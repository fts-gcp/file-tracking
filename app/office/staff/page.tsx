import { auth } from "@/auth";
import prisma from "@/prisma/client";
import CustomTable from "@/components/CustomTable";

const StaffListPage = async () => {
  const session = await auth();
  const currentUser = await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    include: {
      office: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      officeId: currentUser!.officeId || "fsdfdsf",
    },
    select: {
      name: true,
      uniqueID: true,
    },
    orderBy: {
      email: "asc",
    },
  });

  return (
    <div className={"flex flex-col items-center"}>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10"}>
        {currentUser?.office?.name} Staff List
      </h1>
      <CustomTable
        headers={["Name", "UID"]}
        data={{
          rows: users.map((user) => ({
            cols: [user.name, user.uniqueID],
          })),
        }}
      />
    </div>
  );
};

export default StaffListPage;
