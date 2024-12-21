import { DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & { id: string; role: Role };
  }

  interface AdapterUser extends DefaultUser {
    role: string;
  }
}
