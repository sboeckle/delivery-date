import { getDeliveryDates } from "./service/deliveryDates.ts";
import { DeliveryDatesInput } from "./service/types.ts";

import input from "./input.json";

console.log(getDeliveryDates(input as DeliveryDatesInput));
