import GenerateBarcode from "@/components/GenerateBarcode";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import UpdateUniqueId from "@/app/admin/files/[file_id]/UpdateUniqueId";

interface Props {
  params: Promise<{ file_id: string }>;
}

const FilePage = async ({ params }: Props) => {
  const { file_id } = await params;
  const file = await prisma.file.findUnique({
    where: {
      id: file_id,
    },
  });
  if (!file) {
    notFound();
  }
  return (
    <div>
      <h1>{file.name}</h1>
      <div>
        <GenerateBarcode value={file.barcode} />
      </div>
      <UpdateUniqueId file_id={file.id} />
    </div>
  );
};

export default FilePage;
