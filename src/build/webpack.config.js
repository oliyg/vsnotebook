const nodeConfig = require("./node.config");
const webviewConfig = require("./webview.config");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = function({ platform, clean }, { mode }) {
  console.log("TCL: mode", mode);
  let config;
  if (platform === "node") {
    config = nodeConfig;
  } else if (platform === "webview") {
    config = webviewConfig;
  }
  if (clean) {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
