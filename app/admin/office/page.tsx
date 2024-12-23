import prisma from "@/prisma/client";
import CustomTable from "@/components/CustomTable";
import Link from "next/link";

const AddOfficePage = async () => {
  const offices = await prisma.office.findMany();
  return (
    <div className={"flex flex-col items-center"}>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10 mb-3"}>
        Office List
      </h1>
      <Link href={`/admin/office/new`} className={"text-blue-600 mb-3"}>
        Add new Office
      </Link>
      <CustomTable
        headers={["Name", "Details", "Actions"]}
        data={{
          rows: offices.map((office, index) => ({
            cols: [
              office.name,
              office.details || "N/A",
              <Link
                key={index}
                href={`/admin/office/${office.id}`}
                className={"text-blue-600"}
              >
                View
              </Link>,
            ],
          })),
        }}
      />
    </div>
  );
};

export default AddOfficePage;
