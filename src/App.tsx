import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import Form, { FormEntry } from "@/components/Form/Form";
import handle from "@/pages/api/getAddresses";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import useFormFields from "@/hooks/useFormFields";

const initialFormEntries: FormEntry[] = [
  {
    name: "postCode",
    placeholder: "Post Code",
    value: "",
  },
  {
    name: "houseNumber",
    placeholder: "House number",
    value: "",
  },
];

const initialPersonFormEntries: FormEntry[] = [
  { name: "firstName", placeholder: "First name", value: "" },
  { name: "lastName", placeholder: "Last name", value: "" },
];

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const [selectedAddress, setSelectedAddress] = React.useState("");

  const [formEntries, setFormEntries] = React.useState(initialFormEntries);
  const [personFormEntries, setPersonFormEntries] = React.useState(
    initialPersonFormEntries
  );
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedAddress(e.target.value);
    setError("");
  };

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (fields: FormEntry[]) => {
    const pCode = fields[0].value;
    const hNo = fields[1].value;
    try {
      const res = await fetch(
        `api/getAddresses?postcode=${pCode}&streetnumber=${hNo}`
      );
      const data = await res.json();
      console.log(data);
      if (data.status === "error") {
        throw new Error(data.errormessage);
      }

      setAddresses(data.details);
      setError("");
    } catch (error) {
      setError(error + "");
      setAddresses([]);
      setSelectedAddress("");
    } finally {
      // console.log("loading: false");
      console.log(error);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (fields: FormEntry[]) => {
    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    const fName = fields[0].value;
    const lName = fields[1].value;

    if (!(fName && lName)) {
      setError("First name and Last name fields are mandatory!");
      return;
    }

    addAddress({ ...foundAddress, firstName: fName, lastName: lName });
    setError("");
  };

  const handleClearAllFields = () => {
    setAddresses([]);
    setSelectedAddress("");
    setError("");
    setFormEntries(initialFormEntries);
  };

  const handleClearAllPersonFields = () => {
    setError("");
    setPersonFormEntries(initialPersonFormEntries);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          label={"🏠 Find an address"}
          loading={false}
          formEntries={formEntries}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
          clearFields={true}
          resetRelatedFields={handleClearAllFields}
        />

        {addresses?.length > 0 &&
          addresses.map((address) => {
            console.log(address);
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={personFormEntries}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            clearFields={true}
            resetRelatedFields={handleClearAllPersonFields}
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage error={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
