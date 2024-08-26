"use server"

import prisma from "@src/app/db";

export const helloWorld = async () => {
  const result = await prisma.hello_world.findFirst()
  return result?.message
}
 