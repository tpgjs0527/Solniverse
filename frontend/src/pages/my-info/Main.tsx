import { userInfoAtom } from "atoms";
import Layout from "components/Layout";
import Dashboard from "components/Main/Dashboard";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { fetchReceiveDashboard, fetchSendDashboard } from "utils/fetcher";

interface ISend {
  sendCount: number;
  sendTotal: number;
  sendRank: string;
  ranking: number;
}

interface IReceive {
  receiveCount: number;
  receiveTotal: number;
  receiveRank: string;
  ranking: number;
}

interface ISendResponse {
  ranklist: ISend;
  result: string;
}

interface IReceiveResponse {
  ranklist: IReceive;
  result: string;
}

function Main() {
  const userInfo = useRecoilValue(userInfoAtom);

  // [BE] 후원받은 내역 통계
  const {
    isLoading: receiveIsLoading,
    data: receiveData,
    error: receiveError,
  } = useQuery<IReceiveResponse>(
    ["receive", userInfo.walletAddress],
    () => fetchReceiveDashboard(userInfo.walletAddress!)
    // {
    //   refetchInterval: 5000,
    // }
  );

  // [BE] 후원받은 내역 통계
  const {
    isLoading: sendIsLoading,
    data: sendData,
    error: sendError,
  } = useQuery<ISendResponse>(
    ["send", userInfo.walletAddress],
    () => fetchSendDashboard(userInfo.walletAddress!)
    // {
    //   refetchInterval: 5000,
    // }
  );

  return (
    <Layout>
      <Title>대시보드</Title>
      <Section>
        <BoxWrapper>
          {sendData?.ranklist ? (
            <Dashboard receive={false} data={sendData?.ranklist} />
          ) : null}
          {receiveData?.ranklist ? (
            <Dashboard receive data={receiveData?.ranklist} />
          ) : null}
        </BoxWrapper>
      </Section>
    </Layout>
  );
}

const Icon = styled.div`
  margin: 14px 0;
  width: 92px;
  height: 92px;
`;

const ColContent = styled.span`
  letter-spacing: -0.5px;
  font-weight: 600;
`;

const ColTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: ${(props) => props.theme.subTextColor};
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SubBox = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 50px;
  padding: 48px 40px;

  @media screen and (min-width: 767px) {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
  }
`;

const SubTitle = styled.p`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
  text-align: center;
`;

const Box = styled.div`
  min-height: 240px;
  padding: 25px 24px;
  border-radius: 14px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  background: ${(props) => props.theme.boxColor};
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin-top: 36px;
  width: 100%;

  @media screen and (min-width: 767px) {
    padding: 0 18px;
  }
`;

const Section = styled.div`
  padding-top: 12px;
`;

const Title = styled.div`
  padding-top: 48px;
  font-size: 30px;
  line-height: 40px;
  font-weight: 700;
`;

export default Main;
