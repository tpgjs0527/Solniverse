const { Schema, Types } = require("mongoose");
const platforms = require("../config/platforms");

const TransactionSchema = new Schema(
  {
    _id: { type: Types.ObjectId, auto: true },
    //처음 update 뒤에 다시 update하려고 하면 에러 발생
    txSignature: { type: String, required: false, immutable: true },
    splToken: { type: String, required: false },
    paymentType: {
      type: String,
      default: "usdc",
      required: true,
      enum: ["usdc", "sol"],
    },
    amount: { type: Number, required: false },
    sendUserId: { type: Types.ObjectId, ref: "User", required: false },
    receiveUserId: { type: Types.ObjectId, ref: "User", required: false },
    nftToken: { type: String, required: false },
    displayName: { type: String, required: true },
    message: { type: String, required: true },
    platform: {
      type: String,
      default: "",
      required: true,
      enum: platforms,
    },
  },
  {
    //규칙을 어기면 error를 throw함. immutable을 어기면 error throw
    strict: "throw",
    // createdat, updateAt
    timestamps: { createdAt: true, updatedAt: true },
  },
);

module.exports = TransactionSchema;
// module.exports = mongoose.model("Transaction", TransactionSchema);
