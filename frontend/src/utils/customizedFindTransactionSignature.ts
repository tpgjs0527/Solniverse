import { FindTransactionSignatureError } from "@solana/pay";
import {
  ConfirmedSignatureInfo,
  Connection,
  Finality,
  PublicKey,
  SignaturesForAddressOptions,
} from "@solana/web3.js";

export async function customizedFindTransactionSignature(
  connection: Connection,
  reference: PublicKey,
  options?: SignaturesForAddressOptions,
  finality?: Finality
): Promise<ConfirmedSignatureInfo> {
  const signatures = await connection.getSignaturesForAddress(
    reference,
    options,
    finality
  );
  console.log(signatures);
  const length = signatures.length;
  if (!length) throw new FindTransactionSignatureError("not found");

  if (length < (options?.limit || 1000)) return signatures[0];

  try {
    return await customizedFindTransactionSignature(
      connection,
      reference,
      options,
      finality
    );
  } catch (error: any) {
    if (error instanceof FindTransactionSignatureError) return signatures[0];
    throw error;
  }
}
