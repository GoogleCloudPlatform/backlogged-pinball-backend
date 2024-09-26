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

import * as z from 'zod';

// Import the Genkit core libraries and plugins.
import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, startFlowsServer } from '@genkit-ai/flow';
import { vertexAI } from '@genkit-ai/vertexai';
import { ollama } from 'genkitx-ollama'
import { dotprompt, promptRef } from '@genkit-ai/dotprompt';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
import { gemini15Flash } from '@genkit-ai/vertexai';

const OLLAMA_ADDRESS = process.env.OLLAMA_ADDRESS || 'http://localhost:8080';

initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();


configureGenkit({
  plugins: [

    vertexAI({ location: 'us-west4' }),
    ollama({
      models: [
        {
          name: 'llama3.1:70b',
          type: 'generate',
        },
      ],
      serverAddress: OLLAMA_ADDRESS
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
      model: 'ollama/llama3.1:70b',
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

    try {
      const snapshot = await db.collection('AllGameEvents')
        .where('GameId', '==', gameId)
        .get();
  
      const events: { id: string; }[] = [];
      snapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });
      let content = JSON.stringify(events).replace(/"/g, '\\"')
      
      // console.log(`stringified log: ${content}`);

		  // Construct a request and send it to the model API.
      const prompt = promptRef("summary");
      const resp = await prompt.generate({input: {gameLog: content}});
      // console.log(resp.output())
      return resp.output();
    } catch (error) {
    console.error('Error fetching events:', error);
  }
  }
)

// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
startFlowsServer();
