import Link from "next/link";
import { Button } from "@/components/ui/button";

const AdminHomePage = async () => {
  return (
    <div className={"mt-2"}>
      <p className={"text-3xl text-blue-400 font-bold text-center my-10"}>
        Admin Panel
      </p>
      <div className={"flex justify-center gap-4"}>
        <Link href={"/admin/files"}>
          <Button>Files</Button>
        </Link>
        <Link href={"/admin/generate"}>
          <Button>Generate Codes</Button>
        </Link>
        <Link href={"/admin/offices"}>
          <Button>Office List</Button>
        </Link>
        <Link href={"/admin/users"}>
          <Button>User List</Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminHomePage;
