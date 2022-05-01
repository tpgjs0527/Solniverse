const { Schema, Types } = require("mongoose");
const platforms = require("../config/platforms");

const TransactionSchema = new Schema(
  {
    _id: { type: Types.ObjectId, auto: true },
    displayName: { type: String, required: true },
    message: { type: String, required: true },
    platform: {
      type: String,
      default: "",
      enum: platforms,
    },
    //처음 update 뒤에 다시 update하려고 하면 에러 발생
    txSignature: {
      type: String,
      required: false,
      index: true,
      unique: true,
      sparse: true,
    },
    blockTime: { type: Date, required: false },
    block: { type: Number, required: false, index: true },
    splToken: { type: String, required: false },
    paymentType: {
      type: String,
      default: "",
      enum: ["", "usdc", "sol"],
    },
    amount: { type: Number, required: false },
    sendUserId: { type: Types.ObjectId, ref: "User", required: false },
    receiveUserId: { type: Types.ObjectId, ref: "User", required: false },
    nftToken: { type: String, required: false },
  },
  {
    // createdat, updateAt
    timestamps: { createdAt: true, updatedAt: true },
  },
);

module.exports = TransactionSchema;
// module.exports = mongoose.model("Transaction", TransactionSchema);
