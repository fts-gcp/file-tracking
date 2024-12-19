import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { ReactNode, useState } from "react";
import { ZodObject } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select, { GroupBase } from "react-select";

const FaEye = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M572.52 241.4C518.09 135.43 407.59 64 288 64 168.41 64 57.91 135.43 3.48 241.4a48.07 48.07 0 000 29.2C57.91 376.57 168.41 448 288 448c119.59 0 230.09-71.43 284.52-177.4a48.07 48.07 0 000-29.2zM288 400c-88.22 0-167.09-50.26-215.06-128C120.91 194.26 199.78 144 288 144s167.09 50.26 215.06 128C455.09 349.74 376.22 400 288 400zm0-224a80 80 0 1080 80 80 80 0 00-80-80zm0 128a48 48 0 1148-48 48 48 0 01-48 48z" />
    </svg>
  );
};

const FaEyeSlash = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M320 145.92a175.88 175.88 0 01139.66 68.06l-44.93 35.13a96 96 0 00-128.71-18.17zM320 400a175.88 175.88 0 01-139.66-68.06l44.93-35.13a96 96 0 00128.71 18.17zm192.31-113.09a49.5 49.5 0 00-19.4-19.72l42.49-33.22c11.76 9.06 23.1 18.75 34.08 28.91a48.07 48.07 0 010 67.88c-13.31 11.77-27.2 22.54-41.42 32.17l-42.49-33.22a50.13 50.13 0 0026.74-39.8zM96.29 289.24a49.5 49.5 0 0019.4 19.72L73.2 342.18c-11.76-9.06-23.1-18.75-34.08-28.91a48.07 48.07 0 010-67.88C52.43 233.62 66.32 222.85 80.54 213.22l42.49 33.22a50.13 50.13 0 00-26.74 39.8zM570.69 63.3a16 16 0 00-22.62-22.62L89.37 499.3a16 16 0 1022.62 22.62z" />
    </svg>
  );
};

const reformatString = (str: string) => {
  str = str.replace(/([A-Z])/g, " $1").trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const useFormComponents = <T extends FieldValues>(
  resolver: ZodObject<FieldValues>,
  defaultValues?: DefaultValues<T>,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hookFormReturn = useForm<T>({
    resolver: zodResolver(resolver),
    defaultValues,
  });
  const {
    control,
    formState: { errors },
    register,
  } = hookFormReturn;

  interface InputProps {
    name: Path<T>;
    label?: string | null;
    placeholder?: string;
    type?: "text" | "email" | "datetime-local" | "number" | "password";
  }

  const CustomInput = ({ name, label, placeholder, type }: InputProps) => {
    const [isVisible, setIsVisible] = useState(false);
    let extraArgs = {};
    if (type === "datetime-local") {
      extraArgs = {
        valueAsDate: true,
      };
    } else if (type === "number") {
      extraArgs = {
        valueAsNumber: true,
      };
    }

    if (!type) {
      type = "text";
    }

    if (type === "number") {
      type = "text";
    }

    const partedName = name.split(".");
    let error = errors;
    for (let i = 0; i < partedName.length; i++) {
      if (error !== undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        error = error[partedName[i]];
      }
    }

    return (
      <div>
        {label !== null && (
          <label className={"font-bold"}>
            {label ? label : reformatString(name)}
          </label>
        )}
        <div className={"flex mb-2" + ""}>
          <Input
            type={type === "password" && isVisible ? "text" : type}
            placeholder={placeholder}
            {...register(name, extraArgs)}
            className={`${error?.message ? "input-error" : ""}`}
          />
          {type === "password" && (
            <Button
              type={"button"}
              variant={"default"}
              size={"icon"}
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <FaEyeSlash /> : <FaEye />}
            </Button>
          )}
        </div>
        <ErrorMessage>{error?.message as ReactNode}</ErrorMessage>
      </div>
    );
  };

  interface DateTimeLocalProps {
    value: string;
    name: Path<T>;
    label?: string | null;
    placeholder?: string;
  }

  const DateTimeLocal = ({
    name,
    value,
    label,
    placeholder,
  }: DateTimeLocalProps) => {
    return (
      <div>
        {label !== null && (
          <label className={"font-bold"}>
            {label ? label : reformatString(name)}
          </label>
        )}
        <div className={"flex mb-2" + ""}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Input
                defaultValue={formatDateForDatetimeLocal(new Date(value))}
                type="datetime-local"
                placeholder={placeholder}
                {...field}
                onChange={(e) =>
                  field.onChange(
                    formatDateForDatetimeLocal(new Date(e.target.value)),
                  )
                }
                className={`${errors[name] ? "input-error" : ""}`}
              />
            )}
          />
        </div>
        <ErrorMessage>{errors[name]?.message as ReactNode}</ErrorMessage>
      </div>
    );
  };

  interface TextAreaProps {
    name: Path<T>;
  }

  const Textarea = ({ name }: TextAreaProps) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{reformatString(name)}</span>
      </label>
      <textarea
        className={`shadow border border-gray-300 ${
          errors[name] ? "input-error" : ""
        }`}
        {...register(name)}
      />
      <ErrorMessage>{errors[name]?.message as ReactNode}</ErrorMessage>
    </div>
  );

  const CheckBox = ({ name, label }: { name: Path<T>; label?: string }) => (
    <div className="flex">
      <label className="label">
        <input
          className="checkbox rounded-sm checkbox-sm checkbox-primary me-3"
          type="checkbox"
          {...register(name)}
        />
        {label}
      </label>
      <ErrorMessage>{errors[name]?.message as ReactNode}</ErrorMessage>
    </div>
  );

  interface SelectItem {
    value: string;
    label: string;
  }

  interface SelectProps {
    name: Path<T>;
    label?: string;
    options: SelectItem[];
    isMulti?: boolean;
    isSearchable?: boolean;
  }

  const CustomSelect = ({
    name,
    label,
    options,
    isMulti,
    isSearchable,
  }: SelectProps) => {
    const partedName = name.split(".");
    let error = errors;
    for (let i = 0; i < partedName.length; i++) {
      if (error !== undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        error = error[partedName[i]];
      }
    }
    return (
      <div className="w-full">
        {label !== null && (
          <label className={"font-bold"}>
            {label ? label : reformatString(name)}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            return (
              <Select<SelectItem, boolean, GroupBase<SelectItem>>
                isSearchable={isSearchable}
                options={options}
                onChange={(value: any) => {
                  if (isMulti) {
                    field.onChange(value.map((item: any) => item.value));
                  } else {
                    field.onChange(value.value);
                  }
                }}
                isMulti={isMulti || false}
                name={name}
                value={options.filter((c) => field.value?.includes(c.value))}
              />
            );
          }}
        />
        <ErrorMessage>{error?.message as ReactNode}</ErrorMessage>
      </div>
    );
  };

  const SubmitBtn = ({ label }: { label: string }) => (
    <div className="flex justify-center my-5">
      <button
        className={
          "bg-green-600 shadow hover:bg-green-600/70 px-3 py-1 rounded-lg text-lg"
        }
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />} {label}
      </button>
    </div>
  );
  return {
    CheckBox,
    Input: CustomInput,
    Select: CustomSelect,
    DateTimeLocal,
    SubmitBtn,
    Textarea,

    isSubmitting,
    setIsSubmitting,
    ...hookFormReturn,
  };
};

export default useFormComponents;

function formatDateForDatetimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
