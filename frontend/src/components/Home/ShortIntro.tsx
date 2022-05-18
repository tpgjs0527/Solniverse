import React from "react";
import styled from "styled-components";
import BasicSection from "./Tag/BasicSection";

export const ShortIntro = () => {
  return (
    <Wrapper >
      <BasicSection
        size={450}
        imageUrl={`${process.env.PUBLIC_URL}/images/모니터.png`}
        title="Solana 블록체인으로 가능해진 "
        title2="새로운 인터넷 방송 후원 플랫폼"
      ></BasicSection>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding-top: 6%;
`;
