import React, { createRef } from "react";
import styled from "styled-components";

export interface ICoreProps {
  core: {
    title: string;
    content: string;
  };
}
export const CoreCard = ({ core }: ICoreProps) => {
  const imgRef = createRef();
  return (
    <>
      <Card>{core.title} dfgsdf</Card>
    </>
  );
};

const Card = styled.div`
  display: block;
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
