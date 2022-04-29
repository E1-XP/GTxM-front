const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin");
const cssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const copyPlugin = require("copy-webpack-plugin");
const webpackCleanPlugin = require("webpack-clean");
const autoprefixer = require("autoprefixer");

module.exports = {
  entry: ["./src/index.ts", "./src/scss/main.scss"],
  output: {
    path: path.join(__dirname, "/public"),
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          miniCssExtractPlugin.loader,
          "css-loader",
          "resolve-url-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "../",
            publicPath: "/public"
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".ts"]
  },
  plugins: [
    new miniCssExtractPlugin(),
    new htmlWebpackPlugin({
      template: "./src/index.html",
      inlineSource: ".(js|css)$",
      minify: { collapseWhitespace: true }
    }),
    new htmlWebpackInlineSourcePlugin(),
    new copyPlugin({ patterns: [{ from: "./src/assets", to: "./assets" }] }),
    new webpackCleanPlugin(["./public/main.css", "./public/bundle.js"])
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new terserPlugin(),
      new cssMinimizerPlugin(),
    ]
  }
};
