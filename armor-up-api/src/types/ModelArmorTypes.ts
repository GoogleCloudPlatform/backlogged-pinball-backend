import { z } from 'genkit';

export enum InvocationResult {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum ExecutionState {
  EXECUTION_SUCCESS = 'EXECUTION_SUCCESS',
}

export enum MatchState {
  MATCH_FOUND = 'MATCH_FOUND',
  NO_MATCH_FOUND = 'NO_MATCH_FOUND',
}

const csamFilterFilterResultSchema = z.object({
  executionState: z.nativeEnum(ExecutionState),
  matchState: z.nativeEnum(MatchState),
}).optional();

const maliciousUriFilterResultSchema = z.object({
  executionState: z.nativeEnum(ExecutionState),
  matchState: z.nativeEnum(MatchState),
}).optional();

const raiFilterTypeResultsSchema = z.object({
  sexually_explicit: z.object({ matchState: z.nativeEnum(MatchState) }).optional(),
  hate_speech: z.object({ matchState: z.nativeEnum(MatchState) }).optional(),
  harassment: z.object({ matchState: z.nativeEnum(MatchState) }).optional(),
  dangerous: z.object({ matchState: z.nativeEnum(MatchState) }).optional(),
}).optional();

const raiFilterResultSchema = z.object({
  executionState: z.nativeEnum(ExecutionState),
  matchState: z.nativeEnum(MatchState),
  raiFilterTypeResults: raiFilterTypeResultsSchema.optional(),
}).optional();

const piAndJailbreakFilterResultSchema = z.object({
  executionState: z.nativeEnum(ExecutionState),
  matchState: z.nativeEnum(MatchState),
}).optional();

const inspectResultSchema = z.object({
  executionState: z.nativeEnum(ExecutionState),
  matchState: z.nativeEnum(MatchState),
}).optional();

const sdpFilterResultSchema = z.object({
  inspectResult: inspectResultSchema.optional(),
}).optional();

export const filterResultsSchema = z.object({
  csam: z.object({ csamFilterFilterResult: csamFilterFilterResultSchema }).optional(),
  malicious_uris: z.object({ maliciousUriFilterResult: maliciousUriFilterResultSchema }).optional(),
  rai: z.object({ raiFilterResult: raiFilterResultSchema }).optional(),
  pi_and_jailbreak: z.object({ piAndJailbreakFilterResult: piAndJailbreakFilterResultSchema }).optional(),
  sdp: z.object({ sdpFilterResult: sdpFilterResultSchema }).optional(),
});

const sanitizationResultSchema = z.object({
  filterMatchState: z.nativeEnum(MatchState),
  invocationResult: z.nativeEnum(InvocationResult),
  filterResults: filterResultsSchema, 
});

export const ModelArmorResponse = z.object({
  sanitizationResult: sanitizationResultSchema,
});