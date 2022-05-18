const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
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

  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  );

  // console.log(config.resolve)
  // console.log(config.plugins)

  return config;
};
