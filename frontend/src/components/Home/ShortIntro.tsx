import React from "react";
import styled from "styled-components";
import BasicSection from "./Tag/BasicSection";

export const ShortIntro = () => {
  return (
    <Wrapper id="shortIntro">
      <BasicSection
        size={600}
        imageUrl={`${process.env.PUBLIC_URL}/images/모니터.png`}
        title="솔니버스입니다"
      >
        <p>
          저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
          있습니다. 당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다
        </p>
      </BasicSection>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
