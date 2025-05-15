import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomTable from "@/components/CustomTable";
import Status from "@/components/Status";
import Link from "next/link";
import CustomPagination from "@/components/CustomPagination";
import { isNumber } from "@/lib/utils";
import { Metadata } from "next";
import ChangePassword from "./ChangePassword";

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

const ProfilePage = async ({ searchParams }: Props) => {
  const { page: _page, limit: _limit, search } = await searchParams;
  const page = parseInt(_page || "1");
  const limit = parseInt(_limit || "5");
  const searchName = isNumber(search) ? "" : search;
  const searchBarcode = isNumber(search) ? search : "";
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/api/auth/signin?redirect=/profile");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if (!user) {
    redirect("/api/auth/signin?redirect=/profile");
  }

  const files = await prisma.file.findMany({
    where: {
      userId: user.id,
      name: {
        contains: searchName,
      },
      barcode: {
        contains: searchBarcode,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  const total = await prisma.file.count({
    where: {
      userId: user.id,
      name: {
        contains: searchName,
      },
      barcode: {
        contains: searchBarcode,
      },
    },
  });

  return (
    <div className={"flex flex-col items-center mt-2"}>
      <div
        className={
          "grid grid-cols-1 md:grid-cols-3 max-w-6xl mt-10 items-center"
        }
      >
        <Avatar className={"h-32 w-32 text-7xl"}>
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className={"bg-gray-700 text-white"}>
            {user.email ? user.email[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className={"md:col-span-2 ms-5"}>
          <div className={"grid grid-cols-6 border-2 my-2 p-2 rounded-lg"}>
            <div>UID:</div>
            <div className={"col-span-5 ms-5"}>
              {user.uniqueID || "Not Set"}
            </div>
          </div>
          <div className={"grid grid-cols-6 border-2 my-2 p-2 rounded-lg"}>
            <div>Name:</div>
            <div className={"col-span-5 ms-5"}>{user.name}</div>
          </div>
          <div className={"grid grid-cols-6 border-2 my-2 p-2 rounded-lg"}>
            <div>Email:</div>
            <div className={"col-span-5 ms-5"}>{user.email}</div>
          </div>
          <div className={"grid grid-cols-6 border-2 my-2 p-2 rounded-lg"}>
            <div>Role:</div>
            <div className={"col-span-5 ms-5"}>{user.role}</div>
          </div>
          <div className={"grid grid-cols-6 border-2 my-2 p-2 rounded-lg w-full"}>
            <ChangePassword userId={user.id} />
          </div>
        </div>
      </div>
      <div className={"w-full md:w-[550px]"}>
        <h2 className={"mt-5 text-3xl text-azureBlue font-bold"}>
          Recent Files
        </h2>
        <CustomTable
          isSearchable={true}
          searchValue={search}
          headers={["Date", "Title", "File Status", "Actions"]}
          data={{
            rows: files.map((file, index) => ({
              cols: [
                new Date(file.createdAt).toLocaleDateString(),
                file.name || file.accessKey,
                <Status key={index} value={file.status} />,
                <Link href={`/f/${file.id}`} key={index}>
                  View
                </Link>,
              ],
            })),
          }}
        />
        <CustomPagination page={page} limit={limit} total={total} />
      </div>
    </div>
  );
};

export default ProfilePage;

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile",
};
