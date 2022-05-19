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
      "후원 메세지 작성 후, 모바일 내 팬텀앱으로 QR 결제를 진행해보세요",
    imageUrl: "/images/QR코드 결제.png",
    baseColor: "249,82,120",
    secondColor: "221,9,57",
  },
  {
    title: "모바일 결제",
    description:
      "스트리머가 등록한 후원 링크를 터치하면 팬텀앱으로 바로 결제가 됩니다",
    imageUrl: "/images/모바일 결제.png",
    baseColor: "57,148,224",
    secondColor: "99,172,232",
  },
  {
    title: "Extension 결제",
    description:
      "바로결제 클릭 후, 팬텀 월렛 시그니처 검증을 완료 하시면 결제가 진행됩니다",
    imageUrl: "/images/익스텐션 결제.png",
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
        <OverTitle>후원 방식</OverTitle>
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
  padding-left: 4%;
  padding-right: 4%;

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
  margin-bottom: 20px;
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
  width: 34%;

  margin-right: 3rem;

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
  overflow: hidden;

  flex: ${(p) => (p.isActive ? "2" : "0")};

  &:before {
    display: block;
    content: "";
    width: 100%;
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
  }
`;

const Tab = styled.div<{ isActive: boolean }>`
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2);
  :hover {
    box-shadow: 0 13px 20px 0 rgba(0, 0, 0, 0.2);
  }
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  padding: 1.2rem 1.2rem;
  background-color: ${(p) =>
    p.isActive ? null : "rgba(241, 240, 240, 0.801)"};

  opacity: ${(p) => (p.isActive ? 1 : 0.6)};
  cursor: pointer;
  transition: opacity 0.2s;

  font-size: 1.3rem;
  font-weight: bold;
  @media screen and (min-width: 1700px) {
    padding: 2.7rem 1.2rem;
  }
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
