import React from "react";
import styled from "styled-components";
import { Content, OverTitle } from "./DonationIntro";
import RichText from "./Tag/RichText";
import { Wrapper } from "./Tag/Wrapper";
import { BsChevronDoubleDown } from "react-icons/bs";
import { IoEarth } from "react-icons/io5";
import { AiOutlineDollar } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export const CoreFeatures = () => {
  const { t } = useTranslation();
  const coreFeatures = [
    {
      Icon: <BsChevronDoubleDown />,
      title: t("core-1"),
      content_1: t("core-1-intro"),
      content_2: t("core-1-last"),
    },
    {
      Icon: <IoEarth />,
      title: t("core-2"),
      content_1: t("core-2-intro"),
      content_2: t("core-2-last"),
    },
    {
      Icon: <AiOutlineDollar />,
      title: t("core-3"),
      content_1: t("core-3-intro"),
      content_2: t("core-3-last"),
    },
  ];
  return (
    <CoreWrapper id="coreFeatures">
      <Content>
        <OverTitle>{t("distinction")}</OverTitle>
        <RichText>{t("core-introduction")} 👨‍🚀</RichText>
      </Content>
      <CardContainer>
        {coreFeatures.map((card: any, idx) => (
          <Card key={idx}>
            <ImageBox>{card.Icon}</ImageBox>
            <OverTitle>{card.title}</OverTitle>
            <div>
              <RichText>{card.content_1}</RichText>
              <RichText>{card.content_2}</RichText>
            </div>
          </Card>
        ))}
      </CardContainer>
    </CoreWrapper>
  );
};
const Card = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 14px;
  padding-right: 14px;
  height: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.2);
  :hover {
    box-shadow: 0 20px 30px 0 rgba(0, 0, 0, 0.2);
  }
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
  border-radius: 10px;
  border: 1px soild lightcoral;
  @media screen and (max-width: 700px) {
    height: 400px;
  }
`;
const ImageBox = styled.div`
  font-size: 150px;
  color: ${(props) => props.theme.ownColor};
  @media screen and (max-width: 700px) {
    margin-top: 60px;

    margin-left: 0%;
  }
`;

const CoreWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  @media screen and (max-width: 700px) {
    padding-bottom: 13px;
    height: 100%;
    margin-top: 10%;
  }
`;
const CardContainer = styled.div`
  display: flex;
  padding-top: 20px;

  @media screen and (max-width: 700px) {
    flex-direction: column;
    margin-right: 30px;
  }
`;
