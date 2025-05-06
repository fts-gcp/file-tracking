import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import Timeline from "@/components/Timeline";
import FileForm from "@/app/f/[fid]/FileForm";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import type { Metadata } from "next";
import DeviceScan from "@/app/office/DeviceScan";
import { getFullDateTime } from "@/lib/utils";

interface Props {
  params: Promise<{ fid: string }>;
}

const FileDetailsPage = async ({ params }: Props) => {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
        },
        include: {
          office: true,
        },
      })
    : null;

  const { fid } = await params;
  let file = null;
  if (fid.length === 8) {
    file = await prisma.file.findUnique({
      where: {
        accessKey: fid,
      },
      include: {
        user: {
          select: {
            uniqueID: true,
          },
        },
      },
    });
  } else if (fid.length === 13) {
    file = await prisma.file.findUnique({
      where: {
        barcode: fid.substring(0, 12),
      },
      include: {
        user: {
          select: {
            uniqueID: true,
          },
        },
      },
    });
  } else {
    file = await prisma.file.findUnique({
      where: {
        id: fid,
      },
      include: {
        user: {
          select: {
            uniqueID: true,
          },
        },
      },
    });
  }
  if (!file) {
    return notFound();
  }

  const movements = await prisma.movement.findMany({
    where: {
      fileId: file.id,
    },
    include: {
      office: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const selectedUsers = (
    file.userId
      ? await prisma.user.findMany({
          where: {
            id: file.userId,
          },
          select: {
            id: true,
            name: true,
            uniqueID: true,
          },
          orderBy: {
            uniqueID: "asc",
          },
        })
      : []
  ).map((user) => ({
    value: user.id,
    label: `${user.uniqueID} (${user.name})`,
  }));

  const isAllowedToEdit =
    user &&
    (user?.role === Role.ADMIN ||
      movements.at(-1)?.officeId === user?.officeId);
  const registerOfficeId = process.env.REGISTER_OFFICE_ID;

  return (
    <div className={"mt-2"}>
      <div className={"flex flex-col items-center mt-10"}>
        {(user?.role === Role.STAFF || user?.role === Role.ADMIN) && (
          <div className={"flex justify-center mt-10"}>
            <DeviceScan />
          </div>
        )}
        {movements.length > 0 && (
          <Timeline
            events={movements.map((m) => ({
              title: m.office.name,
              description: m.comment || undefined,
              date: `${getFullDateTime("Asia/Dhaka", m.createdAt)}`,
            }))}
          />
        )}
        {!movements.length && (
          <div className="text-center w-full">
            <h1 className="text-2xl font-bold text-destructive">
              Your File is not scanned yet. Please ensure that the barcode is
              scanned by office staff.
            </h1>
          </div>
        )}

        {isAllowedToEdit && (
          <div className={"w-96"}>
            <FileForm file={file} selectedUsers={selectedUsers} processed={user.officeId !== registerOfficeId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDetailsPage;

export const metadata: Metadata = {
  title: "File Details",
  description: "Details of a file",
};
