const { symlink } = require("fs");
symlink(
  "../../server/EncryptionHandler.js",
  "./EncryptionHandler.js",
  "file",
  (err) => {
    if (err) console.log(err);
    else console.log("done");
  }
);
