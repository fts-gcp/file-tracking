"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import OfficeScan from "@/app/office/OfficeScan";

const WebScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  return (
    <div>
      {showScanner && <OfficeScan />}
      <Button
        type={"button"}
        variant={"destructive"}
        onClick={() => setShowScanner(!showScanner)}
      >
        {showScanner ? "Hide Scanner" : "Use Webcam As Scanner"}
      </Button>
    </div>
  );
};

export default WebScanner;
