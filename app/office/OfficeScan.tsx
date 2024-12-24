"use client";

import ScanEAN13 from "@/components/ScanEAN13";
import { useState } from "react";
import { receiveFile } from "@/lib/actions/file.actions";
import { useRouter } from "nextjs-toploader/app";

const OfficeScan = () => {
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  return (
    <div>
      <h1>Office Scan</h1>
      {!scanned && (
        <ScanEAN13
          onBarcodeDetection={async (val) => {
            setScanned(true);
            const res = await receiveFile(val);
            console.log(res);
            if (res === "Same" || res === "Received") {
              router.push(`/f/${val}`);
            } else {
              alert("Something went wrong");
            }
          }}
        />
      )}
    </div>
  );
};

export default OfficeScan;
