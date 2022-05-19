import styled from "styled-components";
import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";
import { CandyMachine } from "../../utils/candy-machine";
import Spinner from "components/Spinner";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { findAssociatedTokenAddress } from "utils/solanaWeb3";
import Swal from "sweetalert2";

export const CTAButton = styled(Button)`
  width: 150px;
  height: 150px;
  border-radius: 50% !important;
  background-color: ${(props) => props.theme.ownColor} !important;
  color: white !important;
  font-size: 20px !important;
  font-weight: bold !important;
  border: none !important;
  background: hsl(345deg 100% 47%);
  will-change: transform;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  box-shadow: none !important;
  &:hover {
    background: linear-gradient(45deg, #870ff8 20%, #0f3af8 60%, #0ff8ec 95%);
  }
  &:focus {
    background: linear-gradient(45deg, #870ff8 20%, #0f3af8 60%, #0ff8ec 95%);
  }
`;
const Pushable = styled.button`
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    /* transform: translateY(1px); */
    transform: translate(4px, 2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .edge {
    position: absolute;
    top: 0;
    left: 2px;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${(props) => "#283250"};
  }
  &:hover {
    filter: brightness(110%);
    .front {
      transform: translateY(-4px);

      transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }
    .shadow {
      /* transform: translateY(3px); */
      transform: translate(5px, 3px);
      transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }
  }
  &:active {
    .front {
      transform: translateY(-2px);
      transition: transform 34ms;
    }
    .shadow {
      transform: translateY(1px);
      transition: transform 34ms;
    }
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

export const MultiMintButton = ({
  onMint,
  candyMachine,
  isMinting,
  isEnded,
  isActive,
  isSoldOut,
  price,
}: {
  onMint: (quantityString: number) => Promise<void>;
  candyMachine: CandyMachine | undefined;
  isMinting: boolean;
  isEnded: boolean;
  isActive: boolean;
  isSoldOut: boolean;
  price: number;
}) => {
  const userInfo = useRecoilValue(userInfoAtom);
  const connection = new Connection(clusterApiUrl("devnet"));
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [mintCount, setMintCount] = useState(1);
  const [totalCost, setTotalCost] = useState(mintCount * (price + 0.012));
  const [isLoading, setIsLoading] = useState(true);
  const [snvBalance, setSNVBalance] = useState(0);
  const [confirmation, setConfirmation] = useState(false);

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
      onMint(mintCount);
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, mintCount, setMintCount, onMint]);

  function incrementValue() {
    var numericField = document.querySelector(".mint-qty") as HTMLInputElement;
    if (numericField) {
      var value = parseInt(numericField.value);
      if (!isNaN(value) && value < 10) {
        value++;
        numericField.value = "" + value;
        updateAmounts(value);
      }
    }
  }

  function decrementValue() {
    var numericField = document.querySelector(".mint-qty") as HTMLInputElement;
    if (numericField) {
      var value = parseInt(numericField.value);
      if (!isNaN(value) && value > 1) {
        value--;
        numericField.value = "" + value;
        updateAmounts(value);
      }
    }
  }

  function updateMintCount(target: any) {
    var value = parseInt(target.value);
    if (!isNaN(value)) {
      if (value > 10) {
        value = 10;
        target.value = "" + value;
      } else if (value < 1) {
        value = 1;
        target.value = "" + value;
      }
      updateAmounts(value);
    }
  }
  const askMint = async () => {
    if (snvBalance < 500) {
      Swal.fire({
        title: "잔액 부족",
        text: "현재 잔고보다 SNV 토큰이 부족합니다.",
        icon: "warning",
      });
      return;
    }
    if (isSoldOut) {
      Swal.fire({
        title: "뽑기 종료",
        text: "이번 랜덤 뽑기가 종료되었어요ㅠㅠ",
        icon: "info",
      });
    }
    await Swal.fire({
      title: "NFT 랜덤 뽑기",
      text: "랜덤 뽑기하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "뽑기",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        setConfirmation(true);
        return;
      } else {
        setConfirmation(false);
        return;
      }
    });

    setConfirmation(false);
  };

  function updateAmounts(qty: number) {
    setMintCount(qty);
    setTotalCost(Math.round(qty * (price + 0.012) * 1000) / 1000); // 0.012 = approx of account creation fees
  }
  const getAsyncToken = async () => {
    try {
      const snvAddress = await findAssociatedTokenAddress(
        new PublicKey(userInfo.walletAddress),
        new PublicKey(`${process.env.REACT_APP_SNV_TOKEN_ACCOUNT}`)
      );

      const snvResponse = await connection.getTokenAccountBalance(
        new PublicKey(snvAddress)
      );

      const snvAmount = Number(snvResponse?.value?.amount) / 1000000;
      if (snvResponse) {
        setSNVBalance(snvAmount);
      }
    } catch (err) {}
  };
  useEffect(() => {
    getAsyncToken();
    if (snvBalance) {
      setTimeout(async () => {
        if (confirmation) {
          if (
            isActive &&
            candyMachine?.state.gatekeeper &&
            gatewayStatus !== GatewayStatus.ACTIVE &&
            confirmation
          ) {
            setClicked(true);
            await requestGatewayToken();
          } else {
            await onMint(mintCount);
          }
        }
      }, 500);
    }
  }, [snvBalance, confirmation]);
  // useEffect(() => {

  // }, [confirmation]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Pushable>
          <span className="shadow"></span>
          <span className="edge"></span>
          <CTAButton
            className="front"
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
              await askMint();
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
        </Pushable>
      )}
    </>
  );
};
