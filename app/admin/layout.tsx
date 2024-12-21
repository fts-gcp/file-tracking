import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!(session?.user && session.user.role === Role.ADMIN)) {
    redirect("/api/auth/signin?redirectUri=/admin/");
  }
  return <div>{children}</div>;
}
