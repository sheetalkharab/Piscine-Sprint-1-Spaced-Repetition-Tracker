// jest.config.cjs
/** @type {import('jest').Config} */
module.exports = {
  transform: {}, // no Babel/CJS transforms
  testEnvironment: "node", // Node’s globals (no jsdom)
  testMatch: ["**/?(*.)+(test).mjs"], // pick up *.test.mjs files
};
