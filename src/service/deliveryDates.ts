import {
  CALCULATE_DELIVERY_FOR_NUMBER_OF_WEEKS_AHEAD,
  GREEN_DELIVERY_WEEKDAY,
  GREEN_DELIVERY_PRIORITIZED_IF_DELIVERABLY_IN_NEXT_DAYS,
} from "../config.json";
import {
  ProductsDeliverableByDay,
  DeliveryDate,
  Product,
  DeliveryDatesInput,
} from "./types.ts";
import { getDateForDayInFuture, differenceInDays } from "../dateTimeUtil.ts";
import {
  isDeliveryDayInPastOrTooFarInFuture,
  isProductDeliverableInAdvance,
  isExternalProductDeliverable,
  isTemporaryProductDeliverable,
} from "./deliveryDayFilters.ts";

function generatePotentialDeliveryDaysForProduct(
  product: Product,
  weeksAhead: number
): number[] {
  const potentialDeliveryDays: number[] = [];
  for (let j = 0; j < weeksAhead; j++) {
    potentialDeliveryDays.push.apply(
      potentialDeliveryDays,
      product.deliveryDays.map((d) => (j < 1 ? d : (d += j * 7)))
    );
  }
  return potentialDeliveryDays;
}

/**
 * generates object with number of products that are deliverably on a day
 * @param Product product
 * @param number currentDayOfTheWeek
 * @returns ProductsDeliverableByDay
 */
function getNumberOfProductsDeliverableByDay(
  products: Product[],
  today: Date
): ProductsDeliverableByDay {
  const currentWeekDay = today.getUTCDay();
  const productsDeliverableByDay: ProductsDeliverableByDay = {};

  products.forEach((product) => {
    generatePotentialDeliveryDaysForProduct(
      product,
      CALCULATE_DELIVERY_FOR_NUMBER_OF_WEEKS_AHEAD
    ).forEach((day) => {
      // filters
      if (isDeliveryDayInPastOrTooFarInFuture(day, currentWeekDay)) return;
      if (!isProductDeliverableInAdvance(day, currentWeekDay, product)) return;
      if (!isExternalProductDeliverable(day, currentWeekDay, product)) return;
      if (!isTemporaryProductDeliverable(day, product)) return;
      // keep day as deliverable for this product
      if (!productsDeliverableByDay[day]) productsDeliverableByDay[day] = 1;
      else productsDeliverableByDay[day]++;
    }, productsDeliverableByDay);
  });

  return productsDeliverableByDay;
}

const isGreenDeliveryDay = (day: number) => day % 7 === GREEN_DELIVERY_WEEKDAY;

/**
 * generates DeliveryDates based on the days where all the products (minNumberOfProductsDeliverable) can be delivered
 * @param deliveryDays
 * @param minNumberOfProductsDeliverable
 * @param postalCode
 * @param today
 * @returns
 */
function generateDeliveryDates({
  deliveryDays,
  minNumberOfProductsDeliverable,
  postalCode,
  today,
}: {
  deliveryDays: ProductsDeliverableByDay;
  minNumberOfProductsDeliverable: number;
  postalCode: string;
  today: Date;
}): DeliveryDate[] {
  const deliveryDates: DeliveryDate[] = [];
  Object.entries(deliveryDays).forEach(([day, numberOfProductsDeliverable]) => {
    if (numberOfProductsDeliverable != minNumberOfProductsDeliverable) return;
    const deliveryDate = {
      postalCode,
      deliveryDate: getDateForDayInFuture(today, parseInt(day)),
      isGreenDelivery: isGreenDeliveryDay(parseInt(day)),
    };
    deliveryDates.push(deliveryDate);
  });

  return deliveryDates;
}

/**
 * Sorts DeliveryDate objects in array
 * First green delivery days if they are close (see configs GREEN_DELIVERY_PRIORITIZED_IF_DELIVERABLY_IN_NEXT_DAYS)
 * Then date ascending
 */
function sortDeliveryDates(dates: DeliveryDate[], today: Date): void {
  dates.sort((a, b) => {
    if (
      a.isGreenDelivery > b.isGreenDelivery &&
      differenceInDays(new Date(a.deliveryDate), today) <=
        GREEN_DELIVERY_PRIORITIZED_IF_DELIVERABLY_IN_NEXT_DAYS
    )
      return -1;
    if (new Date(a.deliveryDate) < new Date(b.deliveryDate)) return -1;
    if (new Date(a.deliveryDate) > new Date(b.deliveryDate)) return 1;
    return 0;
  });
}

export function getDeliveryDates({
  postalCode,
  products,
  today = new Date(),
}: DeliveryDatesInput) {
  const productsDeliveryableByDay = getNumberOfProductsDeliverableByDay(
    products,
    today
  );

  const deliveryDates = generateDeliveryDates({
    deliveryDays: productsDeliveryableByDay,
    minNumberOfProductsDeliverable: products.length,
    postalCode,
    today,
  });

  sortDeliveryDates(deliveryDates, today);

  return deliveryDates;
}
