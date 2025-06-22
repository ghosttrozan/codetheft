import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function signUp(email: string, name: string, password: string){
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {email, name, password: hashedPassword}
    })
    return user;
}