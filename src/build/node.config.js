const path = require("path");
const { PATH_OUT, PATH_SRC } = require("./consts");

module.exports = {
  target: "node",
  entry: {
    extension: path.resolve(PATH_SRC, "extension.ts")
  },
  output: {
    path: PATH_OUT,
    filename(chunkData) {
      if (chunkData.chunk.name === "extension") {
        return "[name].js";
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
