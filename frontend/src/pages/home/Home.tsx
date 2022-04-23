import { walletAtom } from "atoms";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import base58 from "bs58";
import { getProvider } from "components/PhantomWallet/getProvider";

interface IuserData {
  walletAddress: string;
  signature: string;
}

function Home() {
  const provider = getProvider();
  const [walletAddress, setWalletAddress] = useState("");
  const setWallet = useSetRecoilState(walletAtom);

  // connect시 get 요청 후 반환받은 유저 정보가 없으면 post로 재요청
  const connectWallet = async () => {
    const { solana }: any = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());

      setWalletAddress(response.publicKey.toString());
      try {
        const data = await (
          await fetch(
            `http://localhost:3000/api/auth/connect/${response.publicKey.toString()}`,
            {
              method: "GET",
            }
          )
        ).json();
        console.log("get", data);

        setWallet(data.user.wallet_address);
      } catch (error) {
        const data = await (
          await fetch(
            `http://localhost:3000/api/auth/connect/${response.publicKey.toString()}`,
            {
              method: "POST",
            }
          )
        ).json();
        console.log("POST", response.publicKey.toString());
        console.log(data);

        setWallet(data.user.walletAddress);
      }
    }
  };

  // 서명을 위한 넌스값 받기
  const getSign = async (walletAddress: string) => {
    const res = await (
      await fetch(`http://localhost:3000/api/auth/sign/${walletAddress}`, {
        method: "GET",
      })
    ).json();
    console.log(res);

    const messageBytes = new TextEncoder().encode(res.signMessage);
    const signRes = await provider?.signMessage(messageBytes);
    const signature = base58.encode(signRes.signature);

    console.log(walletAddress);
    const userData: IuserData = {
      walletAddress: walletAddress,
      signature: signature,
    };
    const response = await (
      await fetch(`http://localhost:3000/api/auth/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    ).json();
    console.log(response);
  };

  return (
    <div className="App">
      <div className="container">
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWallet}
        >
          {!walletAddress ? "지갑연결" : "연결완료"}
        </button>
        {walletAddress ? (
          <button onClick={() => getSign(walletAddress)}>연동하기</button>
        ) : null}
      </div>
    </div>
  );
}

export default Home;
