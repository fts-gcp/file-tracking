import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import Timeline from "@/components/Timeline";
import FileForm from "@/app/f/[fid]/FileForm";

interface Props {
  params: Promise<{ fid: string }>;
}

const FileDetailsPage = async ({ params }: Props) => {
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
  }
  if (fid.length === 13) {
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
  }
  if (fid.length === 24) {
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
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      uniqueID: true,
    },
    orderBy: {
      uniqueID: "asc",
    },
  });

  return (
    <div className={"mt-2"}>
      <div className={"flex flex-col items-center mt-10"}>
        {movements.length > 0 && (
          <Timeline
            events={movements.map((m) => ({
              title: m.office.name,
              description: m.comment || undefined,
              date: `${m.createdAt.toLocaleDateString()} ${m.createdAt.toLocaleTimeString()}`,
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

        <div className={"w-96"}>
          <FileForm file={file} users={users} />
        </div>
      </div>
    </div>
  );
};

export default FileDetailsPage;
