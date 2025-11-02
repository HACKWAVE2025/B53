import { NextRequest, NextResponse } from "next/server";
import { QAAgent } from "@/mastra/agents/QAagent";
import path from "path";
import fs from "fs";
import { uploadToCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  let testSuiteId: string | undefined;

  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    testSuiteId = body.testSuiteId;
    const { websiteUrl } = body;

    if (!testSuiteId || !websiteUrl) {
      return NextResponse.json(
        { success: false, message: "Missing testSuiteId or websiteUrl" },
        { status: 400 }
      );
    }

    // Verify test suite exists and belongs to user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const testSuite = await prisma.testSuite.findFirst({
      where: {
        id: testSuiteId,
        userId: user.id,
      },
    });

    if (!testSuite) {
      return NextResponse.json(
        { success: false, message: "Test suite not found" },
        { status: 404 }
      );
    }

    // Update test suite status to running
    await prisma.testSuite.update({
      where: { id: testSuiteId },
      data: { status: "pending" },
    });

    // Run QA agent with the website URL and user's test description
    const testInstructions = testSuite.description
      ? `\n\n**User's Testing Requirements:**\n${testSuite.description}\n`
      : `\nPerform comprehensive QA testing including:
- Form validation and submission
- Navigation and links
- User interactions
- Error handling
- Any visible bugs or issues\n`;

    const response = await QAAgent.generate([
      {
        role: "user",
        content: `
**IMPORTANT**: Close browser session after completing all tests.
Test the website: ${websiteUrl}
${testInstructions}

Generate a comprehensive test report in this EXACT markdown format:

# QA Test Report: ${websiteUrl}

## Summary
Brief overview of testing performed, pass/fail count, and overall assessment.

## Test Cases Executed

### ✅ Test Case 1: [Feature Name]
- **Status**: Pass
- **Description**: What functionality was tested
- **Steps**: Actions performed
- **Result**: Expected behavior confirmed
- **Observations**: Any notes

### ❌ Test Case 2: [Feature Name]
- **Status**: Fail
- **Description**: What functionality was tested
- **Steps**: Actions performed
- **Result**: What actually happened
- **Expected**: What should have happened
- **Bug Details**: Specific issue description
- **Visual Evidence**: Element highlighted with RED BORDER in video at [timestamp]
- **Element Selector**: CSS selector of problematic element
- **Severity**: Critical/Major/Minor

## Issues Summary

## Bugs Found
Detailed list of all bugs discovered with:
- Reproduction steps
- Expected vs actual behavior
- Screenshots/selectors
- Suggested fixes

## Recommendations
Suggestions for improvements and preventive measures.

## Test Completion
- ✅ All test scenarios executed
- ✅ Issues highlighted with red borders
- ✅ Browser session closed
- ✅ Video saved successfully

---
        `,
      },
    ]);

    // Process video file
    const baseDir = path.resolve("manual-tests");
    const files = fs.readdirSync(baseDir);
    let videoUrl: string | null = null;

    for (const file of files) {
      if (file.match(/\.(mp4|webm|avi|mov)$/i)) {
        const filePath = path.join(baseDir, file);
        videoUrl = await uploadToCloudinary(filePath);
        fs.unlinkSync(filePath);
        console.log(`✅ Uploaded & deleted: ${file}`);
        break;
      }
    }

    // Extract markdown report from response
    let markdownReport =
      response.text || "Test completed but no detailed report generated.";

    // Ensure the response is in markdown format
    if (!markdownReport.includes("#") && !markdownReport.includes("##")) {
      // If agent didn't return proper markdown, wrap it
      markdownReport = `# QA Test Report\n\n${markdownReport}`;
    }

    // Determine test status based on report content
    const hasBugs =
      markdownReport.toLowerCase().includes("bug") ||
      markdownReport.toLowerCase().includes("error") ||
      markdownReport.toLowerCase().includes("failed");

    const testStatus = hasBugs ? "failed" : "passed";

    // Count test cases from markdown (simple heuristic - count headings that look like test cases)
    const testCaseMatches = markdownReport.match(/###\s+(✅|❌|⚠️)/g);
    const testCount = testCaseMatches ? testCaseMatches.length : 1;

    // Update test suite with results
    const updatedTestSuite = await prisma.testSuite.update({
      where: { id: testSuiteId },
      data: {
        status: testStatus,
        videoUrl: videoUrl || undefined,
        markdownReport: markdownReport,
        testCount: testCount,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test suite executed successfully.",
      testSuite: {
        id: updatedTestSuite.id,
        status: updatedTestSuite.status,
        videoUrl: updatedTestSuite.videoUrl,
        markdownReport: updatedTestSuite.markdownReport,
        testCount: updatedTestSuite.testCount,
      },
    });
  } catch (error: any) {
    console.error("❌ Error running QA test:", error);

    // Try to update test suite status to failed if we have the testSuiteId from earlier
    if (testSuiteId) {
      try {
        await prisma.testSuite.update({
          where: { id: testSuiteId },
          data: {
            status: "failed",
            markdownReport: `# Test Execution Failed\n\nError: ${error?.message ?? "Unknown error"}\n\nThe test could not complete due to an internal error.`,
          },
        });
      } catch (updateError) {
        console.error("Failed to update test suite status:", updateError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to execute QA test.",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
