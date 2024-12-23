import { Role } from "@prisma/client";
import { checkPermission } from "@/lib/utils";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkPermission(Role.STAFF);

  return <div>{children}</div>;
}
