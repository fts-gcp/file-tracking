"use client";

import Image from "next/image";
import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

const UidSearch = () => {
  const [uid, setUid] = useState("");
  return (
    <div>
      <div className={"flex justify-center"}>
        <div className={"flex mt-10"}>
          <input
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder={"Enter UID"}
            className={
              "w-96 bg-lightAzureBlue h-14 rounded-full ps-8 text-2xl font-bold focus:border-none"
            }
          />
          <Image
            className={
              "cursor-pointer h-14 p-2 bg-sky-300 rounded-e-full -ms-14"
            }
            src={"/images/search-icon.png"}
            alt={"Search Icon"}
            width={60}
            height={40}
            onClick={() => redirect(`/files?uid=${uid}`)}
          />
        </div>
      </div>
      <div className={"flex justify-center"}>
        <Link href={"/scan/aztec/"}>
          <button
            className={
              "bg-lightAzureBlue h-14 w-96 rounded-full mt-10 font-bold text-2xl"
            }
          >
            Search Using QR Code
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UidSearch;
