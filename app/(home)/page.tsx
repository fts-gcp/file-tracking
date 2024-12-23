import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import UIDSearch from "@/app/(home)/UIDSearch";
import prisma from "@/prisma/client";

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

  await prisma.file.deleteMany({
    where: {
      name: {
        not: {
          startsWith: "test",
        },
      },
    },
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={"mt-5 md:mt-20"}>
        <UIDSearch />
      </div>
    </div>
  );
};

export default HomePage;
