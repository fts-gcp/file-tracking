import z from "zod";
import { FileStatus } from "@prisma/client";

const fileSchema = z.object({
  fileType: z.string().optional(),
  name: z.string().min(3).max(255),
  department: z.string().optional(),
  details: z.string().optional(),
  status: z.nativeEnum(FileStatus),
  userId: z.string().optional(),
});

export default fileSchema;
export type FileFormData = z.infer<typeof fileSchema>;
