import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import OfficeStaffs from "@/app/office/OfficeStaffs";
import prisma from "@/prisma/client";

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

  const files = await prisma.file.findMany({
    take: 10,
  });

  return (
    <div className={"mt-2"}>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        Begum Rokeya University, Rangpur
      </p>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        File Tracking System
      </p>
      <p className={"text-3xl text-blue-400 font-bold text-center my-10"}>
        {office.name}
      </p>
      <div className={"flex justify-center"}>
        <div className={"grid grid-cols-1 md:grid-cols-2 max-w-4xl"}>
          <div>
            <h2 className={"text-2xl font-bold mt-4"}>Available Files</h2>
            <div className={"mt-4"}>
              {files.map((file) => (
                <div key={file.id} className={"border-b-2 border-gray-200"}>
                  <p className={"text-lg font-bold"}>{file.name}</p>
                  <p className={"text-sm text-gray-500"}>{file.status}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className={"text-2xl font-bold mt-4"}>
              Recently Transfarred Files
            </h2>
            <div className={"mt-4"}>
              {files.map((file) => (
                <div key={file.id} className={"border-b-2 border-gray-200"}>
                  <p className={"text-lg font-bold"}>{file.name}</p>
                  <p className={"text-sm text-gray-500"}>{file.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={"flex justify-center"}>
        <OfficeStaffs />
      </div>
    </div>
  );
};

export default OfficePage;
