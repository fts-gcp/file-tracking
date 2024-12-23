"use server";

import prisma from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import { FileStatus, Role } from "@prisma/client";
import { checkPermission } from "@/lib/utils";
import { BarInfo } from "@/lib/htmlUtils";
import { auth } from "@/auth";
import { FileFormData } from "@/lib/schemas/fileSchema";

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

export const updateFile = async (id: string, data: FileFormData) => {
  // ToDo: Only allow staff of current offices to update file
  await checkPermission(Role.STAFF);

  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });
  if (!file) {
    notFound();
  }

  await prisma.file.update({
    where: {
      id,
    },
    data,
  });
  return true;
};

const generate12DigitBarcode = async (cnt = 1) => {
  const year = new Date().getFullYear().toString().substring(2);
  const barcodes: string[] = [];
  const usedBarcodes = new Set<string>(
    (
      await prisma.file.findMany({
        where: {
          barcode: {
            startsWith: year,
          },
        },
        select: {
          barcode: true,
        },
      })
    ).map((file) => file.barcode),
  );

  for (; barcodes.length < cnt; ) {
    let barcode = year;
    for (let i = 0; i < 10; i++) {
      barcode += Math.floor(Math.random() * 10);
    }
    if (usedBarcodes.has(barcode)) {
      continue;
    }
    barcodes.push(barcode);
  }
  return barcodes;
};

const generate8DigitAccessKey = async (cnt = 1) => {
  const year = new Date().getFullYear().toString().substring(2);
  const allowedChars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const accessKeys: string[] = [];
  const usedAccessKeys = new Set<string>(
    (
      await prisma.file.findMany({
        where: {
          accessKey: {
            startsWith: year,
          },
        },
        select: {
          accessKey: true,
        },
      })
    ).map((file) => file.accessKey),
  );
  for (; accessKeys.length < cnt; ) {
    let accessKey = year;
    for (let i = 0; i < 6; i++) {
      accessKey += allowedChars.charAt(
        Math.floor(Math.random() * allowedChars.length),
      );
    }
    if (usedAccessKeys.has(accessKey)) {
      continue;
    }
    accessKeys.push(accessKey);
  }
  return accessKeys;
};

export const getBarInfo = async (
  pages: number,
  onlyBarcode: boolean,
): Promise<BarInfo> => {
  const numberOfCodes = pages * 10 * (onlyBarcode ? 3 : 1);
  const barcodes = await generate12DigitBarcode(numberOfCodes);
  const accessKeys = await generate8DigitAccessKey(numberOfCodes);
  console.log(barcodes, accessKeys);
  const toBeAddedToDB = [];
  const barInfo: BarInfo = { pages: [] };
  for (let page = 0; page < pages; page++) {
    const barPages = [];
    for (let row = 0; row < 10; row++) {
      const barRows = [];
      for (let col = 0; col < (onlyBarcode ? 3 : 1); col++) {
        const index =
          page * 10 * (onlyBarcode ? 3 : 1) + row * (onlyBarcode ? 3 : 1) + col;
        toBeAddedToDB.push({
          name: "test",
          accessKey: accessKeys[index],
          barcode: barcodes[index],
        });
        barRows.push({
          onlyBarcode,
          barcode: barcodes[index],
          qrcode: accessKeys[index],
        });
      }
      barPages.push(barRows);
    }
    barInfo.pages.push(barPages);
  }

  await prisma.file.createMany({
    data: toBeAddedToDB,
  });

  return barInfo;
};

export const receiveFile = async (barcode: string) => {
  await checkPermission(Role.STAFF);

  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  const user = await prisma.user.findFirst({
    where: {
      id: session.user?.id,
    },
    include: {
      office: true,
    },
  });
  if (!user || !user.office) {
    redirect("/api/auth/signin");
  }
  // remove last extra character
  barcode = barcode.slice(0, -1);
  const file = await prisma.file.findFirst({
    where: {
      barcode: barcode,
    },
  });
  if (!file) {
    return "File not found";
  }
  // try {
  const lastMovement = await prisma.movement.findFirst({
    where: {
      fileId: file.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (lastMovement?.officeId === user.office.id) {
    return "Same";
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
      prevId: lastMovement?.officeId,
      fileId: file.id,
      officeId: user.office.id,
    },
  });

  await prisma.movement.update({
    where: {
      id: lastMovement?.id,
    },
    data: {
      nextId: user.office.id,
    },
  });
  return "Received";
};
