import { PublicKey, Transaction } from "@solana/web3.js";
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
};
