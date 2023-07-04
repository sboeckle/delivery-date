# Simple Delivery Date Functionality

## Prerequisites

- make sure to have `node` and `npm` (or yarn, then replace the `npm` commands with `yarn`) installed.
- node >v.20 was used (see .nvmrc.) but should run with anything > v.18.

## How to run

Run the following in terminal of your choice from the project root folder:

- `nvm use` if you use nvm (to use set version of .nvmrc)
- `npm i` to install dependencies
- `npm start`
  - this will use some example input (from the `src/input.json` file) and sends it to the function that was implemented as required and prints the result to the console
  - input can be changed of course, by changing `src/input.json` file

## Tests

Some tests have been added for testing the functionality and also because I wanted to try the node test runner that does not need another library (like jest).

- See the `./test` folder.
- They can be run using `npm run test` (check package.json for details)

## Notes about implementation

### Models

Product

- deliveryDays (a list of weekdays when the product can be delivered)
- name
- productType (normal, external or temporary)
- daysInAdvance (how many days before delivery the products need to be ordered)

### Input

- postal code
- list of products

e.g:

{postalCode: "11346",
products: [
{
productId: "1",
name: "name1",
productType: "normal",
deliveryDays: [1, 2, 4, 6],
daysInAdvance: 3,
},
{
productId: "2",
name: "name2",
productType: "normal",
deliveryDays: [2, 4],
daysInAdvance: 1,
}
}

### Output

- delivery dates for the upcoming 14 days, e.g:

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

### implemented rules

- Delivery day not valid if not all products can be delivered
- use products daysInAdvance calculate if product can be delivered in time
- All external products need to be ordered 5 days in advance
- Temporary products can only be ordered within the current week (weekday 0-6).
- Green Deliveries: used every Friday (weekday 5)
- sorting: Green delivery first, if within next 3 days -> date ascending

### Approach -> Solution

Solutions:

1. calculate delivery dates per product for next 14 days

   - create array of days; push number of unique deliverable items into map; return map entries where # of entries === # of products
   - write filters for specific requirement and for array
   - write sorting function

2. use map of all potential delivery days, iterate over that instead of products
   and then remove days as soon as one product can not be delivered on that day

3. Use streams to be more efficient with lots of products

- BUT input amount seems not that big (customer ordering "some" items)

=> go with simple straight forward solution first, see where this brings us

=> Implemented Solution 1
