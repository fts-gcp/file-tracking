import OfficeScan from "@/app/office/OfficeScan";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

const OfficePage = async () => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?redirect=/office");
  }
  // @ts-expect-error This expression is correctly handled
  if (session.user?.role !== Role.STAFF) {
    redirect("/api/auth/signin?redirect=/office");
  }
  return (
    <div>
      <OfficeScan />
    </div>
  );
};

export default OfficePage;
