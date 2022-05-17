import React, { useState } from "react";
import styled from "styled-components";
import Collapse from "./Tag/Collapse";
import ThreeLayersCircle from "./Tag/ThreeLayersCircle";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

const TABS = [
  {
    title: "원터치로 후원하기",
    description:
      "휴대폰으로 방송을 보시나요? 크리에이터가 등록한 후원링크에 접속하여 원터치로 후원해보세요! QR코드결제는 당신의 손을 더 자유롭게 해줍니다!",
    imageUrl: "/demo-illustration-3.png",
    baseColor: "249,82,120",
    secondColor: "221,9,57",
  },
  {
    title: "낮은 수수료율",
    description:
      "수수료가 신경쓰였나요? 우리 SOLNIVERSE는 당신이 후원한 가치 그대로를 전달해드립니다. 수수료율을 최소화함으로써 당신의 크리에이터에게 후원의 가치를 전해보세요",
    imageUrl: "/demo-illustration-4.png",
    baseColor: "57,148,224",
    secondColor: "99,172,232",
  },
  {
    title: "후원을 통한 오락요소",
    description:
      "대쉬보드에서 당신의 후원랭킹과 내역을 그래프로 만나보세요! 후원을 할수록 쌓이는 SVN 토큰 포인트를 통해 유니크한 크리에이터 NFT를 뽑고 당신을 빛내보세요. ",
    imageUrl: "/demo-illustration-5.png",
    baseColor: "88,193,132",
    secondColor: "124,207,158",
  },
];
const CreatorImage = styled.img.attrs({})`
  width: 100%;
`;

export default function DonationIntro() {
  const [currentTab, setCurrentTab] = useState(TABS[0]);

  const imagesMarkup = TABS.map((singleTab, idx) => {
    const isActive = singleTab.title === currentTab.title;

    return (
      <ImageContainer key={singleTab.title} isActive={isActive}>
        <CreatorImage src={singleTab.imageUrl} />
      </ImageContainer>
    );
  });

  const tabsMarkup = TABS.map((singleTab, idx) => {
    const isActive = singleTab.title === currentTab.title;

    return (
      <Tab isActive={isActive} key={idx} onClick={() => handleTabClick(idx)}>
        <TabTitleContainer>
          <CircleContainer>
            <ThreeLayersCircle
              baseColor={isActive ? "transparent" : singleTab.baseColor}
              secondColor={singleTab.secondColor}
            />
          </CircleContainer>
          <p>{singleTab.title}</p>
        </TabTitleContainer>
        <Collapse isOpen={isActive} duration={300}>
          <TabContent>
            <RichText> {singleTab.description}</RichText>
          </TabContent>
        </Collapse>
      </Tab>
    );
  });

  function handleTabClick(idx: number) {
    setCurrentTab(TABS[idx]);
  }

  return (
    <DonationIntroWrapper id="donationIntro">
      <Content>
        <OverTitle>도네이션 방식</OverTitle>
      </Content>
      <GalleryWrapper>
        <TabsContainer>{tabsMarkup}</TabsContainer>
        {imagesMarkup}
      </GalleryWrapper>
    </DonationIntroWrapper>
  );
}

export const OverTitle = styled.span`
  display: block;
  margin-bottom: 1.3rem;
  font-size: 1.5rem;
  letter-spacing: 0.02em;
  font-weight: bold;
`;
const DonationIntroWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
`;

const GalleryWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  margin-bottom: 10px;
  & > *:not(:first-child) {
    margin-top: 0.5rem;
  }
  text-align: center;
`;

const TabsContainer = styled.div`
  flex: 1;
  margin-right: 3rem;
  padding-top: 2rem;
  & > *:not(:first-child) {
    margin-top: 0.5rem;
  }
  @media screen and (max-width: 800px) {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
  }
`;

const ImageContainer = styled.div<{ isActive: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 0.8rem;
  margin-top: 1.5rem;
  flex: ${(p) => (p.isActive ? "2" : "0")};

  box-shadow: 1rem;
  /* transition-duration: 500ms; */
  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 10px;
  }

  & > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  @media screen and (max-width: 800px) {
    width: ${(p) => (p.isActive ? "100%" : "0")};
    /* flex-direction: column; */
    /* display: none; */
  }
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  background: rgb(var(--cardBackground));

  opacity: ${(p) => (p.isActive ? 1 : 0.6)};
  cursor: pointer;
  transition: opacity 0.2s;

  font-size: 1.3rem;
  font-weight: bold;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const TabTitleContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    flex: 1;
    margin-left: -1.5rem;
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: normal;
  margin-top: 0.5rem;
  font-size: 1.3rem;
  padding-left: 5rem;
  text-align: justify;
  p {
    font-weight: normal;
  }
  @media screen and (max-width: 800px) {
    padding-left: calc(2.5rem + 1.25rem);
  }
`;

const CircleContainer = styled.div`
  flex: 0 calc(5rem + 1.5rem);
  @media screen and (max-width: 800px) {
    flex: 0 calc(4rem + 1.25rem);
  }
`;
