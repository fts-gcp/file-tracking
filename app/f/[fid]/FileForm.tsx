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

  const searchDepartment = (input: string) => {
    const departments = [
      { value: "AIS", label: "Account and Information Systems" },
      { value: "Bangla", label: "Bangla" },
      { value: "Chemistry", label: "Chemistry" },
      { value: "CSE", label: "Computer Science and Engineering" },
      { value: "DM", label: "Disaster Management" },
      { value: "Economics", label: "Economics" },
      { value: "EEE", label: "Electrical and Electronics Engineering" },
      { value: "English", label: "English" },
      { value: "ES", label: "Environmental Science" },
      { value: "F&B", label: "Finance and Banking" },
      { value: "GSDS", label: "Gender Studies and Development Studies" },
      { value: "HA", label: "History and Archeology" },
      { value: "MIB", label: "Management Information and Banking" },
      { value: "MIS", label: "Management Information System" },
      { value: "MS", label: "Management Studies" },
      { value: "Marketing", label: "Marketing" },
      { value: "MCJ", label: "Mass Communication and Journalism" },
      { value: "Mathematics", label: "Mathematics" },
      { value: "Others", label: "Others" },
      { value: "Physics", label: "Physics" },
      { value: "Political Science", label: "Political Science" },
      { value: "Public Administration", label: "Public Administration" },
      { value: "Sociology", label: "Sociology" },
      { value: "Statistics", label: "Statistics" },
    ];

    return departments.filter(
      (department) =>
        department.label.toLowerCase().includes(input.toLowerCase()) ||
        department.value.toLowerCase().includes(input.toLowerCase()),
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          name="fileType"
          options={[
            { value: "NOC", label: "NOC" },
            { value: "Others", label: "Others" },
          ]}
        />
        <Input name="name" placeholder="Name" />
        <Select
          name="department"
          options={searchDepartment("")}
          loadOptions={async (input) => searchDepartment(input)}
        />
        <Textarea name="details" />
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
