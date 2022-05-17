import React from "react";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import { ImagesSlider } from "./Tag/ImagesSlider";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

const Images = [
  { description: "첫번째 단계 !", imageUrl: "images/alertImg/slider01.jpg" },
  { description: "첫번째 단계 !", imageUrl: "images/alertImg/slider02.jpg" },
  { description: "첫번째 단계 !", imageUrl: "images/alertImg/slider03.jpg" },
  { description: "첫번째 단계 !", imageUrl: "images/alertImg/slider04.jpg" },
  { description: "첫번째 단계 !", imageUrl: "images/alertImg/slider05.jpg" },
  { description: "첫번째 단계 !", imageUrl: "images/alertImg/slider06.jpg" },
];
export const AlertBoxSetting = () => {
  return (
    <Wrapper id="alertBoxSetting">
      <Box>
        <Content>
          <OverTitle>후원 메세지 설정</OverTitle>
          <RichText>
            쉽고 간편한 후원메세지 설정하기! 준비물은 OBS와 팬텀 지갑입니다 👨‍🚀
          </RichText>
        </Content>
        <ImagesSlider Images={Images} />
      </Box>
    </Wrapper>
  );
};

const Box = styled.div`
  margin-top: 7%;
  @media screen and (min-width: 1900px) {
    width: 900px;
    height: 600px;
  }
  width: 692px;

  /* background-color: black; */
`;
