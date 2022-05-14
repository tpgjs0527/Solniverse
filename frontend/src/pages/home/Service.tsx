import Features from "components/Home/Features";
import { Interaction } from "components/Home/Interaction";
import Introduction from "components/Home/Introduction";
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
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/service"}>Service</Link>
            </li>
          </ul>
        </Menu>
      </NavBar>
      <ServiceWrapper>
        {/* <Introduction /> */}
        <Features />
        <Interaction />
      </ServiceWrapper>
    </>
  );
};

const NavBar = styled.div`
  width: 100%;
  position: sticky;
  top: 0%;
`;

const ServiceWrapper = styled.div`
  padding: 4rem;
  & > :last-child {
    margin-bottom: 15rem;
  }
`;
