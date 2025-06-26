import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  let { url, mode, language } = await request.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = session.user;
  const userId = parseInt(id, 10);

  try {
    const checkUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!checkUser) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 400 }
      );
    }

    if ((checkUser.credits as number) <= 0) {
      return NextResponse.json(
        { success: false, message: "Insufficient credits" },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL is required" },
        { status: 400 }
      );
    }

    if (mode === "url") {
      try {
        const res = await fetch(process.env.GET_CODE_API!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            language,
          }),
        });

        if (!res.ok) {
          return NextResponse.json(
            { success: false, message: "Failed to fetch code from API" },
            { status: res.status }
          );
        }

        // Try to parse response
        const responseData = await res.json();

        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: {
              decrement: 10,
            },
          },
        });

        return NextResponse.json({ success: true, code: responseData.code });
      } catch (err: unknown) {
        console.error(
          "Error in processing:",
          err instanceof Error ? err.message : String(err)
        );
        return NextResponse.json(
          {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Invalid mode" },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error(
      "Error in processing:",
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
