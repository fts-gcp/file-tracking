"use server";

import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { checkPermission } from "@/lib/utils";

export const updateFileUser = async (fileId: string, uniqueID: string) => {
  await checkPermission(Role.STAFF, `/f/${fileId}`);

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

export const deleteFiles = async (fileIds: string[]) => {
  await checkPermission(Role.ADMIN);

  await prisma.file.deleteMany({
    where: {
      id: {
        in: fileIds,
      },
    },
  });
  return true;
};
