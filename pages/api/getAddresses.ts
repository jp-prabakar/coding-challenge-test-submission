import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";
import transformAddress from "src/core/models/address";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcode.length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  /** TODO: Implement the validation logic to ensure input value
   *  is all digits and non negative
   */
  const isStrictlyNumeric = (value: string) => {
    return /^\d+$/.test(value);
  };

  /** TODO: Refactor the code below so there is no duplication of logic for postCode/streetNumber digit checks. */
  const validateInputField = (
    value: string | string[],
    errorMessage: string
  ) => {
    if (!value || Array.isArray(value)) return false;

    if (!isStrictlyNumeric(value)) {
      res.status(400).send({
        status: "error",
        errormessage: errorMessage,
      });
      return true;
    }
    return false;
  };

  if (
    validateInputField(
      postcode,
      "Postcode must be all digits and non negative!"
    )
  ) {
    return;
  }

  if (
    validateInputField(
      streetnumber,
      "Street Number must be all digits and non negative!"
    )
  ) {
    return;
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    const transformedAddress = mockAddresses.map((address) =>
      transformAddress({
        ...address,
        id: "",
        firstName: "",
        lastName: "",
        lon: "",
        lat: "",
      })
    );

    return res.status(200).json({
      status: "ok",
      details: transformedAddress,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
