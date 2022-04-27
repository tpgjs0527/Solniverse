const { Schema } = require("mongoose");
const RefreshTokenSchema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
});
module.exports = RefreshTokenSchema;
