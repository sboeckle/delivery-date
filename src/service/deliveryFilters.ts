import {
  NUMBER_OF_DAYS_AHEAD,
  EXTERNAL_PRODUCT_DELIVERY_DAYS_IN_ADVANCE,
  TEMPORARY_PRODUCT_ONLY_DELIVERABLE_UNTIL_DAY,
} from "../config.json";

import { Product } from "./types.ts";

export const isDeliveryDayInPastOrTooFarInFuture = (
  dayOfDelivery: number,
  currentWeekDay: number
) =>
  dayOfDelivery < currentWeekDay ||
  dayOfDelivery > NUMBER_OF_DAYS_AHEAD + currentWeekDay;

export const isProductDeliverableInAdvance = (
  dayOfDelivery: number,
  currentWeekDay: number,
  product: Product
) => dayOfDelivery >= currentWeekDay + product.daysInAdvance;

export const isExternalProductDeliverable = (
  dayOfDelivery: number,
  currentWeekDay: number,
  product: Product
) =>
  product.productType === "external"
    ? dayOfDelivery >=
      currentWeekDay + EXTERNAL_PRODUCT_DELIVERY_DAYS_IN_ADVANCE
    : true;

export const isTemporaryProductDeliverable = (
  dayOfDelivery: number,
  product: Product
) =>
  product.productType === "temporary"
    ? dayOfDelivery < TEMPORARY_PRODUCT_ONLY_DELIVERABLE_UNTIL_DAY
    : true;
