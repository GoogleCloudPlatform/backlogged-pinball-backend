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
import { Firestore, FieldValue } from "@google-cloud/firestore";

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

      if (
        modelArmorResponse.sanitizationResult.filterMatchState ===
        MatchState.MATCH_FOUND
      ) {
        safe = false;
      }

      if (safe) {
        const firestore = new Firestore();
        const collection = firestore.collection("UserPrompts");
        const timestamp = FieldValue.serverTimestamp();

        await collection.add({
          prompt: input.prompt,
          timestamp: timestamp,
          used: false
        });
      }

      return {
        originalPrompt: input.prompt,
        passedFilter: safe,
        modelArmorResponse: modelArmorResponse,
      };
    }
  );
