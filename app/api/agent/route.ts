import { NextRequest, NextResponse } from "next/server";
import { QAAgent } from "@/mastra/agents/QAagent";
import path from "path";
import fs from "fs";
import { uploadToCloudinary } from "@/lib/cloudinary";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    // 🚫 Skip authentication & DB for testing AI logic only
    // const res = new NextResponse();
    // const session = await getServerSession({ req, res, ...authOptions });

    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized: Please sign in first." },
    //     { status: 401 }
    //   );
    // }

    // const userId = session.user.id;

    // ✅ Run your QA agent (AI test only)
    const response = await QAAgent.generate([
      {
        role: "user",
        content: `
Please test the submit registration form functionality and search functionality form  the website at https://event-faux-fun.lovable.app.
    and if you find any bug report it in the summary and NOTE:-close the browser session
        `,
      },
    ]);

    // 🚫 Skip file operations & Cloudinary
    const baseDir = path.resolve("manual-tests");
    const files = fs.readdirSync(baseDir);
    let videoUrl: string | null = null;

    for (const file of files) {
      if (file.match(/\.(mp4|webm|avi|mov)$/i)) {
        const filePath = path.join(baseDir, file);
        videoUrl = await uploadToCloudinary(filePath);
        fs.unlinkSync(filePath);
        console.log(`✅ Uploaded & deleted: ${file}`);
        console.log(videoUrl);
        break;
      }
    }

    // 🚫 Skip DB storage
    // if (videoUrl) {
    //   await prisma.results.create({
    //     data: {
    //       userId,
    //       videoUrl,
    //     },
    //   });
    // }

    // ✅ Just return AI output
    return NextResponse.json({
      success: true,
      message: "AI test executed successfully.",
      agentResponse: response,
    });
  } catch (error: any) {
    console.error("❌ Error running QA test:", error);
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
