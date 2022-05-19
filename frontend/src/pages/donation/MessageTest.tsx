import { Howl } from "howler";
import React, { useEffect, useState } from "react";
import { Money, Name, Test } from "./Message";

export const MessageTest = () => {
  const [start, setStart] = useState(true);
  const [visible, setVisible] = useState(false);
  const sound = {
    donation: new Howl({
      src: [`${process.env.PUBLIC_URL}/sounds/alarm.mp3`],
    }),
  };
  useEffect(() => {
    if (start) {
      let context = new AudioContext();

      context.resume().then(async () => await sound.donation.play());

      setVisible(true);
      sound.donation.play();
      setTimeout(() => {
        setVisible(false);
      }, 3000);
      setTimeout(() => {
        setStart(!start);
        sound.donation.stop();
      }, 7000);
    }
    if (!start) {
      return;
    }
  }, [start]);

  return (
    <div>
      <button onClick={() => setStart(false)}>중지</button>
      <button onClick={() => setStart(true)}>시작</button>
      {start ?? (
        <Test visible={visible}>
          <div>
            <Name>SSAFY 6기</Name>님<Money>66666</Money>SOL 감사합니다!
          </div>
          <div> 기업연계반 사랑해요!</div>
        </Test>
      )}
      MessageTest
    </div>
  );
};
