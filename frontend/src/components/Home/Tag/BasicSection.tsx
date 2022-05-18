import React, { PropsWithChildren } from "react";
import styled from "styled-components";

import RichText from "./RichText";
import { Wrapper } from "./Wrapper";

export interface BasicSectionProps {
  imageUrl: string;
  title: string;
  size: number;
  introTitle?: string;
  introContent?: string;
  reversed?: boolean;
}

export default function BasicSection({
  imageUrl,
  size,
  title,
  children,
  introTitle,
  introContent,
  reversed,
}: PropsWithChildren<BasicSectionProps>) {
  return (
    <BasicSectionWrapper reversed={reversed}>
      <ImageContainer>
        <CreatorImage size={size} src={imageUrl} alt="/" />
        <IntroTitle> {introTitle}</IntroTitle>
        <RichText>{introContent}</RichText>
      </ImageContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <BasicRichText>{children}</BasicRichText>
      </ContentContainer>
    </BasicSectionWrapper>
  );
}

export const Title = styled.h1`
  margin-top: 1rem;
  font-size: 2.3rem;
  font-weight: bold;
  line-height: 1.5;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;
`;

const BasicRichText = styled(RichText)`
  text-align: justify;
`;

const IntroTitle = styled(RichText)`
  font-weight: 600;
`;
const ImageContainer = styled.div`
  flex: 1;
  margin-left: 8%;
  z-index: 0;

  flex-direction: column;
  text-align: center;
  position: relative;
  margin-right: 5%;
`;
const CreatorImage = styled.img<{ size: number }>`
  width: ${(props) => `${props.size}px`};
  @media screen and (max-width: 700px) {
    margin-top: 60px;
    width: 300px;
    margin-left: 0%;
  }
`;
const ContentContainer = styled.div`
  flex: 1;
  margin-right: 10%;
  margin-left: 5%;
`;
type Props = Pick<BasicSectionProps, "reversed">;

const BasicSectionWrapper = styled(Wrapper)`
  display: flex;
  align-items: center;
  height: 550px;
  margin-top: 8%;
  flex-direction: ${(p: Props) => (p.reversed ? "row-reverse" : "row")};

  @media screen and (max-width: 700px) {
    margin-top: 9%;
    flex-direction: column;
    height: 750px;
    text-align: center;
  }
  @media screen and (min-width: 1900px) {
    height: 700px;
  }
`;
