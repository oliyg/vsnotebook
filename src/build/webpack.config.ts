import nodeConfig from "./node.config";
import webviewConfig from "./webview.config";
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from "clean-webpack-plugin";

let configFactory: webpack.ConfigurationFactory;

configFactory = (env, { mode }) => {
  console.log("TCL: mode", mode);
  let { platform, clean } = env as { platform: string, clean: boolean };
  let config;
  if (platform === "node") {
    config = nodeConfig;
  } else if (platform === "webview") {
    config = webviewConfig;
  } else {
    config = {};
  }
  if (clean) {
    config?.plugins?.push(new CleanWebpackPlugin());
  }
  return config;
};

export default configFactory; 