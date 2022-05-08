import { useEffect, useRef, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import styled, { keyframes } from "styled-components";

export interface IMessage {
  displayName: string;
  message: string;
  paymentType: string;
  amount: number;
}
const URL = process.env.REACT_APP_SOCKET_URL;

export const Message = () => {
  const params = useParams<{ uuid: string }>();
  const { uuid } = params;
  const [queue, setQueue] = useState<IMessage[]>([]);
  const [start, setStart] = useState(true);
  const [test, setTest] = useState([
    {
      displayName: "하이루",
      message: "테스트입니다1",
      paymentType: "sol",
      amount: 0.1,
    },
    {
      displayName: "하이루",
      message: "테스트입니다2",
      paymentType: "sol",
      amount: 0.2,
    },
  ]);
  console.log(test);
  const [visible, setVisible] = useState(false);
  // const refQueue = useRef(test);
  const refQueue = useMemo(() => test, [test]);
  const [message, setMessage] = useState<IMessage>();

  useEffect(() => {
    const socket = io(`${URL}?userKey=${uuid}`, {
      transports: ["websocket", "polling"],
      reconnection: !0,
    });
    socket.connect();
    console.log("socket 연결 완료");
    socket.on("donation", (data: IMessage) => {
      console.log(data);

      setQueue((currentQueue) => [
        ...currentQueue,
        {
          displayName: data.displayName,
          message: data.message,
          paymentType: data.paymentType,
          amount: data.amount,
        },
      ]);

      if (queue.length === 1) {
        setStart(true);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (queue.length) {
      let donation = queue[0];
      setVisible(!true);
      console.log(donation);
      let donate = setInterval(() => {
        setVisible(true);
        // splice는 상태값 변경할 때 잘 안쓴다고 함!
        const newQueue = queue.filter((value, i) => i !== 0);
        setQueue((currentValue) => newQueue);
        clearInterval(donate);
      }, 5000);
      setVisible(!false);
      if (queue.length === 0) {
        setStart(false);
        return;
      }
      console.log(queue);
    }
  }, [queue]);

  useEffect(() => {
    console.log(test);
    if (refQueue.length > 0) {
      setStart(true);
      let donation = refQueue[0];
      setMessage({
        displayName: donation.displayName,
        message: donation.message,
        paymentType: donation.paymentType,
        amount: donation.amount,
      });

      console.log(donation);
      console.log("시작");
      // setVisible(true);
      // splice는 상태값 변경할 때 잘 안쓴다고 함!
      setTimeout(() => {
        setTest(refQueue.filter((value, i) => i !== 0));
        // setVisible(false);
      }, 1000);
    }
    if (refQueue.length === 0) {
      setStart(false);
      return;
    }
    console.log("랜더링");
  }, [refQueue]);

  return (
    <>
      {start && refQueue.length > 0 ? (
        <>
          <Test visible={visible}>{refQueue[0].message}</Test>
          <div>dfdsf</div>
        </>
      ) : null}

      <Test visible={visible}>안녕하세요</Test>
    </>
  );
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  60%{
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  50%{
    opacity: 0.7;
  }
  100% {
    opacity: 0;
  }
`;

const Test = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  color: white;
  font-size: 120px;
  font-weight: 500;
  /* visibility: ${(props) => (props.visible ? "visible" : "hidden")};

  animation: ${(props) => (props.visible ? fadeIn : fadeOut)} 1s ease-out;
  transition: visibility 1.5s ease-out; */
  text-shadow: -2px 0 #000, 0 2px #000, 2px 0 #000, 0 -2px #000;
`;
