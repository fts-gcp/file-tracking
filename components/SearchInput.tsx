"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Props {
  value: string;
}

const SearchInput = ({ value }: Props) => {
  const [searchValue, setSearchValue] = useState(value);
  return (
    <div className={"flex"}>
      <Input
        className={"bg-lightAzureBlue text-black"}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("search", searchValue);
            searchParams.set("page", "1");
            window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
          }
        }}
      />
      <Image
        src={"/images/search-icon.png"}
        alt={"Magnifying Glass"}
        width={40}
        height={40}
        className={"cursor-pointer"}
        onClick={() => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("search", searchValue);
          searchParams.set("page", "1");
          window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
        }}
      />
    </div>
  );
};

export default SearchInput;
