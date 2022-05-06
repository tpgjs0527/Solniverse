const express = require("express");
const router = express.Router();
const GraphService = require("./graph.service");
const graphService = new GraphService();

/**
 * walletAddress를 통한 후원받은 내역 가져오기
 */

router.get("/receive/:walletAddress", async function (req, res) {
  const walletAddress = req.params["walletAddress"];

  const { statusCode, responseBody } = await graphService.receive(
    walletAddress,
  );

  //res send
  res.statusCode = statusCode;
  res.send(responseBody);
});

/**
 * walletAddress를 통한 후원한 내역 가져오기
 */

router.post("/give/:walletAddress", async function (req, res) {
  const walletAddress = req.params["walletAddress"];

  const { statusCode, responseBody } = await graphService.give(walletAddress);

  //res send
  res.statusCode = statusCode;
  res.send(responseBody);
});

module.exports = router;
