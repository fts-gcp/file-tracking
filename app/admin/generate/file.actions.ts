"use server";

import prisma from "@/prisma/client";
import { BarInfo } from "@/lib/htmlUtils";

const generate12DigitBarcode = async () => {
  let barcode = "";
  for (let i = 0; i < 12; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  // check if barcode already exists
  const existingFile = await prisma.file.findFirst({
    where: {
      barcode: barcode,
    },
  });
  if (existingFile) {
    return generate12DigitBarcode();
  }
  return barcode;
};

const generate8DigitAccessKey = async () => {
  // first 4 letter is year
  // rest of them will be upper case letter and digit except I, O, 0, 1
  const allowedChars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let accessKey = "";
  const year = new Date().getFullYear().toString().substring(2);
  accessKey += year;
  for (let i = 0; i < 6; i++) {
    accessKey += allowedChars.charAt(
      Math.floor(Math.random() * allowedChars.length),
    );
  }
  // check if accessKey already exists
  const existingFile = await prisma.file.findFirst({
    where: {
      accessKey: accessKey,
    },
  });
  if (existingFile) {
    return generate8DigitAccessKey();
  }
  return accessKey;
};

export const getBarInfo = async (
  pages: number,
  onlyBarcode: boolean,
): Promise<BarInfo> => {
  // ToDo: Improve performance of this function
  const barInfo: BarInfo = { pages: [] };
  for (let page = 0; page < pages; page++) {
    const barPages = [];
    for (let row = 0; row < 10; row++) {
      const barRows = [];
      for (let col = 0; col < (onlyBarcode ? 3 : 1); col++) {
        const newFile = await prisma.file.create({
          data: {
            name: "test",
            accessKey: await generate8DigitAccessKey(),
            barcode: await generate12DigitBarcode(),
          },
        });
        barRows.push({
          onlyBarcode,
          barcode: newFile.barcode,
          qrcode: newFile.accessKey,
        });
      }
      barPages.push(barRows);
    }
    barInfo.pages.push(barPages);
  }

  return barInfo;
};
