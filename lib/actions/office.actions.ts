"use server";

import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { OfficeFormData } from "@/lib/schemas/officeSchema";
import { Office, Role } from "@prisma/client";
import { checkPermission } from "@/lib/utils";

export const createOrUpdateOffice = async (
  data: OfficeFormData,
  office_id?: string,
): Promise<Office> => {
  await checkPermission(Role.ADMIN);

  let res: Office | null = null;
  if (office_id) {
    res = await prisma.office.findUnique({
      where: {
        id: office_id,
      },
    });
    if (!res) {
      notFound();
    }
    await prisma.office.update({
      where: {
        id: res.id,
      },
      data: data,
    });
  } else {
    res = await prisma.office.create({
      data: data,
    });
  }
  return res;
};

export const deleteOffice = async (officeId: string) => {
  await checkPermission(Role.ADMIN);

  await prisma.office.delete({
    where: {
      id: officeId,
    },
  });
  return true;
};
