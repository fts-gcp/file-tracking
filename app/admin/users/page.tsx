import prisma from "@/prisma/client";
import Link from "next/link";
import CustomTable from "@/components/CustomTable";

const UserListPage = async () => {
  const users = await prisma.user.findMany();

  return (
    <div className={"flex flex-col items-center"}>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10 mb-3"}>
        User List
      </h1>
      <CustomTable
        headers={["UID", "Role", "Name", "Email", "Actions"]}
        data={{
          rows: users.map((user, index) => ({
            cols: [
              user.uniqueID || "N/A",
              user.role,
              user.name,
              user.email,
              <Link
                key={index}
                href={`/admin/users/${user.id}`}
                className={"text-blue-600"}
              >
                View
              </Link>,
            ],
          })),
        }}
      />
    </div>
  );
};

export default UserListPage;
