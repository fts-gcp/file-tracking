import Link from "next/link";

const Footer = async () => {
  return (
    <div className="bottom-0 w-full flex h-14 bg-azureBlue opacity-60 rounded-b-3xl">
      <div className="flex flex-col items-center justify-center text-center w-full text-white text-xl font-bold">
        <p>©All Copyright reserved by BRUR</p>
        <p>
          Developed By{" "}
          <Link
            className={"underline"}
            href={"https://github.com/mahbd"}
            target={"_blank"}
          >
            Mahmudul
          </Link>{" "}
          and{" "}
          <Link
            className={"underline"}
            target={"_blank"}
            href={"https://github.com/rlhrakib"}
          >
            Rakib
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
