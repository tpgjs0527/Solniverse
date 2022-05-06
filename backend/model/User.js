const { Schema } = require("mongoose");
const { v4, v5 } = require("uuid");

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
    userKey: { type: String, immutable: true, unique: true },
    enabled: { type: Boolean, required: false },
  },

  {
    // createdat, updatedat
    timestamps: true,
  },
);

UserSchema.pre("save", function (next) {
  this.userKey = v5(this.get("walletAddress"), v4()).replace(/-/g, "");
  next();
});

module.exports = UserSchema;
// module.exports = mongoose.model("User", UserSchema);
