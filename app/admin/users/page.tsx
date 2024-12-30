import prisma from "@/prisma/client";
import Link from "next/link";
import CustomTable from "@/components/CustomTable";
import { Metadata } from "next";
import CustomPagination from "@/components/CustomPagination";

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

const UserListPage = async ({ searchParams }: Props) => {
  const { page: _page, limit: _limit, search: _search } = await searchParams;
  const page = parseInt(_page || "1");
  const limit = parseInt(_limit || "5");
  const search = _search || "";
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          email: {
            contains: search?.toLowerCase(),
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const total = await prisma.user.count({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          email: {
            contains: search?.toLowerCase(),
          },
        },
        {
          uniqueID: {
            contains: search,
          },
        },
      ],
    },
  });

  return (
    <div className={"flex flex-col items-center"}>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10 mb-3"}>
        User List
      </h1>
      <Link href={`/admin/users/new`} className={"text-blue-600 mb-3"}>
        Add new User
      </Link>
      <CustomTable
        isSearchable={true}
        searchValue={search}
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
      <CustomPagination page={page} limit={limit} total={total} />
    </div>
  );
};

export default UserListPage;

export const metadata: Metadata = {
  title: "User List",
  description: "List of all users in the system",
};
