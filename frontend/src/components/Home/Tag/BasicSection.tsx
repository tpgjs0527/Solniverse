import React, { PropsWithChildren } from "react";
import styled from "styled-components";

import RichText from "./RichText";
import { Wrapper } from "./Wrapper";

export interface BasicSectionProps {
  imageUrl: string;
  title: string;
  size: number;
  introTitle?: string;
  title2?: string;
  introContent?: string;
  reversed?: boolean;
}

export default function BasicSection({
  imageUrl,
  size,
  title,
  title2,
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
        <Title>{title2}</Title>

        <BasicRichText>{children}</BasicRichText>
      </ContentContainer>
    </BasicSectionWrapper>
  );
}

export const Title = styled.h1`
  margin-top: 1rem;
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 1.5;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;

  @media screen and (max-width: 500px) {
    font-size: 1.2rem;
  }
  @media screen and (min-width: 800px) and (max-width: 1450px) {
    font-size: 1.55rem;
  }
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
  @media screen and (min-width: 701px) and(max-width: 1450px) {
    width: 330px;
  }
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
  margin-top: 3%;
  flex-direction: ${(p: Props) => (p.reversed ? "row-reverse" : "row")};
  padding-top: 4%;
  @media screen and (max-width: 700px) {
    margin-top: 9%;
    flex-direction: column;
    height: 800px;
    text-align: center;
  }
  @media screen and (min-width: 1700px) {
    margin-top: 2%;
  }
`;
