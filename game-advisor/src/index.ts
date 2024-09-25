import * as z from 'zod';

// Import the Genkit core libraries and plugins.
import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, startFlowsServer } from '@genkit-ai/flow';
import { vertexAI } from '@genkit-ai/vertexai';
import { ollama } from 'genkitx-ollama'
import { dotprompt, promptRef } from '@genkit-ai/dotprompt';

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
import { gemini15Flash } from '@genkit-ai/vertexai';

configureGenkit({
  plugins: [

    vertexAI({ location: 'us-west4' }),
    ollama({
      models: [
        {
          name: 'Meta-Llama-3.1-70B-Instruct-FP8',
          type: 'chat',
        },
      ],
      serverAddress: 'http://localhost:8000'
    }),
    dotprompt()
  ],
  // Log debug output to tbe console.
  logLevel: 'debug',
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracingAndMetrics: true,
});

// Define a simple flow that prompts an LLM to generate menu suggestions.
export const menuSuggestionFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
		// Construct a request and send it to the model API.
    const llmResponse = await generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });

		// Handle the response from the model API. In this sample, we just convert
    // it to a string, but more complicated flows might coerce the response into
    // structured output or chain the response into another LLM call, etc.
    return llmResponse.text();
  }
);

const gameSummaryOutputSchema = z.object({
  headline: z.string(),
  analysis: z.string(),
  tips: z.array(z.string()),
  grade: z.string(),
});

export const gameSummaryFlow = defineFlow(
  {
    name: 'gameSummaryFlow',
    inputSchema: z.string(),
    outputSchema: gameSummaryOutputSchema
  },
  async (gameId) => {
		// Construct a request and send it to the model API.
    const prompt = promptRef("summary");
    const resp = await prompt.generate({});
    console.log((resp).output())
    return resp.output();
  }
)

// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
startFlowsServer();
