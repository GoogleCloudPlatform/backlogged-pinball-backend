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

package all_spotlight

import (
	"context"
	// "encoding/base64"
	// "encoding/json"
	"fmt"

	"cloud.google.com/go/pubsub"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
)

// MessagePublishedData contains the full Pub/Sub message
// See the documentation for more details:
// https://cloud.google.com/eventarc/docs/cloudevents#pubsub
type MessagePublishedData struct {
	Message PubSubMessage
}

// PubSubMessage is the payload of a Pub/Sub event.
// See the documentation for more details:
// https://cloud.google.com/pubsub/docs/reference/rest/v1/PubsubMessage
type PubSubMessage struct {
	Data       []byte            `json:"data"`
	Attributes map[string]string `json:"attributes"`
}

func init() {
	// Register a CloudEvent function with the Functions Framework
	functions.CloudEvent("allSpotlightFunction", allSpotlightFunction)
}

// Function myCloudEventFunction accepts and handles a CloudEvent object
func allSpotlightFunction(ctx context.Context, e event.Event) error {
	spotlight_events := map[string]bool{"GameStarted": true,
		"BallDrained": true, "GameEnded": true}
	// fmt.Printf("pinball-event-raw: %s\n", e)

	var msg MessagePublishedData
	if err := e.DataAs(&msg); err != nil {
		return fmt.Errorf("event.DataAs: %w\n", err)
	}
	fmt.Printf("pinball-event-parsed: %s\n", msg)

	event_type, _ := msg.Message.Attributes["PinballEventType"]
	fmt.Printf("PinballEventType: %s\n", event_type)

	_, prs := spotlight_events[event_type]
	if !prs {
		fmt.Printf("%v not in %v filter, returning\n", event_type, spotlight_events)
		return nil
	}

	// TODO: get project from environment somehow.
	publishCustomAttributes("backlogged-dev", "pinball-events-spotlight", msg.Message)

	// Parse the JSON into a generic map
	// var jsonData map[string]interface{}
	// if err := json.Unmarshal([]byte(e.Data()), &jsonData); err != nil {
	// 	return fmt.Errorf("error parsing JSON: %v", err)
	// }
	// fmt.Printf("pinball-event-unedited: %s\n", jsonData)

	// // Check for 'message' map
	// if messageData, ok := jsonData["message"].(map[string]interface{}); ok {
	// 	// Extract and decode the 'data' field from 'message'
	// 	if encodedData, ok := messageData["data"].(string); ok {
	// 		decodedData, err := base64.StdEncoding.DecodeString(encodedData)
	// 		if err != nil {
	// 			return fmt.Errorf("error decoding base64: %v", err)
	// 		}
	// 		fmt.Printf("decodedData: '%s'\n", string(decodedData))
	// 		dataStr := string(decodedData)

	// 		jsonData["message"] = messageData
	// 		messageData["data"] = dataStr

	// 		// Re-serialize
	// 		updatedJSON, err := json.Marshal(jsonData)
	// 		if err != nil {
	// 			return fmt.Errorf("error re-serializing JSON: %v", err)
	// 		}
	// 		fmt.Printf("pinball-event: %s\n", updatedJSON)
	// 	} else {
	// 		return fmt.Errorf("data field not found within message or not a string")
	// 	}
	// } else {
	// 	return fmt.Errorf("message field not found")
	// }

	return nil
}

func publishCustomAttributes(projectID, topicID string, msg PubSubMessage) error {
	// projectID := "my-project-id"
	// topicID := "my-topic"
	ctx := context.Background()
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		return fmt.Errorf("pubsub.NewClient: %w", err)
	}
	defer client.Close()

	// TODO: total hack... use the filter from:
	// https://github.com/googleapis/google-cloudevents-go/issues/154
	message :=
		&pubsub.Message{
			Data:       msg.Data,
			Attributes: msg.Attributes,
		}
	t := client.Topic(topicID)
	result := t.Publish(ctx, message)
	// Block until the result is returned and a server-generated
	// ID is returned for the published message.
	id, err := result.Get(ctx)
	if err != nil {
		return fmt.Errorf("Get: %w", err)
	}
	fmt.Printf("Published message with custom attributes; msg ID: %v\n", id)
	return nil
}
