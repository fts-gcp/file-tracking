"use client";

import { receiveFile } from "@/lib/actions/file.actions";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

const DeviceScan = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const [scanNow, setScanNow] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
      {scanNow && (
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
              setLoading(true);
              const res = await receiveFile(barcode);
              if (res === "Same" || res === "Received") {
                router.push(`/f/${barcode}`);
              } else {
                setBarcode("");
                alert("Something went wrong");
              }
            }
          }}
        />
      )}
      <Button
        onClick={() => {
          setScanNow(!scanNow);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        {loading && <Spinner />} Toggle Barcode Scanner
      </Button>
    </div>
  );
};

export default DeviceScan;
