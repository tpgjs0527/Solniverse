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
import Swal from "sweetalert2";

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
  const [getTXId, { data }] = useMutation<any>(
    `${process.env.REACT_APP_BASE_URL}/donation/send`
  );

  const closeModal = () => {
    setOpenModal(false);
  };
  const onClick = async () => {
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
      <PageName>결제 페이지</PageName>
      <Line />
      <MainContainer>
        <SubContainer>
          <Wrapper>
            <PaymentWrapper>
              <UserWrapper>
                <TitleWrapper>
                  <Title>후원자 정보</Title>
                </TitleWrapper>
                <InfoWrapper>
                  <Name>후원자 닉네임 : {nickName}</Name>
                  <AccountTitle>지갑 주소</AccountTitle>
                  <Account>{userInfo.walletAddress}</Account>
                </InfoWrapper>
              </UserWrapper>
              <UserWrapper>
                <TitleWrapper>
                  <Title>스트리머 정보</Title>
                </TitleWrapper>
                <InfoWrapper>
                  <Name>{creatorName}</Name>
                  <AccountTitle>지갑 주소</AccountTitle>
                  <Account>{walletAddress}</Account>
                </InfoWrapper>
              </UserWrapper>
            </PaymentWrapper>
          </Wrapper>
          <Wrapper>
            <PaymentWrapper>
              <TitleWrapper style={{ marginLeft: "32px", marginBottom: "8px" }}>
                <Title>결제 정보</Title>
              </TitleWrapper>
              <TotalPriceWrapper>
                <PriceWrapper style={{ marginBottom: "8px" }}>
                  <Price>후원 메시지</Price>
                  <Price>{message}</Price>
                </PriceWrapper>
                <PriceWrapper>
                  <Price>후원 금액</Price>
                  <SOL>
                    {amount} {type}
                  </SOL>
                </PriceWrapper>
                <Line />
                <PriceWrapper>
                  <Price>총 후원 금액</Price>
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
        </SubContainer>
      </MainContainer>
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
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 64px 70px;
  @media screen and (min-width: 1439px) {
    min-width: 600px;
  }
  @media screen and (max-width: 767px) {
    max-width: 300px;
  }
`;
const SubContainer = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 30px;
  @media screen and (min-width: 1439px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (min-width: 1439px) {
    min-width: 600px;
  }
  @media screen and (max-width: 767px) {
    max-width: 300px;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 600px;
  min-height: 500px;
  border-radius: 16px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22) !important;
  @media screen and (min-width: 1439px) {
    min-width: 600px;
  }
  @media screen and (max-width: 767px) {
    max-width: 300px;
  }
`;
const PaymentWrapper = styled.div`
  width: 100%;

  @media screen and (min-width: 1439px) {
    min-width: 600px;
  }
  @media screen and (max-width: 767px) {
    max-width: 300px;
  }
`;

const UserWrapper = styled.div`
  /* display: flex;
    justify-content: center; */
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 16px;
`;
const TitleWrapper = styled.div``;
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
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 16px;
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
