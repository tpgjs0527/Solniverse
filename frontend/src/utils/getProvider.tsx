import { PublicKey, Transaction } from "@solana/web3.js";
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
  if (isMobile) {
  } else {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          const provider = solana;
          return provider;
        }
      } else {
        alert("solana를 찾지 못하였습니다. 다시 로그인해주세요!");
      }
    } catch {}
  }
};
