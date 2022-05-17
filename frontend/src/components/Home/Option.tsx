import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Option = () => {
  const [top, setTop] = useState(true);
  console.log(top);
  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <WrapperNav top={top}>
      <li>
        <Link to={"/"}>홈</Link>
      </li>

      <li>
        <a href="#shortIntro">서비스 소개</a>
      </li>
      <li>
        <a href="#coreFeatures">차별점</a>
      </li>
      <li>
        <a href="#donationIntro">도네이션 방식</a>
      </li>
      <li>
        <a href="#alertBoxSetting">후원메세지 설정</a>
      </li>
      <li>
        <a href="#sideFeatures">오락요소</a>
      </li>
    </WrapperNav>
  );
};

const WrapperNav = styled.div<{ top: boolean }>`
  width: 100vw;
  padding-bottom: 1.5%;
  position: fixed;
  display: flex;
  z-index: 100;

  padding-top: 1.5%;
  opacity: 0.8;
  padding-right: 10%;
  list-style: none;
  background-color: ${(props) => (!props.top ? "white" : null)};
  box-shadow: ${(props) =>
    !props.top ? "1px 0px 10px 1px rgba(151, 151, 151, 0.25)" : null};
  transition: box-shadow 0.2s ease-out;

  li {
    font-weight: 600;
    font-size: 20px;
    /* box-sizing: border-box; */
    display: inline-block;
    margin-left: 80px;

    @media screen and (max-width: 467px) {
      margin-left: 8px;
      font-size: 15px;
    }
    @media screen and (max-width: 767px) and (min-width: 468px) {
      margin-left: 10px;
      font-size: 20px;
    }
    &:hover {
      color: ${(props) => props.theme.ownColor};
    }
  }
  @media screen and (max-width: 767px) {
    padding-right: 7%;
  }
`;
