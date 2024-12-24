import { Role } from "@prisma/client";
import { checkPermission } from "@/lib/utils";
import type { Metadata } from "next";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkPermission(Role.ADMIN);

  return <div>{children}</div>;
}

export const metadata: Metadata = {
  title: "Admin (FTS)",
  description: "Admin panel for BRUR FTS",
};
