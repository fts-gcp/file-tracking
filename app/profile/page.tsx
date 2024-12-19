import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";

const ProfilePage = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/api/auth/signin?redirect=/profile");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if (!user) {
    redirect("/api/auth/signin?redirect=/profile");
  }
  const files = await prisma.file.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      movements: {
        include: {
          office: true,
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    take: 10,
  });
  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {session.user.email}</p>
      <p>Unique ID: {user.uniqueID}</p>
      <h2>Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <a href={`/files/${file.id}`}>{file.name}</a>
            <p>{file.status}</p>
            {file.movements.length > 0 && (
              <p>Currently at: {file.movements[0].office.name}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
