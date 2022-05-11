import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { isMobile } from "react-device-detect";
import { checkMobile } from "./checkMobile";

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";

type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signMessage";
interface ConnectOpts {
  onlyIfTrusted: boolean;
}
interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;

  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export const getProvider = (): PhantomProvider | undefined => {
  const UA = checkMobile();
  if (isMobile) {
    // window.location.href = "solana:";
    // window.location.href = "https://phantom.app/ul/v1/connect";
  } else {
    if ("solana" in window) {
      const anyWindow: any = window;
      const provider = anyWindow.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  }
  // const confirmation = window.confirm("Phantom wallet 앱을 설치하시겠습니까?");
  // if (isMobile && confirmation) {
  //   if (UA === "ios") {
  //     window.location.href =
  //       "https://apps.apple.com/kr/app/phantom-solana-wallet/id1598432977";
  //   } else if (UA === "android") {
  //     window.location.href =
  //       "https://play.google.com/store/apps/details?id=app.phantom";
  //   }
  // } else if (!isMobile) {
  //   window.open("https://phantom.app/", "_blank");
  // }
};
