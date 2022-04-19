const { Schema, model, Types } = require("mongoose");

const TransactionSchema = new Schema(
  {
    user_id: { types: Types.ObjectId, required: true, ref: "user" },
    transaction_address: { type: String, required: true },
    spl_token: { type: String, required: true },
    payment_type: { type: String, required: true },
    amount: { type: Number, required: true },
    display_name: { type: String, required: true },
    message: { type: String, required: true },
    nft_token: { type: String, required: true },
    // createdat = 지불 날짜, updatedat은 빼야함
  },
  { timestamps: true }
);

const Transaction = model("transaction", TransactionSchema);
module.exports = { Transaction };
