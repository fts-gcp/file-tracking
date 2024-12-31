import z from "zod";
import { FileStatus } from "@prisma/client";

const fileSchema = z.object({
  fileType: z.string().min(1, "File Type must be selected.").max(50),
  name: z.string().optional(),
  department: z.string().min(1, "Department must be selected.").max(50),
  details: z.string().optional(),
  status: z.nativeEnum(FileStatus),
  userId: z.string().optional(),
});

export default fileSchema;
export type FileFormData = z.infer<typeof fileSchema>;
