// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package all_firebase

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
	"google.golang.org/api/iterator"
)

func init() {
	// Register a CloudEvent function with the Functions Framework
	functions.CloudEvent("allFirebaseFunction", allFirebaseFunction)
}

// Function myCloudEventFunction accepts and handles a CloudEvent object
func allFirebaseFunction(ctx context.Context, e event.Event) error {
	// Parse the JSON into a generic map
	var event map[string]interface{}
	if err := json.Unmarshal([]byte(e.Data()), &event); err != nil {
		return fmt.Errorf("error parsing JSON: %v", err)
	}

	// Expect events to have a base64 encoded 'data' field. This doesn't
	// make for great messages. Decode and replace before using.
	// Stat by checking for 'message'
	message, ok := event["message"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("message field not found")
	}

	// Extract and decode the 'data' field from 'message'
	if dataEncoded, ok := message["data"].(string); ok {
		dataDecoded, err := base64.StdEncoding.DecodeString(dataEncoded)
		if err != nil {
			return fmt.Errorf("error decoding base64: %v", err)
		}

		// Parse the JSON into a generic map, so we get a complete
		// JSON doc after we add it back to the message a re-serialize
		var data map[string]interface{}
		if err := json.Unmarshal([]byte(dataDecoded), &data); err != nil {
			return fmt.Errorf("error parsing JSON from 'data' field: %v", err)
		}

		message["data"] = data
	} else {
		return fmt.Errorf("data field not found within message or not a string")
	}

	// Move all attributes to the message itself (for ease of use in the web app)
	var attributes = message["attributes"].(map[string]interface{})
	for key, value := range attributes {
		// log.Printf("attribute: %v : %v\n", key, value)
		message[key] = value
	}
	delete(message, "attributes")

	// Time to publish to Firebase

	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	// Check if event is starting a game and if so, clear out the previous events
	if message["PinballEventType"] == "GameStarted" {
		log.Println("GameStarted")
		var buff bytes.Buffer
		deleteCollection(&buff, ctx, *client, "LiveGameEvents", 40)
		log.Print(buff)
	}

	publishTime, ok := message["publishTime"].(string)
	if !ok {
		return fmt.Errorf("messageId field not found")
	}

	_, err = client.Collection("LiveGameEvents").Doc(publishTime).Set(ctx, message)
	if err != nil {
		// If that doesn't work, not much we can do. Log and exit.
		log.Fatalf("An error has occurred: %s", err)
	}

	return nil
}

// from: https://firebase.google.com/docs/firestore/manage-data/delete-data
// "The snippets below are somewhat simplified and do not deal with error
// handling, security, deleting subcollections, or maximizing performance"
func deleteCollection(w io.Writer, ctx context.Context, client firestore.Client, collectionName string,
	batchSize int) error {

	col := client.Collection(collectionName)
	bulkwriter := client.BulkWriter(ctx)

	for {
		// Get a batch of documents
		iter := col.Limit(batchSize).Documents(ctx)
		numDeleted := 0

		// Iterate through the documents, adding
		// a delete operation for each one to the BulkWriter.
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return err
			}

			bulkwriter.Delete(doc.Ref)
			numDeleted++
		}

		// If there are no documents to delete,
		// the process is over.
		if numDeleted == 0 {
			bulkwriter.End()
			break
		}

		bulkwriter.Flush()
	}
	fmt.Fprintf(w, "Deleted collection \"%s\"", collectionName)
	return nil
}
