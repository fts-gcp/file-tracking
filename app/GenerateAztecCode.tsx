import { QRCodeSVG } from "qrcode.react";

interface Props {
  value: string;
}

const GenerateAztecCode = ({ value }: Props) => {
  return <QRCodeSVG value={value} level="M" />;
};

export default GenerateAztecCode;
