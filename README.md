<img src="https://raw.githubusercontent.com/aronmandrella/valenv/main/media/valenv.png" />

---

> Process environment checking utility with value validation

<img src="https://raw.githubusercontent.com/aronmandrella/valenv/main/media/console.png" width="600"/>

---

<br>

## Install

```
npm install valenv --save-dev
```

<br>

## Usage A - Basic NODE_ENV checker

- NODE_ENV variable allows `process.env.NODE_ENV` to be one of these: `"development"`, `"production"` or `"test"`.

- If it is `undefined` or something else, checking it will cause an error.

### Example 1

```js
const NODE_ENV = require("valenv").NODE_ENV;

// Set it like this, via CLI...
process.env.NODE_ENV = "development";
// or just set it like this
NODE_ENV.value = "development";

NODE_ENV.value;
// => "development"

NODE_ENV.is("development");
// => true
NODE_ENV.is("production");
// => false

NODE_ENV.isDev();
// => true
NODE_ENV.isProd();
// => false
NODE_ENV.isTest();
// => false

NODE_ENV.value = "production";
NODE_ENV.is("development");
// => false
```

### Example 2 (Errors)

```js
const NODE_ENV = require("valenv").NODE_ENV;

NODE_ENV.value;
// => Was undefined, shows error and terminates app

NODE_ENV.is("development");
// => Was undefined, shows error and terminates app

NODE_ENV.isDev();
// => Was undefined, shows error and terminates app

NODE_ENV.value = "wrong";
// => Not allowed value, shows error and terminates app
```

<br>

## Usage B - Your own checker

You can create your own checkers for any environment variable.

### Example

```js
const valenv = require("valenv");

const YOUR_VAR = valenv(
  // will check process.env["YOUR_VAR"]
  "YOUR_VAR",
  // list of allowed values
  ["value1", "value2"],
  // If true will terminate process on error
  true
);

process.env.YOUR_VAR = "value1";

YOUR_VAR.is("value1");
// => true
YOUR_VAR.is("value2");
// => false

YOUR_VAR.value = "value2";
YOUR_VAR.is("value2");
// => true

YOUR_VAR.value = "value3";
// => Not allowed value, shows error and terminates app
```
