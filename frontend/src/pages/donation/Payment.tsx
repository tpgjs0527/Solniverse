import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Qrcode from "./Qrcode";
import { isMobile } from "react-device-detect";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { encodeURL } from "@solana/pay";
import { useRecoilState, useRecoilValue } from "recoil";
import { accessTokenAtom, userInfoAtom } from "atoms";
import useMutation from "hooks/useMutation";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { getProvider } from "utils/getProvider";
import nacl from "tweetnacl";

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
  const amount = searchParams.get("amount");
  const nickName = searchParams.get("nickName");
  const creatorName = searchParams.get("creatorName");
  const message = searchParams.get("message");
  const walletAddress = searchParams.get("walletAddress");
  const type = searchParams.get("type");
  const params = { amount, nickName, message, walletAddress, type };
  const [txid, setTXID] = useState("");
  const [getTXId, { data, loading }] = useMutation<any>(
    `${process.env.REACT_APP_BASE_URL}/donation/send`
  );
  console.log(params);

  const closeModal = () => {
    setOpenModal(false);
  };
  const onClick = () => {
    if (txid) {
      if (isMobile) {
        if (type === "SOL") {
          const recipient = new PublicKey(`${walletAddress}`);
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
          window.location.href = url;
        } else if (type === "USDC") {
          console.log("USDC로 결제");
          const recipient = new PublicKey(`${walletAddress}`);
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
            "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
          );
          const url = encodeURL({
            recipient,
            amount,
            splToken,
            reference,
            label,
            message,
            memo,
          });
          console.log(url);
          window.location.href = url;
        }
      } else {
        setOpenModal(true);
      }
    } else {
      alert("잘못된 결제 경로입니다. 다시 도네이션을 진행해주세요.");
      navigate(`/donation/${walletAddress}`);
    }
  };

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
            <Name>{creatorName}</Name>
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
              <SOL>
                {amount} {type}
              </SOL>
            </PriceWrapper>
            <Line />
            <PriceWrapper>
              <Price>Total</Price>
              <SOL>
                {amount} {type}
              </SOL>
            </PriceWrapper>
          </TotalPriceWrapper>
          <ButtonWrapper>
            <Button onClick={onClick}>Pay</Button>
          </ButtonWrapper>
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
  @media screen and (max-width: 691px) {
    margin: 8px;
    min-width: 0px;
  }
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
  &:hover {
    background: linear-gradient(45deg, #870ff8 0%, #0f3af8 60%, #0ff8ec 100%);
  }
`;

export default Payment;
