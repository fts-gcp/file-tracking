"use client";

import useFormComponents from "@/components/useFormComponents";
import fileSchema, { FileFormData } from "@/lib/schemas/fileSchema";
import { File as FileModel, FileStatus } from "@prisma/client";
import { updateFile } from "@/lib/actions/file.actions";

interface Props {
  file: FileModel;
  users: { id: string; name: string | null; uniqueID: string | null }[];
}

const FileForm = ({ file, users }: Props) => {
  const { handleSubmit, setIsSubmitting, Input, Select, Textarea, SubmitBtn } =
    useFormComponents<FileFormData>(fileSchema, {
      fileType: file.fileType || "",
      name: file?.name || "",
      department: file?.department || "",
      details: file?.details || "",
      status: file?.status || FileStatus.NOT_RECEIVED,
      userId: file?.userId || "",
    });

  const onSubmit = async (data: FileFormData) => {
    setIsSubmitting(true);
    await updateFile(file.id, data);
    window.location.reload();
    setIsSubmitting(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input name="fileType" placeholder="File Type" />
        <Input name="name" placeholder="Name" />
        <Input name="department" placeholder="Department" />
        <Textarea name="details" />
        <Select
          name="status"
          options={[
            { label: "Not Received", value: FileStatus.NOT_RECEIVED },
            { label: "Processing", value: FileStatus.PROCESSING },
            {
              label: "More Information Needed",
              value: FileStatus.MORE_INFO_REQUIRED,
            },
            { label: "Approved", value: FileStatus.APPROVED },
            { label: "Rejected", value: FileStatus.REJECTED },
          ]}
        />
        <Select
          name="userId"
          options={users.map((user) => ({
            label: `${user.uniqueID} (${user.name})`,
            value: user.id,
          }))}
        />
        <SubmitBtn label={"Update File"} />
      </form>
    </div>
  );
};

export default FileForm;
