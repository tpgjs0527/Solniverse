import { AlertBoxSetting } from "components/Home/AlertBoxSetting";
import { CoreFeatures } from "components/Home/CoreFeatures";
import DonationIntro from "components/Home/DonationIntro";
import { Intro } from "components/Home/Intro";
import { Option } from "components/Home/Option";
import { ShortIntro } from "components/Home/ShortIntro";
import { SideFeatures } from "components/Home/SideFeatures";
import AOS from "aos";
import "aos/dist/aos.css";
import { TopButton } from "components/Home/TopButton";

import React, { useEffect } from "react";

import styled from "styled-components";

export const Service = () => {
  useEffect(() => {
    AOS.init();
  });
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
