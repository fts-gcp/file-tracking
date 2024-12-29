"use client";

import useFormComponents from "@/components/useFormComponents";
import fileSchema, { FileFormData } from "@/lib/schemas/fileSchema";
import { File as FileModel, FileStatus } from "@prisma/client";
import { updateFile } from "@/lib/actions/file.actions";
import { searchUserForReactSelect } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";

interface Props {
  file: FileModel;
  selectedUsers: { value: string; label: string }[];
}

const FileForm = ({ file, selectedUsers }: Props) => {
  const { handleSubmit, setIsSubmitting, Input, Select, Textarea, SubmitBtn } =
    useFormComponents<FileFormData>(fileSchema, {
      fileType: file.fileType || "",
      name: file?.name || "",
      department: file?.department || "",
      details: file?.details || "",
      status: file?.status || FileStatus.NOT_RECEIVED,
      userId: file?.userId || "",
    });

  const [defaultOptions, setDefaultOptions] =
    useState<{ value: string; label: string }[]>(selectedUsers);
  useEffect(() => {
    searchUserForReactSelect("").then((res) => {
      for (const user of res) {
        if (!defaultOptions.find((option) => option.value === user.value)) {
          defaultOptions.push(user);
        }
      }
      setDefaultOptions(defaultOptions);
    });
  }, []);

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
          isSearchable={false}
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
          loadOptions={searchUserForReactSelect}
          options={defaultOptions}
        />
        <SubmitBtn label={"Update File"} />
      </form>
    </div>
  );
};

export default FileForm;
