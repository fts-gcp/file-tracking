"use client";
import { Button } from "@/components/ui/button";
import { createNewFile } from "@/app/admin/generate/file.actions";
import { useState } from "react";
import { File as FileModel } from "@prisma/client";
import GenerateBarcode from "@/app/GenerateBarcode";
import GenerateAztecCode from "@/app/GenerateAztecCode";

const GenerateBarcodePage = () => {
  const [file, setFile] = useState<FileModel | null>(null);
  return (
    <div>
      <h1>Generate New File</h1>
      <Button
        onClick={async () => {
          const res = await createNewFile();
          setFile(res);
        }}
      >
        Generate
      </Button>
      {file && (
        <div>
          <GenerateBarcode value={file.barcode} />
          <GenerateAztecCode value={file.accessKey} />
        </div>
      )}
    </div>
  );
};

export default GenerateBarcodePage;
