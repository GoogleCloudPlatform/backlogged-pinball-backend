// A genkit flow that checks a suggested prompt for model armor violations using a looser filter,
// then responds with an object that contains the model armor reponse metadata.

// Flow will send a pub/sub message to the pinball machine as appropriate
import { Genkit } from "genkit";
import {
  FilterAndRespondInput,
  FilterAndRespondOutput,
} from "../types/FilterAndRespondTypes";
import { sanitizeUserPrompt } from "../services/modelArmor";

import { ModelArmorResponse, MatchState } from "../types/ModelArmorTypes";
import { PubSub } from "@google-cloud/pubsub";

export const initializeFilterSuggestedPromptFlow = (ai: Genkit) =>
  ai.defineFlow(
    {
      name: "filterSuggestedPrompt",
      inputSchema: FilterAndRespondInput,
      outputSchema: FilterAndRespondOutput.omit({ generatedText: true }),
    },
    async (input) => {
      const modelArmorResponse = ModelArmorResponse.parse(
        await sanitizeUserPrompt(input.prompt, "loose")
      );
      let safe = true;
      let aiResponse = "";

      if (
        modelArmorResponse.sanitizationResult.filterMatchState ===
        MatchState.MATCH_FOUND
      ) {
        safe = false;
      }

      if (safe) {
        // Send a pubsub message to the topic prompts-to-machine containing the text of the 'safe' prompt
        const pubsub = new PubSub();
        const topic = pubsub.topic("prompts-to-machine");
        const dataBuffer = Buffer.from(
          JSON.stringify({
            PinballReactionType: "SuggestedPrompt",
            Prompt: input.prompt,
          })
        );

        await topic.publishMessage({ data: dataBuffer });
      }

      return {
        passedFilter: safe,
        modelArmorResponse: modelArmorResponse,
      };
    }
  );
