"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
} from "lucide-react";

interface TestSuite {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  videoUrl: string | null;
  markdownReport: string | null;
  status: "pending" | "passed" | "failed";
  createdAt: string;
  testCount: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [newSuite, setNewSuite] = useState({
    name: "",
    description: "",
    websiteUrl: "",
  });

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch test suites on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchTestSuites();
    }
  }, [status]);

  const fetchTestSuites = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/testsuite");
      if (response.ok) {
        const data = await response.json();
        setTestSuites(data.testSuites);
      }
    } catch (error) {
      console.error("Error fetching test suites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSuite.name.trim() && newSuite.websiteUrl.trim()) {
      try {
        const response = await fetch("/api/testsuite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSuite),
        });

        if (response.ok) {
          const data = await response.json();
          setTestSuites([data.testSuite, ...testSuites]);
          setNewSuite({ name: "", description: "", websiteUrl: "" });
          setShowCreateModal(false);
        } else {
          alert("Failed to create test suite");
        }
      } catch (error) {
        console.error("Error creating test suite:", error);
        alert("Error creating test suite");
      }
    }
  };

  const handleRunTest = async (suiteId: string, websiteUrl: string) => {
    setRunningTests((prev) => new Set(prev).add(suiteId));

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testSuiteId: suiteId,
          websiteUrl: websiteUrl,
        }),
      });

      if (response.ok) {
        // Refresh test suites to get updated status
        await fetchTestSuites();
      } else {
        alert("Failed to run tests");
      }
    } catch (error) {
      console.error("Error running tests:", error);
      alert("Error running tests");
    } finally {
      setRunningTests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(suiteId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Test Suites
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Create and manage your test suites
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Test Suite
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Total Suites
              </p>
              <p className="mt-1 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                {testSuites.length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Passed
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {testSuites.filter((s) => s.status === "passed").length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Failed
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {testSuites.filter((s) => s.status === "failed").length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Pending
              </p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {testSuites.filter((s) => s.status === "pending").length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Test Suites List */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-4">
            {testSuites.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-neutral-400" />
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    No test suites yet
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    Create your first test suite
                  </button>
                </div>
              </div>
            ) : (
              testSuites.map((suite) => (
                <div
                  key={suite.id}
                  className="rounded-lg border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(suite.status)}
                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                          {suite.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {suite.description}
                      </p>
                      <a
                        href={suite.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {suite.websiteUrl}
                      </a>
                      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {suite.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {suite.testCount} tests
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            suite.status === "passed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : suite.status === "failed"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {suite.status}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() =>
                          handleRunTest(suite.id, suite.websiteUrl)
                        }
                        disabled={runningTests.has(suite.id)}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        {runningTests.has(suite.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Run Test
                          </>
                        )}
                      </button>
                      {(suite.videoUrl || suite.markdownReport) && (
                        <button
                          onClick={() => {
                            window.location.href = `/dashboard/${suite.id}`;
                          }}
                          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              Create Test Suite
            </h2>
            <form onSubmit={handleCreateSuite} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Suite Name
                </label>
                <input
                  type="text"
                  value={newSuite.name}
                  onChange={(e) =>
                    setNewSuite({ ...newSuite, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
                  placeholder="e.g., User Authentication Tests"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newSuite.websiteUrl}
                  onChange={(e) =>
                    setNewSuite({ ...newSuite, websiteUrl: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Description
                </label>
                <textarea
                  value={newSuite.description}
                  onChange={(e) =>
                    setNewSuite({ ...newSuite, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
                  placeholder="Describe what this test suite covers..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer"
                >
                  Create Suite
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSuite({ name: "", description: "", websiteUrl: "" });
                  }}
                  className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
