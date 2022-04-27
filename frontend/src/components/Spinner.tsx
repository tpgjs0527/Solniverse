import styled, { keyframes } from "styled-components";

export default function Spinner() {
  return <SpinnerSt />;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerSt = styled.div`
  border: 4px solid ${(props) => props.theme.subBoxColor};
  border-top: 4px solid ${(props) => props.theme.ownColor};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spin} 1s linear infinite;
`;
