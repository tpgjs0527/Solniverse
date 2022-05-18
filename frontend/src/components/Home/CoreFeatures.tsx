import React from "react";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";
import { BsChevronDoubleDown } from "react-icons/bs";
import { IoEarth } from "react-icons/io5";
import { AiOutlineDollar } from "react-icons/ai";

const coreFeatures = [
  {
    Icon: <BsChevronDoubleDown />,
    title: "수수료율 절감",
    content:
      "도네이션의 부담을 해소하기 위해 기존 시장 수수료율 10%에서 0.01%로 절감",
  },
  {
    Icon: <IoEarth />,
    title: "글로벌 결제 서비스 플랫폼",
    content:
      "가상 화폐를 활용한 특정 국가에 국한되지 않는 글로벌 결제 서비스를 제공",
  },
  {
    Icon: <AiOutlineDollar />,
    title: "간편한 결제 과정",
    content:
      "QR Code 결제, 팬텀 월렛 익스텐션, 모바일 결제 총 3가지의 간편 결제 서비스",
  },
];

export const CoreFeatures = () => {
  return (
    <CoreWrapper id="coreFeatures">
      <Content>
        <OverTitle>차별점</OverTitle>
        <RichText>
          SOLNIVERSE는 후원자와 스트리머 유저에게 최고의 서비스를 제공하기 위해
          3가지 차별점을 두었습니다 👨‍🚀
        </RichText>
      </Content>
      <CardContainer>
        {coreFeatures.map((card: any, idx) => (
          <Card key={idx}>
            <ImageBox>{card.Icon}</ImageBox>
            <OverTitle>{card.title}</OverTitle>
            <RichText>{card.content}</RichText>
          </Card>
        ))}
      </CardContainer>
    </CoreWrapper>
  );
};
const Card = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  height: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.2);
  :hover {
    box-shadow: 0 20px 30px 0 rgba(0, 0, 0, 0.2);
  }
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
  border-radius: 10px;
  border: 1px soild lightcoral;
  @media screen and (max-width: 700px) {
    height: 400px;
  }
`;
const ImageBox = styled.div`
  font-size: 150px;
  color: ${(props) => props.theme.ownColor};
  @media screen and (max-width: 700px) {
    margin-top: 60px;

    margin-left: 0%;
  }
`;

const CoreWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 700px) {
    height: 100%;
  }
`;
const CardContainer = styled.div`
  display: flex;
  padding-top: 20px;

  @media screen and (max-width: 700px) {
    flex-direction: column;
    margin-right: 30px;
  }
`;
