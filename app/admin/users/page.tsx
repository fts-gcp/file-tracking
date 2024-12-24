import prisma from "@/prisma/client";
import Link from "next/link";
import CustomTable from "@/components/CustomTable";
import { Metadata } from "next";

const UserListPage = async () => {
  const users = await prisma.user.findMany();

  return (
    <div className={"flex flex-col items-center"}>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10 mb-3"}>
        User List
      </h1>
      <Link href={`/admin/users/new`} className={"text-blue-600 mb-3"}>
        Add new User
      </Link>
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

export const metadata: Metadata = {
  title: "User List",
  description: "List of all users in the system",
};
