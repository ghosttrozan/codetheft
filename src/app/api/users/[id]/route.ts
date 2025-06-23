import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1]; // last part is the [id]

    const userId = parseInt(id, 10);

    console.log(userId);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        credits: true,
        isVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      image: user.image,
      email: user.email,
      credits: user.credits,
      isVerified: user.isVerified,
    };

    return NextResponse.json(safeUser);
  } catch (err: unknown) {
    console.error("Error fetching user:", err);
    let errorMessage = "Something went wrong";

    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
