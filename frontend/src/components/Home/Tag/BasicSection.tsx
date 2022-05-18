import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import { OverTitle } from "../DonationIntro";
import Container from "./Container";
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
        <RichText> {introTitle}</RichText>
        <IntroContent>{introContent}</IntroContent>
      </ImageContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <RichText>{children}</RichText>
      </ContentContainer>
    </BasicSectionWrapper>
  );
}

export const Title = styled.h1`
  margin-top: 1rem;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;
`;
const IntroContent = styled(RichText)`
  padding-right: 80px;
  @media screen and (max-width: 700px) {
    padding-right: 40px;
  }
`;
const ImageContainer = styled.div`
  flex: 1;
  margin-left: 5%;
  z-index: 0;

  flex-direction: column;
  position: relative;
  margin-right: 5%;
  @media screen and (max-width: 700px) {
    margin-top: 60px;
  }
`;
const CreatorImage = styled.img<{ size: number }>`
  width: ${(props) => `${props.size}px`};
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
  }
  @media screen and (min-width: 1900px) {
    height: 700px;
  }
`;
