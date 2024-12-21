import Image from "next/image";

const Spinner = ({ sz }: { sz?: "md" | "lg" | "xl" | "2xl" }) => {
  let size = 32;
  if (sz === "md") size = 64;
  if (sz === "lg") size = 128;
  if (sz === "xl") size = 150;
  if (sz === "2xl") size = 200;
  return (
    <div className={"loader"}>
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
