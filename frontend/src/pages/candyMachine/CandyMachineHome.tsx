import { useEffect, useState } from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { GatewayProvider } from "@civic/solana-gateway-react";
import Countdown from "react-countdown";
import { Snackbar, Paper, LinearProgress, Chip } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  toDate,
  AlertState,
  getAtaForMint,
} from "../../utils/candy-machine-utils";
import { MintButton } from "./MintButton";
import { MultiMintButton } from "./MultiMintButton";
import {
  awaitTransactionSignatureConfirmation,
  mintOneToken,
  mintMultipleToken,
  CANDY_MACHINE_PROGRAM,
} from "../../utils/candy-machine";
import { getProvider } from "utils/getProvider";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import Swal from "sweetalert2";

export interface ICandyMachine {
  id: anchor.web3.PublicKey;
  program: anchor.Program;
  state: CandyMachineState;
}

interface CandyMachineState {
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  treasury: anchor.web3.PublicKey;
  tokenMint: anchor.web3.PublicKey;
  isSoldOut: boolean;
  isActive: boolean;
  goLiveDate: anchor.BN;
  price: anchor.BN;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: anchor.web3.PublicKey;
  };
  endSettings: null | {
    number: anchor.BN;
    endSettingType: any;
  };
  whitelistMintSettings: null | {
    mode: any;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | anchor.BN;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
}

const cluster = process.env.REACT_APP_SOLANA_NETWORK!.toString();
const decimals = process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS
  ? +process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS!.toString()
  : 9;
const splTokenName = process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME
  ? process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME.toString()
  : "TOKEN";

const CandyMachineHome = () => {
  const [balance, setBalance] = useState<number>();
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [isActive, setIsActive] = useState(false); // true when countdown completes or whitelisted
  const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>("");
  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [payWithSplToken, setPayWithSplToken] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceLabel, setPriceLabel] = useState<string>("SOL");
  const [whitelistPrice, setWhitelistPrice] = useState(0);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [isBurnToken, setIsBurnToken] = useState(false);
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [endDate, setEndDate] = useState<Date>();
  const [isPresale, setIsPresale] = useState(false);
  const [isWLOnly, setIsWLOnly] = useState(false);
  const [percent, setPercent] = useState(0);
  const userInfo = useRecoilValue(userInfoAtom);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const wallet = useAnchorWallet();
  const provider = getProvider();
  const walletAddress = new PublicKey(userInfo.walletAddress);

  const [candyMachine, setCandyMachine] = useState<any>();

  //@TODO candyMachineId를 바꿔야함. useEffect [] 첫 마운트 기준으로 state로 받아와야됨.
  const candyMachineId = new PublicKey(
    `${process.env.REACT_APP_CANDY_MACHINE_ID}`
  );
  const rpcUrl = clusterApiUrl("devnet");
  const connection = new anchor.web3.Connection(rpcUrl, "confirmed");
  const txTimeout = 30000;

  const solFeesEstimation = 0.012; // approx of account creation fees
  const opts: any = {
    preflightCommitment: "processed",
  };
  const candyMachineProgram = new anchor.web3.PublicKey(
    "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
  );
  const getRPCProvider = () => {
    // const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
    // const connection = new Connection(rpcHost!);
    const provider = new anchor.Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };
  const getCandy = async () => {
    const provider = getRPCProvider();
    const idl = await anchor.Program.fetchIdl(candyMachineProgram, provider);
    const program = new anchor.Program(idl, candyMachineProgram, provider);
    const candyMachine: any = await program.account.candyMachine.fetch(
      candyMachineId
    );

    const itemsAvailable = candyMachine.data.itemsAvailable.toNumber();
    const itemsRedeemed = candyMachine.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;
    // const goLiveDate = candyMachine.data.goLiveDate.toNumber();
    const presale =
      candyMachine.data.whitelistMintSettings &&
      candyMachine.data.whitelistMintSettings.presale &&
      (!candyMachine.data.goLiveDate ||
        candyMachine.data.goLiveDate.toNumber() > new Date().getTime() / 1000);
    // const goLiveDateTimeString = `${new Date(goLiveDate * 1000).toGMTString()}`;
    return {
      id: candyMachineId,
      program,
      state: {
        itemsAvailable,
        itemsRedeemed,
        itemsRemaining,
        goLiveDate: candyMachine.data.goLiveDate,
        // goLiveDateTimeString,
        isSoldOut: itemsRemaining === 0,
        isActive:
          (presale ||
            candyMachine.data.goLiveDate.toNumber() <
              new Date().getTime() / 1000) &&
          (candyMachine.endSettings
            ? candyMachine.endSettings.endSettingType.date
              ? candyMachine.endSettings.number.toNumber() >
                new Date().getTime() / 1000
              : itemsRedeemed < candyMachine.endSettings.number.toNumber()
            : true),
        // isPresale: presale,
        treasury: candyMachine.wallet,
        tokenMint: candyMachine.tokenMint,
        gatekeeper: candyMachine.data.gatekeeper,
        endSettings: candyMachine.data.endSettings,
        whitelistMintSettings: candyMachine.data.whitelistMintSettings,
        hiddenSettings: candyMachine.data.hiddenSettings,
        price: candyMachine.data.price,
      },
    };
  };
  const refreshCandyMachineState = () => {
    (async () => {
      if (!provider) return;
      const cndy = await getCandy();
      // const cndy = await getCandyMachineState(
      //   wallet as anchor.Wallet,
      //   candyMachineId,
      //   connection
      // );

      setCandyMachine(cndy);
      setItemsAvailable(cndy.state.itemsAvailable);
      setItemsRemaining(cndy.state.itemsRemaining);
      setItemsRedeemed(cndy.state.itemsRedeemed);

      var divider = 1;
      if (decimals) {
        divider = +("1" + new Array(decimals).join("0").slice() + "0");
      }

      // detect if using spl-token to mint
      if (cndy.state.tokenMint) {
        setPayWithSplToken(true);
        // Customize your SPL-TOKEN Label HERE
        // TODO: get spl-token metadata name
        setPriceLabel(splTokenName);
        setPrice(cndy.state.price.toNumber() / divider);
        setWhitelistPrice(cndy.state.price.toNumber() / divider);
      } else {
        setPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
        setWhitelistPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
      }

      // fetch whitelist token balance
      if (cndy.state.whitelistMintSettings) {
        setWhitelistEnabled(true);
        setIsBurnToken(cndy.state.whitelistMintSettings.mode.burnEveryTime);
        setIsPresale(cndy.state.whitelistMintSettings.presale);
        setIsWLOnly(
          !isPresale && cndy.state.whitelistMintSettings.discountPrice === null
        );

        if (
          cndy.state.whitelistMintSettings.discountPrice !== null &&
          cndy.state.whitelistMintSettings.discountPrice !== cndy.state.price
        ) {
          if (cndy.state.tokenMint) {
            setWhitelistPrice(
              cndy.state.whitelistMintSettings.discountPrice?.toNumber() /
                divider
            );
          } else {
            setWhitelistPrice(
              cndy.state.whitelistMintSettings.discountPrice?.toNumber() /
                LAMPORTS_PER_SOL
            );
          }
        }

        let balance = 0;
        try {
          const tokenBalance = await connection.getTokenAccountBalance(
            (
              await getAtaForMint(
                cndy.state.whitelistMintSettings.mint,
                walletAddress
              )
            )[0]
          );

          balance = tokenBalance?.value?.uiAmount || 0;
        } catch (e) {
          console.error(e);
          balance = 0;
        }
        setWhitelistTokenBalance(balance);
        setIsActive(isPresale && !isEnded && balance > 0);
      } else {
        setWhitelistEnabled(false);
      }

      // end the mint when date is reached
      if (cndy?.state.endSettings?.endSettingType.date) {
        setEndDate(toDate(cndy.state.endSettings.number));
        if (
          cndy.state.endSettings.number.toNumber() <
          new Date().getTime() / 1000
        ) {
          setIsEnded(true);
          setIsActive(false);
        }
      }
      // end the mint when amount is reached
      if (cndy?.state.endSettings?.endSettingType.amount) {
        let limit = Math.min(
          cndy.state.endSettings.number.toNumber(),
          cndy.state.itemsAvailable
        );
        setItemsAvailable(limit);
        if (cndy.state.itemsRedeemed < limit) {
          setItemsRemaining(limit - cndy.state.itemsRedeemed);
        } else {
          setItemsRemaining(0);
          cndy.state.isSoldOut = true;
          setIsEnded(true);
        }
      } else {
        setItemsRemaining(cndy.state.itemsRemaining);
      }

      if (cndy.state.isSoldOut) {
        setIsActive(false);
      }
    })();
  };

  const renderGoLiveDateCounter = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div>
        <Card elevation={1}>
          <h1>{days}</h1>Days
        </Card>
        <Card elevation={1}>
          <h1>{hours}</h1>
          Hours
        </Card>
        <Card elevation={1}>
          <h1>{minutes}</h1>Mins
        </Card>
        <Card elevation={1}>
          <h1>{seconds}</h1>Secs
        </Card>
      </div>
    );
  };

  const renderEndDateCounter = ({ days, hours, minutes }: any) => {
    let label = "";
    if (days > 0) {
      label += days + " days ";
    }
    if (hours > 0) {
      label += hours + " hours ";
    }
    label += minutes + 1 + " minutes left to MINT.";
    return (
      <div>
        <h3>{label}</h3>
      </div>
    );
  };

  function displaySuccess(mintPublicKey: any, qty: number = 1): void {
    let remaining = itemsRemaining - qty;
    setItemsRemaining(remaining);
    setIsSoldOut(remaining === 0);
    if (isBurnToken && whitelistTokenBalance && whitelistTokenBalance > 0) {
      let balance = whitelistTokenBalance - qty;
      setWhitelistTokenBalance(balance);
      setIsActive(isPresale && !isEnded && balance > 0);
    }
    setItemsRedeemed(itemsRedeemed + qty);
    if (!payWithSplToken && balance && balance > 0) {
      setBalance(
        balance -
          (whitelistEnabled ? whitelistPrice : price) * qty -
          solFeesEstimation
      );
    }
    setSolanaExplorerLink(
      cluster === "devnet" || cluster === "testnet"
        ? "https://solscan.io/token/" + mintPublicKey + "?cluster=" + cluster
        : "https://solscan.io/token/" + mintPublicKey
    );
    throwConfetti();
  }

  function throwConfetti(): void {
    confetti({
      particleCount: 1000,
      spread: 100,
      origin: { y: 0.6, x: 0.57 },
    });
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function mintMany(quantityString: number) {
    if (provider && candyMachine?.program && walletAddress) {
      const quantity = Number(quantityString);
      const futureBalance =
        (balance || 0) -
        (whitelistEnabled && whitelistTokenBalance > 0
          ? whitelistPrice
          : price) *
          quantity;
      const signedTransactions: any = await mintMultipleToken(
        candyMachine,
        walletAddress,
        quantity
      );

      const promiseArray = [];

      for (let index = 0; index < signedTransactions.length; index++) {
        const tx = signedTransactions[index];
        promiseArray.push(
          awaitTransactionSignatureConfirmation(
            tx,
            txTimeout,
            connection,
            "singleGossip",
            true
          )
        );
      }

      const allTransactionsResult = await Promise.all(promiseArray);
      let totalSuccess = 0;
      let totalFailure = 0;

      for (let index = 0; index < allTransactionsResult.length; index++) {
        const transactionStatus = allTransactionsResult[index];
        if (!transactionStatus?.err) {
          totalSuccess += 1;
        } else {
          totalFailure += 1;
        }
      }

      let retry = 0;
      if (allTransactionsResult.length > 0) {
        let newBalance =
          (await connection.getBalance(walletAddress)) / LAMPORTS_PER_SOL;

        while (newBalance > futureBalance && retry < 20) {
          await sleep(2000);
          newBalance =
            (await connection.getBalance(walletAddress)) / LAMPORTS_PER_SOL;
          retry++;
        }
      }

      if (totalSuccess && retry < 20) {
        setAlertState({
          open: true,
          message: `Congratulations! Your ${quantity} mints succeeded!`,
          severity: "success",
        });

        // update front-end amounts
        displaySuccess(walletAddress, quantity);
        Swal.fire(
          "민팅 성공",
          "NFT 랜덤 뽑기에 성공했습니다. 팬텀 월렛 컬렉터블에서 나만의 NFT를 확인해보세요!",
          "success"
        );
      }

      if (totalFailure || retry === 20) {
        setAlertState({
          open: true,
          message: `Some mints failed! (possibly ${totalFailure}) Wait a few minutes and check your wallet.`,
          severity: "error",
        });
      }

      if (totalFailure === 0 && totalSuccess === 0) {
        setAlertState({
          open: true,
          message: `Mints manually cancelled.`,
          severity: "error",
        });
      }
    }
  }

  async function mintOne() {
    if (provider && candyMachine?.program && walletAddress) {
      const mint = anchor.web3.Keypair.generate();
      await provider.connect();

      const mintTxId = (
        await mintOneToken(candyMachine, walletAddress, mint)
      )[0];
      // const mintTxId =
      //   "2iu7QABig45Cqf8hGJZ1ntyaSrCikemQTj396T7xq8dGwzCdkMrdVgjC8ize85fyfW2aAgvajirjPhaSxJgf2E7w";

      let status: any = { err: true };
      if (mintTxId) {
        status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          txTimeout,
          connection,
          "singleGossip",
          true
        );
      }

      if (!status?.err) {
        setAlertState({
          open: true,
          message: "뽑기에 성공하셨어요!",
          severity: "success",
        });

        // update front-end amounts
        displaySuccess(mint.publicKey);
      } else {
        setAlertState({
          open: true,
          message: "뽑기에 실패했어요! 다시 시도해주세요.",
          severity: "error",
        });
      }
    }
  }

  const startMint = async (quantityString: number) => {
    try {
      setIsMinting(true);
      if (quantityString === 1) {
        await mintOne();
      } else {
        await mintMany(quantityString);
      }
    } catch (error: any) {
      let message = error.msg || "뽑기에 실패했습니다.";
      if (!error.msg) {
        if (!error.message) {
          message = "트랜잭션 요청시간이 만료됐습니다.";
        } else if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `뽑기가 종료됐습니다.`;
        } else if (error.message.indexOf("0x135")) {
          message = `잔액이 부족합니다.`;
        }
      } else {
        if (error.code === 311) {
          message = `뽑기가 종료됐습니다!`;
        } else if (error.code === 312) {
          message = `뽑기가 진행중이 아닙니다.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(refreshCandyMachineState, [provider, isEnded, isPresale]);
  useEffect(() => {}, [provider, candyMachine]);

  return (
    <Container>
      <PageTitle>NFT 랜덤 뽑기</PageTitle>
      <Wrapper>
        <MainContainer>
          <ImageWrapper>
            <ImageTitle>이번 랜덤 뽑기 NFT</ImageTitle>
            <Image
              src={`${process.env.PUBLIC_URL}/images/NFT리스트.gif`}
              alt="NFT To Mint"
            />
          </ImageWrapper>
        </MainContainer>
        <SpinContainer>
          {!isActive &&
          !isEnded &&
          candyMachine?.state.goLiveDate &&
          (!isWLOnly || whitelistTokenBalance > 0) ? (
            <Countdown
              date={toDate(candyMachine?.state.goLiveDate)}
              onMount={({ completed }) => completed && setIsActive(!isEnded)}
              onComplete={() => {
                setIsActive(!isEnded);
              }}
              renderer={renderGoLiveDateCounter}
            />
          ) : !provider ? (
            <ConnectButton>Connect Wallet</ConnectButton>
          ) : !isWLOnly || whitelistTokenBalance > 0 ? (
            candyMachine?.state.gatekeeper &&
            walletAddress &&
            provider.signTransaction ? (
              <GatewayProvider
                wallet={{
                  publicKey:
                    walletAddress || new PublicKey(CANDY_MACHINE_PROGRAM),
                  //@ts-ignore
                  signTransaction: provider.signTransaction,
                }}
                // // Replace with following when added
                // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                gatekeeperNetwork={
                  candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                } // This is the ignite (captcha) network
                /// Don't need this for mainnet
                clusterUrl={rpcUrl}
                options={{ autoShowModal: false }}
              >
                <MintButton
                  candyMachine={candyMachine}
                  isMinting={isMinting}
                  isActive={isActive}
                  isEnded={isEnded}
                  isSoldOut={isSoldOut}
                  onMint={startMint}
                />
              </GatewayProvider>
            ) : (
              /*<MintButton
                                                candyMachine={candyMachine}
                                                isMinting={isMinting}
                                                isActive={isActive}
                                                isEnded={isEnded}
                                                isSoldOut={isSoldOut}
                                                onMint={startMint}
                                            />*/
              <MultiMintButton
                candyMachine={candyMachine}
                isMinting={isMinting}
                isActive={isActive}
                isEnded={isEnded}
                isSoldOut={isSoldOut}
                onMint={startMint}
                price={
                  whitelistEnabled && whitelistTokenBalance > 0
                    ? whitelistPrice
                    : price
                }
              />
            )
          ) : (
            <h1>Mint is private.</h1>
          )}
        </SpinContainer>
        <MainContainer>
          <MintContainer>
            <DesContainer>
              <NFT elevation={0}>
                <br />
                {provider &&
                  isActive &&
                  endDate &&
                  Date.now() < endDate.getTime() && (
                    <Countdown
                      date={toDate(candyMachine?.state?.endSettings?.number)}
                      onMount={({ completed }) => completed && setIsEnded(true)}
                      onComplete={() => {
                        setIsEnded(true);
                      }}
                      renderer={renderEndDateCounter}
                    />
                  )}
                {provider && isActive && (
                  <TitleWrapper>
                    <Title>뽑기 진행현황 :</Title>
                    <Title>
                      {itemsRedeemed} / {itemsAvailable}
                    </Title>
                  </TitleWrapper>
                )}
                {provider && isActive && (
                  <BorderLinearProgress
                    color="primary"
                    variant="determinate"
                    value={100 - (itemsRemaining * 100) / itemsAvailable}
                  />
                )}
                <br />
                <TitleWrapper>
                  <Title>뽑기 한 번 : 500 SNV</Title>
                </TitleWrapper>
                {provider && isActive && solanaExplorerLink && (
                  <SolExplorerLink href={solanaExplorerLink} target="_blank">
                    View on Solscan
                  </SolExplorerLink>
                )}
              </NFT>
            </DesContainer>
          </MintContainer>
        </MainContainer>
        <Snackbar
          open={alertState.open}
          autoHideDuration={6000}
          onClose={() => setAlertState({ ...alertState, open: false })}
        >
          <Alert
            onClose={() => setAlertState({ ...alertState, open: false })}
            severity={alertState.severity}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 1px 1px;
  border-radius: 16px;
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22) !important;
`;
const PageTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 32px;
  margin-bottom: 16px;
`;

const Wrapper = styled.div`
  padding-left: 64px;
  padding-right: 64px;
  padding-bottom: 64px;
  display: flex;
  justify-content: center;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 16px;
  margin-left: 16px;
  text-align: center;
  justify-content: center;
  width: 40%;
  height: 250px;
`;

const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 16px;
  margin-left: 16px;
  text-align: center;
  align-items: center;
  width: 250px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.bgColor};
`;
const SpinBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  cursor: pointer;
  /* background-color: ${(props) => props.theme.bgColor}; */
  border: none;
  border-radius: 50%;
  background-color: ${(props) => props.theme.ownColor};
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22) !important;
  &:hover {
    background: linear-gradient(45deg, #870ff8 0%, #0f3af8 60%, #0ff8ec 100%);
  }
`;
const SpinTitle = styled.div``;
const SvgWrapper = styled.svg`
  width: 50px;
  height: 50px;
`;
const MintBtnWrapper = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  z-index: 0;
  background-color: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
`;

const MintContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 20px;
`;

const DesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 20px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.boxColor} !important;
`;
const TitleWrapper = styled.div``;
const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 8px;
`;

const Card = styled(Paper)`
  display: inline-block;
  background-color: ${(props) => props.theme.bgColor} !important;
  margin: 5px;
  min-width: 40px;
  padding: 24px;
  h1 {
    margin: 0px;
  }
`;

const Price = styled(Chip)`
  position: absolute;
  margin: 16px;
  font-weight: bold;
  font-size: 1.2em !important;
  /* font-family: "Patrick Hand", cursive !important; */
`;

const ImageWrapper = styled.div``;
const ImageTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Image = styled.img`
  height: auto;
  width: 100%;
  border-radius: 7px;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.5);
`;

const ConnectButton = styled(WalletMultiButton)`
  border-radius: 18px !important;
  padding: 6px 16px;
  background-color: #4e44ce;
  margin: 0 auto;
`;

const NFT = styled(Paper)`
  /* min-width: 500px;
  min-height: 500px; */
  border-radius: 16px !important;
  color: ${(props) => props.theme.textColor} !important;
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding: 5px 20px 20px 20px;
  flex: 1 1 auto;
  background-color: ${(props) => props.theme.boxColor} !important;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22) !important;
`;

const SolExplorerLink = styled.a`
  color: var(--title-text-color);
  border-bottom: 1px solid var(--title-text-color);
  font-weight: bold;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  outline: none;
  text-decoration: none;
  text-size-adjust: 100%;

  :hover {
    border-bottom: 2px solid var(--title-text-color);
  }
`;

const BorderLinearProgress = styled(LinearProgress)`
  margin: 20px;
  height: 10px !important;
  border-radius: 30px;
  border: 2px solid white;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.5);
  /* background-color: ; */
  .MuiLinearProgress-barColorPrimary {
    background-image: linear-gradient(
      45deg,
      #870ff8,
      #0f3af8,
      #0ff8ec
    ) !important;
  }
`;

export default CandyMachineHome;
