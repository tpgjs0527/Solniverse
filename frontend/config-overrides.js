const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
    console: require.resolve("console-browserify"),
  };
  config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new NodePolyfillPlugin(),
  ];
  // console.log(config.resolve)
  // console.log(config.plugins)

  return config;
};
