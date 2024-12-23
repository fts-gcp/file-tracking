import z from "zod";

const officeSchema = z.object({
  name: z.string().min(3).max(255),
  details: z.string().optional(),
});

export default officeSchema;
export type OfficeFormData = z.infer<typeof officeSchema>;
