import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { redirect, unauthorized } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isNumber = (value: string | null | undefined): boolean => {
  return !isNaN(Number(value));
};

export const checkPermission = async (
  allowedRole: Role | "OWNER" | "OWNER_OR_STAFF",
  uri?: string | null | undefined,
  userId?: string | null | undefined,
): Promise<void | never> => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect(`/api/auth/signin?redirect=${uri || "/"}`);
  }
  if (session.user.role === Role.ADMIN) return;
  if (allowedRole == Role.ADMIN) {
    if (session.user.role !== Role.ADMIN) {
      unauthorized();
    }
  }
  if (allowedRole == Role.STAFF) {
    if (session.user.role !== Role.STAFF) {
      unauthorized();
    }
  }
  if (allowedRole == Role.USER) {
    if (!(session.user.role in [Role.USER, Role.STAFF])) {
      unauthorized();
    }
  }
  if (allowedRole == "OWNER") {
    if (session.user.id !== userId) {
      unauthorized();
    }
  }
  if (allowedRole == "OWNER_OR_STAFF") {
    if (!(session.user.role === Role.STAFF || session.user.id === userId)) {
      unauthorized();
    }
  }
};

export const getFullDateTime = (timezone: string, time: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(time);
};
