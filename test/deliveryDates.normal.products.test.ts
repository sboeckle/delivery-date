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

const testDataNormalOnly: TestDataSet[] = [
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
      ],
      todayTestDate: testDateMonday,
    },
    expectedNumberOfDates: 8,
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
          deliveryDays: [2, 4],
          daysInAdvance: 0,
        },
        {
          productId: "3",
          productType: "normal",
          deliveryDays: [2, 6],
          daysInAdvance: 0,
        },
      ],
      todayTestDate: testDateMonday,
    },
    expectedNumberOfDates: 2, // only day 2 is intersected in all products
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
          daysInAdvance: 0,
        },
        {
          productId: "3",
          productType: "normal",
          deliveryDays: [5],
          daysInAdvance: 0,
        },
      ],
      todayTestDate: testDateMonday,
    },
    expectedNumberOfDates: 0, // no day intersected therefore no delivery possible
  },
];

describe("delivery dates tests for normal products", async () => {
  it(`getDeliveryDates`, async () => {
    await Promise.all(
      testDataNormalOnly.map((testData, index) => {
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

  it(`returns with correct dates`, () => {
    const testInput = {
      postalCode: "11346",
      products: [
        {
          productId: "1",
          productType: "normal",
          deliveryDays: [1, 2, 4, 6],
          daysInAdvance: 0,
        },
      ] as Product[],
      todayTestDate: testDateMonday,
    };

    const expectedOutputWithoutTimezone = [
      {
        postalCode: "11346",
        deliveryDate: "2023-06-26",
        isGreenDelivery: false,
      },
      {
        postalCode: "11346",
        deliveryDate: "2023-06-27",
        isGreenDelivery: false,
      },
      {
        postalCode: "11346",
        deliveryDate: "2023-06-29",
        isGreenDelivery: false,
      },
      {
        postalCode: "11346",
        deliveryDate: "2023-07-01",
        isGreenDelivery: false,
      },
      {
        postalCode: "11346",
        deliveryDate: "2023-07-03",
        isGreenDelivery: false,
      },
      {
        postalCode: "11346",
        deliveryDate: "2023-07-04",
        isGreenDelivery: false,
      },
      {
        postalCode: "11346",
        deliveryDate: "2023-07-06",
        isGreenDelivery: false,
      },
      {
        postalCode: "11346",
        deliveryDate: "2023-07-08",
        isGreenDelivery: false,
      },
    ];

    const { postalCode, products, todayTestDate } = testInput;
    const out = getDeliveryDates({
      postalCode,
      products,
      today: todayTestDate,
    });
    for (let i = 0; i < out.length; i++) {
      const expected = expectedOutputWithoutTimezone[i];
      const actual = out[i];
      assert.equal(
        new Date(expected.deliveryDate).getTime(),
        new Date(actual.deliveryDate).getTime()
      );
    }
  });
});
