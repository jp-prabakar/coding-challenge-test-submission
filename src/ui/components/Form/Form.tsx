import React, { FunctionComponent } from "react";

import useFormFields from "@/hooks/useFormFields";
import Button from "../Button/Button";
import InputText from "../InputText/InputText";
import $ from "./Form.module.css";

export interface FormEntry {
  name: string;
  placeholder: string;
  value: string;
  // onChange: (e: React.ChangeEvent<HTMLInputElement>) => {};
  // TODO: Defined a suitable type for extra props
  // This type should cover all different of attribute types
  extraProps?: any;
}

export interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (fields: FormEntry[]) => void;
  submitText: string;
  clearFields?: boolean;
  resetRelatedFields?: () => void;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
  clearFields,
  resetRelatedFields,
}) => {
  const [fields, handleFieldChange, resetFields] = useFormFields(formEntries);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handleSubmit");
    onFormSubmit(fields as FormEntry[]);
  };

  const handleClearAllFields = () => {
    resetFields();

    if (resetRelatedFields) {
      resetRelatedFields();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(
          ({ name, placeholder, extraProps }, index) => (
            console.log(fields),
            (
              <div key={`${name}-${index}`} className={$.formRow}>
                <InputText
                  key={`${name}-${index}`}
                  name={name}
                  onChange={handleFieldChange}
                  value={(fields as FormEntry[])[index].value}
                  placeholder={placeholder}
                  {...extraProps}
                />
              </div>
            )
          )
        )}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>

      {clearFields && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleClearAllFields()}
        >
          Clear all fields
        </Button>
      )}
    </form>
  );
};

export default Form;
