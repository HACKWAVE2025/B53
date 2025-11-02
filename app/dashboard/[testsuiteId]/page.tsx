"use client";
import { useParams } from "next/navigation";
import { Play, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface TestSuiteData {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  videoUrl: string | null;
  markdownReport: string | null;
  status: string;
  testCount: number;
  createdAt: string;
}

export default function TestSuiteDetailPage() {
  const params = useParams();
  const testsuiteId = params.testsuiteId as string;

  const [testSuite, setTestSuite] = useState<TestSuiteData | null>(null);
  const [loading, setLoading] = useState(true);

  const getDefaultMarkdown = () => `
# Test Suite Results

## Test Suite ID: ${testsuiteId}

### Overview
This test suite was executed on **November 2, 2025** at 10:30 AM.

### Test Results Summary
- **Total Tests**: 15
- **Passed**: 12
- **Failed**: 2
- **Skipped**: 1

---

## Test Cases

### ✅ Test Case 1: User Login
**Status**: Passed  
**Duration**: 2.3s  
**Description**: Verified that users can successfully log in with valid credentials.

#### Steps:
1. Navigate to login page
2. Enter username and password
3. Click login button
4. Verify redirect to dashboard

---

### ✅ Test Case 2: Form Validation
**Status**: Passed  
**Duration**: 1.8s  
**Description**: Verified that form validation works correctly for all input fields.

---

### ❌ Test Case 3: API Response
**Status**: Failed  
**Duration**: 5.2s  
**Description**: API endpoint returned unexpected response format.

#### Error Details:
\`\`\`
Expected: { status: 200, data: {...} }
Received: { status: 500, error: "Internal Server Error" }
\`\`\`

#### Stack Trace:
\`\`\`
Error: Assertion failed
  at testAPIResponse (test.js:45:10)
  at runTest (runner.js:123:5)
\`\`\`

---

### ✅ Test Case 4: Navigation
**Status**: Passed  
**Duration**: 1.5s  
**Description**: Verified that navigation between pages works correctly.

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Total Duration | 45.3s |
| Average Test Time | 3.02s |
| Success Rate | 80% |

---

## Recommendations

1. **Fix API Error Handling**: The API endpoint needs better error handling for 500 errors
2. **Optimize Test 3**: Consider breaking down Test Case 3 into smaller units
3. **Add Timeout Handling**: Implement proper timeout mechanisms for API calls

---

## Environment Details

- **Browser**: Chrome 119.0.6045.105
- **OS**: Windows 11
- **Node Version**: 20.10.0
- **Test Framework**: Jest 29.7.0
  `;

  useEffect(() => {
    fetchTestSuite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testsuiteId]);

  const fetchTestSuite = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/testsuite/${testsuiteId}`);
      if (response.ok) {
        const data = await response.json();
        setTestSuite(data.testSuite);
      }
    } catch (error) {
      console.error("Error fetching test suite:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const markdownContent = testSuite?.markdownReport || getDefaultMarkdown();
  const videoUrl = testSuite?.videoUrl || "";

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            {testSuite?.name || "Test Suite Details"}
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {testSuite?.websiteUrl || `ID: ${testsuiteId}`}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Video Section - Left Side */}
        <div className="flex w-1/2 flex-col gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-3 flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                Test Execution Video
              </h2>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              {videoUrl ? (
                <video
                  controls
                  className="h-full w-full"
                  preload="metadata"
                  crossOrigin="anonymous"
                >
                  <source src={videoUrl} type="video/webm" />
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <div className="text-center">
                    <Play className="mx-auto h-12 w-12 mb-2" />
                    <p>No video available yet</p>
                    <p className="text-sm">Run the test to generate a video</p>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              Recording of the automated test execution showing all test steps
              and interactions.
            </p>
          </div>
        </div>

        {/* Markdown Report Section - Right Side */}
        <div className="flex w-1/2 flex-col gap-4 overflow-hidden">
          <div className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2 border-b border-neutral-200 p-4 dark:border-neutral-700">
              <FileText className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                Test Report
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="mb-4 text-3xl font-bold text-neutral-800 dark:text-neutral-200"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="mb-3 mt-6 text-2xl font-semibold text-neutral-800 dark:text-neutral-200"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="mb-2 mt-4 text-xl font-semibold text-neutral-800 dark:text-neutral-200"
                        {...props}
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        className="mb-2 mt-3 text-lg font-semibold text-neutral-800 dark:text-neutral-200"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-4 text-neutral-700 dark:text-neutral-300"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="mb-4 list-disc space-y-2 pl-6 text-neutral-700 dark:text-neutral-300"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="mb-4 list-decimal space-y-2 pl-6 text-neutral-700 dark:text-neutral-300"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code
                          className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200"
                          {...props}
                        />
                      ) : (
                        <code
                          className="block overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100"
                          {...props}
                        />
                      ),
                    pre: ({ node, ...props }) => (
                      <pre className="mb-4 overflow-x-auto" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="mb-4 overflow-x-auto">
                        <table
                          className="min-w-full divide-y divide-neutral-300 dark:divide-neutral-700"
                          {...props}
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="bg-neutral-100 px-4 py-2 text-left font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border-t border-neutral-200 px-4 py-2 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                        {...props}
                      />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr
                        className="my-6 border-neutral-300 dark:border-neutral-700"
                        {...props}
                      />
                    ),
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
