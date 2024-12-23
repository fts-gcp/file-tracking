"use client";

import ScanEAN13 from "@/components/ScanEAN13";
import { useState } from "react";
import { receiveFile } from "@/lib/actions/file.actions";

const OfficeScan = () => {
  const [scanned, setScanned] = useState(false);
  return (
    <div>
      <h1>Office Scan</h1>
      {!scanned && (
        <ScanEAN13
          onBarcodeDetection={async (val) => {
            setScanned(true);
            const res = await receiveFile(val);
            if (res) {
              alert("File received successfully");
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
