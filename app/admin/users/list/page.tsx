import prisma from "@/prisma/client";
import Link from "next/link";

const UserListPage = async () => {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.email}</h2>
          <p>{user.role}</p>
          <Link href={`/admin/users/${user.id}`}>Edit</Link>
        </div>
      ))}
    </div>
  );
};

export default UserListPage;
