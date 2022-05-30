import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import { Phantom } from "./Intro";
import { ImagesSlider } from "./Tag/ImagesSlider";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

const Images = [
  { imageUrl: "images/alertImg/1.PNG" },
  { imageUrl: "images/alertImg/2.PNG" },
  { imageUrl: "images/alertImg/3.PNG" },
  { imageUrl: "images/alertImg/4.png" },
  { imageUrl: "images/alertImg/5.png" },
  { imageUrl: "images/alertImg/6.png" },
];
export const AlertBoxSetting = () => {
  const { t } = useTranslation();
  return (
    <AlertWrapper id="alertBoxSetting">
      <Box>
        <Content>
          <OverTitle>{t("alert-setting")}</OverTitle>
          <RichText>
            {t("alert-setting-intro-1")}{" "}
            <Phantom onClick={() => window.open("https://obsproject.com/ko")}>
              {t("alert-setting-intro-2")}
            </Phantom>
            {t("alert-setting-intro-3")} 👨‍🚀
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
  @media screen and (min-width: 1200px) {
    padding-top: 7%;
  }
`;
const Box = styled.div`
  width: 800px;

  @media screen and (min-width: 1700px) {
    margin-top: 2%;
    width: 930px;
    height: 580px;
  }

  @media screen and (max-width: 800px) {
    margin-top: 0%;
    width: 400px;
    height: 220x;
  }
`;
