import { describe, it, test } from "node:test";
import assert from "node:assert/strict";
import { getDeliveryDates } from "../src/service/deliveryDates.ts";
import { Product } from "../src/service/types.ts";

const testDateTuesday = new Date(new Date("2023-06-26T00:00:00Z"));

type TestDataSet = {
  input: {
    postalCode: string;
    products: Product[];
    todayTestDate: Date;
  };
  expectedNumberOfDates: number;
};

describe("delivery dates tests", async () => {
  const testDataWithDaysInAdvance: TestDataSet[] = [
    {
      input: {
        postalCode: "11346",
        products: [
          {
            productId: "1",
            productType: "normal",
            deliveryDays: [1, 2, 4, 6],
            daysInAdvance: 3,
          },
        ],
        todayTestDate: testDateTuesday,
      },
      expectedNumberOfDates: 6,
    },
    {
      input: {
        postalCode: "11346",
        products: [
          {
            productId: "1",
            productType: "normal",
            deliveryDays: [1, 2, 4, 6],
            daysInAdvance: 3,
          },
          {
            productId: "2",
            productType: "normal",
            deliveryDays: [2, 4],
            daysInAdvance: 1,
          },
          {
            productId: "3",
            productType: "normal",
            deliveryDays: [2, 6],
            daysInAdvance: 2,
          },
        ],
        todayTestDate: testDateTuesday,
      },
      expectedNumberOfDates: 1, // only day 2 is intersected and first week is not possible
    },
    {
      input: {
        postalCode: "11346",
        products: [
          {
            productId: "1",
            productType: "normal",
            deliveryDays: [1, 2, 4, 6],
            daysInAdvance: 0,
          },
          {
            productId: "2",
            productType: "normal",
            deliveryDays: [3],
            daysInAdvance: 12,
          },
        ],
        todayTestDate: testDateTuesday,
      },
      expectedNumberOfDates: 0, // no day intersected therefore no delivery possible
    },
  ];

  it(`getDeliveryDates for products with days in advance`, async () => {
    await Promise.all(
      testDataWithDaysInAdvance.map((testData, index) => {
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

  const testDataWithExternalProducts: TestDataSet[] = [
    {
      input: {
        postalCode: "11346",
        products: [
          {
            productId: "1",
            productType: "external", // i.e. 5 days in advance
            deliveryDays: [1, 2, 4, 6],
            daysInAdvance: 0,
          },
        ],
        todayTestDate: testDateTuesday,
      },
      expectedNumberOfDates: 5, // only day 6 in first week
    },
    {
      input: {
        postalCode: "11346",
        products: [
          {
            productId: "1",
            productType: "external",
            deliveryDays: [1, 2, 4, 5],
            daysInAdvance: 0,
          },
          {
            productId: "2",
            productType: "external",
            deliveryDays: [3],
            daysInAdvance: 0,
          },
        ],
        todayTestDate: testDateTuesday,
      },
      expectedNumberOfDates: 0, // no day intersected therefore no delivery possible
    },
  ];

  it(`getDeliveryDates for products that are external`, async () => {
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

  const testDataWithTemporaryProducts: TestDataSet[] = [
    {
      input: {
        postalCode: "11346",
        products: [
          {
            productId: "1",
            productType: "temporary", // i.e. only deliverable in first week
            deliveryDays: [0, 2, 4, 5],
            daysInAdvance: 0,
          },
        ],
        todayTestDate: testDateTuesday,
      },
      expectedNumberOfDates: 3,
    },
    {
      input: {
        postalCode: "11346",
        products: [
          {
            productId: "1",
            productType: "temporary",
            deliveryDays: [0, 2, 4, 6],
            daysInAdvance: 0,
          },
          {
            productId: "2",
            productType: "temporary",
            deliveryDays: [0, 1, 4, 6],
            daysInAdvance: 0,
          },
          {
            productId: "3",
            productType: "temporary",
            deliveryDays: [1, 2, 4],
            daysInAdvance: 0,
          },
        ],
        todayTestDate: testDateTuesday,
      },
      expectedNumberOfDates: 1, // only day 4 in week one intersects
    },
  ];

  it(`getDeliveryDates for products that are temporary`, async () => {
    await Promise.all(
      testDataWithTemporaryProducts.map((testData, index) => {
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
