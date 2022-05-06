import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import styled, { keyframes } from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";
interface IDonation {
  displayName: string;
  message: string;
  paymentType: string;
  amount: number;
}

export const Message = () => {
  const params = useParams<{ uuid: string }>();
  const { uuid } = params;
  const [queue, setQueue] = useState<IDonation[]>([]);
  const [start, setStart] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    AOS.init();
    const socket = io(`https://solniverse.net?userKey=${uuid}`, {
      transports: ["websocket", "polling"],
      reconnection: !0,
    });
    socket.connect();
    console.log("socket 연결 완료");
    socket.on("donation", (data: IDonation) => {
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

      console.log(donation);
      let donate = setInterval(() => {
        setVisible(true);
        // splice는 상태값 변경할 때 잘 안쓴다고 함!
        const newQueue = queue.filter((value, i) => i !== 0);
        setQueue((currentValue) => newQueue);
        clearInterval(donate);
        setStart(false);
      }, 5000);

      if (queue.length === 0) {
        setStart(false);
        return;
      }
      console.log(queue);
    }
  }, [queue]);
  const handleBtn = () => {
    setVisible(!visible);
  };
  // setInterval로 true/false 값바꾸면서 보여줄 예정
  return (
    <>
      <Test visible={visible}>안녕하세요</Test>
      <button onClick={handleBtn}>버튼</button>
    </>
  );
};

const animation = keyframes`
0% {
  opacity: 0;
}
30% {
  opacity: 0.8;
}
50% {
  opacity: 1;
}
60% {
  opacity: 1;
}
70% {
  opacity: 1;
}
80% {
  opacity: 0.8;
}
100% {
  opacity: 0;
}
`;

const Base = styled.div`
  margin: 0 auto;
  padding: 60px 24px 172px;
  max-width: 364px;

  @media screen and (min-width: 1439px) {
    max-width: 1296px;
  }

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  animation: ${animation} 5s;

  font-size: xx-large;
`;

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
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};

  animation: ${(props) => (props.visible ? fadeIn : fadeOut)} 2s ease-out;
  transition: visibility 1.5s ease-out;
  text-shadow: -2px 0 #000, 0 2px #000, 2px 0 #000, 0 -2px #000;
`;
