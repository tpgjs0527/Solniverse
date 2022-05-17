import React from "react";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import { CoreCard } from "./Tag/CoreCard";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

const coreFeatures = [
  {
    Title: "수수료율 절감",
    content: "기존 서비스의 10분의 1",
  },
  {
    Title: "수수료율 절감",
    content: "기존 서비스의 10분의 1",
  },
  {
    Title: "수수료율 절감",
    content: "기존 서비스의 10분의 1",
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
        {coreFeatures.map((core: any, idx) => (
          <CoreCard key={idx} core={core} />
        ))}
      </CardContainer>
    </CoreWrapper>
  );
};

const CoreWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
`;
const CardContainer = styled.div`
  display: flex;

  padding-top: 20px;
`;
