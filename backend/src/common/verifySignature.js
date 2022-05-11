const nacl = require("tweetnacl");
const base58 = require("bs58");

const UserRepository = require("../auth/user.repository");
const userRepository = new UserRepository();

const message =
  "Sign this message for authenticating with your wallet. Nonce: ";

/**
 *
 * @param {string} signature
 * @param {string} walletAddress
 * @returns {Promice<Object>|Promice<void>} user or void
 */
async function verifyAddressBySignature(signature, walletAddress) {
  try {
    const user = await userRepository.getUserByWalletAddress(walletAddress);
    if (!user) {
      return;
    }
    const messageBytes = new TextEncoder().encode(message + user.nonce);
    const publicKeyBytes = base58.decode(walletAddress);
    const signatureBytes = base58.decode(signature);

    if (nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes))
      return user;
  } catch (err) {
    return;
  }
}

module.exports = { message, verifyAddressBySignature };
