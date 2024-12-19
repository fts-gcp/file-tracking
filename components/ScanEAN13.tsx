"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";

interface Props {
  onBarcodeDetection?: (barcode: string) => void;
}

const ScanEAN13 = ({ onBarcodeDetection }: Props) => {
  const [barcode, setBarcode] = useState("");
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
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]);
    const codeReader = new BrowserMultiFormatReader(hints);
    if (selectedDeviceId) {
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            setBarcode(result.getText());
            if (onBarcodeDetection) {
              onBarcodeDetection(result.getText());
            }
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
    <div>
      <video ref={videoRef} style={{ width: "300px" }} />
      <select
        className={"text-black"}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
        value={selectedDeviceId}
      >
        {videoInputDevices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label || `Camera ${index + 1}`}
          </option>
        ))}
      </select>
      <p>Barcode: {barcode}</p>
    </div>
  );
};

export default ScanEAN13;
