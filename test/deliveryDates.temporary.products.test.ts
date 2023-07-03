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

describe("delivery dates tests with temporary products", async () => {
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
        todayTestDate: testDateMonday,
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
        todayTestDate: testDateMonday,
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
