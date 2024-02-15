package all_logger

import (
	"context"
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
	// Your code here
	// Access the CloudEvent data payload via e.Data() or e.DataAs(...)

	// Return nil if no error occurred
	fmt.Printf("pinball-event: %s", e.Data())
	return nil
}
