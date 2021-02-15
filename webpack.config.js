const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/client/index",
  output: {
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 8081,
    contentBase: './src/client'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
}