import prisma from "@/prisma/client";
import GenerateBarcode from "@/components/GenerateBarcode";
import Link from "next/link";
import CustomTable from "@/components/CustomTable";
import { isNumber } from "@/lib/utils";
import Status from "@/components/Status";
import CustomPagination from "@/components/CustomPagination";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

const FilesPage = async ({ searchParams }: Props) => {
  const { page: _page, limit: _limit, search } = await searchParams;
  const page = parseInt(_page || "1");
  const limit = parseInt(_limit || "5");
  const searchName = isNumber(search) ? "" : search;
  const searchBarcode = isNumber(search) ? search : "";
  const files = await prisma.file.findMany({
    where: {
      name: {
        contains: searchName,
      },
      barcode: {
        contains: searchBarcode,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  const total = await prisma.file.count({
    where: {
      name: {
        contains: searchName,
      },
      barcode: {
        contains: searchBarcode,
      },
    },
  });

  return (
    <div className={"flex flex-col items-center"}>
      <h1 className={"text-center text-3xl text-blue-800 font-bold mt-10"}>
        Files
      </h1>
      <CustomTable
        isSearchable={true}
        searchValue={search}
        headers={["Name", "Barcode", "Status", "Actions"]}
        data={{
          rows: files.map((file, index) => ({
            cols: [
              file.name,
              <GenerateBarcode key={index} value={file.barcode} />,
              <Status key={index} value={file.status} />,
              <Link
                key={index}
                className={"text-blue-600"}
                href={`/f/${file.barcode}1`}
              >
                View it{" "}
              </Link>,
            ],
          })),
        }}
      />
      <CustomPagination page={page} limit={limit} total={total} />
    </div>
  );
};
export default FilesPage;

export const metadata: Metadata = {
  title: "Files",
  description: "List of files in the system",
};
