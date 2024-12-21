import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import Timeline from "@/components/Timeline";

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
    });
  }
  if (fid.length === 13) {
    file = await prisma.file.findUnique({
      where: {
        barcode: fid.substring(0, 12),
      },
    });
  }
  if (fid.length === 24) {
    file = await prisma.file.findUnique({
      where: {
        id: fid,
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

  return (
    <div className={"flex flex-col items-center mt-10"}>
      <div className={"max-w-2xl"}>
        <h1 className={"text-lg font-bold"}>
          File Name / UID: {file.name || file.accessKey}
        </h1>
      </div>
      {movements.length > 0 && (
        <Timeline
          events={movements.map((m) => ({
            title: m.office.name,
            description: m.comment || undefined,
            date: m.createdAt.toLocaleDateString(),
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
    </div>
  );
};

export default FileDetailsPage;
