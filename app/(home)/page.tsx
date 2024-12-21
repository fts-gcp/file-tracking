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
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <div className={"-mt-[10vh]"}>
        <UIDSearch />
      </div>
    </div>
  );
};

export default HomePage;
