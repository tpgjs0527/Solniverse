const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    display_name: { type: String, required: true },
    profileimage_url: { type: String, required: false },
    oauth: {
      access_token: { type: String, required: true },
      refresh_token: { type: String, required: true },
      type: String,
      required: false,
    },
    waller_address: { type: String, required: true },
    authority: { type: String, required: false },
    enabled: { type: Boolean, required: false },

    // createdat, updatedat
  },
  { timestamps: true }
);

const User = model("user", UserSchema);
module.exports = { User };
