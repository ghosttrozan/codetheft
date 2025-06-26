import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/validations/signup";
import { signUp } from "./signUp";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      image: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { email, name, password } = await request.json();
  const validatedData = signupSchema.safeParse({ email, password, name });
  if (!validatedData.success) {
    const errorMessages = validatedData.error.issues.map((err) => err.message);
    return NextResponse.json({ errors: errorMessages }, { status: 400 });
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return NextResponse.json(
      { errors: ["email already exists"], success: false },
      { status: 400 }
    );
  }
  const user = await signUp(email, name, password);
  return NextResponse.json(
    { message: "User created!", success: true, user },
    { status: 201 }
  );
}
