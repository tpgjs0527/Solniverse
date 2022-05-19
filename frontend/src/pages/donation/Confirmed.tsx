import { clusterApiUrl, Connection } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import interpolate from "color-interpolate";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import styled, { keyframes } from "styled-components";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { Snackbar } from "@material-ui/core";
import { AlertState } from "utils/candy-machine-utils";
import { Alert } from "@material-ui/lab";

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
  const navigate = useNavigate();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const requiredConfirmations = 32;
  const [confirmations, setConfirmations] = useState<Confirmations>(0);
  const [status, setStatus] = useState("Confirmed");
  const [isBlocking, setIsBlocking] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
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
          //
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
        } catch (error: any) {}
      }, 1000);
    }
  }, [state]);
  // 뒤로 가기 방지 코드
  useEffect(() => {
    if (status === "Finalized") {
      confetti({
        particleCount: 1000,
        spread: 100,
        origin: { y: 0.7, x: 0.5 },
      });
      setAlertState({
        open: true,
        message: "결제가 완료됐습니다.",
        severity: "success",
      });
      setTimeout(() => {
        setAlertState({
          ...alertState,
          open: false,
        });
      }, 3000);
      if (!alertState.open) {
        setTimeout(() => {
          setAlertState({
            open: true,
            message: "SNV 토큰이 발급됐습니다.",
            severity: "success",
          });
        }, 4000);
      }
    }
    const preventGoBack = () => {
      window.history.pushState(null, "", window.location.href);
      if (status === "Finalized") {
        Swal.fire(
          "도네이션 성공",
          "이미 결제 완료한 도네이션 입니다!",
          "success"
        );
      } else {
        Swal.fire({
          title: "도네이션 진행 중",
          html: "현재 도네이션 중입니다!",
          timerProgressBar: true,
        });
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
        {text === "Donating..." ? (
          <>
            <ProgressWrapper>
              <SpinnerSt />
              <ProgressText>{text}</ProgressText>
            </ProgressWrapper>
          </>
        ) : (
          <>
            <ProgressWrapper>
              <CircularProgressbar maxValue={1} value={value} styles={styles} />
              <ProgressText>{text}</ProgressText>

              <SnackBar
                open={alertState.open}
                autoHideDuration={5000}
                onClose={() => setAlertState({ ...alertState, open: false })}
              >
                <Alert
                  onClose={() => setAlertState({ ...alertState, open: false })}
                  severity={alertState.severity}
                >
                  {alertState.message}
                </Alert>
              </SnackBar>
            </ProgressWrapper>
            <HomeBtn onClick={() => navigate("/")}>Home</HomeBtn>
          </>
        )}
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const ProgressWrapper = styled.div`
  width: 300px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media screen and (max-width: 691px) {
    width: 200px;
    height: 200px;
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
const HomeBtn = styled.button`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 40px;
  color: #ffffff;
  background-color: ${(props) => props.theme.ownColor};
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: linear-gradient(45deg, #870ff8 0%, #0f3af8 60%, #0ff8ec 100%);
  }
  @media screen and (max-width: 691px) {
    width: 80px;
    top: 70%;
    height: 30px;
    font-size: 14px;
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
    width: 200px;
    height: 200px;
  }
`;

const SnackBar = styled(Snackbar)`
  position: absolute !important;
  top: 40% !important;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  @media screen and (max-width: 691px) {
    position: relative !important;
    margin-top: 32px;
    margin-left: 90px;
  }
`;

export default Confirmed;
