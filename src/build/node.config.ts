import path from "path";
import * as webpack from 'webpack';
import { PATH_OUT, PATH_SRC } from "./consts";

const config: webpack.Configuration = {
  target: "node",
  entry: {
    extension: path.resolve(PATH_SRC, "extension.ts")
  },
  output: {
    path: PATH_OUT,
    filename(chunkData) {
      if (chunkData.chunk.name === "extension") {
        return "[name].js";
      } else {
        return "extension.js";
      }
    },
    libraryTarget: "commonjs2"
    // devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
    "@jupyterlab/services": "@jupyterlab/services"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                module: "es6"
              }
            }
          }
        ]
      }
    ]
  }
};

export default config;