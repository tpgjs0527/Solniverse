import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import BasicSection from "./Tag/BasicSection";

export const Intro = () => {
  const { t } = useTranslation();
  return (
    <Wrapper data-aos="fade-up" data-aos-duration="2000" id="shortIntro">
      <BasicSection
        size={200}
        introTitle="SOLNIVERSE"
        introContent={t("compound")}
        imageUrl="/favicon.ico"
        title={t("intro-1")}
        title2={t("intro-2")}
        title3={t("intro-3")}
        title4={t("intro-4")}
      >
        <p>
          {t("intro-5")}{" "}
          <Phantom
            onClick={() => window.open("https://phantom.app/", "_blank")}
          >
            {t("intro-6")}
          </Phantom>
        </p>
      </BasicSection>
    </Wrapper>
  );
};
export const Phantom = styled.span`
  color: ${(props) => props.theme.ownColor};
  border-radius: 3px;
  padding: 3px;
  :hover {
    background-color: ${(props) => props.theme.ownColor};
    color: white;
    cursor: pointer;
  }
  transition-duration: 300ms;
`;

const Wrapper = styled.div`
  padding-top: 10%;
`;
