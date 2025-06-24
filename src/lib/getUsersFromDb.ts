import { prisma } from "./db";

export async function getUsersFromDb() {
  const users = await prisma.user.findMany();
  return users;
}
