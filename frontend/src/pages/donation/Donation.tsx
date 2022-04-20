import styled from "styled-components";
import Layout from "components/Layout";
import banner from "../../../public/가로긴사진.png";

function Donation() {
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
        <DonationWrapper>
          <TotalWrapper>
            <TotalPrice></TotalPrice>
            <TotalUSDC></TotalUSDC>
          </TotalWrapper>
        </DonationWrapper>
        <DonationWrapper>
          <ButtonWrapper>
            <Button>Donate</Button>
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
  src: `${process.env.PUBLIC_URL}/가로긴사진.png`,
})`
  width: auto;
  height: 200px;
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
const PriceInput = styled.input``;
const DonateMessage = styled.div``;
const MessageTextarea = styled.textarea`
  width: 80%;
  height: 100px;
  border-radius: 4px;
  border: 1px solid #7f8fa6;
`;

const TotalWrapper = styled.div``;
const TotalPrice = styled.div``;
const TotalUSDC = styled.div``;

const ButtonWrapper = styled.div``;
const Button = styled.button``;

export default Donation;
