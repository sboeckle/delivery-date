import { getDeliveryDates } from "./service/deliveryDates.ts";
import { DeliveryDatesInput } from "./service/types.ts";

const exampleInput: DeliveryDatesInput = {
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
};

console.log(getDeliveryDates(exampleInput));
