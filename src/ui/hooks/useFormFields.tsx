import { FormEntry } from "@/components/Form/Form";
import { ChangeEvent, useState } from "react";

export default function useFormFields(
  formEntries: FormEntry[]
): [FormEntry[], (event: ChangeEvent<HTMLInputElement>) => void, () => void] {
  const [fields, setFields] = useState<FormEntry[]>(formEntries);

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value: updatedValue } = event.target;
    console.log(name, updatedValue);
    setFields((prevFields) => {
      return prevFields?.map((fields) => {
        if (fields.name === name) {
          return { ...fields, value: updatedValue };
        }

        return fields;
      });
    });
  };

  const resetFields = () => {
    setFields((formEntries) => {
      return formEntries?.map((fields) => {
        return { ...fields, value: "" };
      });
    });
  };

  return [fields, handleFieldChange, resetFields];
}
