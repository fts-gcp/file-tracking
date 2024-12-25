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
  let extraClass = "text-white";
  if (color === "black") extraClass = "text-black";
  else if (color === "white") extraClass = "text-white";
  return (
    <div className={"loader " + extraClass}>
      <Image
        src={"/loader.svg"}
        alt={"Loader"}
        width={size}
        height={size}
        className={"animate-spin"}
      />
    </div>
  );
};

export default Spinner;
