"use client";

import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const GenerateBarcode: React.FC<{ value: string }> = ({ value }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "EAN13",
        displayValue: true,
        height: 30,
        width: 2,
      });
    }
  }, [value]);

  return <svg ref={barcodeRef}></svg>;
};

export default GenerateBarcode;
