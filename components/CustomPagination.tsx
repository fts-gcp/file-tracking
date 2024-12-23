"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Select, { GroupBase } from "react-select";
import dynamic from "next/dynamic";

interface Props {
  page: number;
  limit: number;
  total: number;
}

interface SelectItem {
  value: string;
  label: string;
}

const CustomPagination = ({ total, page, limit }: Props) => {
  const searchParams = new URLSearchParams(window.location.search);
  const totalPages = Math.ceil(total / limit);

  const goToPage = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page.toString());
    return window.location.pathname + "?" + searchParams.toString();
  };
  return (
    <div className={"flex"}>
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={goToPage(page - 1)} />
            </PaginationItem>
          )}
          {page - 5 > 0 && (
            <PaginationItem>
              <PaginationLink href={goToPage(page - 5)}>
                {page - 5}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href="#">
              <span className={"border-2 px-1 rounded-lg bg-gray-200"}>
                {page} of {totalPages}
              </span>
            </PaginationLink>
          </PaginationItem>
          {page + 5 < totalPages && (
            <PaginationItem>
              <PaginationLink href={goToPage(page + 5)}>
                {page + 5}
              </PaginationLink>
            </PaginationItem>
          )}

          {page < totalPages && (
            <PaginationItem>
              <PaginationNext href={goToPage(page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      <Select<SelectItem, false, GroupBase<SelectItem>>
        value={{ value: limit.toString(), label: limit.toString() }}
        onChange={(option) => {
          searchParams.set("limit", (option?.value || "5").toString());
          window.location.href =
            window.location.pathname + "?" + searchParams.toString();
        }}
        options={[
          { value: "5", label: "5" },
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
        ]}
        className={"w-28"}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(CustomPagination), {
  ssr: false,
});
