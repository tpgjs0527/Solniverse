import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import { OverTitle } from "../Features";
import Container from "./Container";
import RichText from "./RichText";

export interface BasicSectionProps {
  imageUrl: string;
}
const CreatorImage = styled.img.attrs({})`
  width: 100%;
  /* height: 100%; */
  /* height: auto; */
`;
export default function BasicSection({
  imageUrl,
  children,
}: PropsWithChildren<BasicSectionProps>) {
  return (
    <BasicSectionWrapper>
      <ImageContainer>
        <CreatorImage src={imageUrl} alt="/" />
      </ImageContainer>
      <ContentContainer>
        <Title>블록체인과 함께합니다</Title>
        <RichText>{children}</RichText>
      </ContentContainer>
    </BasicSectionWrapper>
  );
}

const Title = styled.h1`
  margin-top: 1rem;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;
`;

const ImageContainer = styled.div`
  flex: 1;
  margin-left: 10%;

  position: relative;
  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 50px;
  }

  & > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  margin-right: 10%;
  margin-left: 5%;
`;

const BasicSectionWrapper = styled(Container)`
  display: flex;
  align-items: center;
  height: 100vh;

  @media screen and (max-width: 700px) {
    flex-direction: column;
  }
`;
