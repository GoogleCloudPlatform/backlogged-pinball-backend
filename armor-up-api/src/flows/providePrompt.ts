import { Genkit } from "genkit";
import {
  promptType,
  ProvidePromptInput,
  ProvidePromptOutput,
} from "../types/ProvidePromptTypes";
import { safePrompts, unsafePrompts } from "../canned-prompts/canned-prompts";

export const initializeProvidePromptFlow = (ai: Genkit) =>
  ai.defineFlow(    
    {
      name: "providePrompt",
      inputSchema: ProvidePromptInput,
      outputSchema: ProvidePromptOutput,
    },
    async (input) => {
      const getRandomItem = <T>(arr: T[]): T => {
        return arr[Math.floor(Math.random() * arr.length)];
      };

      switch (input.type) {
        case promptType.SAFE_PROMPT:
          return {
            prompt: getRandomItem(safePrompts),
            promptType: promptType.SAFE_PROMPT,
          };
        case promptType.UNSAFE_PROMPT:
          return {
            prompt: getRandomItem(unsafePrompts),
            promptType: promptType.UNSAFE_PROMPT,
          };
        case promptType.INTERESTING_PROMPT:
        default:
            return {
                prompt: "An interesting prompt will be provided later.", // Default prompt
                promptType: promptType.INTERESTING_PROMPT,
              };
      }
    }
  );
