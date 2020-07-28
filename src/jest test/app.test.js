import mainFunction from '../client/js/app'

// jest testing to check generateTripDetails returns something - i.e. variable is not undefined

describe(generateTripDetails, () => {
  test("generateTripDetails is defined", () => {
      expect(generateTripDetails).toBeDefined
  });
});