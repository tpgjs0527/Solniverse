import React from "react";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import { ImagesSlider } from "./Tag/ImagesSlider";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

const Images = [
  { imageUrl: "images/alertImg/1.PNG" },
  { imageUrl: "images/alertImg/2.PNG" },
  { imageUrl: "images/alertImg/3.PNG" },
  { imageUrl: "images/alertImg/4.png" },
  { imageUrl: "images/alertImg/5.png" },
];
export const AlertBoxSetting = () => {
  return (
    <AlertWrapper id="alertBoxSetting">
      <Box>
        <Content>
          <OverTitle>후원 메세지 설정</OverTitle>
          <RichText>
            쉽고 간편한 후원메세지 설정하기! 준비물은 OBS와 팬텀 지갑입니다 👨‍🚀
          </RichText>
        </Content>
        <ImagesSlider Images={Images} />
      </Box>
    </AlertWrapper>
  );
};
const AlertWrapper = styled(Wrapper)`
  justify-content: center;
  @media screen and (max-width: 800px) {
    align-items: center;
    height: 600px;
  }
`;
const Box = styled.div`
  @media screen and (min-width: 1700px) {
    margin-top: 2%;
    width: 900px;
    height: 580px;
  }
  width: 692px;
  @media screen and (max-width: 800px) {
    margin-top: 0%;

    width: 400px;
    height: 220x;
  }

  /* background-color: black; */
`;
