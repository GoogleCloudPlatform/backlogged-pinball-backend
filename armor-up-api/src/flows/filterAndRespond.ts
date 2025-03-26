// A genkit flow that checks a prompt for model armor violations, then responds with an object that contains the model armor reponse metadata as well as a response from ai.generate if model armor had no issues with the prompt

import { Genkit } from "genkit";
import {
  FilterAndRespondInput,
  FilterAndRespondOutput,
} from "../types/FilterAndRespondTypes";
import { sanitizeUserPrompt } from "../services/modelArmor";

import { ModelArmorResponse, MatchState } from "../types/ModelArmorTypes";
import { Firestore, FieldValue } from "@google-cloud/firestore";

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

      if (
        modelArmorResponse.sanitizationResult.filterMatchState ===
        MatchState.MATCH_FOUND
      ) {
        safe = false;
      }

      if (safe) {
        const systemPrompt = ai.prompt("generateFriendlyText");
        const modelResponse = await systemPrompt({ userPrompt: input.prompt });
        aiResponse = modelResponse.text;
      }

      const firestore = new Firestore();
      const collection = firestore.collection("ProcessedPrompts");
      const timestamp  = FieldValue.serverTimestamp();

      const returnObject = {
        originalPrompt: input.prompt,
        generatedText: aiResponse,
        passedFilter: safe,
        modelArmorResponse: modelArmorResponse,
        timestamp: timestamp,
      };

      await collection.add(returnObject);

      return returnObject;
    }
  );
