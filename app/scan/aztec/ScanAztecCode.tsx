"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import { redirect } from "next/navigation";

const ScanBarcode: React.FC = () => {
  const [qrCode, setQrCode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.enumerateDevices === "function"
    ) {
      const medias = navigator.mediaDevices.getUserMedia({ video: true });
      medias.then((stream) => {
        stream.getVideoTracks().forEach((track) => {
          track.stop();
        });

        codeReader
          .listVideoInputDevices()
          .then((videoInputDevices) => {
            if (videoInputDevices.length > 0) {
              setVideoInputDevices(videoInputDevices);
              let selected = false;
              for (const device of videoInputDevices) {
                if (
                  device.label.toLowerCase().includes("back") ||
                  device.label.toLowerCase().includes("rear")
                ) {
                  selected = true;
                  setSelectedDeviceId(device.deviceId);
                  break;
                }
              }
              if (!selected) {
                setSelectedDeviceId(videoInputDevices[0].deviceId);
              }
            }
          })
          .catch((err) => console.error(err));
      });
    }
  }, []);

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.AZTEC]);
    const codeReader = new BrowserMultiFormatReader(hints);
    if (selectedDeviceId) {
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            if (result.getText().startsWith("http")) {
              redirect(result.getText());
            }
            setQrCode(result.getText());
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        },
      );
    }

    return () => {
      codeReader.reset();
    };
  }, [selectedDeviceId]);

  return (
    <div className={"flex flex-col items-center"}>
      <video ref={videoRef} className={"rounded-xl mt-5 w-96"} />
      <select
        className={
          "text-black bg-white border border-gray-300 rounded-lg py-2 px-4  w-96 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        }
        onChange={(e) => setSelectedDeviceId(e.target.value)}
        value={selectedDeviceId}
      >
        {videoInputDevices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label || `Camera ${index + 1}`}
          </option>
        ))}
      </select>
      <p>QR Code: {qrCode}</p>
    </div>
  );
};

export default ScanBarcode;
