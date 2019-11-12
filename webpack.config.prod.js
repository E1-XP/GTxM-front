const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const uglifyJSPlugin = require("uglifyjs-webpack-plugin");
const optimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const copyPlugin = require("copy-webpack-plugin");
const webpackCleanPlugin = require("webpack-clean");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("clean-css");

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
        use: ["awesome-typescript-loader"]
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
    new copyPlugin([{ from: "./src/assets", to: "./assets" }]),
    new webpackCleanPlugin(["./public/main.css", "./public/bundle.js"])
  ],
  optimization: {
    minimizer: [
      new uglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          },
          output: {
            comments: false
          }
        }
      }),
      new optimizeCSSAssetsPlugin({
        cssProcessor: cleanCSS
      })
    ]
  },
  devServer: {
    contentBase: "./public"
  }
};
