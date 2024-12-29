import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import prisma from "@/prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeviceScan from "@/app/office/DeviceScan";

const OfficePage = async () => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?redirect=/office");
  }
  if (session.user?.role in [Role.ADMIN, Role.STAFF]) {
    redirect("/api/auth/signin?redirect=/office");
  }

  const office = await prisma.office.findFirst({
    where: {
      users: {
        some: {
          id: session.user.id as string,
        },
      },
    },
  });

  if (!office) {
    return (
      <div className={"text-red-600 font-bold text-center text-lg"}>
        This staff or admin is not assigned to any office. Please contact ICT
        division.
      </div>
    );
  }

  return (
    <div className={"mt-2"}>
      <p className={"text-3xl text-blue-400 font-bold text-center my-10"}>
        {office.name}
      </p>
      <div className={"flex flex-wrap justify-center gap-4"}>
        <Link href={"/office/recent"}>
          <Button>View Transferred Files</Button>
        </Link>
        <Link href={"/office/available"}>
          <Button>View Available Files</Button>
        </Link>
        <Link href={"/office/staff"}>
          <Button>View Staff List</Button>
        </Link>
      </div>
      <div className={"flex justify-center mt-10"}>
        <DeviceScan noButton={true} />
      </div>
    </div>
  );
};

export default OfficePage;

export const metadata = {
  title: "Office",
  description: "Office dashboard",
};
