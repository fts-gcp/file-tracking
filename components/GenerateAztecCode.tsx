import { QRCodeSVG } from "qrcode.react";

interface Props {
  value: string;
}

const GenerateAztecCode = ({ value }: Props) => {
  return <QRCodeSVG value={value} height={70} level="M" />;
};

export default GenerateAztecCode;
