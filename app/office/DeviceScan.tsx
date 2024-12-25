"use client";

import {
  approveFile,
  receiveFile,
  rejectFile,
  requestMoreInfo,
} from "@/lib/actions/file.actions";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import ScanEAN13 from "@/components/ScanEAN13";

interface Props {
  noButton?: boolean;
}

const DeviceScan = ({ noButton }: Props) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const [scanNow, setScanNow] = useState<boolean>(noButton || false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
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

  const onSuccessfulScan = async (val: string) => {
    setLoading(true);
    const res = await receiveFile(val);
    if (res === "Same") {
      setIsAlertOpen(true);
    } else if (res === "Received") {
      router.push(`/f/${val}`);
    } else {
      setBarcode("");
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className={"w-72"}>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className={"bg-lightAzureBlue"}>
          <AlertDialogHeader>
            <AlertDialogTitle>Updating File Status</AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea
                className={"text-black bg-white"}
                placeholder={"Write what you need?"}
                value={comment}
                onChange={(e) => setComment(e.currentTarget.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className={"flex flex-wrap w-full justify-between gap-4"}>
              <Button
                disabled={loading}
                type={"button"}
                variant={"success"}
                className={"text-xl font-bold"}
                onClick={async () => {
                  setLoading(true);
                  await approveFile(barcode);
                  router.push(`/f/${barcode}`);
                  setLoading(false);
                }}
              >
                {loading && <Spinner />} Approve
              </Button>
              <Button
                disabled={loading}
                variant={"destructive"}
                type={"button"}
                className={"text-xl font-bold"}
                onClick={async () => {
                  setLoading(true);
                  await rejectFile(barcode);
                  router.push(`/f/${barcode}`);
                  setLoading(false);
                }}
              >
                {loading && <Spinner />} Reject
              </Button>
              <Button
                disabled={loading}
                type={"button"}
                className={"text-xl font-bold"}
                onClick={async () => {
                  setLoading(true);
                  await requestMoreInfo(barcode, comment);
                  router.push(`/f/${barcode}`);
                  setLoading(false);
                }}
              >
                {loading && <Spinner />} Request Information
              </Button>
              <Button
                disabled={loading}
                type={"button"}
                className={"text-xl font-bold"}
                onClick={async () => {
                  setLoading(true);
                  router.push(`/f/${barcode}`);
                  setLoading(false);
                }}
              >
                {loading && <Spinner />} Update
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {loading && <Spinner sz={"2xl"} color={"black"} />}
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
              await onSuccessfulScan(barcode);
            }
          }}
        />
      )}
      {!noButton && (
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
      )}
      <div className={"mt-5"}>
        {showCameraScanner && !loading && (
          <ScanEAN13
            onBarcodeDetection={async (val) => {
              setBarcode(val);
              await onSuccessfulScan(val);
              setShowCameraScanner(false);
            }}
          />
        )}
        <Button
          type={"button"}
          variant={"destructive"}
          onClick={() => setShowCameraScanner(!showCameraScanner)}
        >
          {showCameraScanner ? "Hide Scanner" : "Use Webcam As Scanner"}
        </Button>
      </div>
    </div>
  );
};

export default DeviceScan;
