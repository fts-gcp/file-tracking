"use client";

import useFormComponents from "@/components/useFormComponents";
import officeSchema, { OfficeFormData } from "@/app/admin/office/officeSchema";
import { createOrUpdateOffice } from "@/app/admin/office/office.actions";

const OfficeForm = () => {
  const { handleSubmit, setIsSubmitting, Input, SubmitBtn, Textarea } =
    useFormComponents<OfficeFormData>(officeSchema, {});

  const onSubmit = async (data: OfficeFormData) => {
    setIsSubmitting(true);
    await createOrUpdateOffice(data);
    setIsSubmitting(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input name="name" label="Office Name" />
        <Textarea name="details" />
        <SubmitBtn label="Save" />
      </form>
    </div>
  );
};

export default OfficeForm;
