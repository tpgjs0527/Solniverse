import React, { useState } from "react";
import styled from "styled-components";
import Collapse from "./Tag/Collapse";
import ThreeLayersCircle from "./Tag/ThreeLayersCircle";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

const TABS = [
  {
    title: "QR코드 결제",
    description:
      "도네이션 링크로 들어오니, 현재 컴퓨터에 팬텀 월렛이 없나요? 걱정 마세요! 모바일에 팬텀 월렛앱을 이용하여 QR 결제를 진행하시면 됩니다!",
    imageUrl: "/images/QR코드 결제.png",
    baseColor: "249,82,120",
    secondColor: "221,9,57",
  },
  {
    title: "모바일 결제",
    description:
      "모바일로 방송을 보시다가 도네이션을 하고 싶으신가요? 스트리머의 후원 링크를 클릭하여 후원 메세지를 작성한 후, 결제 버튼을 눌러보세요! 저희 SOLNIVERSE는 긴 절차 없이 원터치로 모바일 결제가 진행되도록 서비스를 제공하고 있습니다!",
    imageUrl: "/images/모바일 결제.png",
    baseColor: "57,148,224",
    secondColor: "99,172,232",
  },
  {
    title: "Extension 결제",
    description:
      "후원 메세지 작성 후, 클릭 3번으로 후원 작성부터 시그니처 검증, 결제까지 완료됩니다. 잠깐! 혹시, SOLINIVERSE에 팬텀 월렛이 연결되어있으신가요? Extension 결제 서비스는 팬텀 월렛이 연결되어 있으셔야 합니다!",
    imageUrl: "/images/익스텐션 결제.png",
    baseColor: "88,193,132",
    secondColor: "124,207,158",
  },
];
const CreatorImage = styled.img.attrs({})`
  width: 90%;
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
  @media screen and (max-width: 800px) {
    height: 900px;
  }
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
  @media screen and (max-width: 800px) {
    margin-top: 10px;
    margin-bottom: 0px;
  }
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

  /* margin-top: 0rem; */
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
