const chalk = require("chalk");
const assert = require("assert");

/*
  Sprawdza w jakim trybie jest środowisko.
  Jeśli tryb nie jest ustawiony zwróci błąd.
*/

const NAME = "valenv";

/* --------------------------- FUNKCJE POMOCNICZE --------------------------- */

// Helper do pokazywania błędu
const logError = (msg) => console.log(chalk.red(msg));
const logInfo = (msg) => console.log(chalk.cyan(chalk.bold(msg)));
const logSuccess = (msg) => console.log(chalk.green(chalk.bold(msg)));

/* -------- GŁÓWNA FUNKCJA TWORZĄCA CHECKERY ZMIENNYCH ŚRODOWISKOWYCH ------- */

class ProcessEnvChecker {
  constructor(env = "", allowedValues = [], exitWhenNotAllowed = true) {
    // Walidacja parametrów
    assert(env, `Please pass enviroment variable name.`);
    assert(
      Array.isArray(allowedValues),
      `Please pass array of allowed values for ${env} env variable.`
    );

    // Zapisanie ustawień
    this.env = env;
    this.allowedValues = allowedValues;
    this.exitWhenNotAllowed = exitWhenNotAllowed;

    // Do zapisywania poprzedniej wartości (używane przy logowaniu)
    this.VALUE_wasChecked = false;
    this.VALUE_whenLastChecked = undefined;

    // Dla konsoli
    this.envPrintPath = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(env)
      ? `process.env.${env}`
      : `process.env[\`${env}\`]`;
  }

  // Pozwala ustawić wartość zmiennej środowiskowj
  set value(value) {
    // Sprawdzenie czy podano dozwoloną wartość
    if (this.allowedValues.indexOf(value) === -1) {
      logError(
        `[${NAME}: error] Environment variable ${
          this.envPrintPath
        } can't be set to ${chalk.underline(value)},\n` +
          `it can be set to one of these: [${this.allowedValues.join(", ")}].`
      );

      if (this.exitWhenNotAllowed) process.exit(1);
      return false;
    }

    // Udało się zmienić wartość
    else {
      process.env[this.env] = value;

      logSuccess(
        `[${NAME}: set] ${this.envPrintPath} is now set to ${chalk.underline(
          value
        )}.`
      );

      this.VALUE_wasChecked = true;
      this.VALUE_whenLastChecked = value;
      return true;
    }
  }

  // Pobieranie zmiennej środowiskowej i walidacja
  get value() {
    const value = process.env[this.env];

    // Walidacja wartości jeżeli zmieniła się od ostatniego razu
    if (!this.VALUE_wasChecked || value !== this.VALUE_whenLastChecked) {
      // Ustawiono niedozwoloną wartość (np. brak wartosći)
      if (this.allowedValues.indexOf(value) === -1) {
        logError(
          `[${NAME}: error] Environment variable ${
            this.envPrintPath
          } is set to: ${chalk.underline(value)},\n` +
            `it should be set to one of these: [${this.allowedValues.join(
              ", "
            )}].\n` +
            `Please set it manually on top of your entry point: ${this.envPrintPath} = "...")\n` +
            `or with CLI bin like cross-env: "your-script" = "cross-env ${this.env} = ...".`
        );
        if (this.exitWhenNotAllowed) process.exit(1);
      }

      // Ustawiona wartość jest OK
      else {
        logInfo(
          `[${NAME}: get] ${
            this.envPrintPath
          } is currently set to ${chalk.underline(value)}.`
        );
      }
    }

    this.VALUE_wasChecked = true;
    this.VALUE_whenLastChecked = value;
    return value;
  }

  // Sprawdza czy wartość zmiennej jest równa value
  is(value) {
    return this.value === value;
  }
}

/* ----------------- PRZYGOTOWANIE FABRYKI NIEWYMAGAJĄCEJ NEW --------------- */

function processEnvCheckerFactory(env, allowedValues, exitWhenNotAllowed) {
  return new ProcessEnvChecker(env, allowedValues, exitWhenNotAllowed);
}

/* ------------------------- PREDEFINIOWANE CHECKERY ------------------------ */

// Predefiniowany checker dla NODE_ENV
const NODE_ENV = new ProcessEnvChecker("NODE_ENV", [
  "development",
  "production",
  "test",
]);
NODE_ENV.isProd = () => {
  return NODE_ENV.is("production");
};
NODE_ENV.isDev = () => {
  return NODE_ENV.is("development");
};
NODE_ENV.isTest = () => {
  return NODE_ENV.is("test");
};

processEnvCheckerFactory.NODE_ENV = NODE_ENV;

/* --------------------------------- EXPORT --------------------------------- */

module.exports = processEnvCheckerFactory;
