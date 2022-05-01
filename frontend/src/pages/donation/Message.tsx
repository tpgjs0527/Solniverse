import { useParams } from "react-router-dom";
import io from "socket.io-client";
export const Message = () => {
  const params = useParams<{ uuid: string }>();
  const { uuid } = params;

  interface IDonation {
    displayName: string;
    message: string;
    paymentType: string;
    amount: number;
  }
  const socket = io(
    `${process.env.REACT_APP_BASE_URL}/socket.io?userkey=${uuid}`
  );

  socket.on("donation", (data: IDonation) => {
    console.log(data);
  });
  return <div>Message</div>;
};
