import { PublicKey, Transaction } from "@solana/web3.js";
import { useCallback } from "react";

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

export function useProvider() {
  const getProvider = useCallback((): PhantomProvider | undefined => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          const provider = solana;
          return provider;
        }
      } else {
        return;
      }
    } catch {
      return;
    }

    return;
  }, []);
  return getProvider();
}
