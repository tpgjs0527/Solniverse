import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
  u64,
} from "@solana/spl-token";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import BN from "bn.js";

export enum CreateTransactionError {
  PAYER_NOT_FOUND = "PAYER_NOT_FOUND",
  RECIPIENT_NOT_FOUND = "RECIPIENT_NOT_FOUND",
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
  TOKEN_INVALID_PROGRAM = "TOKEN_INVALID_PROGRAM",
  TOKEN_INVALID_LENGTH = "TOKEN_INVALID_LENGTH",
  TOKEN_MINT_NOT_INITIALIZED = "TOKEN_MINT_NOT_INITIALIZED",
  AMOUNT_INVALID_DECIMALS = "AMOUNT_INVALID_DECIMALS",
  PAYER_ATA_NOT_FOUND = "PAYER_ATA_NOT_FOUND",
  RECIPIENT_ATA_NOT_FOUND = "RECIPIENT_ATA_NOT_FOUND",
  PAYER_INSUFFICIENT_FUNDS = "PAYER_INSUFFICIENT_FUNDS",
  PAYER_ATA_INSUFFICIENT_FUNDS = "PAYER_ATA_INSUFFICIENT_FUNDS",
}

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

const SOL_DECIMALS = 9;
const TEN = new BigNumber(10);

export async function createTransaction(
  connection: Connection,
  payer: PublicKey,
  recipient: PublicKey,
  amount: BigNumber,
  {
    token,
    reference,
    memo,
  }: {
    token?: PublicKey;
    reference?: PublicKey | PublicKey[];
    memo?: string;
  }
): Promise<Transaction> {
  const payerInfo = await connection.getAccountInfo(payer);
  if (!payerInfo) throw new Error(CreateTransactionError.PAYER_NOT_FOUND);

  let instruction: TransactionInstruction;

  const transaction = new Transaction();
  // 토큰이 인자로 없을 때
  if (!token) {
    // 충분한 금액이 있는지 검사
    if (amount.decimalPlaces() > SOL_DECIMALS)
      throw new Error(CreateTransactionError.AMOUNT_INVALID_DECIMALS);

    // Convert input decimal amount to integer lamports
    amount = amount.times(LAMPORTS_PER_SOL).integerValue(BigNumber.ROUND_FLOOR);

    // Check that the payer has enough lamports
    const lamports = amount.toNumber();
    if (lamports > payerInfo.lamports)
      throw new Error(CreateTransactionError.PAYER_INSUFFICIENT_FUNDS);

    // Create an instruction to transfer native SOL
    instruction = SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipient,
      lamports,
    });
  } else {
    // 토큰 이 주어졌을 때
    const tokenInfo = await connection.getAccountInfo(token);
    if (!tokenInfo) throw new Error(CreateTransactionError.TOKEN_NOT_FOUND);
    if (!tokenInfo.owner.equals(TOKEN_PROGRAM_ID))
      throw new Error(CreateTransactionError.TOKEN_INVALID_PROGRAM);
    if (tokenInfo.data.length !== MintLayout.span)
      throw new Error(CreateTransactionError.TOKEN_INVALID_LENGTH);

    const mint = MintLayout.decode(tokenInfo.data);
    if (!mint.isInitialized)
      throw new Error(CreateTransactionError.TOKEN_MINT_NOT_INITIALIZED);

    // decimal 단위
    const decimals: number = mint.decimals;
    if (amount.decimalPlaces() > decimals)
      throw new Error(CreateTransactionError.AMOUNT_INVALID_DECIMALS);

    // amount 변환
    amount = amount
      .times(TEN.pow(decimals))
      .integerValue(BigNumber.ROUND_FLOOR);

    // payer의 ATA를 가져옴
    const payerATA = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      token,
      payer
    );

    // Payer의 tokenBalance를 가져옴
    const tokenBalance = await connection.getTokenAccountBalance(payerATA);
    if (!tokenBalance)
      throw new Error(CreateTransactionError.PAYER_ATA_NOT_FOUND);

    // balance를 가져옴
    const balance = new BN(tokenBalance.value.amount);
    const tokens = new u64(String(amount));
    if (tokens.gt(balance))
      throw new Error(CreateTransactionError.PAYER_ATA_INSUFFICIENT_FUNDS);

    // Get the recipient's ATA and check that it exists
    const recipientATA = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      token,
      recipient
    );

    // 만약에 recipientATAInfo가 가져와지지 않는다면 새로운 토큰 어드레스를 생성해줌
    const recipientATAInfo = await connection.getAccountInfo(recipientATA);
    if (!recipientATAInfo) {
      transaction.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          token,
          recipientATA,
          recipient,
          payer
        )
      );
    }

    // Create an instruction to transfer SPL tokens, asserting the mint and decimals match
    instruction = Token.createTransferCheckedInstruction(
      TOKEN_PROGRAM_ID,
      payerATA,
      token,
      recipientATA,
      payer,
      [],
      tokens,
      decimals
    );
  }
  if (reference) {
    if (!Array.isArray(reference)) {
      reference = [reference];
    }

    // If reference accounts are provided, add them to the instruction
    if (reference?.length) {
      instruction.keys.push(
        ...reference.map((pubkey) => ({
          pubkey,
          isWritable: false,
          isSigner: false,
        }))
      );
    }
  }

  // Add instructions to the transaction
  transaction.add(instruction);

  // If a memo is provided, add it to the transaction
  if (memo != null) {
    transaction.add(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(memo, "utf8"),
      })
    );
  }

  return transaction;
}
