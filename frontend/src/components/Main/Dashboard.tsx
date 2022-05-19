import Spinner from "components/Spinner";
import { RankingList } from "pages/my-info/Main";
import { useState } from "react";
import styled from "styled-components";
import Ranking from "./Ranking";
import Tier from "./Tier";

export interface IData {
  receiveCount?: number;
  receiveTotal?: number;
  receiveRank?: string;

  sendCount?: number;
  sendTotal?: number;
  sendRank?: string;

  nextList: RankingList[];
  previousList: RankingList[];
  ranking: number;
}

interface IProps {
  receive: boolean;
  data: IData | undefined;
  isLoading: boolean;
}

function Dashboard({ receive, data, isLoading }: IProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box>
      <SubTitle>{receive ? "후원받은 내역 통계" : "후원한 내역 통계"}</SubTitle>
      {isLoading ? (
        <SpinnerDiv>
          <Spinner />
        </SpinnerDiv>
      ) : (
        <SubBox>
          <Col>
            <ColTitle>총 횟수</ColTitle>
            <Icon>
              {receive ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#534bb1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#534bb1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
              )}
            </Icon>
            <ColContent>
              {data?.receiveCount
                ? data?.receiveCount
                : data?.sendCount
                ? data?.sendCount
                : 0}
            </ColContent>
            <ColEmpty></ColEmpty>
          </Col>
          <Col>
            <ColTitle>총 금액</ColTitle>
            <Icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#85bb65"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Icon>
            <ColContent>
              ${" "}
              {data?.receiveTotal
                ? data?.receiveTotal.toFixed(2)
                : data?.sendTotal
                ? data?.sendTotal.toFixed(2)
                : 0}
            </ColContent>
            <ColEmpty></ColEmpty>
          </Col>
          <Tier
            tier={data?.receiveRank ? data?.receiveRank : data?.sendRank}
            dashboard
          />
          <Col>
            <ColTitle>현재 나의 등수</ColTitle>
            <Icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#00a8ff"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </Icon>
            <ColContent>
              {data?.ranking !== -1 ? data?.ranking : "-"}
            </ColContent>
            <ColRef onClick={() => setIsModalOpen(true)}>순위표</ColRef>
          </Col>
        </SubBox>
      )}

      <Ranking
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
      />
    </Box>
  );
}

const ColEmpty = styled.div`
  margin-top: 10px;
  height: 37px;
`;

export const ColRef = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  line-height: 20px;
  height: 37px;
  padding: 0 17px;
  font-size: 14px;
  border-radius: 30px;
  letter-spacing: -0.5px;
  cursor: pointer;
  background: ${(props) => props.theme.subBoxColor};
  &:hover {
    background: ${(props) => props.theme.ownColor};
  }
`;

const SpinnerDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 253px;
`;

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

  @media screen and (min-width: 767px) {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
  }

  @media screen and (min-width: 1439px) {
    padding: 0 40px;
  }
`;

const SubTitle = styled.p`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
  text-align: center;
  margin-bottom: 40px;
`;

const Box = styled.div`
  min-height: 240px;
  padding: 25px 24px;
  border-radius: 14px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  background: ${(props) => props.theme.boxColor};
`;

export default Dashboard;
