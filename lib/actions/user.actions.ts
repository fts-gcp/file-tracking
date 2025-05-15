// users.actions.ts
"use server";

import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { UserFormData } from "@/lib/schemas/userSchema";
import { Role, User } from "@prisma/client";
import { checkPermission } from "@/lib/utils";
import { hashPassword } from "@/auth";

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

export const setUserPassword = async (user_id: string, password: string) => {
  await checkPermission(Role.ADMIN);
  await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      password: await hashPassword(password),
    },
  });
};

export const changePassword = async (user_id: string, password: string) => {
  await checkPermission("OWNER", undefined, user_id);
  await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      password: await hashPassword(password),
    },
  });
};

export const searchUserForReactSelect = async (search: string) => {
  const res = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
          },
        },
        {
          uniqueID: {
            contains: search,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      uniqueID: true,
    },
    take: 10,
  });
  return res.map((user) => ({
    value: user.id,
    label: `${user.uniqueID} (${user.name})`,
  }));
};
