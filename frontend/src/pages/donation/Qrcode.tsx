import { useEffect, useState, useMemo, useCallback } from "react";
import Modal from "react-modal";
// import { Modal } from "react-responsive-modal";
import { createQR, createTransaction, encodeURL, parseURL } from "@solana/pay";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import QRCodeStyling from "qr-code-styling";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import { useNavigate } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProvider } from "utils/getProvider";
import { checkMobile } from "utils/checkMobile";
// import * as splToken from "@solana/spl-token";

interface IPayment {
  open: any;
  onClose: Function;
  params: {
    amount: string | null;
    nickName: string | null;
    message: string | null;
    walletAddress: string | null;
    type: string | null;
  };
  txid: string;
}

function Qrcode({ open, onClose, params, txid }: IPayment) {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoAtom);
  const connections = new Connection(clusterApiUrl("devnet"), "confirmed");

  const [modalIsOpen, setModalIsOpen] = useState(open);
  const [makeQR, setMakeQR] = useState({});
  const [signature, setSignature] = useState("");
  const [connectWallet, setConnectWallet] = useState(false);
  const [txURL, setTXURL] = useState<any>();

  // const wallets = [new PhantomWalletAdapter()];
  const desktopStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "700px",
      height: "600px",
      backgroundColor: "#eeeeee",
    },
  };

  const main = async () => {
    if (txid) {
      // 이 부분은 이제 결제 진행할 때 스트리머의 지갑 주소가 들어가야 한다.
      console.log(params.type);
      if (params.type === "SOL") {
        const recipient = new PublicKey(`${params.walletAddress}`);
        const label = `${
          userInfo.twitch.id ? userInfo.twitch.displayName : "이름없음"
        }`;

        const message = `${params.message}`;
        const memo = `${txid}`;
        const amount = new BigNumber(Number(`${params.amount}`));
        const reference = new PublicKey(
          "C11hWWx6Zhn4Vhx1qpbnFazWQYNpuz9CFv269QC4vDba"
        );
        // const splToken = new PublicKey("")

        const url = encodeURL({
          recipient,
          amount,
          reference,
          label,
          message,
          memo,
        });
        console.log(url);
        setTXURL(url);

        const qrCode = createQR(url);
        // const qrCodeSize = Number(`${message.length >= 30 ? 250 : 230}`);
        const qrCodeSize = 230;
        const QrCode = new QRCodeStyling({
          width: qrCodeSize,
          height: qrCodeSize,
          type: "canvas",
          data: `${qrCode._options.data}`,
          image: `${process.env.PUBLIC_URL}/솔라나.png`,
          dotsOptions: {
            // color: "#4267b2",
            gradient: {
              type: "linear",
              rotation: 90,
              colorStops: [
                { offset: 0, color: "#00ff55" },
                { offset: 1, color: "#7808f8" },
              ],
            },
            type: "extra-rounded",
          },
          backgroundOptions: {
            color: "#e9ebee",
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 10,
          },
        });
        const element = document.getElementById("qr-code");
        QrCode.append(element!);

        setMakeQR(QrCode);
      } else if (params.type === "USDC") {
        const recipient = new PublicKey(`${params.walletAddress}`);
        const label = `${
          userInfo.twitch.id ? userInfo.twitch.displayName : "이름없음"
        }`;

        const message = `${params.message}`;
        const memo = `${txid}`;
        const amount = new BigNumber(Number(`${params.amount}`));
        const reference = new PublicKey(
          "C11hWWx6Zhn4Vhx1qpbnFazWQYNpuz9CFv269QC4vDba"
        );
        const splToken = new PublicKey(
          "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        );
        const url = encodeURL({
          recipient,
          amount,
          reference,
          label,
          message,
          memo,
          splToken,
        });
        console.log(url);
        console.log(url);
        setTXURL(url);

        const qrCode = createQR(url);
        // const qrCodeSize = Number(`${message.length >= 30 ? 250 : 230}`);
        const qrCodeSize = 230;
        const QrCode = new QRCodeStyling({
          width: qrCodeSize,
          height: qrCodeSize,
          type: "canvas",
          data: `${qrCode._options.data}`,
          image: `${process.env.PUBLIC_URL}/솔라나.png`,
          dotsOptions: {
            // color: "#4267b2",
            gradient: {
              type: "linear",
              rotation: 90,
              colorStops: [
                { offset: 0, color: "#00ff55" },
                { offset: 1, color: "#7808f8" },
              ],
            },
            type: "extra-rounded",
          },
          backgroundOptions: {
            color: "#e9ebee",
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 10,
          },
        });
        const element = document.getElementById("qr-code");
        QrCode.append(element!);

        setMakeQR(QrCode);
      }
    } else {
      alert("결제정보가 잘못 입력됐습니다. 다시 후원해주세요.");
      // navigate("/donation");
    }
  };
  const closeModal = () => {
    setModalIsOpen(false);
    onClose();
  };
  const getSignature = async () => {
    const reference = new PublicKey(`${userInfo.walletAddress}`);
    const options = {};
    const finality = "confirmed";
    const signatures = await connections.getSignaturesForAddress(
      reference,
      options,
      finality
    );
    if (signatures.length > 0) {
      setSignature(signatures[0].signature);
    } else {
    }
  };

  const onInstall = () => {
    const UA = checkMobile();
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

  useEffect(() => {
    setTimeout(() => main(), 100);
    getSignature();
  }, []);

  useEffect(() => {
    if (signature) {
      console.log(signature);
      const interval = setInterval(async () => {
        const reference = new PublicKey(`${userInfo.walletAddress}`);
        const options = { until: `${signature}`, limit: 1000 };

        const finality = "confirmed";
        const signatures = await connections.getSignaturesForAddress(
          reference,
          options,
          finality
        );
        console.log(signatures);
        for (let i = 0; i < signatures.length; i++) {
          const transaction = await connections.getTransaction(
            signatures[i].signature
          );
          console.log(transaction);
          if (transaction && params.type === "SOL") {
            for (
              let j = 0;
              j < transaction?.transaction.message.accountKeys.length;
              j++
            ) {
              // 여기 주소 값은 recipient와 같아야 한다.
              console.log(
                transaction?.transaction.message.accountKeys[j].toBase58()
              );
              if (
                transaction?.transaction.message.accountKeys[j].toBase58() ===
                `${params.walletAddress}`
              ) {
                console.log("결제 내용이 블록체인에 올라갔습니다.");
                clearInterval(interval);
                navigate("/payment/confirmed", {
                  state: { signature: signatures[i].signature },
                });
              }
            }
          } else if (transaction && params.type === "USDC") {
            for (
              let j = 0;
              j < transaction?.transaction.message.accountKeys.length;
              j++
            ) {
              // 여기 주소 값은 recipient와 같아야 한다.
              console.log(
                transaction?.transaction.message.accountKeys[j].toBase58()
              );
              if (
                transaction?.transaction.message.accountKeys[j].toBase58() ===
                `Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr`
              ) {
                console.log("결제 내용이 블록체인에 올라갔습니다.");
                clearInterval(interval);
                navigate("/payment/confirmed", {
                  state: { signature: signatures[i].signature },
                });
              }
            }
          }
        }
      }, 1000);
    }
  }, [signature]);

  // const getPhantomProvider = async () => {
  //   const re = await getWallet();

  // };
  // getPhantomProvider();
  const { connection } = useConnection();

  const sendTX = async () => {
    setConnectWallet(true);
    try {
      if (txURL) {
        if (params.type === "SOL") {
          const provider = getProvider();
          provider?.connect();
          const { recipient, amount, reference, memo } = parseURL(txURL);
          const publicKey = new PublicKey(userInfo.walletAddress);
          console.log(publicKey);

          // part 1
          const transaction = await createTransaction(
            connection,
            publicKey!,
            recipient,
            amount!,
            { reference, memo }
          );
          console.log(transaction);
          transaction.feePayer = publicKey;
          const anyTransaction: any = transaction;
          anyTransaction.recentBlockhash = (
            await connection.getRecentBlockhash()
          ).blockhash;

          let blockhashObj = await connection.getRecentBlockhash();
          transaction.recentBlockhash = await blockhashObj.blockhash;
          const response = await provider?.signTransaction(transaction);
          console.log("시그니처 싸인이 완료됐습니다.", response);
          let signature = await connection.sendRawTransaction(
            response!.serialize()
          );
          console.log("트랜잭션 전송 성공~", signature);
          const res2 = await connection.confirmTransaction(signature);
          console.log("결제 확인까지 성공했습니다.", res2);
        } else if (params.type === "USDC") {
          console.log("USDC로 결제");

          const provider = getProvider();
          provider?.connect();
          const { recipient, amount, reference, memo } = parseURL(txURL);
          const publicKey = new PublicKey(userInfo.walletAddress);

          const splToken = new PublicKey(
            "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
          );
          console.log(publicKey);

          // part 1
          const transaction = await createTransaction(
            connection,
            publicKey!,
            recipient,
            amount!,
            { reference, memo, splToken }
          );
          console.log(transaction);
          transaction.feePayer = publicKey;
          const anyTransaction: any = transaction;
          anyTransaction.recentBlockhash = (
            await connection.getRecentBlockhash()
          ).blockhash;

          let blockhashObj = await connection.getRecentBlockhash();
          transaction.recentBlockhash = await blockhashObj.blockhash;
          const response = await provider?.signTransaction(transaction);
          console.log("시그니처 싸인이 완료됐습니다.", response);
          let signature = await connection.sendRawTransaction(
            response!.serialize()
          );
          console.log("트랜잭션 전송 성공~", signature);
          const res2 = await connection.confirmTransaction(signature);
          console.log("결제 확인까지 성공했습니다.", res2);
        }

        // // 이부분에서 내부적으로 지갑이 있는지 체크하는데 연결된 지갑이 없다고 인식하는 문제 발생
        // const response = await sendTransaction(transaction, connection);
        // console.log(response);

        // await connection.confirmTransaction(signature, "processed");

        // part 2
        // let connection = new web3.Connection(web3.clusterApiUrl("devnet"));
        // let transaction = new web3.Transaction().add(
        //   web3.SystemProgram.transfer({
        //     fromPubkey: publicKey,
        //     toPubkey: recipient,
        //     lamports: web3.LAMPORTS_PER_SOL,
        //   })
        // );

        // let signed = await provider?.signTransaction(transaction);
      }
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => closeModal()}
      style={desktopStyle}
    >
      {/* <Modal open={modalIsOpen} onClose={() => closeModal()} center> */}
      <Container>
        <TitleWrapper style={{ backgroundColor: "#eeeeee", padding: "4px" }}>
          <PageName>Phantom Wallet 결제</PageName>
          <OurLogo>
            <SVGLogo />
            Solniverse
          </OurLogo>
        </TitleWrapper>
        <Wrapper>
          <ManualWrapper>
            <ManualName>Phantom wallet 결제 방법</ManualName>
            <ManualSeries>
              <ManualNumber>1️⃣</ManualNumber>
              <ManualContent>Phantom Wallet 앱 실행</ManualContent>
            </ManualSeries>
            <ManualSeries>
              <ManualNumber>2️⃣</ManualNumber>
              <ManualContent>
                측 상단 QR코드 메뉴 선택 후 오른쪽의 QR코드를 스캔하세요.
              </ManualContent>
            </ManualSeries>
            <ManualSeries>
              <ManualNumber>3️⃣</ManualNumber>
              <ManualContent>
                이후 표시된 전송 정보를 확인 후 보내기 버튼 클릭
              </ManualContent>
            </ManualSeries>
            {isMobile ? null : (
              <>
                <ManualSeries>
                  <ManualNumber>4️⃣</ManualNumber>
                  <ManualContent>
                    앱 없이 크롬 확장 프로그램으로 결제하시려면 아래 바로 결제
                    버튼을 눌러주세요.
                  </ManualContent>
                </ManualSeries>
                <ExtensionWrapper>
                  <ExtensionButton onClick={sendTX}>바로결제</ExtensionButton>
                </ExtensionWrapper>
              </>
            )}
          </ManualWrapper>
          <QRWrapper>
            <QRCodeName>QR코드</QRCodeName>
            <QRCodeWrapper>
              <QRCode id="qr-code"></QRCode>
            </QRCodeWrapper>
          </QRWrapper>
        </Wrapper>
        <Wrapper>
          {isMobile ? (
            <NoWalletGuide>
              스마트폰으로 쉽고 편리하게 결제할 수 있는 Phantom Wallet 앱을
              설치하세요!
            </NoWalletGuide>
          ) : (
            <NoWalletGuide>
              쉽고 편리하게 결제할 수 있는 Phantom Wallet 구글 확장프로그램을
              설치하세요!
            </NoWalletGuide>
          )}

          <WalletInstall>
            <WalletBtn onClick={onInstall}>설치하기</WalletBtn>
          </WalletInstall>
        </Wrapper>
        <CloseBtn onClick={closeModal}>닫기</CloseBtn>
      </Container>
    </Modal>
  );
}

const Container = styled.div``;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.boxColor};
  margin-bottom: 8px;
  border-radius: 5px;
  padding: 4px;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.boxColor};
  margin-bottom: 16px;
  border-radius: 5px;
  padding: 16px;
  @media screen and (max-width: 691px) {
    display: flex;
    justify-content: center;
  }
`;
const PageName = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
const SVGLogo = styled.img.attrs({
  src: `${process.env.PUBLIC_URL}/solanasvg.svg`,
})`
  width: 15px;
  height: 15px;
  margin-right: 2px;
`;
const OurLogo = styled.div`
  display: flex;
  align-items: center;
`;
const ManualWrapper = styled.div`
  width: 55%;
  margin-right: 8px;
  @media screen and (max-width: 691px) {
    display: none;
  }
`;
const ManualName = styled.div`
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 16px;
`;
const ManualSeries = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
`;
const ManualNumber = styled.div`
  margin-right: 8px;
`;
const ManualContent = styled.div``;
const ExtensionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const ExtensionButton = styled.button`
  background-color: ${(props) => props.theme.ownColor};
  width: 50%;
  height: 30px;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
`;
const QRWrapper = styled.div`
  width: 45%;
  /* display: flex;
  justify-content: center; */
  text-align: center;
  background-color: ${(props) => props.theme.subBoxColor};
  border-radius: 6px;
`;
const QRCodeName = styled.div`
  padding: 8px;
  font-weight: bold;
`;
const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const QRCode = styled.div`
  width: 90%;
  height: 90%;
  background-color: ${(props) => props.theme.boxColor};
  padding: 10px;
  margin-bottom: 10px;
`;

const NoWalletWrapper = styled.div``;
const NoWalletGuide = styled.div`
  width: 65%;
  font-size: 14px;
`;
const WalletInstall = styled.div`
  width: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const WalletBtn = styled.button`
  background-color: ${(props) => props.theme.ownColor};
  width: 70%;
  height: 30px;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const CloseBtn = styled.button``;

Modal.setAppElement("#root");
export default Qrcode;
