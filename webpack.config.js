const path = require("path");
const nodeExternals = require("webpack-node-externals");

const SETTINGS = {
  // Nazwa biblioteki
  library: "valenv",
};

module.exports = {
  mode: "production",
  target: "node",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: SETTINGS.library,

    // Uniwersalne ustawienia eksportowania
    libraryTarget: "umd",
    globalObject: "this",
  },
  devtool: "source-map",
  optimization: {
    nodeEnv: false,
  },
  externals: [
    nodeExternals({
      // Bez tego core-js musi być jako dependency
      // Z tym może być jako devDependency
      allowlist: /^core-js/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            sourceType: "unambiguous",
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: require("core-js/package.json").version,
                  targets: {
                    node: "7",
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
