export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Mon-Sun

export type Product = {
  productId: string;
  productType: "normal" | "external" | "temporary";
  deliveryDays: WeekDay[];
  daysInAdvance: number;
};

export type ProductsDeliverableByDay = { [index: number]: number };

export type DeliveryDatesInput = {
  postalCode: string;
  products: Product[];
  today?: Date;
};

export type DeliveryDate = {
  postalCode: string;
  deliveryDate: string;
  isGreenDelivery: boolean;
};
