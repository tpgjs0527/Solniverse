import styled from "styled-components";

export interface ThreeLayersCircleProps {
  baseColor: string;
  secondColor: string;
}

const ThreeLayersCircle = styled.div<ThreeLayersCircleProps>`
  position: relative;
  display: inline-block;
  opacity: 0.8;
  width: 2rem;
  height: 2rem;
  border-radius: 100rem;
  background: rgb(${(p) => p.baseColor});
  z-index: 0;
  transition: background 0.2s;

  &:after,
  &:before {
    content: "";
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100rem;
    z-index: -1;
  }

  &:after {
    width: 2.5rem;
    height: 2.5rem;
    background: rgb(${(p) => p.secondColor});
    z-index: -2;
  }

  &:before {
    width: 1.5rem;
    height: 1.5rem;
    background: rgb(${(p) => p.baseColor});
  }
`;

export default ThreeLayersCircle;
