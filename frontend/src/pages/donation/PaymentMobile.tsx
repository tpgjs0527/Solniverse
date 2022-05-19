import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Qrcode from "./Qrcode";
import { isMobile } from "react-device-detect";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { encodeURL } from "@solana/pay";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import useMutation from "hooks/useMutation";
import { WalletConnectButton } from "@solana/wallet-adapter-react-ui";
import Swal from "sweetalert2";

export interface ITX {
  result: string;
  shopAddress: string;
  txid: string;
}

function PaymentMobile() {
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

          window.location.href = url;
        } else if (type === "USDC") {
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

          window.location.href = url;
        }
      } else {
        setOpenModal(true);
      }
    } else {
      Swal.fire(
        "결제 경로 오류",
        "잘못된 결제 경로입니다. 다시 도네이션을 진행해주세요.",
        "warning"
      );
      navigate(`/donation/${walletAddress}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!data) {
      getTXId({
        displayName: nickName,
        message: message,
        platform: "",
      });
    }
  }, []);

  useEffect(() => {
    // getSignature();
    if (data) {
      setTXID(data.txid);
    }
  }, [data]);

  return (
    <Container>
      <PageName>Payment Page</PageName>
      <Line />
      <Wrapper>
        <PaymentWrapper>
          <Title>후원자 정보</Title>
          <InfoWrapper>
            <Name>{nickName}</Name>
            <AccountTitle>Account</AccountTitle>
            <Account>{userInfo.walletAddress}</Account>
          </InfoWrapper>
          <Title>크리에이터 정보</Title>
          <InfoWrapper>
            <Name>홀리냥</Name>
            <AccountTitle>Account</AccountTitle>
            <Account>{walletAddress}</Account>
          </InfoWrapper>
          <Title>도네이션 정보</Title>
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
          <ButtonWrapper style={{ visibility: "hidden" }}>
            <WalletConnectButton />
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
  min-width: 300px;
  @media screen and (max-width: 767px) {
    width: 100%;
    height: 100%;
    margin: 4px;
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
`;

export default PaymentMobile;
