import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// GET - Fetch all test suites for the logged-in user
export async function GET(req: NextRequest) {
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

    const testSuites = await prisma.testSuite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ testSuites }, { status: 200 });
  } catch (error) {
    console.error("Error fetching test suites:", error);
    return NextResponse.json(
      { error: "Failed to fetch test suites" },
      { status: 500 }
    );
  }
}

// POST - Create a new test suite
export async function POST(req: NextRequest) {
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
    const { name, description, websiteUrl } = body;

    if (!name || !websiteUrl) {
      return NextResponse.json(
        { error: "Name and website URL are required" },
        { status: 400 }
      );
    }

    const testSuite = await prisma.testSuite.create({
      data: {
        userId: user.id,
        name,
        description: description || "",
        websiteUrl,
        status: "pending",
        testCount: 0,
      },
    });

    return NextResponse.json({ testSuite }, { status: 201 });
  } catch (error) {
    console.error("Error creating test suite:", error);
    return NextResponse.json(
      { error: "Failed to create test suite" },
      { status: 500 }
    );
  }
}
