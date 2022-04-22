import { walletAtom } from "atoms";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { PublicKey } from "@solana/web3.js";
import base58 from "bs58";

type DisplayEncoding = "utf8" | "hex";
type PhantomRequestMethod = "signMessage";

// const fetcher = async() => {}
// const {data, isLoading} = useQuery(`Key`, fetcher)
// useEffect(()=> {},[data]) 갱신해서 atom에 저장
interface PhantomProvider {
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;

  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const anyWindow: any = window;
    const provider = anyWindow.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

function Home() {
  const provider = getProvider();
  const { solana }: any = window;

  const [walletAddress, setWalletAddress] = useState("");
  const setWallet = useSetRecoilState(walletAtom);

  const checkIfWalletIsConnected = async () => {
    try {
      if (solana) {
        if (solana.isPhantom) {
          console.log("팬텀 지갑 발견!");
          // onlyIfTrusted : true
          // 유저가 지갑을 이미 연결했을 때
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("퍼블릭키랑 함께 연결!", response.publicKey.toString());

          const data = await (
            await fetch(
              `http://localhost:3000/api/auth/connect/${response.publicKey.toString()}`,
              {
                method: "GET",
              }
            )
          ).json();
          console.log(data);
          setWallet({
            twitch: "",
            wallet_address: data.user.wallet_address,
            created_at: data.user.created_at,
          });
          console.log(walletAtom);
          getSign(response.publicKey.toString());
        }
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 유저가 아직 지갑 연결을 안했을 때 함수 실행
  // connect시 get 요청 후 반환받은 유저 정보가 없으면 post로 재요청
  const connectWallet = async () => {
    const { solana }: any = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());

      setWalletAddress(response.publicKey.toString());
      console.log(document.cookie);

      const data = await (
        await fetch(
          `http://localhost:3000/api/auth/connect/${response.publicKey.toString()}`,
          {
            method: "GET",
          }
        )
      ).json();
      console.log(data);

      setWallet({
        twitch: "",
        wallet_address: data.user.wallet_address,
        created_at: data.user.created_at,
      });

      getSign(response.publicKey.toString());
    }
  };
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    // 팬텀 확장프로그램 없으면 리턴
    if (!provider) return;
    // 컴포넌트가 mount 될 때, onLoad 실행하고, unmount 될 때만 사용하기 위해, []를 넘기고 return으로 removeEventListener
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);
  // 서명을 위한 넌스값 받기
  const getSign = async (walletAddress: string) => {
    const nonce = await (
      await fetch(`http://localhost:3000/api/auth/nonce/${walletAddress}`, {
        method: "GET",
      })
    ).json();
    console.log(nonce.nonce);
    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce.nonce}`;
    const messageBytes = new TextEncoder().encode(message);
    // console.log(messageBytes);
    const res = await provider?.signMessage(messageBytes);
    console.log(JSON.stringify(res));
    console.log(base58.encode(res.signature));
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
        {walletAddress ? <button>연동하기</button> : null}
      </div>
    </div>
  );
}

export default Home;
