// AddUserPage.tsx
import UserForm from "@/app/admin/users/[user_id]/UserForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ user_id: string }>;
}

const EditUserPage = async ({ params }: Props) => {
  const offices = await prisma.office.findMany();
  const { user_id } = await params;

  if (user_id === "new") {
    return (
      <div>
        <h1
          className={"text-center text-3xl text-blue-800 font-bold mt-10 mb-3"}
        >
          Add User
        </h1>
        <UserForm offices={offices} />
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });
  if (!user) {
    notFound();
  }
  return (
    <div>
      <h2 className={"text-center text-3xl text-blue-800 font-bold mt-10 mb-3"}>
        Update User
      </h2>
      <UserForm user={user} offices={offices} />
    </div>
  );
};

export default EditUserPage;
