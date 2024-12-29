"use server";

import prisma from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import { FileStatus, Role } from "@prisma/client";
import { checkPermission, getFullDateTime } from "@/lib/utils";
import { BarInfo } from "@/lib/htmlUtils";
import { auth } from "@/auth";
import { FileFormData } from "@/lib/schemas/fileSchema";
import { sendFTSEmail } from "./email.actions";

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
  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });
  if (!file) {
    notFound();
  }

  const { user, lastMovement } = await getUserFileLastMovement(file.barcode);
  if (user.role != Role.ADMIN && lastMovement?.officeId !== user.officeId) {
    return false;
  }

  await prisma.file.update({
    where: {
      id,
    },
    data,
  });

  try {
    if (
      (data.status === FileStatus.APPROVED &&
        file.status !== FileStatus.APPROVED) ||
      (data.status === FileStatus.REJECTED &&
        file.status !== FileStatus.REJECTED) ||
      (data.status === FileStatus.MORE_INFO_REQUIRED &&
        file.status !== FileStatus.MORE_INFO_REQUIRED)
    ) {
      const user = file.userId
        ? await prisma.user.findUnique({
            where: {
              id: file.userId,
            },
          })
        : null;
      const firstMovement = await prisma.movement.findFirst({
        where: {
          fileId: file.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      const action =
        data.status === FileStatus.APPROVED
          ? "Approved"
          : data.status === FileStatus.REJECTED
            ? "Rejected"
            : "requested more information";
      const created = firstMovement?.createdAt || file.createdAt;
      const actioned = new Date();
      if (user && user.email) {
        await sendFTSEmail({
          action: action,
          userName: user.name || "Unknown",
          userEmail: user.email,
          fileName: file.name || file.accessKey,
          dateSubmitted: `${created.toLocaleDateString()} ${created.toLocaleTimeString()}`,
          lastActionDate: `${actioned.toLocaleDateString()} ${actioned.toLocaleTimeString()}`,
          currentOffice: lastMovement?.office.name || "N/A",
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
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

const getUserFileLastMovement = async (barcode: string) => {
  barcode = barcode.length === 13 ? barcode.slice(0, -1) : barcode;
  await checkPermission(Role.STAFF);

  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  const user = await prisma.user.findFirst({
    where: {
      id: session.user?.id,
    },
  });
  if (!user) {
    redirect("/api/auth/signin");
  }
  // remove last extra character
  const file = await prisma.file.findFirst({
    where: {
      barcode: barcode,
    },
    include: {
      user: true,
    },
  });
  if (!file) {
    notFound();
  }
  // try {
  const lastMovement = await prisma.movement.findFirst({
    where: {
      fileId: file.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      office: true,
    },
  });
  return { file, user, lastMovement };
};

export const receiveFile = async (barcode: string) => {
  barcode = barcode.length === 13 ? barcode.slice(0, -1) : barcode;
  const { file, user, lastMovement } = await getUserFileLastMovement(barcode);
  if (!user.officeId) return "Unauthorized";
  if (lastMovement?.officeId === user.officeId) {
    return "Same";
  }
  if (
    file.status === FileStatus.NOT_RECEIVED ||
    file.status === FileStatus.MORE_INFO_REQUIRED
  ) {
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
      officeId: user.officeId,
      userId: user.id,
    },
  });

  if (lastMovement) {
    await prisma.movement.update({
      where: {
        id: lastMovement?.id,
      },
      data: {
        nextId: user.officeId,
      },
    });
  }
  return "Received";
};

export const approveFile = async (barcode: string) => {
  barcode = barcode.length === 13 ? barcode.slice(0, -1) : barcode;
  const { file, user, lastMovement } = await getUserFileLastMovement(barcode);
  if (user.role != Role.ADMIN && lastMovement?.officeId !== user.officeId) {
    return false;
  }

  await prisma.file.update({
    where: {
      barcode: barcode,
    },
    data: {
      status: FileStatus.APPROVED,
    },
  });

  const firstMovement = await prisma.movement.findFirst({
    where: {
      fileId: file.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (file.user && file.user.email) {
    await sendFTSEmail({
      action: "Approved",
      userName: user.name || "Unknown",
      userEmail: file.user.email,
      fileName: file.name || file.accessKey,
      dateSubmitted: `${getFullDateTime("Asia/Dhaka", firstMovement?.createdAt || file.createdAt)}`,
      lastActionDate: `${getFullDateTime("Asia/Dhaka", new Date())}`,
      currentOffice: lastMovement?.office.name || "N/A",
    });
  }
};

export const rejectFile = async (barcode: string) => {
  barcode = barcode.length === 13 ? barcode.slice(0, -1) : barcode;
  const { file, user, lastMovement } = await getUserFileLastMovement(barcode);
  if (user.role != Role.ADMIN && lastMovement?.officeId !== user.officeId) {
    return false;
  }

  await prisma.file.update({
    where: {
      barcode: barcode,
    },
    data: {
      status: FileStatus.REJECTED,
    },
  });

  const firstMovement = await prisma.movement.findFirst({
    where: {
      fileId: file.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (file.user && file.user.email) {
    await sendFTSEmail({
      action: "Rejected",
      userName: user.name || "Unknown",
      userEmail: file.user.email,
      fileName: file.name || file.accessKey,
      dateSubmitted: `${getFullDateTime("Asia/Dhaka", firstMovement?.createdAt || file.createdAt)}`,
      lastActionDate: `${getFullDateTime("Asia/Dhaka", new Date())}`,
      currentOffice: lastMovement?.office.name || "N/A",
    });
  }
};

export const requestMoreInfo = async (barcode: string, comment: string) => {
  barcode = barcode.length === 13 ? barcode.slice(0, -1) : barcode;
  const { file, user, lastMovement } = await getUserFileLastMovement(barcode);
  if (user.role != Role.ADMIN && lastMovement?.officeId !== user.officeId) {
    return false;
  }

  await prisma.file.update({
    where: {
      barcode: barcode,
    },
    data: {
      status: FileStatus.MORE_INFO_REQUIRED,
    },
  });

  await prisma.movement.update({
    where: {
      id: lastMovement?.id,
    },
    data: {
      comment,
    },
  });

  const firstMovement = await prisma.movement.findFirst({
    where: {
      fileId: file.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (file.user && file.user.email) {
    await sendFTSEmail({
      action: "requested more information",
      userName: user.name || "Unknown",
      userEmail: file.user.email,
      fileName: file.name || file.accessKey,
      dateSubmitted: `${getFullDateTime("Asia/Dhaka", firstMovement?.createdAt || file.createdAt)}`,
      lastActionDate: `${getFullDateTime("Asia/Dhaka", new Date())}`,
      currentOffice: lastMovement?.office.name || "N/A",
      comment,
    });
  }
};

export const searchOfficeForReactSelect = async (search: string) => {
  const res = await prisma.office.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
    },
    take: 10,
  });
  return res.map((office) => ({
    value: office.id,
    label: `${office.name}`,
  }));
};
