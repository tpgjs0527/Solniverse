import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
interface IDonation {
  // id: number;
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
  // 트윕은 백이 queue처리해줘서 추가적인 event가 있다

  // let A = {
  //   connectCheckTimeout: null,
  //   connectCheckReceived: !1,
  //   config: {},
  //   queue: {
  //     donate: [],
  //   },
  //   queueKey: "queue",
  //   pause: !1,
  //   socket: io(),
  //   queueTimeout: null,
  //   alertTimeout: null,
  //   ts: function () {
  //     // return parseInt(new Date().getTime() / 1000, 10);
  //   },
  //   saveQueue: function () {
  //     // if (!A.config.load_on_reload) return;
  //     try {
  //       localStorage.setItem(A.queueKey, JSON.stringify(A.queue));
  //     } catch (e) {}
  //   },
  //   getQueueLength: function () {
  //     return A.queue.donate.length;
  //   },
  //   shouldPlay: function (type: string, data: any) {
  //     let isMediaDonate = !1;
  //     if (
  //       type === "donate" &&
  //       data &&
  //       data.comment &&
  //       /^\[(audio|yt|twc):(.*?)\]$/.test(data.comment) === !0
  //     ) {
  //       isMediaDonate = !0;
  //     }
  //   },
  //   addQueue: function (type: string, data: any) {
  //     if (A.shouldPlay(type, data) === !1) {
  //       return;
  //     }
  //     let playNow = A.getQueueLength() <= 0;
  //     A.queue[type].push(data);
  //     A.saveQueue();
  //     if (playNow && type !== "media") {
  //       A.processQueue();
  //     }
  //   },
  //   processQueue: function () {
  //     let now = A.queue.donate[0];
  //     if (A.getQueueLength() == 0) {
  //       return;
  //     }
  //     if (A.queueTimeout !== null) {
  //       return;
  //     }
  //     if (A.pause) return;

  //     A.saveQueue();
  //     A.socket?.emit("now", {
  //       type: nowType,
  //       _id: now._id || now.key,
  //     });
  //     A.makeDonateAlert(now);
  //     break;
  //   },
  //   remove: function (type: string, data: any) {
  //     if (A.getQueueLength() === 0) {
  //       return;
  //     }
  //     if (A.queue[type] === undefined || A.queue[type].length < 1) {
  //       return;
  //     }
  //     for (let i = 0; i < A.queue[type].length; ++i) {
  //       if (A.queue[type][i]._id === key) {
  //         A.queue[type].splice(i, 1);
  //         break;
  //       }
  //     }
  //   },
  //   clear: function () {
  //     if (A.alertTimeout !== null) {
  //       clearInterval(A.alertTimeout);
  //       A.alertTimeout = null;
  //     }
  //     if (A.queueTimeout !== null) {
  //       clearTimeout(A.queueTimeout);
  //       A.queueTimeout = null;
  //     }
  //   },
  //   nextQueue: function () {
  //     A.clear();
  //     if (A.getQueueLength() > 0) {
  //       A.processQueue();
  //     }
  //   },
  //   makeDonateAlert: function (data: any) {
  //     if (A.alertTimeout !== null) {
  //       clearInterval(A.alertTimeout);
  //       A.alertTimeout = null;
  //     }
  //     if (A.queueTimeout !== null) {
  //       clearTimeout(A.queueTimeout);
  //       A.queueTimeout = null;
  //     }
  //   },
  //   init: function () {
  //     try {
  //       A.socket = io(
  //         `${process.env.REACT_APP_BASE_URL}/socket.io?userkey=${uuid}`,
  //         { transports: ["websocket", "polling"], reconnection: !0 }
  //       );
  //       A.socket.on("connect", function () {
  //         A.connectCheckReceived = !1;

  //         if (A.connectCheckTimeout !== null) {
  //           clearTimeout(A.connectCheckTimeout);
  //           A.connectCheckTimeout = null;
  //         }
  //         A.connectCheckTimeout = setTimeout(A.connectCheck, 5e3);
  //       });

  //       A.socket.on("disconnect", function (r) {
  //         A.addDebugLine("disconnected");
  //         $("#Connecting").removeClass("hide");
  //         if (A.inited) {
  //           for (let soundId in A.sound) {
  //             A.destroySound(soundId);
  //           }
  //           if (A.followInterval !== null) {
  //             clearInterval(A.followInterval);
  //             A.followInterval = null;
  //           }
  //           A.inited = !1;
  //         }
  //       });

  //       A.socket.on("new donate", function (data) {
  //         if (A.config.donation_enable !== "true") return;
  //         if (AlertBox.exclude.indexOf("D") != -1) return;
  //         if (
  //           A.config.donate_min_alert > 0 &&
  //           data.amount < A.config.donate_min_alert
  //         )
  //           return;
  //         A[data.repeat ? "doRepeat" : "addQueue"]("donate", data);
  //       });
  //     } catch (e) {
  //       setTimeout(function () {
  //         location.reload();
  //       }, 5000);
  //     }
  //   },
  // };
  useEffect(() => {
    const socket = io(`?userKey=${uuid}`, {
      transports: ["websocket", "polling"],
      reconnection: !0,
    });
    socket.on("donation", (data: IDonation) => {
      console.log(data);
      setQueue([
        ...queue,
        {
          // id: data.id,
          displayName: data.displayName,
          message: data.message,
          paymentType: data.paymentType,
          amount: data.amount,
        },
      ]);
      console.log(queue);
      if (queue.length === 1) {
        setStart(true);
      }
    });
    // return () => socket.disconnect();
  }, []);

  // socket.connect();
  // unmount됐을 때, socket연결 끊음
  // useEffect(() => {
  //   return () => socket.disconnect();
  // }, []);

  // useEffect(() => {
  //   let i = 0;
  //   if (queue) {
  //     setInterval(function () {
  //       const donationInfo = queue[i];
  //       console.log(donationInfo);
  //       queue.pop()
  //       // 도네이션 보여주기 내용 바꾸기
  //     }, 5000);
  //   }
  //   // queue에 남은 도네이션 데이터가 없으면 setInterval 멈춰
  //   if (queue.length === 0) {
  //     setStart(false);
  //     clearInterval();
  //   }
  // }, [queue]);

  return (
    <div>
      {queue &&
        queue.map((data, index) => (
          <div key={index}>
            <span>
              {data.displayName}님께서 {data.amount}SOL을 후원하셨습니다.
            </span>
            <span>{data.message}</span>
          </div>
        ))}
    </div>
  );
};
