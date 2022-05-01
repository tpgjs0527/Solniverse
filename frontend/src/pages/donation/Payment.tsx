import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Qrcode from "./Qrcode";
import { isBrowser, isMobile } from "react-device-detect";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { encodeURL } from "@solana/pay";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";

function Payment() {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const amount = searchParams.get("amount");
  const nickName = searchParams.get("nickName");
  const message = searchParams.get("message");
  const params = { amount, nickName, message };
  const closeModal = () => {
    setOpenModal(false);
  };
  const onClick = async () => {
    // pay버튼 누를 때 백으로 display name, message, platform
    // soniverse.net/displayname/platform
    // soniverse.net/walletAddress
    // http://localhost:3000/api/donation/send
    // alert("팬텀 월렛을 이용한 Solana Pay 진행할게용");
    if (isMobile) {
      // 스트리머 주소 받아오기
      const recipient = new PublicKey(
        "RpigkMduJPjCobrBJXaK68kRLGTJ3UbEwxRgFDADFNC"
      );
      const label = `${
        userInfo.twitch.id ? userInfo.twitch.displayName : "이름없음"
      }`;

      const message = `${params.message}`;
      // 이 자리에는 txid값이 담겨야 한다. 100kb
      const memo = `${params.message}`;
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
            <Account>Pu674dikkyAAUotqgQUZMe5fHzsgnYwFKQEmjEx4oR8</Account>
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
        </PaymentWrapper>
      </Wrapper>
      {openModal && isBrowser && (
        <Qrcode open={openModal} onClose={closeModal} params={params} />
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
