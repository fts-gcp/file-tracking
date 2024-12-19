// AddUserPage.tsx
import UserForm from "@/app/admin/user/UserForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ user_id: string }>;
}

const EditUserPage = async ({ params }: Props) => {
  const offices = await prisma.office.findMany();
  const { user_id } = await params;
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
      <h1>Add User</h1>
      <UserForm user={user} offices={offices} />
    </div>
  );
};

export default EditUserPage;
