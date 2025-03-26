import { Genkit } from "genkit";
import {
  promptType,
  ProvidePromptInput,
  ProvidePromptOutput,
} from "../types/ProvidePromptTypes";
import { safePrompts, unsafePrompts } from "../canned-prompts/canned-prompts";
import { Firestore } from "@google-cloud/firestore";


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

      const firestore = new Firestore();
      const collection = firestore.collection("UserPrompts");

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
          // Fetch the latest unused prompt from Firestore
          const querySnapshot = await collection
            .where("used", "==", false)
            .orderBy("timestamp", "asc")
            .limit(1)
            .get();

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const promptData = doc.data();

            // Update the 'used' field to true
            await doc.ref.update({ used: true });

            return {
              prompt: promptData.prompt,
              promptType: promptType.INTERESTING_PROMPT,
            };
          } else {
            // If no unused prompts are found, return an empty string
            return {
              prompt: "",
              promptType: promptType.INTERESTING_PROMPT,
            };
          }
      }
    }
  );
