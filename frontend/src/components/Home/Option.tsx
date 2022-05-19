import { Logo, Menu } from "pages/home/Home";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Option = () => {
  const [top, setTop] = useState(true);

  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <WrapperNav top={top}>
      <Logo>
        <Link to={"/"}>
          <img src={`${process.env.PUBLIC_URL}/images/SNV토큰.png`} alt="" />
        </Link>
      </Logo>
      <Menu>
        <ul>
          <li>
            <Link to={"/"}>홈</Link>
          </li>

          <li>
            <a href="#coreFeatures">차별점</a>
          </li>
          <li>
            <a href="#donationIntro">후원 방식</a>
          </li>
          <li>
            <a href="#alertBoxSetting">알림창 설정</a>
          </li>
          <li>
            <a href="#sideFeatures">오락 요소</a>
          </li>
        </ul>
      </Menu>
    </WrapperNav>
  );
};

const WrapperNav = styled.div<{ top: boolean }>`
  width: 100%;
  position: fixed;
  display: flex;
  z-index: 100;
  align-items: center;
  opacity: 0.8;

  list-style: none;
  background-color: ${(props) => (!props.top ? props.theme.bgColor : null)};
  box-shadow: ${(props) =>
    !props.top ? "1px 0px 10px 1px rgba(151, 151, 151, 0.25)" : null};
  transition: box-shadow 0.2s ease-out;

  li {
    @media screen and (max-width: 400px) {
      font-size: 12px;
      line-height: 1;
      &:first-child {
        display: none;
      }
    }
    @media screen and (min-width: 401px) and (max-width: 500px) {
      font-size: 14px;
      line-height: 1;
      &:first-child {
        display: none;
      }
    }
    @media screen and (min-width: 501px) and (max-width: 549px) {
      font-size: 14px;
      line-height: 1;
    }
    @media screen and (min-width: 550px) and (max-width: 900px) {
      font-size: 16px;
      line-height: 1;
    }
  }
`;
