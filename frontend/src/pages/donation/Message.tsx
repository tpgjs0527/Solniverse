import { useSocket } from "hooks/useSocket";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Howl, Howler } from "howler";
export interface IMessage {
  displayName: string;
  message: string;
  paymentType: string;
  amount: number;
}

export const Message = () => {
  Howler.autoUnlock = false;
  const params = useParams<{ uuid: string }>();
  const { uuid } = params;
  const [queue, setQueue] = useState<IMessage[]>([]);
  const [start, setStart] = useState(true);
  const [visible, setVisible] = useState(false);
  const refQueue = useMemo(() => queue, [queue]);
  const [socket, disconnectSocket] = useSocket(uuid);

  const sound = {
    donation: new Howl({
      src: [`${process.env.PUBLIC_URL}/sounds/alarm.mp3`],
    }),
  };

  useEffect(() => {
    return () => {
      console.log("disconnect socket", uuid);
      disconnectSocket();
    };
  }, [disconnectSocket, uuid]);

  useEffect(() => {
    socket?.on("donation", (data: IMessage) => {
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
  }, [socket]);

  useEffect(() => {
    if (refQueue.length > 0) {
      let context = new AudioContext();
      // 크롬에서 자동재생을 막기 때문에, 참고(https://developer.chrome.com/blog/autoplay/) resume() 호출하도록 해야함
      context
        .resume()
        .then(() => sound.donation.play())
        .catch((error) => console.log(error));

      setStart(true);
      setVisible(true);
      sound.donation.play();
      setTimeout(() => {
        setVisible(false);
      }, 3000);
      setTimeout(() => {
        setQueue(refQueue.filter((value, i) => i !== 0));
        sound.donation.stop();
      }, 7000);
    }
    if (refQueue.length === 0) {
      setStart(false);

      return;
    }
  }, [refQueue]);

  return (
    <>
      {start && refQueue.length > 0 ? (
        <Test visible={visible}>
          <div>
            <Name>{refQueue[0].displayName}</Name>님
            <Money>
              {refQueue[0].amount}
              {refQueue[0].paymentType}
            </Money>
            감사합니다!
          </div>
          <div>{refQueue[0].message}</div>
        </Test>
      ) : null}
    </>
  );
};

const fadeIn = keyframes`
from {

    opacity: 0;
  }

  to {
    
    opacity: 1;
  }
`;

const fadeOut = keyframes`
from {

    opacity: 1;
  }

  to {
    
    opacity: 0;
  }
`;

export const Test = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  color: white;
  font-size: 70px;
  font-weight: 500;
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  animation: ${(props) => (props.visible ? fadeIn : fadeOut)} 3s ease-out;
  transition: visibility 1.5s ease-out;
  text-shadow: -2px 0 #000, 0 2px #000, 2px 0 #000, 0 -2px #000;
`;
export const Name = styled.span`
  color: ${(props) => props.theme.ownColor};
`;
export const Money = styled(Name)`
  margin-left: 20px;
  margin-right: 30px;
`;
