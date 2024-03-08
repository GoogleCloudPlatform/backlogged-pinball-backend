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
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"

	"firebase.google.com/go/v4"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
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
