import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomTable from "@/components/CustomTable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProfilePage = async () => {
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
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <div className={"flex flex-col items-center mt-2"}>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        Begum Rokeya University, Rangpur
      </p>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        File Tracking System
      </p>

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
        </div>
      </div>
      <h2 className={"mt-5 text-2xl text-azureBlue font-bold"}>Recent Files</h2>
      <CustomTable
        headers={["Date", "Title", "File Status"]}
        data={{
          rows: files.map((file) => ({
            cols: [
              new Date(file.createdAt).toLocaleDateString(),
              file.name || file.accessKey,
              file.status,
            ],
          })),
        }}
      />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProfilePage;
