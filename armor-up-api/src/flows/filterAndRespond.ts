// A genkit flow that checks a prompt for model armor violations, then responds with an object that contains the model armor reponse metadata as well as a response from ai.generate if model armor had no issues with the prompt

import { Genkit } from "genkit";
import {
  FilterAndRespondInput,
  FilterAndRespondOutput,
} from "../types/FilterAndRespondTypes";
import { sanitizeUserPrompt } from "../services/modelArmor";

import { ModelArmorResponse, MatchState } from "../types/ModelArmorTypes";

export const initializeFilterAndRespondFlow = (ai: Genkit) =>
  ai.defineFlow(
    {
      name: "filterAndRespond",
      inputSchema: FilterAndRespondInput,
      outputSchema: FilterAndRespondOutput,
    },
    async (input) => {
      const modelArmorResponse = ModelArmorResponse.parse(
        await sanitizeUserPrompt(input.prompt)
      );
      let safe = true;
      let aiResponse = "";

      if (modelArmorResponse.sanitizationResult.filterMatchState === MatchState.MATCH_FOUND) {
        safe = false;
      }

      if (safe) {
        const result = await ai.generate({
          prompt: input.prompt,
        });
        aiResponse = result.text;
      }

      return {
        generatedText: aiResponse,
        passedFilter: safe,
        modelArmorResponse: modelArmorResponse,
      };
    }
  );
