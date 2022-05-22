import styled, { keyframes } from "styled-components";

interface IProps {
  isBalance?: boolean;
}

export default function Spinner({ isBalance }: IProps) {
  return <SpinnerSt isBalance={isBalance} />;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerSt = styled.div<{ isBalance?: boolean }>`
  border: ${(props) =>
    props.isBalance
      ? `2px solid ${props.theme.subBoxColor}`
      : `4px solid ${props.theme.subBoxColor}`};
  border-top: ${(props) =>
    props.isBalance
      ? `2px solid ${props.theme.ownColor}`
      : `4px solid ${props.theme.ownColor}`};
  border-radius: 50%;
  width: ${(props) => (props.isBalance ? "15px" : "30px")};
  height: ${(props) => (props.isBalance ? "15px" : "30px")};
  animation: ${spin} 1s linear infinite;
`;
