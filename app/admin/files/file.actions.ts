"use server";

import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

export const updateFileUser = async (fileId: string, uniqueID: string) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
  const user = await prisma.user.findFirst({
    where: {
      uniqueID,
    },
  });
  if (!file || !user) {
    notFound();
  }
  await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  return true;
};
