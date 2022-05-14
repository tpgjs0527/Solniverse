import Features from "components/Home/Features";
import { Interaction } from "components/Home/Interaction";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Logo, Main, Menu } from "./Home";

export const Service = () => {
  return (
    <>
      <NavBar>
        <Logo>
          <img src="" alt="" />
        </Logo>
        <Menu>
          <ul>
            <li>
              <Link to={"/service"}>서비스</Link>
            </li>
            <li>
              <Link to={"/"}>홈</Link>
            </li>
          </ul>
        </Menu>
      </NavBar>
      <ServiceWrapper>
        <Features />
        {/* <Interaction /> */}
      </ServiceWrapper>
    </>
  );
};

const NavBar = styled.div`
  width: 100vw;
  position: sticky;
  top: 0%;
`;

const ServiceWrapper = styled.div`
  /* padding: 4rem; */
  padding-top: 4rem;
  /* & > :last-child {
    margin-bottom: 15rem;
  } */
`;
