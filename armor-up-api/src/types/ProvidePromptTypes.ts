import {z} from 'genkit';

export enum promptType {
  SAFE_PROMPT = 'SAFE_PROMPT',
  UNSAFE_PROMPT = 'UNSAFE_PROMPT',
  INTERESTING_PROMPT = 'INTERESTING_PROMPT',
}

export const ProvidePromptInput = z.object({
  type: z.nativeEnum(promptType).optional().default(promptType.SAFE_PROMPT),
});
export type ProvidePromptInputType = z.infer<typeof ProvidePromptInput>;




export const ProvidePromptOutput = z.object({
  prompt: z.string(),
  promptType: z.nativeEnum(promptType),
});
export type ProvidePromptOutputType = z.infer<typeof ProvidePromptOutput>;