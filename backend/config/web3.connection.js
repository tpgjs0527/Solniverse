const web3 = require("@solana/web3.js");

const connection = new web3.Connection(
  web3.clusterApiUrl(process.env.SOLANA_NET),
  "confirmed",
);

const getNewConnection = () => {
  return new web3.Connection(web3.clusterApiUrl(process.env.SOLANA_NET), {
    commitment: "confirmed",
    httpHeaders: "Connection: Keep-Alive",
  });
};

module.exports = { web3, connection, getNewConnection };
