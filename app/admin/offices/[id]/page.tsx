import OfficeForm from "./OfficeForm";
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import { cache } from "react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const fetchOffice = cache((id: string) =>
  prisma.office.findUnique({
    where: {
      id: id,
    },
  }),
);

const AddOrUpdateOfficePage = async ({ params }: Props) => {
  const { id } = await params;
  if (id === "new") {
    return (
      <div>
        <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10"}>
          Add new Office
        </h1>
        <OfficeForm />
      </div>
    );
  }
  const office = await fetchOffice(id);
  if (!office) {
    notFound();
  }
  return (
    <div>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10"}>
        Update Office
      </h1>
      <OfficeForm office={office} />
    </div>
  );
};

export default AddOrUpdateOfficePage;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id === "new") {
    return {
      title: "Add new Office",
      description: "Add a new office to the system",
    };
  }
  const office = await fetchOffice(id);
  if (!office) {
    return {
      title: "Office Not Found",
      description: "The requested office does not exist.",
    };
  }
  return {
    title: `Update Office: ${office.name}`,
    description: `Update details of the office with ID: ${office.id}`,
  };
}
