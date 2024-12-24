import GenerateCode from "@/app/admin/generate/GenerateCode";
import { Metadata } from "next";

const GenerateBarcodePage = () => {
  return (
    <div className={"mt-2"}>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        Begum Rokeya University, Rangpur
      </p>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        File Tracking System
      </p>
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <div className={"-mt-[30vh]"}>
          <GenerateCode />
        </div>
      </div>
    </div>
  );
};

export default GenerateBarcodePage;

export const metadata: Metadata = {
  title: "Generate Barcode and QR Code",
  description: "Generate barcode for files to be tracked",
};
