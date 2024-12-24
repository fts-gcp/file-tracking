"use client";

import { receiveFile } from "@/lib/actions/file.actions";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

const DeviceScan = () => {
  const [barcode, setBarcode] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Event listener to constantly refocus if the input loses focus
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("click", handleFocus);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("click", handleFocus);
    };
  }, []);

  return (
    <div className={"w-72"}>
      <Input
        type={"text"}
        ref={inputRef}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Scan Barcode"
        autoFocus={true}
        value={barcode}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (barcode.length != 13) {
              setBarcode("");
              return;
            }
            console.log(barcode);
            const res = await receiveFile(barcode);
            if (res === "Same" || res === "Received") {
              redirect(`/f/${barcode}`);
            } else {
              setBarcode("");
              alert("Something went wrong");
            }
          }
        }}
      />
    </div>
  );
};

export default DeviceScan;
