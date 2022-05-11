const { Schema } = require("mongoose");
const RefreshTokenSchema = new Schema(
  {
    publicKey: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  },
  {
    // createdat, updateAt
    timestamps: { createdAt: true, updatedAt: true },
  },
);
module.exports = RefreshTokenSchema;
