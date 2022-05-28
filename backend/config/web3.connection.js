const web3 = require("@solana/web3.js");

const SOLANA_NETWORK = process.env.SOLANA_NET;
const connection = new web3.Connection(web3.clusterApiUrl(SOLANA_NETWORK), {
  commitment: "confirmed",
  httpHeaders: "Connection: Keep-Alive",
});

const getNewConnection = () => {
  return new web3.Connection(web3.clusterApiUrl(SOLANA_NETWORK), {
    commitment: "confirmed",
  });
};

module.exports = { web3, connection, getNewConnection };
