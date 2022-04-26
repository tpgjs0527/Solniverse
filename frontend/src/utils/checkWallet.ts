import { getProvider } from "./getProvider";

// 현재 브라우저에 지갑이 이미 연결되어있으면 바로 지갑 주소 받아서 요청에 대한 리턴값 반환

export const checkWallet = async () => {
  const provider = getProvider();

  // provider가 undefined면 팬텀지갑 공식홈페이지로 이동
  if (provider) {
    console.log("지갑찾음");
    const response = await provider.connect({ onlyIfTrusted: true });

    console.log("지갑연결", response.publicKey.toString());

    try {
      const data = await (
        await fetch(
          `${
            process.env.REACT_APP_BASE_URL
          }/auth/connect/${response.publicKey.toString()}`,
          {
            method: "GET",
          }
        )
      ).json();
      console.log("get", data);
      return data;
    } catch (error) {
      const data = await (
        await fetch(
          `${
            process.env.REACT_APP_BASE_URL
          }/auth/connect/${response.publicKey.toString()}`,
          {
            method: "POST",
          }
        )
      ).json();
      console.log("post", data);
      return data;
    }
  }
};
