import { useRecoilState } from "recoil";
import { userInfoAtom } from "atoms";
import Swal from "sweetalert2";
import { getProvider } from "../utils/getProvider";
import { fetchWallet } from "utils/fetcher";
import { useTranslation } from "react-i18next";

function useWallet() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const { t } = useTranslation();
  // phantom wallet extension 가져오기
  const getWallet = async () => {
    const provider = getProvider();

    if (provider) {
      const response = await provider.connect();
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
        const res = await fetchWallet(response.publicKey.toString(), "POST");
        if (res.status >= 200 && res.status < 400) {
          const data = await res.json();
          return data;
        } else {
          const error = new Error(res.statusText);
          console.log(error);
          Swal.fire({
            icon: "error",
            title: t("not-connected"),
            text: t("not-connected-alert"),
            footer: t("go-service-guide"),
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: t("no-wallet"),
        html: t("no-wallet-alert"),
        footer: t("go-service-guide"),
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
        title: t("no-wallet"),
        html: t("no-wallet-alert"),
        footer: t("go-service-guide"),
      });
    }
  };

  return [getWallet, connectWallet];
}

export default useWallet;
