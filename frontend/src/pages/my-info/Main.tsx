import { userInfoAtom } from "atoms";
import Layout from "components/Layout";
import Dashboard from "components/Main/Dashboard";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { fetchReceiveDashboard, fetchSendDashboard } from "utils/fetcher";

interface IUser {
  twitch?: {
    displayName: string;
  };
  walletAddress: string;
  _id: string;
}

export interface RankingList {
  sendCount?: number;
  sendTotal?: number;
  sendRank?: string;

  receiveCount?: number;
  receiveTotal?: number;
  receiveRank?: string;

  user: IUser;
}

interface ISend {
  nextList: RankingList[];
  previousList: RankingList[];
  sendCount: number;
  sendTotal: number;
  sendRank: string;
  ranking: number;
}

interface IReceive {
  nextList: RankingList[];
  previousList: RankingList[];
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

  // [BE] 후원한 내역 통계
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

  return (
    <Layout>
      <Title>대시보드</Title>
      <Section>
        <BoxWrapper>
          <Dashboard
            receive={false}
            data={sendData?.ranklist}
            isLoading={sendIsLoading}
          />
          <Dashboard
            receive
            data={receiveData?.ranklist}
            isLoading={receiveIsLoading}
          />
        </BoxWrapper>
      </Section>
    </Layout>
  );
}

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
