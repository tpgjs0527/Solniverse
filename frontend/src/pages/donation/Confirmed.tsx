import { clusterApiUrl, Connection } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import interpolate from "color-interpolate";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import styled, { keyframes } from "styled-components";

// interface IState {
//   state: { signature: string };
// }
type Confirmations =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32;

function Confirmed() {
  const { state }: any = useLocation();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const requiredConfirmations = 32;
  const [confirmations, setConfirmations] = useState<Confirmations>(0);
  const [status, setStatus] = useState("Confirmed");
  const [isBlocking, setIsBlocking] = useState(false);
  const progress = useMemo(
    () => confirmations / requiredConfirmations,
    [confirmations, requiredConfirmations]
  );
  const [value, text] = useMemo(() => {
    switch (status) {
      case "Finalized":
        return [1, "Completed"];
      // case "Confirmed":
      //   return progress >= 1
      //     ? [1, "Complete"]
      //     : [progress, Math.floor(progress * 100) + "%"];
      default:
        return [0, "Donating..."];
    }
  }, [status, progress]);
  const interpolated = useMemo(
    () => interpolate(["#8752f3", "#5497d5", "#43b4ca", "#28e0b9", "#19fb9b"]),
    []
  );
  const styles = useMemo(
    () =>
      buildStyles({
        pathTransitionDuration: 2.0,
        pathColor: interpolated(value),
        trailColor: "rgba(0,0,0,.1)",
      }),
    [interpolated, value]
  );

  useEffect(() => {
    if (state) {
      const interval = setInterval(async () => {
        try {
          const response = await connection.getSignatureStatus(state.signature);
          // console.log(response);
          const status = response.value;
          if (status) {
            const confirmation = (status.confirmations || 0) as Confirmations;
            setConfirmations(confirmation);
            if (
              confirmation >= requiredConfirmations ||
              status.confirmationStatus === "finalized"
            ) {
              clearInterval(interval);
              setStatus("Finalized");
            }
          }
        } catch (error: any) {
          console.log(error);
        }
      }, 1000);
    }
  }, [state]);
  // 뒤로 가기 방지 코드
  useEffect(() => {
    const preventGoBack = () => {
      window.history.pushState(null, "", window.location.href);
      if (status === "Finalized") {
        alert("이미 결제 완료된 도네이션입니다.");
      } else {
        alert("결제 중인 도네이션입니다.");
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, [status]);

  return (
    <Container>
      <Wrapper>
        <ProgressWrapper>
          {text === "Donating..." ? (
            <>
              <SpinnerSt />
              <ProgressText>{text}</ProgressText>
            </>
          ) : (
            <>
              <CircularProgressbar maxValue={1} value={value} styles={styles} />
              <ProgressText>{text}</ProgressText>
            </>
          )}
        </ProgressWrapper>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const ProgressWrapper = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  @media screen and (max-width: 691px) {
    width: 150px;
    height: 150px;
  }
`;
const ProgressText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: bold;
`;
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerSt = styled.div`
  border: 10px solid ${(props) => props.theme.subBoxColor};
  border-top: 10px solid ${(props) => props.theme.ownColor};
  border-radius: 50%;
  width: 300px;
  height: 300px;
  animation: ${spin} 1s linear infinite;
  @media screen and (max-width: 691px) {
    width: 150px;
    height: 150px;
  }
`;

export default Confirmed;
