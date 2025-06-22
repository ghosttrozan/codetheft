import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { use } from "react";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: "Invalid user ID format" },
      { status: 400 }
    );
  }

  try {
    // 2. Use consistent naming (user instead of User)
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

    // 3. Consider excluding sensitive data
    const safeUser = {
      id: user.id,
      name: user.name,
      image: user.image,
      credits: user.credits,
      isVerified: user.isVerified,
    };

    return NextResponse.json(safeUser);
  } catch (err: unknown) {
    // 4. Better error handling
    console.error("Error fetching user:", err);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
