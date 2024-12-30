import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";

const Navbar = async () => {
  const session = await auth();
  return (
    <div className="flex h-10 md:h-14 bg-azureBlue opacity-60 rounded-t-xl md:rounded-t-3xl justify-between p-2">
      <Link href={"/"}>
        <Image
          className={
            "h-8 md:h-10 w-8 md:w-10 ms-1 md:ms-10 -mt-1 md:mt-0 cursor-pointer"
          }
          src={"/images/logo.svg"}
          alt={"BRUR Logo"}
          height={50}
          width={50}
        />
      </Link>
      {!session?.user && (
        <div className="ml-auto flex gap-4 mr-10 -mt-2 md:mt-0">
          <Link href={"/api/auth/signin"}>
            <Button variant={"whiteLink"} size={"xl"} className={"font-bold"}>
              Register
            </Button>
          </Link>
          <Link href={"/api/auth/signin"}>
            <Button variant={"whiteLink"} size={"xl"} className={"font-bold"}>
              Login
            </Button>
          </Link>
        </div>
      )}
      {session?.user && (
        <div className="ml-auto gap-4 flex mr-10 -mt-2 md:mt-0">
          <Link href={"/profile"}>
            <Button variant={"whiteLink"} size={"xl"} className={"font-bold "}>
              Profile
            </Button>
          </Link>
          <Link href={"/api/auth/signout"}>
            <Button variant={"whiteLink"} size={"xl"} className={"font-bold"}>
              Logout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
