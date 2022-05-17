import { useRecoilState } from "recoil";
import { userInfoAtom } from "atoms";
import Swal from "sweetalert2";
import { getProvider } from "../utils/getProvider";
import { fetchWallet } from "utils/fetcher";

function useWallet() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  // phantom wallet extension 가져오기
  const getWallet = async () => {
    const provider = getProvider();

    if (provider) {
      const response = await provider.connect();
      // console.log(response);

      try {
        const res = await fetchWallet(response.publicKey.toString());
        if (res.status >= 200 && res.status < 400) {
          const data = await res.json();
          return data;
        } else {
          const error = new Error(res.statusText);
          throw error;
        }
      } catch (error) {
        // console.log(error);
        const res = await fetchWallet(response.publicKey.toString(), "POST");
        if (res.status >= 200 && res.status < 400) {
          const data = await res.json();
          // console.log(data);
          return data;
        } else {
          const error = new Error(res.statusText);
          // console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There is not wallet address! Please reconnect your wallet 😊",
            footer: '<a href="/service">Go Service Page</a>',
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There is not wallet address! Please check your wallet program😊",
        footer: '<a href="/service">Go Service Page</a>',
      });
    }
  };

  // phantom wallet extension 연결
  const connectWallet = async () => {
    const data = await getWallet();
    if (data.result === "success") {
      if (data.user.twitch) {
        setUserInfo({
          twitch: {
            id: data.user.twitch.id,
            displayName: data.user.twitch.displayName,
            profileImageUrl: data.user.twitch.profileImageUrl,
          },
          walletAddress: data.user.walletAddress,
          createdAt: data.user.createdAt,
        });
      } else {
        setUserInfo({
          ...userInfo,
          walletAddress: data.user.walletAddress,
          createdAt: data.user.createdAt,
        });
      }
    } else {
      return Swal.fire({
        icon: "error",
        title: "Connect issue!",
        text: "  The wallet is not found.  Please check the wallet program!",
        footer: '<a href="/service">Go Service Page</a>',
      });
    }
  };

  return [getWallet, connectWallet];
}

export default useWallet;
