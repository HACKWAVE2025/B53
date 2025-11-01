import { MCPClient } from "@mastra/mcp";

export const QAClient = new MCPClient({
  id: "QA-mcp-client",
  servers: {
    Playwright: {
      command: "npx",
      args: [
        "-y",
        "@playwright/mcp@latest",
        "--save-video=1280x720",                                     
        "--output-dir=manual-tests",           
        "--save-session",                                   
      ],
    },
  },
});
