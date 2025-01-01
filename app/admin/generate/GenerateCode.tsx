"use client";

import { useEffect, useState } from "react";
import { generateBarcodePDF } from "@/lib/htmlUtils";
import Spinner from "@/components/Spinner";
import { getBarInfo } from "@/lib/actions/file.actions";

const GenerateCode = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "PDFs are being generated. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <div>
        <label htmlFor={"pages"} className={"text-2xl font-bold"}>
          Pages
        </label>
        <input
          name={"pages"}
          id={"pages"}
          value={pages}
          onChange={(e) => setPages(parseInt(e.target.value))}
          type="number"
          min={1}
          max={1000}
          className={
            "ms-5 w-16 bg-lightAzureBlue h-14 rounded-xl ps-2 text-2xl font-bold focus:border-none"
          }
        />
      </div>
      <div className={"flex justify-center"}>
        <button
          className={
            "bg-lightAzureBlue h-14 w-96 rounded-full mt-10 font-bold text-xl hover:bg-lightAzureBlue/90 disabled:bg-gray-400"
          }
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await generateBarcodePDF(await getBarInfo(pages, true));
            setLoading(false);
          }}
        >
          Generate Code (Barcode Only) {loading && <Spinner />}
        </button>
      </div>
      <div className={"flex justify-center"}>
        <button
          className={
            "bg-lightAzureBlue h-14 w-96 rounded-full mt-10 font-bold text-xl hover:bg-lightAzureBlue/90 disabled:bg-gray-400"
          }
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await generateBarcodePDF(await getBarInfo(pages, false));
            setLoading(false);
          }}
        >
          Generate Code (Bar and QR) {loading && <Spinner />}
        </button>
      </div>
      {loading && (
        <div className={"flex justify-center text-red-600 text-xl font-bold"}>
          Generating Pages will take some time. Please be patient. Don&#39;t
          reload while PDF are shown left side.
        </div>
      )}
    </div>
  );
};

export default GenerateCode;
