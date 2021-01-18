const assert = require("assert");

const NODE_ENV = require("./dist/main").NODE_ENV;

console.log("\n\n\n");
process.env.NODE_ENV = "production";
NODE_ENV.value;
NODE_ENV.value = "development";
NODE_ENV.value = "bad_value";

// Błąd
// NODE_ENV.isProd();

// Poprawne operacje
for (const env of ["production", "development", "test"]) {
  NODE_ENV.value = env;
  assert(NODE_ENV.value === env, "1");
  assert(NODE_ENV.isProd() === (env === "production"), "2");
  assert(NODE_ENV.isDev() === (env === "development"), "3");
  assert(NODE_ENV.isTest() === (env === "test"), "4");
}
// Błąd
// NODE_ENV.value = undefined;

const checkProcessEnv = require("./dist/main");

const YOUR_VAR = checkProcessEnv(
  "YOUR_VAR", // will check process.env["YOUR_VAR"]
  ["value1", "value2"], // list of allowed values
  true // If true will terminate process on error
);

process.env.YOUR_VAR = "value1";

YOUR_VAR.is("value1");
// => true
YOUR_VAR.is("value2");
// => false

YOUR_VAR.value = "value2";
YOUR_VAR.is("value2");
// => true
