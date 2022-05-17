import React from "react";
import styled from "styled-components";
import BasicSection from "./Tag/BasicSection";
import { Wrapper } from "./Tag/Wrapper";

export const SideFeatures = () => {
  return (
    <SideWrapper id="sideFeatures">
      <BasicSection
        imageUrl="/images/모니터.png"
        title="스트리머 NFT 뽑기"
        size={550}
      >
        <p>
          저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
          있습니다. 당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다 예
          제생각에는 겟핍의 소개 내용을 좀 많이 차용해야겠군요
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
          있습니다. 당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다 예
          제생각에는 겟핍의 소개 내용을 좀 많이 차용해야겠군요
        </p>
      </BasicSection>
      <BasicSection
        imageUrl="/images/모니터.png"
        title="스트리머 NFT 뽑기"
        size={550}
      >
        <p>
          저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
          있습니다. 당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다 예
          제생각에는 겟핍의 소개 내용을 좀 많이 차용해야겠군요
        </p>
      </BasicSection>
    </SideWrapper>
  );
};

const SideWrapper = styled(Wrapper)`
  flex-direction: column;
  height: 110%;
`;
