### Todo

Delivery Dates functionality

### Input

- postal code
- list of products

  {
  postalCode: string,
  products: Products[]
  }

### Output

- delivery dates for the upcoming 14 days

  [
  {
  "postalCode": 13756,
  "deliveryDate": "2019-02-13T00:00:00+01:00",
  "isGreenDelivery": true
  },
  {
  "postalCode": 13756,
  "deliveryDate": "2019-02-12T00:00:00+01:00",
  "isGreenDelivery": false
  }
  ]

### Models

Product

- productId
- name
- deliveryDays (a list of weekdays when the product can be delivered)
- productType (normal, external or temporary)
- daysInAdvance (how many days before delivery the products need to be ordered)

  {
  productId: string,
  productType: 'normal' | 'external' | 'temporary',
  deliveryDays: string[], // (date[])
  daysInAdvance: number
  }

Green Deliveries:

- e.g. every Friday

### Rules

- Not valid if not all products can be delivered
- Calc with daysInAdvance if product can be delivered in time
- All external products need to be ordered 5 days in advance
- Temporary products can only be ordered within the current week (Mon-Sun).
- sort Green (if within next 3 days) > date ascending

### Solution

- Could use streams to process input data more efficiently
  - BUT input amount is not that big (customer ordering "some" items)
- go with simple straight forward solution

Solutions:

1. calculate delivery dates per product for next 14 days

   - create array of days; push number of unique deliverable items into map; return map entries where # of entries === # of products
   - write filters for specific requirement and for array
   - write sorting function

2. use map of all potential delivery days, iterate over that instead of products
   and then remove days as soon as one product can not be delivered on that day
