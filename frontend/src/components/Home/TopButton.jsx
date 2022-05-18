import React from "react";
import styled from "styled-components";
import { BsFillHandIndexThumbFill } from "react-icons/bs";
export const TopButton = () => {
  function TopEvent() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("topButton").style.visibility = "visible";
    } else {
      document.getElementById("topButton").style.visibility = "hidden";
    }
  }
  window.onscroll = function () {
    scrollFunction();
  };
  window.onload = function () {
    scrollFunction();
  };
  return (
    <Top onClick={TopEvent} id="topButton" title="Go to top">
      <BsFillHandIndexThumbFill />
    </Top>
  );
};

const Top = styled.button`
  visibility: hidden;
  opacity: 0.8;
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 100;
  border: none;
  outline: none;
  background-color: ${(props) => props.theme.ownColor};
  color: black;
  cursor: pointer;
  padding: 15px;
  border-radius: 15px;
  font-size: 25px;
  :hover {
    transition: all ease-in-out 0.2s;
    background-color: ${(props) => props.theme.ownColorHover};
    color: white;
  }
`;
