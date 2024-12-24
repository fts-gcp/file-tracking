// AddUserPage.tsx
import UserForm from "@/app/admin/users/[user_id]/UserForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";

interface Props {
  params: Promise<{ user_id: string }>;
}

const fetchUser = cache((user_id: string) =>
  prisma.user.findUnique({
    where: {
      id: user_id,
    },
  }),
);

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

  const user = await fetchUser(user_id);
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user_id } = await params;
  if (user_id === "new") {
    return {
      title: "Add new User",
      description: "Add a new user to the system",
    };
  }
  const user = await fetchUser(user_id);
  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested user does not exist.",
    };
  }
  return {
    title: `User: ${user.name}`,
    description: `Details of the user with ID: ${user.id}`,
  };
}
