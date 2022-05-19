import styled from "styled-components";
import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";
import { CandyMachine } from "../../utils/candy-machine";
import Spinner from "components/Spinner";

export const CTAButton = styled(Button)`
  display: block !important;
  margin: 0 auto !important;
  background-color: var(--title-text-color) !important;
  min-width: 120px !important;
  height: 300px;
  border-radius: 50%;
  font-size: 1em !important;
`;

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
  isEnded,
  isActive,
  isSoldOut,
}: {
  onMint: (quantityString: number) => Promise<void>;
  candyMachine: CandyMachine | undefined;
  isMinting: boolean;
  isEnded: boolean;
  isActive: boolean;
  isSoldOut: boolean;
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (candyMachine) {
      setIsLoading(false);
    }
    setIsVerifying(false);
    if (
      gatewayStatus === GatewayStatus.COLLECTING_USER_INFORMATION &&
      clicked
    ) {
      // when user approves wallet verification txn
      setIsVerifying(true);
    } else if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      console.log("Verified human, now minting...");
      onMint(1);
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <CTAButton
          disabled={
            clicked ||
            candyMachine?.state.isSoldOut ||
            isSoldOut ||
            isMinting ||
            isEnded ||
            !isActive ||
            isVerifying
          }
          onClick={async () => {
            if (
              isActive &&
              candyMachine?.state.gatekeeper &&
              gatewayStatus !== GatewayStatus.ACTIVE
            ) {
              console.log("Requesting gateway token");
              setClicked(true);
              await requestGatewayToken();
            } else {
              console.log("Minting...");
              await onMint(1);
            }
          }}
          variant="contained"
        >
          {!candyMachine ? (
            "연결중..."
          ) : candyMachine?.state.isSoldOut || isSoldOut ? (
            "뽑기 종료"
          ) : isActive ? (
            isVerifying ? (
              "확인중..."
            ) : isMinting || clicked ? (
              <CircularProgress />
            ) : (
              `뽑기`
            )
          ) : isEnded ? (
            "뽑기 종료"
          ) : candyMachine?.state.goLiveDate ? (
            "곧 시작"
          ) : (
            "불가능"
          )}
        </CTAButton>
      )}
    </>
  );
};
