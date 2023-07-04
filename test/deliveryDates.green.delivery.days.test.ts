import { describe, it, test } from "node:test";
import assert from "node:assert/strict";
import { getDeliveryDates } from "../src/service/deliveryDates.ts";
import { Product } from "../src/service/types.ts";

describe("delivery dates green delivery tests", async () => {
  it(`marks days as green delivery days`, () => {
    const testDateMonday = new Date("2023-06-26T00:00:00Z");
    const postalCode = "11346";
    const products: Product[] = [
      {
        productId: "1",
        name: "name1",
        productType: "normal",
        deliveryDays: [3, 4, 5, 6],
        daysInAdvance: 0,
      },
      {
        productId: "2",
        name: "name2",
        productType: "normal",
        deliveryDays: [5, 6],
        daysInAdvance: 0,
      },
      {
        productId: "3",
        name: "name3",
        productType: "normal",
        deliveryDays: [3, 4, 5, 6],
        daysInAdvance: 0,
      },
      {
        productId: "4",
        name: "name4",
        productType: "normal",
        deliveryDays: [3, 4, 5, 6],
        daysInAdvance: 0,
      },
    ];
    // only day 2 and 5 are deliverable by all, and only 5 is green day (i.e. friday)
    // and since "today" is monday we have 2 fridays the next two weeks
    const expectedGreenDeliveryDays = 2;
    const out = getDeliveryDates({
      postalCode,
      products,
      today: testDateMonday,
    });
    const greenDeliveryDates = out.filter((d) => d.isGreenDelivery);
    assert.equal(greenDeliveryDates.length, expectedGreenDeliveryDays);
  });

  it(`sorts products with green deliveries in time first`, () => {
    const testDateWednesday = new Date("2023-06-28T00:00:00Z");
    const postalCode = "11346";
    const products: Product[] = [
      {
        productId: "1",
        name: "name1",
        productType: "normal",
        deliveryDays: [3, 4, 5, 6],
        daysInAdvance: 0,
      },
      {
        productId: "2",
        name: "name2",
        productType: "normal",
        deliveryDays: [5, 6],
        daysInAdvance: 0,
      },
      {
        productId: "3",
        name: "name3",
        productType: "normal",
        deliveryDays: [3, 4, 5, 6],
        daysInAdvance: 0,
      },
    ];

    const out = getDeliveryDates({
      postalCode,
      products,
      today: testDateWednesday,
    });
    const expectedTopDate = {
      postalCode,
      deliveryDate: "2023-06-30T00:00:00.000Z",
      isGreenDelivery: true,
    };
    assert.equal(out[0].isGreenDelivery, true);
    assert.equal(
      new Date(out[0].deliveryDate).getTime(),
      new Date(expectedTopDate.deliveryDate).getTime()
    );
  });
});
