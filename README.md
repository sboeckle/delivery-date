# Simple Delivery Date Functionality

## Prerequisites

make sure to have `node`and `npm` installed (here node >v.20 is used, see .nvmrc. but should run with anything > v.18).

## How to run

Run the following in terminal of your choice from the project root folder:

- `nvm use` if you use nvm (to use set version of .nvmrc)
- `npm i` to install dependencies
- `npm start`
  - this will use some input and sends it to the function that was implemented as required and printes the result to the console
  - input can be changed of course, just change the `exampleInput` parameter with correct values in the `./src/index.ts` file

## Tests

Some tests have been added for testing the functionality and also because I wanted to try the node test runner that does not need another library (like jest).

- See the `./test` folder.
- They can be run using `npm run test` (check package.json for details)
