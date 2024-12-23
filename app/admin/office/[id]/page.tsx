import OfficeForm from "./OfficeForm";
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const AddOfficePage = async ({ params }: Props) => {
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
  const office = await prisma.office.findUnique({
    where: {
      id: id,
    },
  });
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

export default AddOfficePage;
