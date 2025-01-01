import Image from "next/image";

interface Props {
  sz?: "md" | "lg" | "xl" | "2xl";
  color?: "white" | "black";
}

const Spinner = ({ sz, color }: Props) => {
  let size = 32;
  if (sz === "md") size = 64;
  if (sz === "lg") size = 128;
  if (sz === "xl") size = 150;
  if (sz === "2xl") size = 200;
  let loader = "/loader.svg";
  if (color === "black") loader = "/loader-black.svg";
  return (
    <div className={"loader "}>
      <Image src={loader} alt={"Loader"} width={size} height={size} />
    </div>
  );
};

export default Spinner;
