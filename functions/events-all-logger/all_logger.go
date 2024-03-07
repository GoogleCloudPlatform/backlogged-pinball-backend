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

// Simulating an Event struct for demonstration
type PinballEventMessage struct {
	Data string `json:"data"` // Assume 'data' is the base64-encoded string
	// ... other fields you might have
}

// Function myCloudEventFunction accepts and handles a CloudEvent object
func allLoggerFunction(ctx context.Context, e event.Event) error {
	// Parse the JSON into a generic map
	var jsonData map[string]interface{}
	if err := json.Unmarshal([]byte(e.Data()), &jsonData); err != nil {
		return fmt.Errorf("error parsing JSON: %v", err)
	}
	fmt.Printf("pinball-event-unedited: %s\n", jsonData)

	// Check for 'message' map
	if messageData, ok := jsonData["message"].(map[string]interface{}); ok {
		// Extract and decode the 'data' field from 'message'
		if encodedData, ok := messageData["data"].(string); ok {
			decodedData, err := base64.StdEncoding.DecodeString(encodedData)
			if err != nil {
				return fmt.Errorf("error decoding base64: %v", err)
			}
			fmt.Printf("decodedData: '%s'\n", string(decodedData))
			dataStr := string(decodedData)

			jsonData["message"] = messageData
			messageData["data"] = dataStr

			// Re-serialize
			updatedJSON, err := json.Marshal(jsonData)
			if err != nil {
				return fmt.Errorf("error re-serializing JSON: %v", err)
			}
			fmt.Printf("pinball-event: %s\n", updatedJSON)
		} else {
			return fmt.Errorf("data field not found within message or not a string")
		}
	} else {
		return fmt.Errorf("message field not found")
	}

	return nil
}
