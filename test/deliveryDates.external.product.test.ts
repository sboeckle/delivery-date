import { describe, it, test } from "node:test";
import assert from "node:assert/strict";
import { getDeliveryDates } from "../src/service/deliveryDates.ts";
import { Product } from "../src/service/types.ts";

const testDateMonday = new Date("2023-06-26T00:00:00Z");

type TestDataSet = {
  input: {
    postalCode: string;
    products: Product[];
    todayTestDate: Date;
  };
  expectedNumberOfDates: number;
};

const testDataWithExternalProducts: TestDataSet[] = [
  {
    input: {
      postalCode: "11346",
      products: [
        {
          productId: "1",
          name: "name1",
          productType: "external", // i.e. 5 days in advance
          deliveryDays: [1, 2, 4, 6],
          daysInAdvance: 0,
        },
      ],
      todayTestDate: testDateMonday,
    },
    expectedNumberOfDates: 5, // only day 6 in first week
  },
  {
    input: {
      postalCode: "11346",
      products: [
        {
          productId: "1",
          name: "name1",
          productType: "external",
          deliveryDays: [1, 2, 4, 5],
          daysInAdvance: 0,
        },
        {
          productId: "2",
          name: "name2",
          productType: "external",
          deliveryDays: [3],
          daysInAdvance: 0,
        },
      ],
      todayTestDate: testDateMonday,
    },
    expectedNumberOfDates: 0, // no day intersected therefore no delivery possible
  },
];

describe("delivery dates tests external products", async () => {
  it(`getDeliveryDates`, async () => {
    await Promise.all(
      testDataWithExternalProducts.map((testData, index) => {
        const { input, expectedNumberOfDates } = testData;
        return new Promise((resolve, reject) => {
          it(`testing with testData @index: ${index}`, () => {
            const { postalCode, products, todayTestDate } = input;
            const out = getDeliveryDates({
              postalCode,
              products,
              today: todayTestDate,
            });
            assert.equal(out.length, expectedNumberOfDates);
            resolve(true);
          });
        });
      })
    );
  });
});
