import { AlertBoxSetting } from "components/Home/AlertBoxSetting";
import { CoreFeatures } from "components/Home/CoreFeatures";
import DonationIntro from "components/Home/DonationIntro";
import { Intro } from "components/Home/Intro";
import { Option } from "components/Home/Option";
import { ShortIntro } from "components/Home/ShortIntro";
import { SideFeatures } from "components/Home/SideFeatures";

import { TopButton } from "components/Home/TopButton";

import React from "react";

import styled from "styled-components";

export const Service = () => {
  return (
    <Wrapper>
      <Option />
      <ServiceWrapper>
        <Intro />
        <ShortIntro />
        <CoreFeatures />
        <DonationIntro />
        <AlertBoxSetting />
        <SideFeatures />
        <TopButton />
      </ServiceWrapper>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  overflow-x: hidden;
`;

const ServiceWrapper = styled.div``;
