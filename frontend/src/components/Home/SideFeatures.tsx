import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import { Phantom } from "./Intro";
import BasicSection from "./Tag/BasicSection";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";

export const SideFeatures = () => {
  const { t } = useTranslation();
  return (
    <SideWrapper id="sideFeatures">
      <Content>
        <OverTitle> {t("gamification")}</OverTitle>
        <RichText>{t("gamification-intro")}</RichText>
      </Content>
      <BasicSection
        imageUrl="/images/후원 내역과 랭킹.png"
        title={t("gamification-1")}
        size={500}
      >
        <p>{t("gamification-1-intro")}</p>
      </BasicSection>
      <BasicSection
        imageUrl="/images/NFT 캔디드롭.png"
        title={t("gamification-2")}
        size={550}
        reversed
      >
        <p>
          {t("gamification-2-intro")}{" "}
          <Phantom
            onClick={() =>
              window.open(
                "https://solscan.io/token/9UGMFdqeQbNqu488mKYzsAwBu6P2gLJnsFeQZ29cGSEw?cluster=devnet",
                "_blank"
              )
            }
          >
            {t("gamification-2-token")}
          </Phantom>
          {t("gamification-2-last")}
        </p>
      </BasicSection>
      <BasicSection
        imageUrl="/images/그래프.png"
        title={t("gamification-3")}
        size={550}
      >
        <p>
          {t("gamification-3-intro")}{" "}
          <Phantom onClick={() => window.open("https://solscan.io/", "_blank")}>
            {t("gamification-3-solscan")}
          </Phantom>
          {t("gamification-3-last")}
        </p>
      </BasicSection>
    </SideWrapper>
  );
};

const SideWrapper = styled(Wrapper)`
  flex-direction: column;
  margin-top: 10%;
`;
