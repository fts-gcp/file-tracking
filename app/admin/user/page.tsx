// AddUserPage.tsx
import UserForm from "@/app/admin/user/UserForm";
import prisma from "@/prisma/client";

const AddUserPage = async () => {
  const offices = await prisma.office.findMany();
  return (
    <div>
      <h1>Add User</h1>
      <UserForm offices={offices} />
    </div>
  );
};

export default AddUserPage;
