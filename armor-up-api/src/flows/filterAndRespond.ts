// A genkit flow that checks a prompt for model armor violations, then responds with an object that contains the model armor reponse metadata as well as a response from ai.generate if model armor had no issues with the prompt

import { Genkit } from "genkit";
import {
  FilterAndRespondInput,
  FilterAndRespondOutput,
} from "../types/FilterAndRespondTypes";
import { sanitizeUserPrompt } from "../services/modelArmor";

import { ModelArmorResponse, MatchState } from "../types/ModelArmorTypes";
import { PubSub } from "@google-cloud/pubsub";

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
        const systemPrompt = ai.prompt('generateFriendlyText');
        const modelResponse = await systemPrompt({userPrompt: input.prompt});
        aiResponse = modelResponse.text;
      }

      const pubsub = new PubSub();
      const topic = pubsub.topic("prompts-to-machine");
      const dataBuffer = Buffer.from(
        JSON.stringify({
          PinballReactionType: "ProcessedPrompt",
          Prompt: input.prompt,
          Response: aiResponse,
          PassedFilter: safe,
        })
      );

      await topic.publishMessage({ data: dataBuffer });

      return {
        originalPrompt: input.prompt,
        generatedText: aiResponse,
        passedFilter: safe,
        modelArmorResponse: modelArmorResponse,
      };
    }
  );
