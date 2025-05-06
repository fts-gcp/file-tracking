import { auth } from "@/auth";
import prisma from "@/prisma/client";
import CustomTable from "@/components/CustomTable";
import GenerateBarcode from "@/components/GenerateBarcode";
import Status from "@/components/Status";
import Link from "next/link";
import CustomPagination from "@/components/CustomPagination";
import { Metadata } from "next";
import StatusFilter from "./StatusFilter";
import {ClearFileFilter} from "./StatusFilter";
import {FileStatus} from "@prisma/client";

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
  }>;
}

const AvailableFilesPage = async ({ searchParams }: Props) => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    include: {
      office: true,
    },
  });

  const { page: _page, limit: _limit, status } = await searchParams;
  const page = parseInt(_page || "1");
  const limit = parseInt(_limit || "5");

  const movements = await prisma.movement.findMany({
    where: {
      officeId: user!.officeId || "fsdfdsf",
      nextId: null,
      file: status ? {status: status as FileStatus}: undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      file: true,
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  const total = await prisma.movement.count({
    where: {
      prevId: user!.officeId || "fsdfdsf",
    },
  });

    if (movements.length === 0) {
        return (
        <div className={"text-center text-azureBlue font-bold text-lg"}>
            No data available
            <div className={"mt-4"}>
                <ClearFileFilter />
            </div>
        </div>
        );
    }

  return (
    <div className={"flex flex-col items-center"}>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10"}>
        Available Files
      </h1>
      <CustomTable
        headers={["Name", "Barcode", <StatusFilter key="status-filter" initialStatus={status} />, "Actions"]}
        data={{
          rows: movements.map(({ file }, index) => ({
            cols: [
              file.name,
              <GenerateBarcode key={index} value={file.barcode} />,
              <Status key={index} value={file.status} />,
              <Link
                key={index}
                className={"text-blue-600"}
                href={`/f/${file.id}`}
              >
                View it
              </Link>,
            ],
          })),
        }}
      />
      <CustomPagination page={page} limit={limit} total={total} />
    </div>
  );
};
export default AvailableFilesPage;

export const metadata: Metadata = {
  title: "Available Files",
  description: "List of all available files in the office",
};
