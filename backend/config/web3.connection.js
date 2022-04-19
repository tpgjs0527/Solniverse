const web3 = require("@solana/web3.js");
require("dotenv").config();

const connection = new web3.Connection(
  web3.clusterApiUrl(process.env.SOLANA_NET),
  "confirmed"
);

module.exports = { web3, connection };
