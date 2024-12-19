"use server";

import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FileStatus } from "@prisma/client";

export const receiveFile = async (barcode: string) => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  const office = await prisma.office.findFirst({
    where: {
      users: {
        some: {
          id: session.user?.id || "12345678",
        },
      },
    },
  });
  if (!office) {
    redirect("/api/auth/signin?redirect=/office");
  }
  // remove last character
  barcode = barcode.slice(0, -1);
  const file = await prisma.file.findFirst({
    where: {
      barcode: barcode,
    },
  });
  if (!file) {
    return false;
  }
  const lastMovement = await prisma.movement.findFirst({
    where: {
      fileId: file.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (lastMovement?.officeId === office.id) {
    return false;
  }
  if (file.status !== FileStatus.PROCESSING) {
    await prisma.file.update({
      where: {
        barcode: barcode,
      },
      data: {
        status: FileStatus.PROCESSING,
      },
    });
  }
  await prisma.movement.create({
    data: {
      fileId: file.id,
      officeId: office.id,
    },
  });
  return true;
};
