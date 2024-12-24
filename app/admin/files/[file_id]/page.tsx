import GenerateBarcode from "@/components/GenerateBarcode";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import UpdateUniqueId from "@/app/admin/files/[file_id]/UpdateUniqueId";
import type { Metadata } from "next";
import { cache } from "react";

interface Props {
  params: Promise<{ file_id: string }>;
}

const fetchFile = cache((file_id: string) =>
  prisma.file.findUnique({
    where: {
      id: file_id,
    },
  }),
);

const FilePage = async ({ params }: Props) => {
  const { file_id } = await params;
  const file = await fetchFile(file_id);
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { file_id } = await params;
  const file = await fetchFile(file_id);

  if (!file) {
    return {
      title: "File Not Found",
      description: "The requested file does not exist.",
    };
  }

  return {
    title: `File: ${file.name}`,
    description: `Details of the file with ID: ${file.id}`,
  };
}
