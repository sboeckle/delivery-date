### Todo

Delivery Date functionality

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

- e.g. every Monday

### Rules

- not valid if can not be delivered today ?
- calc with daysInAdvance if product can be delivered in time
- All external products need to be ordered 5 days in advance
- Temporary products can only be ordered within the current week (Mon-Sun).
- sort Green (if within next 3 days) > date ascending

### Solution

- Could use streams to process input data more efficiently
  - BUT input amount is not that big (customer ordering "some" items)
- go with simple straight forward solution

  /\*

  Question: All the products must have the same delivery day matching for the order?
  -> implement filters that keep the earliest delivery days and skip others (keep special cases)
  OR do we return delivery days for all products separately?
  -> maybe too easy for a task

Solution:

1. calculate delivery dates per product for next 14 days
   a. function that filters if date is weekday that product allows
   b. use daysInAdvance
   c. special cases temporary -> only in current week; external products 5 days in advance

2. Make green delivery fnc

3. sort stuff by date
   a. sort green delivery things if delivery date is within next 3 days
   \*/

// IDEA: create Map of days; push number of unique deliverable items into map; return map entries where # of entries === # of products

// calc if weekday
