import React from "react";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import { Phantom } from "./Intro";
import BasicSection from "./Tag/BasicSection";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

export const SideFeatures = () => {
  return (
    <SideWrapper id="sideFeatures">
      <Content>
        <OverTitle>오락 요소</OverTitle>
        <RichText>
          Solniverse는 유저들의 즐거움을 위해 다양한 오락 서비스들을 제공합니다
        </RichText>
      </Content>
      <BasicSection
        imageUrl="/images/후원 내역과 랭킹.png"
        title="나의 랭킹 및 후원 내역"
        size={500}
      >
        <p>
          지금까지 후원한 혹은 후원받은 내역들을 한눈에 확인하실 수 있습니다.
          등급표와 순위 목록을 보며 레벨 업을 해보아요
        </p>
      </BasicSection>
      <BasicSection
        imageUrl="/images/NFT 캔디드롭.png"
        title="스트리머 NFT 뽑기"
        size={550}
        reversed
      >
        <p>
          SOLNIVERSE는 자체 포인트 토큰인{" "}
          <Phantom
            onClick={() =>
              window.open(
                "https://solscan.io/token/9UGMFdqeQbNqu488mKYzsAwBu6P2gLJnsFeQZ29cGSEw?cluster=devnet",
                "_blank"
              )
            }
          >
            SNV 토큰
          </Phantom>
          을 만들었습니다. 후원을 통해 얻은 SNV 토큰을 가지고, 스트리머 사진이
          담긴 NFT를 뽑고 소장해보아요
        </p>
      </BasicSection>
      <BasicSection
        imageUrl="/images/그래프.png"
        title="후원 그래프"
        size={550}
      >
        <p>
          후원 내역에 대한 상세 정보가 궁금하신가요? 필요한 후원 정보를 그래프와
          리스트로 보여드립니다! 상세 정보를 클릭하시면{" "}
          <Phantom onClick={() => window.open("https://solscan.io/", "_blank")}>
            Solscan
          </Phantom>
          을 통해 결제 정보를 확인하실 수 있습니다
        </p>
      </BasicSection>
    </SideWrapper>
  );
};

const SideWrapper = styled(Wrapper)`
  flex-direction: column;
`;
