import { auth } from "@/auth";
import Link from "next/link";

const HomePage = async () => {
  const session = await auth();
  if (!session?.user) {
    return (
      <div>
        <div className={"flex justify-end"}>
          <Link className={"mr-2"} href={"/api/auth/signin"}>
            Sign In
          </Link>
        </div>
        <h1>Home Page</h1>
        <p>Welcome to the home page!</p>
      </div>
    );
  }
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome back, {session.user.name}!</p>
    </div>
  );
};

export default HomePage;
