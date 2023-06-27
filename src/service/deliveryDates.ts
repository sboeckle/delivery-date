import {
  ProductsDeliverableByDay,
  DeliveryDate,
  Product,
  DeliveryDatesInput,
} from "./types.ts";
import { addDays, differenceInDays } from "../util.ts";

// All fridays are considered green field deliveries
const GREEN_DELIVERY_DAY = 4;
const EXTERNAL_PRODUCT_DELIVERY_DAYS_IN_ADVANCE = 5;
const TEMPORARY_PRODUCT_ONLY_DELIVERABLE_UNTIL_DAY = 6;
const GREEN_DELIVERY_PRIORITIZED_IF_DELIVERABLY_IN_NEXT_DAYS = 3;

/**
 * generates object with number of products that are deliverably on a day
 * hard coded to look 14 days (two weeks) ahead
 * @param Product product
 * @param number currentDayOfTheWeek
 * @returns ProductsDeliverableByDay
 */
function getNumberOfProductsDeliverableByDay(
  products: Product[],
  currentDayOfTheWeek: number
): ProductsDeliverableByDay {
  const productsDeliverableByDay: ProductsDeliverableByDay = {};

  products.forEach((product) => {
    [
      // current week, filter out days that are in the past already
      ...product.deliveryDays.filter((day) => day >= currentDayOfTheWeek),
      // next week
      ...product.deliveryDays.map((n: number) => (n += 7)),
    ]
      .filter((day) => day >= currentDayOfTheWeek + product.daysInAdvance)
      .filter((day) =>
        product.productType === "external"
          ? day >=
            currentDayOfTheWeek + EXTERNAL_PRODUCT_DELIVERY_DAYS_IN_ADVANCE
          : true
      )
      .filter((day) =>
        product.productType === "temporary"
          ? day <= TEMPORARY_PRODUCT_ONLY_DELIVERABLE_UNTIL_DAY
          : true
      )
      .forEach((day) => {
        if (!productsDeliverableByDay[day]) productsDeliverableByDay[day] = 1;
        else productsDeliverableByDay[day]++;
      });
  });

  return productsDeliverableByDay;
}

/**
 * generates deliveryDates based on the deliveryDays where all the products (numberOfProducts) can be delivered
 * @param deliveryDays
 * @param numberOfProducts
 * @param postalCode
 * @param today
 * @returns
 */
export function generateDeliveryDates({
  deliveryDays,
  numberOfProducts,
  postalCode,
  today,
}: {
  deliveryDays: ProductsDeliverableByDay;
  numberOfProducts: number;
  postalCode: string;
  today: Date;
}): DeliveryDate[] {
  const deliveryDates: DeliveryDate[] = [];

  Object.entries(deliveryDays).forEach(([day, numberOfProductsDeliverable]) => {
    if (numberOfProductsDeliverable != numberOfProducts) return;
    const dateForDelivery = addDays(today, parseInt(day));
    const deliveryDate = {
      postalCode,
      deliveryDate: dateForDelivery.toISOString(),
      isGreenDelivery: parseInt(day) === GREEN_DELIVERY_DAY,
    };
    if (
      deliveryDate.isGreenDelivery &&
      differenceInDays(today, dateForDelivery) >
        GREEN_DELIVERY_PRIORITIZED_IF_DELIVERABLY_IN_NEXT_DAYS
    ) {
      deliveryDates.unshift(deliveryDate);
    } else deliveryDates.push(deliveryDate);
  });

  return deliveryDates;
}

export function getDeliveryDates({
  postalCode,
  products,
  today = new Date(new Date().toDateString()),
}: DeliveryDatesInput) {
  const productsDeliveryableByDay = getNumberOfProductsDeliverableByDay(
    products,
    today.getUTCDay() // UTC since our week starts on Monday = 0
  );

  const deliveryDates = generateDeliveryDates({
    deliveryDays: productsDeliveryableByDay,
    numberOfProducts: products.length,
    postalCode,
    today,
  });

  return deliveryDates;
}
