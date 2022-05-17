import { userInfoAtom } from "atoms";
import Layout from "components/Layout";
import Spinner from "components/Spinner";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getBalance } from "utils/solanaWeb3";
import { Route, Routes, useMatch, useNavigate } from "react-router-dom";
import CandyDrop from "pages/nft/CandyDrop";
import Other from "pages/nft/Other";
import CandyMachineHome from "pages/candyMachine/CandyMachineHome";
import axios from "axios";
import confetti from "canvas-confetti";
import Rank from "components/Main/Rank";

function SNVWorld() {
  const userInfo = useRecoilValue(userInfoAtom);
  const navigate = useNavigate();
  const tokenAddress = "9UGMFdqeQbNqu488mKYzsAwBu6P2gLJnsFeQZ29cGSEw";
  const [solBalance, setSolBalance] = useState<number>();
  const [tokenBalance, setTokenBalance] = useState<number>();
  const [isLoadingGetBalance, setIsLoadingGetBalance] = useState(true);
  // const publicKey = new PublicKey(userInfo.walletAddress);
  const nftMatch = useMatch("/snv-world/nft");
  const otherMatch = useMatch("/snv-world/other");
  // const solBalance = getBalance(userInfo.walletAddress);
  const getAsyncSol = async () => {
    const sol = await getBalance(userInfo.walletAddress);
    setSolBalance(Number(sol));
  };

  const onNFT = () => {
    navigate("/snv-world");
  };

  const onOther = () => {
    navigate("/snv-world/Other");
  };

  const getTokenBalance = async (
    walletAddress: string,
    tokenMintAddress: string
  ) => {
    const response = await axios({
      url: `https://api.devnet.solana.com`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress,
          {
            mint: tokenMintAddress,
          },
          {
            encoding: "jsonParsed",
          },
        ],
      },
    });
    console.log(response);
    if (
      Array.isArray(response?.data?.result?.value) &&
      response?.data?.result?.value?.length > 0 &&
      response?.data?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount
        ?.amount > 0
    ) {
      setTokenBalance(
        Number(
          response?.data?.result?.value[0]?.account?.data?.parsed?.info
            ?.tokenAmount?.amount
        ) / 1000000
      );
    } else {
      setTokenBalance(0);
    }
  };

  // const getToken = async () => {
  //   if (publicKey) {
  //     const mint = new PublicKey("");
  //     const signer = new Keypair().from;

  //     const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
  //       connection,
  //       publicKey,
  //       mint,
  //       publicKey,
  //       signTransaction
  //     );
  //   }
  // };

  useEffect(() => {
    getAsyncSol();
    getTokenBalance(userInfo.walletAddress, tokenAddress);
    if (solBalance && tokenBalance) {
      setIsLoadingGetBalance(false);
    }
  }, [solBalance, tokenBalance]);

  return (
    <Layout>
      <Container>
        <Title>SNV World</Title>
        <Section>
          <Wrapper>
            <UserWrapper>
              <UserBox style={{ display: "flex" }}>
                <UserImageWrapper>
                  <UserImage src={userInfo.twitch.profileImageUrl} />
                </UserImageWrapper>
                <UserInfoWrapper>
                  <Hello>반갑습니다</Hello>
                  <UserName>
                    {userInfo.twitch.id
                      ? userInfo.twitch.displayName
                      : "익명의 솔전사"}
                    님
                  </UserName>
                </UserInfoWrapper>
              </UserBox>
              <RankingBox>
                <UserName>랭킹표시 할 자리</UserName>
              </RankingBox>
              <Hr />
              <PointBox>
                <UserTitle>Your Balance</UserTitle>
                <PointWrapper>
                  <PointInfoWrapper>
                    <PointImage src={`${process.env.PUBLIC_URL}/솔라나.png`} />
                    <PointTitle>SOL</PointTitle>
                  </PointInfoWrapper>
                  <PointInfoWrapper>
                    <PointContent>
                      {isLoadingGetBalance ? (
                        <SpinnerDiv>
                          <Spinner />
                        </SpinnerDiv>
                      ) : (
                        solBalance?.toFixed(2)
                      )}
                    </PointContent>
                  </PointInfoWrapper>
                </PointWrapper>
                <PointWrapper>
                  <PointInfoWrapper>
                    <PointImage src={`${process.env.PUBLIC_URL}/SNV토큰.png`} />
                    <PointTitle>SNV</PointTitle>
                  </PointInfoWrapper>
                  <PointInfoWrapper>
                    <PointContent>
                      {isLoadingGetBalance ? (
                        <SpinnerDiv>
                          <Spinner />
                        </SpinnerDiv>
                      ) : (
                        tokenBalance?.toFixed(2)
                      )}
                    </PointContent>
                  </PointInfoWrapper>
                </PointWrapper>
              </PointBox>
            </UserWrapper>

            <Tabs>
              <Tab isActive={nftMatch !== null} onClick={onNFT}>
                Candy Drop
              </Tab>
              <Tab isActive={otherMatch !== null} onClick={onOther}>
                Other
              </Tab>
            </Tabs>
          </Wrapper>
          <NFTWrapper>
            <NFTBox>
              <Routes>
                <Route path="" element={<CandyMachineHome />} />
                <Route path="other" element={<Other />} />
              </Routes>
            </NFTBox>
            <NFTBox>
              <NFTTitle></NFTTitle>
            </NFTBox>
            <NFTBox>
              <NFTContent></NFTContent>
            </NFTBox>
          </NFTWrapper>
        </Section>
      </Container>
    </Layout>
  );
}

const Container = styled.div``;
const Section = styled.div`
  display: flex;
  padding-top: 12px;
`;

const Title = styled.div`
  padding-top: 48px;
  font-size: 30px;
  line-height: 40px;
  font-weight: 700;
`;

const Wrapper = styled.div`
  padding: 8px;
  width: 20%;
  height: 100%;
  @media screen and (max-width: 691px) {
    margin-bottom: 12px;
    width: 100%;
  }
`;
const SpinnerDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
  height: 100%;
`;
const UserWrapper = styled.div`
  height: 40%;
  padding: 16px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.boxColor};
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22) !important;
`;
const Hello = styled.div`
  font-size: 14px;
  margin-top: 8px;
`;
const UserBox = styled.div`
  padding: 8px 8px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.subBoxColor};
  margin-bottom: 12px;
`;
const RankingBox = styled(UserBox)`
  background-color: ${(props) => props.theme.boxColor};
`;
const PointBox = styled(UserBox)`
  background-color: ${(props) => props.theme.boxColor};
  padding: 0px;
`;
const Hr = styled.hr`
  background-color: ${(props) => props.theme.borderColor};
`;
const UserTitle = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;
const UserImageWrapper = styled.div``;
const UserImage = styled.img`
  width: 50px;
  border-radius: 30px;
  margin-right: 8px;
`;
const UserInfoWrapper = styled.div``;
const UserName = styled.div`
  margin-bottom: 4px;
  white-space: pre-wrap;
`;
const PointWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.subBoxColor};
  margin-bottom: 8px;
`;
const PointInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const PointImage = styled.img`
  width: 30px;
  margin-right: 4px;
`;
const PointTitle = styled.div``;
const PointContent = styled.div`
  white-space: pre-wrap;
  font-weight: bold;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  margin: 32px 0px;
  gap: 20px;
  height: 60%;
`;
const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  height: 45px;
  padding: 0 17px;
  font-size: 18px;
  font-weight: bold;
  line-height: 37px;
  border-radius: 30px;
  letter-spacing: -0.5px;
  cursor: pointer;
  text-align: center;
  background-color: ${(props) => props.theme.subTextColor};
  color: #ffffff;
  &:hover {
    background: linear-gradient(45deg, #870ff8 20%, #0f3af8 60%, #0ff8ec 95%);
  }
`;
const NFTWrapper = styled.div`
  width: 70%;
  margin-left: 32px;
`;
const NFTBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  @media screen and (max-width: 691px) {
    width: 30%;
    height: auto;
  }
`;
const NFTTitle = styled.div``;
const NFTContent = styled.div``;

export default SNVWorld;
