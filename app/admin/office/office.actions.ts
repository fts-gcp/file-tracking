"use server";

import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { OfficeFormData } from "@/app/admin/office/officeSchema";
import { Office } from "@prisma/client";

export const createOrUpdateOffice = async (
  data: OfficeFormData,
  office_id?: string,
) => {
  // ToDo: implement permission check
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
        id: office_id,
      },
      data: data,
    });
  }
  res = await prisma.office.create({
    data: data,
  });
  return res;
};
