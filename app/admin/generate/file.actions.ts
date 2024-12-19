"use server";

import prisma from "@/prisma/client";

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
  const year = new Date().getFullYear().toString().substr(-2);
  accessKey += year;
  for (let i = 0; i < 4; i++) {
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

export const createNewFile = async () => {
  const newFile = await prisma.file.create({
    data: {
      name: "test",
      accessKey: await generate8DigitAccessKey(),
      barcode: await generate12DigitBarcode(),
    },
  });
  return newFile;
};
