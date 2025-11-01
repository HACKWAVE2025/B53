import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { QAClient } from "../mcp/mcp-client";
import { SAIRAM } from "../prompts/prompt";

export const QAAgent = new Agent({
  name: "Playwright QA Agent",
  description:
    "An autonomous QA Engineer that runs manual tests using Playwright MCP.",

  instructions: SAIRAM,

  model: google("gemini-2.5-flash"),
  tools: await QAClient.getTools(),
});
