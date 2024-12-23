// users.actions.ts
"use server";

import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { UserFormData } from "@/lib/schemas/userSchema";
import { User } from "@prisma/client";

export const createOrUpdateUser = async (
  data: UserFormData,
  user_id?: string,
) => {
  // ToDo: implement permission check
  let res: User | null = null;
  if (user_id) {
    res = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!res) {
      notFound();
    }
    res = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: data,
    });
  } else {
    res = await prisma.user.create({
      data: data,
    });
  }
  return res;
};
