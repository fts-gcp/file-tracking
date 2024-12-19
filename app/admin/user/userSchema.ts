import z from "zod";

const userSchema = z.object({
  uniqueID: z.string().optional(),
  name: z.string().min(3).max(255),
  role: z.enum(["USER", "STAFF", "ADMIN"]),
  email: z.string().email(),
  officeId: z.string().optional(),
});

export default userSchema;
export type UserFormData = z.infer<typeof userSchema>;
