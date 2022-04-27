const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    twitch: {
      id: { type: String, required: false },
      displayName: { type: String, required: false },
      profileImageUrl: { type: String, required: false },
      oauth: {
        accessToken: { type: String, required: false },
        refreshToken: { type: String, required: false },
        type: Object,
        required: false,
      },
      type: Object,
      default: undefined,
      required: false,
    },

    walletAddress: { type: String, required: true, unique: true },
    nonce: { type: String, required: true },
    authority: {
      type: String,
      default: "normal",
      required: true,
      enum: ["normal", "admin"],
    },
    enabled: { type: Boolean, required: false },
  },

  {
    // createdat, updatedat
    timestamps: true,
  },
);

module.exports = UserSchema;
// module.exports = mongoose.model("User", UserSchema);
