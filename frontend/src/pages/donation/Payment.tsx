import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Qrcode from "./Qrcode";
import { isBrowser, isMobile } from "react-device-detect";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { encodeURL } from "@solana/pay";
import { useRecoilState, useRecoilValue } from "recoil";
import { accessTokenAtom, userInfoAtom } from "atoms";
import useMutation from "hooks/useMutation";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletConnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export interface ITX {
  result: string;
  shopAddress: string;
  txid: string;
}

function Payment() {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [signature, setSignature] = useState("");
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const amount = searchParams.get("amount");
  const nickName = searchParams.get("nickName");
  const message = searchParams.get("message");
  const walletAddress = searchParams.get("walletAddress");
  const params = { amount, nickName, message, walletAddress };
  const wallets = [new PhantomWalletAdapter()];
  const [connectWallet, setConnectWallet] = useState(true);
  const endPoint = clusterApiUrl("devnet");
  console.log(wallets);
  const [txid, setTXID] = useState("");

  const [getTXId, { data, loading }] = useMutation<any>(
    `${process.env.REACT_APP_BASE_URL}/donation/send`
  );

  const closeModal = () => {
    setOpenModal(false);
  };
  const onClick = async () => {
    // pay버튼 누를 때 백으로  displayName, message, platform
    // soniverse.net/displayname/platform
    // soniverse.net/walletAddress
    // http://localhost:3000/api/donation/send
    // alert("팬텀 월렛을 이용한 Solana Pay 진행할게용");
    if (isMobile && txid) {
      // 스트리머 주소 받아오기
      const recipient = new PublicKey(`${walletAddress}`);
      const label = `${
        userInfo.twitch.id ? userInfo.twitch.displayName : "이름없음"
      }`;

      const message = `${params.message}`;
      // 이 자리에는 txid값이 담겨야 한다. 100kb
      const memo = `${txid}`;
      // 해당 안의 숫자도 사용자가 보내는 값으로 입력해서 보내기
      const amount = new BigNumber(Number(`${params.amount}`));
      // 이 안의 값은 우리가 실제로 운영하는 서비스 지갑 주소가 들어간다.(추적용)
      // bum reference
      // const reference = new PublicKey(
      //   "FTvDSffKvWaL8hdhATY1sxgZKVg6LZwxtDS86JHuL6Fd"
      // );
      // official DDD reference
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
      window.location.href = url;
    } else {
      setOpenModal(true);
    }
  };

  // const getSignature = async () => {
  //   const reference = new PublicKey(`${userInfo.walletAddress}`);
  //   const options = { limit: 1000 };
  //   const finality = "confirmed";
  //   const signatures = await connection.getSignaturesForAddress(
  //     reference,
  //     options,
  //     finality
  //   );
  //   console.log(signatures[0].signature);
  //   console.log(signatures[0]);
  //   setSignature(signatures[0].signature);
  // };
  useEffect(() => {
    if (!data) {
      getTXId({
        displayName: nickName,
        message: message,
        platform: "",
      });
      console.log("첫 번째 랜더링입니다.");
    }
  }, []);

  useEffect(() => {
    // getSignature();
    if (data) {
      setTXID(data.txid);
      console.log("두 번째 랜더링입니다.");
    }
    console.log("랜더링 가즈아");
  }, [data]);
  console.log(txid);

  // 모바일 진행할 떄 앱에서 빠져나온 후 결제 확인 알림 받는 방법 강구하기.

  // useEffect(() => {
  //   if (signature && isMobile) {
  //     setTimeout(() => {
  //       const interval = setInterval(async () => {
  //         const reference = new PublicKey(`${userInfo.walletAddress}`);
  //         const options = { until: `${signature}`, limit: 1000 };
  //         console.log(options);
  //         const finality = "confirmed";
  //         const signatures = await connection.getSignaturesForAddress(
  //           reference,
  //           options,
  //           finality
  //         );
  //         console.log(signatures);
  //         for (let i = 0; i < signatures.length; i++) {
  //           const transaction = await connection.getTransaction(
  //             signatures[i].signature
  //           );
  //           if (transaction) {
  //             for (
  //               let j = 0;
  //               j < transaction?.transaction.message.accountKeys.length;
  //               j++
  //             ) {
  //               // 여기 주소 값은 recipient와 같아야 한다.
  //               if (
  //                 transaction?.transaction.message.accountKeys[j].toBase58() ===
  //                 "FLouH8f4bCA2qowUcugFog4YNaRsGPjyV8q7UvvpNcYY"
  //               ) {
  //                 console.log("이 트랜잭션이 현재 진행된 결제입니다.");
  //                 console.log(signatures[i].signature);
  //                 clearInterval(interval);
  //                 navigate("/payment/confirmed", {
  //                   state: { signature: signatures[i].signature },
  //                 });
  //               }
  //             }
  //           }
  //         }
  //       }, 5000);
  //     }, 1000);
  //   }
  // }, [signature]);

  return (
    <Container>
      <PageName>Payment Page</PageName>
      <Line />
      <Wrapper>
        <PaymentWrapper>
          <Title>Your Information</Title>
          <InfoWrapper>
            <Name>{nickName}</Name>
            <AccountTitle>Account</AccountTitle>
            <Account>{userInfo.walletAddress}</Account>
          </InfoWrapper>
          <Title>Creator Information</Title>
          <InfoWrapper>
            <Name>홀리냥</Name>
            <AccountTitle>Account</AccountTitle>
            <Account>{walletAddress}</Account>
          </InfoWrapper>
          <Title>Donate Information</Title>
          <TotalPriceWrapper>
            <PriceWrapper style={{ marginBottom: "8px" }}>
              <Price>Donate Message</Price>
              <Price>{message}</Price>
            </PriceWrapper>
            <PriceWrapper>
              <Price>Donate Price</Price>
              <SOL>{amount} SOL</SOL>
            </PriceWrapper>
            <Line />
            <PriceWrapper>
              <Price>Total</Price>
              <SOL>{amount} SOL</SOL>
            </PriceWrapper>
          </TotalPriceWrapper>
          <ButtonWrapper>
            <Button onClick={onClick}>Pay</Button>
          </ButtonWrapper>
          {/* <ButtonWrapper style={{ visibility: "hidden" }}> */}
          <WalletConnectButton />
          {/* </ButtonWrapper> */}
        </PaymentWrapper>
      </Wrapper>
      {openModal && txid && (
        <Qrcode
          open={openModal}
          onClose={closeModal}
          params={params}
          txid={txid}
        />
      )}
      {/* {isMobile && } */}
    </Container>
  );
}
const Container = styled.div`
  margin: 32px 64px;
  min-width: 400px;
`;

const PageName = styled.div`
  font-size: 32px;
  font-weight: bold;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const PaymentWrapper = styled.div`
  width: 70%;
  min-width: 400px;
`;

const InfoWrapper = styled.div`
  border-radius: 5px;
  padding: 20px;
  background-color: #ececec;
`;
const Title = styled.div`
  margin-top: 32px;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: bold;
`;
const Name = styled.div`
  font-size: 16px;
`;
const AccountTitle = styled.div`
  font-weight: bold;
  margin-top: 8px;
`;
const Account = styled.div`
  font-size: 14px;
  color: #686868;
  margin-top: 2px;
`;

const TotalPriceWrapper = styled.div`
  margin-top: 16px;
  background-color: #ececec;
  border-radius: 5px;
  padding: 20px;
`;
const PriceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Price = styled.div`
  font-size: 14px;
`;
const SOL = styled.div`
  font-weight: bold;
`;

const Line = styled.hr`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  width: 30%;
  height: 40px;
  color: #ffffff;
  background-color: #00a8ff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

export default Payment;
