import { PublicKey, Transaction } from "@solana/web3.js";
import { isMobile } from "react-device-detect";
import { checkMobile } from "./checkMobile";
import Swal from "sweetalert2";

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
export interface PhantomProvider {
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

  if (UA === "android" || UA === "ios") {
    return;
  } else {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          const provider = solana;
          return provider;
        }
      } else {
        Swal.fire(
          "Solana 네트워크 이슈",
          "Solana 네트워크가 있나요?",
          "question"
        );
      }
    } catch {}
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
