const mongoose = require("mongoose");
const { Schema, Types } = require("mongoose");

const TransactionSchema = new Schema(
  {
    transaction_address: { type: String, required: true },
    spl_token: { type: String, required: false },
    payment_type: { type: String, required: true },
    amount: { type: Number, required: true },
    display_name: { type: String, required: true },
    message: { type: String, required: true },
    send_user_id: { type: Types.ObjectId, ref: "User", required: true },
    receive_user_id: { type: Types.ObjectId, ref: "User", required: true },
    nft_token: { type: String, required: false },
    platform: { type: String, required: true },
  },
  {
    // createdat
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = TransactionSchema;
// module.exports = mongoose.model("Transaction", TransactionSchema);
