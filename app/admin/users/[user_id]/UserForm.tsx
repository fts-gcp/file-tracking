"use client";

import useFormComponents from "@/components/useFormComponents";
import userSchema, { UserFormData } from "@/lib/schemas/userSchema";
import { createOrUpdateUser } from "@/lib/actions/user.actions";
import { Office, Role, User } from "@prisma/client";
import { useRouter } from "nextjs-toploader/app";

interface Props {
  user?: User;
  offices: Office[];
}

const UserForm = ({ user, offices }: Props) => {
  const { handleSubmit, setIsSubmitting, Input, SubmitBtn, Select } =
    useFormComponents<UserFormData>(userSchema, {
      role: user?.role || Role.USER,
      email: user?.email || "",
      name: user?.name || "",
      uniqueID: user?.uniqueID || undefined,
      officeId: user?.officeId || undefined,
    });
  const router = useRouter();

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      await createOrUpdateUser(data, user?.id);
      router.push("/admin/users");
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={"flex justify-center"}>
      <form onSubmit={handleSubmit(onSubmit)} className={"w-96"}>
        <Input name="uniqueID" label="Unique ID" />
        <Input name="name" label="Name" />
        <Select
          name="role"
          label="Role"
          options={[
            { value: "USER", label: "User" },
            { value: "STAFF", label: "Staff" },
            { value: "ADMIN", label: "Admin" },
          ]}
        />
        <Input name="email" label="Email" type="email" />
        <Select
          name="officeId"
          label="Office"
          options={offices.map((office) => ({
            value: office.id,
            label: office.name,
          }))}
        />
        <SubmitBtn label="Save" />
      </form>
    </div>
  );
};

export default UserForm;
