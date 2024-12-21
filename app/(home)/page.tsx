import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import UIDSearch from "@/app/(home)/UIDSearch";

const HomePage = async () => {
  const session = await auth();

  if (session?.user && session.user.role === Role.ADMIN) {
    redirect("/admin/");
  }
  if (session?.user && session.user.role === Role.STAFF) {
    redirect("/office/");
  }
  if (!!session?.user) {
    redirect("/profile/");
  }

  return (
    <div className={"mt-2"}>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        Begum Rokeya University, Rangpur
      </p>
      <p className={"text-3xl text-blue-400 font-bold text-center "}>
        File Tracking System
      </p>
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <div className={"-mt-[30vh]"}>
          <UIDSearch />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
