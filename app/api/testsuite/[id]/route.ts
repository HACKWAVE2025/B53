import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// GET - Fetch a single test suite by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 notice it's a Promise now
) {
  try {
    const params = await context.params; // 👈 unwrap it!
    console.log("Params:", params);

    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const testSuite = await prisma.testSuite.findUnique({
      where: { id: params.id },
    });

    if (!testSuite) {
      return NextResponse.json({ error: "Test suite not found" }, { status: 404 });
    }

    return NextResponse.json({ testSuite }, { status: 200 });
  } catch (error) {
    console.error("Error fetching test suite:", error);
    return NextResponse.json(
      { error: "Failed to fetch test suite" },
      { status: 500 }
    );
  }
}

// PATCH - Update test suite (status, video, markdown report)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, videoUrl, markdownReport, testCount } = body;

    const testSuite = await prisma.testSuite.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!testSuite) {
      return NextResponse.json(
        { error: "Test suite not found" },
        { status: 404 }
      );
    }

    const updatedTestSuite = await prisma.testSuite.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(videoUrl && { videoUrl }),
        ...(markdownReport && { markdownReport }),
        ...(testCount !== undefined && { testCount }),
      },
    });

    return NextResponse.json({ testSuite: updatedTestSuite }, { status: 200 });
  } catch (error) {
    console.error("Error updating test suite:", error);
    return NextResponse.json(
      { error: "Failed to update test suite" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a test suite
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const testSuite = await prisma.testSuite.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!testSuite) {
      return NextResponse.json(
        { error: "Test suite not found" },
        { status: 404 }
      );
    }

    await prisma.testSuite.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Test suite deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting test suite:", error);
    return NextResponse.json(
      { error: "Failed to delete test suite" },
      { status: 500 }
    );
  }
}
