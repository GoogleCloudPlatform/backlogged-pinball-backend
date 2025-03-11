import {vertexAI, gemini20Flash001} from '@genkit-ai/vertexai';
import { genkit } from 'genkit';
import { initializeFilterAndRespondFlow } from './flows/filterAndRespond';
import {startFlowServer} from '@genkit-ai/express';

const ai = genkit({
    plugins: [
      vertexAI({location: 'us-central1'}),
    ],
    model: gemini20Flash001,
  });

  const filterAndRespondFlow = initializeFilterAndRespondFlow(ai);

 startFlowServer(
    {
        flows: [
            filterAndRespondFlow
        ]
    }
 )