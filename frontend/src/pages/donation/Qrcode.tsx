import { useEffect, useState } from "react";
import Modal from "react-modal";
// import { Modal } from "react-responsive-modal";
import ReactDOM from "react-dom";
import { createQR, encodeURL } from "@solana/pay";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import QRCodeStyling from "qr-code-styling";
import styled from "styled-components";
import App from "App";
import Payment from "./Payment";
import { BrowserView, isMobile, MobileView } from "react-device-detect";

interface IPayment {
  open: any;
  onClose: Function;
  params: {
    amount: string | null;
    nickName: string | null;
    message: string | null;
  };
}

function Qrcode({ open, onClose, params }: IPayment) {
  const [modalIsOpen, setModalIsOpen] = useState(open);
  const [makeQR, setMakeQR] = useState({});
  const [modalStyle, setModalStyle] = useState({});
  const mobileStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "300px",
      height: "600px",
      backgroundColor: "#eeeeee",
    },
  };
  const desktopStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "700px",
      height: "600px",
      backgroundColor: "#eeeeee",
    },
  };

  const main = async () => {
    let paymentStatus: string;

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // 이 부분은 이제 결제 진행할 때 스트리머의 지갑 주소가 들어가야 한다.
    const recipient = new PublicKey(
      "RpigkMduJPjCobrBJXaK68kRLGTJ3UbEwxRgFDADFNC"
    );
    const label = `후원자가 후원하는 스트리머 이름`;
    const message = `스트리머가 남기는 메시지 or 우리 서비스가 주는 메시지`;
    const memo = `${params.message}`;
    // 해당 안의 숫자도 사용자가 보내는 값으로 입력해서 보내기
    const amount = new BigNumber(Number(`${params.amount}`));
    // 이 안의 값은 우리가 실제로 운영하는 서비스 지갑 주소가 들어간다.(추적용)
    const reference = new PublicKey(
      "FTvDSffKvWaL8hdhATY1sxgZKVg6LZwxtDS86JHuL6Fd"
    );

    const url = encodeURL({
      recipient,
      amount,
      reference,
      label,
      message,
      memo,
    });

    const qrCode = createQR(url);
    const QrCode = new QRCodeStyling({
      width: 210,
      height: 210,
      type: "canvas",
      data: `${qrCode._options.data}`,
      image: `${process.env.PUBLIC_URL}/솔라나.png`,
      dotsOptions: {
        // color: "#4267b2",
        gradient: {
          type: "linear",
          rotation: 90,
          colorStops: [
            { offset: 0, color: "#00ff55" },
            { offset: 1, color: "#7808f8" },
          ],
        },
        type: "extra-rounded",
      },
      backgroundOptions: {
        color: "#e9ebee",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,
      },
    });
    const element = document.getElementById("qr-code");
    QrCode.append(element!);
    // console.log(QrCode);
    // console.log(typeof QrCode._container);
    setMakeQR(QrCode);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    onClose();
  };
  const onClick = () => {
    main();
  };
  useEffect(() => {
    setTimeout(() => main(), 100);
  }, []);
  return (
    <Container>
      <BrowserView>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => closeModal()}
          style={desktopStyle}
        >
          {/* <Modal open={modalIsOpen} onClose={() => closeModal()} center> */}
          <Container>
            <TitleWrapper
              style={{ backgroundColor: "#eeeeee", padding: "4px" }}
            >
              <PageName>Phantom Wallet 결제</PageName>
              <OurLogo>
                <SVGLogo />
                Solniverse
              </OurLogo>
            </TitleWrapper>
            <Wrapper>
              <ManualWrapper>
                <ManualName>Phantom wallet 결제 방법</ManualName>
                <ManualSeries>
                  <ManualNumber>1️⃣</ManualNumber>
                  <ManualContent>Phantom Wallet 앱 실행</ManualContent>
                </ManualSeries>
                <ManualSeries>
                  <ManualNumber>2️⃣</ManualNumber>
                  <ManualContent>
                    측 상단 QR코드 메뉴 선택 후 오른쪽의 QR코드를 스캔하세요.
                  </ManualContent>
                </ManualSeries>
                <ManualSeries>
                  <ManualNumber>3️⃣</ManualNumber>
                  <ManualContent>
                    이후 표시된 전송 정보를 확인 후 보내기 버튼 클릭
                  </ManualContent>
                </ManualSeries>
              </ManualWrapper>
              <QRWrapper>
                <QRCodeName>QR코드</QRCodeName>
                <QRCodeWrapper>
                  <QRCode id="qr-code"></QRCode>
                </QRCodeWrapper>
              </QRWrapper>
            </Wrapper>
            <Wrapper>
              <NoWalletGuide>
                스마트폰으로 쉽고 편리하게 결제할 수 있는 Phantom Wallet 앱을
                설치하세요!
              </NoWalletGuide>
              <WalletInstall>
                <WalletBtn>설치하기</WalletBtn>
              </WalletInstall>
            </Wrapper>
            <CloseBtn onClick={closeModal}>닫기</CloseBtn>
          </Container>
        </Modal>
      </BrowserView>
    </Container>
  );
}

const Container = styled.div``;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.boxColor};
  margin-bottom: 8px;
  border-radius: 5px;
  padding: 4px;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.boxColor};
  margin-bottom: 16px;
  border-radius: 5px;
  padding: 16px;
  @media screen and (max-width: 691px) {
    display: flex;
    justify-content: center;
  }
`;
const PageName = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
const SVGLogo = styled.img.attrs({
  src: `${process.env.PUBLIC_URL}/solanasvg.svg`,
})`
  width: 15px;
  height: 15px;
  margin-right: 2px;
`;
const OurLogo = styled.div`
  display: flex;
  align-items: center;
`;
const ManualWrapper = styled.div`
  width: 55%;
  margin-right: 8px;
  @media screen and (max-width: 691px) {
    display: none;
  }
`;
const ManualName = styled.div`
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 16px;
`;
const ManualSeries = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
`;
const ManualNumber = styled.div`
  margin-right: 8px;
`;
const ManualContent = styled.div``;
const QRWrapper = styled.div`
  width: 45%;
  /* display: flex;
  justify-content: center; */
  text-align: center;
  background-color: ${(props) => props.theme.subBoxColor};
  border-radius: 6px;
`;
const QRCodeName = styled.div`
  padding: 8px;
  font-weight: bold;
`;
const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const QRCode = styled.div`
  width: 90%;
  height: 90%;
  background-color: ${(props) => props.theme.boxColor};
  padding: 10px;
  margin-bottom: 10px;
`;

const NoWalletWrapper = styled.div``;
const NoWalletGuide = styled.div`
  width: 65%;
  font-size: 14px;
`;
const WalletInstall = styled.div`
  width: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const WalletBtn = styled.button`
  background-color: ${(props) => props.theme.ownColor};
  width: 70%;
  height: 30px;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const CloseBtn = styled.button``;

// Modal.setAppElement("#root");

export default Qrcode;
