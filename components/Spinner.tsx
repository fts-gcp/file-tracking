const Spinner = ({ sz }: { sz?: "md" | "lg" | "xl" | "2xl" }) => {
  let size = 10;
  if (sz === "md") size = 16;
  if (sz === "lg") size = 32;
  if (sz === "xl") size = 64;
  if (sz === "2xl") size = 96;

  return (
    <div
      className={`animate-spin rounded-full border-t-4 border-b-4 border-blue-500`}
      style={{ width: `${size}px`, height: `${size}px` }}
    ></div>
  );
};

export default Spinner;
