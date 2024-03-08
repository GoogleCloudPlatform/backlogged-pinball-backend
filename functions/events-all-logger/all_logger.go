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

package all_logger

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
)

func init() {
	// Register a CloudEvent function with the Functions Framework
	functions.CloudEvent("allLoggerFunction", allLoggerFunction)
}

// Function myCloudEventFunction accepts and handles a CloudEvent object
func allLoggerFunction(ctx context.Context, e event.Event) error {
	// Print out the raw data to start, so we always see *something* in the logs.
	fmt.Printf("pinball-event-raw: %s", e.Data())

	// Parse the JSON into a generic map
	var event map[string]interface{}
	if err := json.Unmarshal([]byte(e.Data()), &event); err != nil {
		return fmt.Errorf("error parsing JSON: %v", err)
	}

	// Expect events to have a base64 encoded 'data' field. This doesn't
	// make for great log messages. Decode and replace before logging.
	// Stat by checking for 'message'
	if message, ok := event["message"].(map[string]interface{}); ok {
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

			// Re-serialize
			updatedJSON, err := json.Marshal(event)
			if err != nil {
				return fmt.Errorf("error re-serializing JSON: %v", err)
			}
			// Print as JSON string, so Cloud Logging will parse as JSON
			// ("Structured Logging") and allow querying by fields in the document
			fmt.Printf("%s\n", updatedJSON)
		} else {
			return fmt.Errorf("data field not found within message or not a string")
		}
	} else {
		return fmt.Errorf("message field not found")
	}

	return nil
}
