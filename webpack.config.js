const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/client/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  devServer: {
    port: 8081,
    //contentBase: path.join(__dirname, "dist"),
    contentBase: "./src/client",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator"
            ]
          },
        },
      },
    ],
  },
};
