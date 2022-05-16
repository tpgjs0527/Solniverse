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
    navigate("/snv-world/nft");
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
              <UserBox>
                <Hello>반갑습니다</Hello>
                <UserName>
                  {userInfo.twitch.id
                    ? userInfo.twitch.displayName
                    : "익명의 솔전사"}
                  님
                </UserName>
                <UserName>랭킹표시 할 자리</UserName>
              </UserBox>
              <UserBox>
                <PointWrapper>
                  <PointTitle>SOL</PointTitle>
                  <PointContent>
                    {isLoadingGetBalance ? (
                      <SpinnerDiv>
                        <Spinner />
                      </SpinnerDiv>
                    ) : (
                      solBalance?.toFixed(2)
                    )}
                  </PointContent>
                </PointWrapper>
                <PointWrapper>
                  <PointTitle>SVN</PointTitle>
                  <PointContent>
                    {isLoadingGetBalance ? (
                      <SpinnerDiv>
                        <Spinner />
                      </SpinnerDiv>
                    ) : (
                      tokenBalance?.toFixed(0)
                    )}
                  </PointContent>
                </PointWrapper>
              </UserBox>
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
  background-color: ${(props) => props.theme.bgColor};
`;
const Hello = styled.div`
  font-size: 14px;
  margin-top: 8px;
`;
const UserBox = styled.div`
  margin-bottom: 16px;
`;
const UserName = styled.div`
  margin-bottom: 4px;
`;
const PointWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const PointTitle = styled.div``;
const PointContent = styled.div`
  white-space: pre-wrap;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  margin: 25px 0px;
  gap: 20px;
  height: 60%;
`;
const Tab = styled.span<{ isActive: boolean }>`
  margin-right: 10px;
  height: 37px;
  padding: 0 17px;
  font-size: 16px;
  font-weight: bold;
  line-height: 37px;
  border-radius: 30px;
  letter-spacing: -0.5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background: ${(props) => props.theme.ownColor};
    color: #ffffff;
  }
  color: ${(props) => (!props.isActive ? props.theme.textColor : `#ffffff`)};
  background-color: ${(props) =>
    props.isActive ? props.theme.ownColor : props.theme.borderColor};
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
