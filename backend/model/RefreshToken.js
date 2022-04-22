const { Schema } = require("mongoose");
const RefreshTokenSchema = new Schema({
  wallet_address: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
});
module.exports = RefreshTokenSchema;
