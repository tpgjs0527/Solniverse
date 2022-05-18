import React, { createRef } from "react";
import styled from "styled-components";
import { OverTitle } from "../DonationIntro";
import RichText from "./RichText";

export interface ICardInfoProps {
  cardInfo: {
    imgURL: string;
    title: string;
    content: string;
  };
}
export const CoreCard = ({ cardInfo }: ICardInfoProps) => {
  const imgRef = createRef();
  return (
    <>
      <Card>
        <ImageBox src={cardInfo.imgURL} alt="/" />
        <OverTitle>{cardInfo.title}</OverTitle>
        <RichText>{cardInfo.content}</RichText>
      </Card>
    </>
  );
};

const Card = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

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
    height: 300px;
  }
`;
const ImageBox = styled.img`
  width: 200px;
  @media screen and (max-width: 700px) {
    margin-top: 60px;
    width: 300px;
    margin-left: 0%;
  }
`;
