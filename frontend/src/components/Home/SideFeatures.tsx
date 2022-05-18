import React from "react";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import BasicSection from "./Tag/BasicSection";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

export const SideFeatures = () => {
  return (
    <SideWrapper id="sideFeatures">
      <Content>
        <OverTitle>오락요소</OverTitle>
        <RichText>
          Solniverse는 유저들의 즐거움을 위해 다양한 오락 서비스들을 제공합니다
        </RichText>
      </Content>
      <BasicSection
        imageUrl="/images/후원 내역과 랭킹.png"
        title="나의 랭킹 및 후원 내역"
        size={550}
      >
        <p>
          저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
          있습니다. 당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다
        </p>
      </BasicSection>
      <BasicSection
        imageUrl="/images/모니터.png"
        title="스트리머 NFT 뽑기"
        size={550}
        reversed
      >
        <p>
          저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
          있습니다. 당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다
        </p>
      </BasicSection>
      <BasicSection
        imageUrl="/images/그래프.png"
        title="후원 그래프"
        size={550}
      >
        <p>
          저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
          있습니다. 당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다
        </p>
      </BasicSection>
    </SideWrapper>
  );
};

const SideWrapper = styled(Wrapper)`
  flex-direction: column;
`;
