"use client";

import useFormComponents from "@/components/useFormComponents";
import officeSchema, { OfficeFormData } from "@/lib/schemas/officeSchema";
import {
  createOrUpdateOffice,
  deleteOffice,
} from "@/lib/actions/office.actions";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { Office } from "@prisma/client";
import { useRouter } from "nextjs-toploader/app";

interface Props {
  office?: Office;
}

const OfficeForm = ({ office }: Props) => {
  const {
    handleSubmit,
    isSubmitting,
    setIsSubmitting,
    Input,
    SubmitBtn,
    Textarea,
  } = useFormComponents<OfficeFormData>(officeSchema, {
    name: office?.name,
    details: office?.details || "",
  });

  const router = useRouter();

  const onSubmit = async (data: OfficeFormData) => {
    setIsSubmitting(true);
    await createOrUpdateOffice(data, office?.id);
    router.push("/admin/offices");
  };

  return (
    <div className={"flex justify-center"}>
      <form onSubmit={handleSubmit(onSubmit)} className={"w-72"}>
        <Input name="name" label="Office Name" />
        <Textarea name="details" />
        <div className={"flex justify-around"}>
          <SubmitBtn label={office ? "Update" : "Add new"} />
          {office && (
            <Button
              disabled={isSubmitting}
              type={"button"}
              variant={"destructive"}
              className={"mt-5 text-lg"}
              onClick={async () => {
                setIsSubmitting(true);
                await deleteOffice(office.id);
                router.push("/admin/offices");
              }}
            >
              {isSubmitting && <Spinner />}Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OfficeForm;
