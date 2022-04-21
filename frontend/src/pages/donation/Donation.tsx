import styled from "styled-components";
import Layout from "components/Layout";
import banner from "../../../public/가로긴사진.png";

function Donation() {
  const onClick = () => {
    alert("도네이션을 진행하겠습니다");
  };
  return (
    <Layout>
      <Container>
        <DonationWrapper>
          <CreatorWrapper>
            <CreatorName>To. 후원하고자 하는 크리에이터</CreatorName>
            <CreatorImage />
            <CreatorContent>
              후원하고자 하는 크리에이터가 지정한 문구
            </CreatorContent>
          </CreatorWrapper>
        </DonationWrapper>
        <DonationWrapper>
          <DonatorWrapper>
            <DonatorName>후원닉네임</DonatorName>
            <Input />
          </DonatorWrapper>
          <DonatorWrapper>
            <DonatePrice>후원금액</DonatePrice>
            <Input />
          </DonatorWrapper>
          <DonatorWrapper>
            <DonateMessage>후원메시지</DonateMessage>
            <MessageTextarea />
          </DonatorWrapper>
        </DonationWrapper>
        <Line />
        <DonationWrapper>
          <DonatorWrapper>
            <TotalPrice>Total</TotalPrice>
            <TotalUSDC>100 USDC</TotalUSDC>
          </DonatorWrapper>
        </DonationWrapper>
        <DonationWrapper>
          <ButtonWrapper>
            <Button onClick={onClick}>Donate</Button>
          </ButtonWrapper>
        </DonationWrapper>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  margin-top: 32px;
`;

const DonationWrapper = styled.div`
  margin-bottom: 32px;
`;

const CreatorWrapper = styled.div``;
const CreatorName = styled.div`
  font-size: 32px;
  font-weight: bold;
`;
const CreatorContent = styled.div`
  font-size: 20px;
`;
const CreatorImage = styled.img.attrs({
  src: `${process.env.PUBLIC_URL}/헤이.png`,
})`
  width: 100%;
  height: auto;
`;

const DonatorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;
const DonatorName = styled.div``;
const Input = styled.input`
  width: 80%;
  height: 40px;
  border-radius: 4px;
  /* border-width: 1px; */
  /* border-color: whitesmoke; */
  border: 1px solid #7f8fa6;
  font-size: 16px;
  font-weight: bold;
`;
const DonatePrice = styled.div``;
const DonateMessage = styled.div``;
const MessageTextarea = styled.textarea`
  width: 80%;
  height: 100px;
  border-radius: 4px;
  border: 1px solid #7f8fa6;
`;

const Line = styled.hr`
  margin: 32px 0px;
`;

const TotalPrice = styled.div``;
const TotalUSDC = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const ButtonWrapper = styled.div`
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

export default Donation;
