"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";

const UidSearch = () => {
  const [uid, setUid] = useState("");
  const router = useRouter();
  if (uid.length > 8) {
    setUid(uid.slice(0, 8));
  }
  return (
    <div>
      <div className={"flex justify-center"}>
        <div className={"flex mt-10"}>
          <input
            min={8}
            max={8}
            value={uid}
            onChange={(e) => setUid(e.target.value.toUpperCase())}
            placeholder={"Enter UID"}
            className={
              "w-full md:w-96 bg-lightAzureBlue h-14 rounded-full ps-8 text-2xl font-bold focus:border-none"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (uid.length === 8) {
                  router.push(`/f/${uid}`);
                } else {
                  alert("UID should be 8 characters long");
                }
              }
            }}
          />
          <Image
            className={
              "cursor-pointer h-14 p-2 bg-sky-300 rounded-e-full -ms-14"
            }
            src={"/images/search-icon.png"}
            alt={"Search Icon"}
            width={60}
            height={40}
            onClick={() => {
              if (uid.length === 8) {
                router.push(`/f/${uid}`);
              } else {
                alert("UID should be 8 characters long");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UidSearch;
