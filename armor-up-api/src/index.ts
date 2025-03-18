import {vertexAI, gemini20Flash001} from '@genkit-ai/vertexai';
import { genkit } from 'genkit';
import { initializeFilterAndRespondFlow } from './flows/filterAndRespond';
import {startFlowServer} from '@genkit-ai/express';
import { initializeProvidePromptFlow } from './flows/providePrompt';
import { initializeFilterSuggestedPromptFlow } from './flows/filterSuggestedPrompt';

const ai = genkit({
    plugins: [
      vertexAI({location: 'us-central1'}),
    ],
    model: gemini20Flash001,
    promptDir: './src/prompts'
  });

  const filterAndRespondFlow = initializeFilterAndRespondFlow(ai);
  const providePromptFlow = initializeProvidePromptFlow(ai);
  const filterSuggestedPromptFlow = initializeFilterSuggestedPromptFlow(ai);


 startFlowServer(
    {
        flows: [
            filterAndRespondFlow,
            providePromptFlow,
            filterSuggestedPromptFlow
        ]
    }
 )