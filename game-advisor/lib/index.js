"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSummaryFlow = exports.menuSuggestionFlow = void 0;
const z = __importStar(require("zod"));
// Import the Genkit core libraries and plugins.
const ai_1 = require("@genkit-ai/ai");
const core_1 = require("@genkit-ai/core");
const flow_1 = require("@genkit-ai/flow");
const vertexai_1 = require("@genkit-ai/vertexai");
const genkitx_ollama_1 = require("genkitx-ollama");
const dotprompt_1 = require("@genkit-ai/dotprompt");
// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
const vertexai_2 = require("@genkit-ai/vertexai");
(0, core_1.configureGenkit)({
    plugins: [
        (0, vertexai_1.vertexAI)({ location: 'us-west4' }),
        (0, genkitx_ollama_1.ollama)({
            models: [
                {
                    name: 'Meta-Llama-3.1-70B-Instruct-FP8',
                    type: 'chat',
                },
            ],
            serverAddress: 'http://localhost:8000'
        }),
        (0, dotprompt_1.dotprompt)()
    ],
    // Log debug output to tbe console.
    logLevel: 'debug',
    // Perform OpenTelemetry instrumentation and enable trace collection.
    enableTracingAndMetrics: true,
});
// Define a simple flow that prompts an LLM to generate menu suggestions.
exports.menuSuggestionFlow = (0, flow_1.defineFlow)({
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await (0, ai_1.generate)({
        prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
        model: vertexai_2.gemini15Flash,
        config: {
            temperature: 1,
        },
    });
    // Handle the response from the model API. In this sample, we just convert
    // it to a string, but more complicated flows might coerce the response into
    // structured output or chain the response into another LLM call, etc.
    return llmResponse.text();
});
const gameSummaryOutputSchema = z.object({
    headline: z.string(),
    analysis: z.string(),
    tips: z.array(z.string()),
    grade: z.string(),
});
exports.gameSummaryFlow = (0, flow_1.defineFlow)({
    name: 'gameSummaryFlow',
    inputSchema: z.string(),
    outputSchema: gameSummaryOutputSchema
}, async (gameId) => {
    // Construct a request and send it to the model API.
    const prompt = (0, dotprompt_1.promptRef)("summary");
    const resp = await prompt.generate({});
    console.log((resp).output());
    return resp.output();
});
// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
(0, flow_1.startFlowsServer)();
//# sourceMappingURL=index.js.map