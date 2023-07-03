import {
  GREEN_DELIVERY_DAY,
  EXTERNAL_PRODUCT_DELIVERY_DAYS_IN_ADVANCE,
  TEMPORARY_PRODUCT_ONLY_DELIVERABLE_UNTIL_DAY,
  GREEN_DELIVERY_PRIORITIZED_IF_DELIVERABLY_IN_NEXT_DAYS,
} from "../config.json";
import {
  ProductsDeliverableByDay,
  DeliveryDate,
  Product,
  DeliveryDatesInput,
} from "./types.ts";
import { getDateForDayInFuture, differenceInDays } from "../dateTimeUtil.ts";

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

const isGreenDeliveryDay = (day: number) =>
  day === GREEN_DELIVERY_DAY || day === GREEN_DELIVERY_DAY + 7;

/**
 * generates deliveryDates based on the deliveryDays where all the products (numberOfProducts) can be delivered
 * @param deliveryDays
 * @param numberOfProducts
 * @param postalCode
 * @param today
 * @returns
 */
function generateDeliveryDates({
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
    const dateForDelivery = getDateForDayInFuture(today, parseInt(day));
    const deliveryDate = {
      postalCode,
      deliveryDate: dateForDelivery.toISOString(),
      isGreenDelivery: isGreenDeliveryDay(parseInt(day)),
    };
    deliveryDates.push(deliveryDate);
  });

  sortDeliveryDates(deliveryDates, today);

  return deliveryDates;
}

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
    today.getUTCDay()
  );

  const deliveryDates = generateDeliveryDates({
    deliveryDays: productsDeliveryableByDay,
    numberOfProducts: products.length,
    postalCode,
    today,
  });

  return deliveryDates;
}
