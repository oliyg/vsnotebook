const path = require("path");
const { PATH_OUT, PATH_SRC } = require("./consts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",
  entry: {
    workflow: path.resolve(PATH_SRC, "workflow/webview/home.tsx")
  },
  output: {
    path: PATH_OUT,
    filename(chunkData) {
      if (chunkData.chunk.name === "workflow") {
        return "[name]/[name].js";
      }
    }
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {}
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ["workflow"],
      template: path.resolve(PATH_SRC, "workflow/webview/index.template.html"),
      filename: "workflow/index.html"
    })
  ]
};
