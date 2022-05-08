import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { isMobile } from "react-device-detect";
import { checkMobile } from "./checkMobile";

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "connect";

type PhantomRequestMethod = "connect" | "signTransaction" | "signMessage";
interface ConnectOpts {
  onlyIfTrusted: boolean;
}
interface PhantomProvider {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export const getProvider = (): PhantomProvider | undefined => {
  const UA = checkMobile();
  if (isMobile) {
    window.location.href = "solana:";
    return;
  } else {
    if ("solana" in window) {
      const anyWindow: any = window;
      const provider = anyWindow.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  }

  if (isMobile) {
    if (UA === "ios") {
      window.location.href =
        "https://apps.apple.com/kr/app/phantom-solana-wallet/id1598432977";
    } else if (UA === "android") {
      window.location.href =
        "https://play.google.com/store/apps/details?id=app.phantom";
    }
  } else {
    window.open("https://phantom.app/", "_blank");
  }
};
