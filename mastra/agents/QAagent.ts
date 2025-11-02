import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { QAClient } from "../mcp/mcp-client";
import { SAIRAM } from "../prompts/prompt";

export const QAAgent = new Agent({
  name: "Playwright QA Agent",
  description:
    "Expert QA Engineer performing automated testing with Playwright MCP, visual highlighting, and detailed reporting.",
  instructions: SAIRAM,
  model: google("gemini-2.5-flash"),
  tools: await QAClient.getTools(),
});
