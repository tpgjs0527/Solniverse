import { useEffect } from "react";
import styled from "styled-components";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { toggleThemeAtom, userInfoAtom } from "atoms";
import { useQuery } from "react-query";
import { fetchSend } from "utils/fetcher";
import { LAMPORTS_PER_SOL } from "utils/solanaWeb3";
import Spinner from "components/Spinner";

interface IRecord {
  x: number;
  y: number;
}

interface IData {
  [index: string]: Record<number, IRecord>;
  sol: Record<number, IRecord>;
  usdc: Record<number, IRecord>;
}

interface IUser {
  twitch?: {
    displayName: string;
  };
  walletAddress: string;
  _id: string;
}

interface ITransaction {
  amount: number;
  block: number;
  blockTime: number;
  displayName: string;
  message: string;
  platform?: string;
  paymentType: string;
  receiveUserId: IUser;
  sendUserId: IUser;
  txSignature: string;
}

interface IResponse {
  result: string;
  transaction: ITransaction[];
}

function SendDonationHistory() {
  const isDark = useRecoilValue(toggleThemeAtom);
  const userInfo = useRecoilValue(userInfoAtom);

  // [BE] 후원한 목록
  const { isLoading, data } = useQuery<IResponse>(
    ["give", userInfo.walletAddress],
    () => fetchSend(userInfo.walletAddress!)
    // {
    //   refetchInterval: 5000,
    // }
  );

  const graphData: IData = { sol: {}, usdc: {} };

  const state: ApexOptions = {
    theme: {
      mode: isDark ? "dark" : "light",
    },
    chart: {
      id: "realtime",
      height: 350,
      type: "line",
      toolbar: {
        show: true, // 확대, 축소, 저장 등
      },
      background: "transparent", // 그래프 배경색
    },
    colors: ["#00FFA3", "#2775ca"],
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          [
            {
              offset: 0,
              color: "#00FFA3",
            },
            {
              offset: 50,
              color: "#03E1FF",
            },
            {
              offset: 100,
              color: "#DC1FFF",
            },
          ],
          [
            {
              color: "#2775ca",
            },
          ],
        ],
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#333333" : "#eeeeee",
    },
    stroke: {
      curve: "smooth", // 선 모양 (곡선)
      width: 4, // 선 너비
    },
    xaxis: {
      type: "datetime",
      axisBorder: { show: false }, // x축 하단 테두리
      axisTicks: {
        show: true,
        color: isDark ? "#333333" : "#eeeeee",
      },
      labels: {
        show: true,
        style: {
          colors: isDark ? "#777777" : "#666666",
        },
      },
    },
    yaxis: {
      show: false,
    },
    markers: {
      // 점
      size: 3,
    },
    tooltip: {
      // 차트 영역 위로 마우스를 가져갈 때 해당 데이터 표시
      shared: false,
      intersect: true, // 마우스를 해당 위치에 정확히 올린 경우에만 표시
      x: {
        show: true, // 윗부분에 x값 추가 표시
      },
      y: {
        formatter: (value) => String(parseFloat(value.toFixed(2))),
      },
    },
    legend: {
      // 범례
      horizontalAlign: "center", // 위치
      offsetX: 50, // 범례 간 간격
    },
    series: [],
  };

  // 그래프에 들어갈 data 추가
  const setGraphData = (type: string, key: number, amount: number) => {
    if (!graphData[type][key]) {
      graphData[type][key] = {
        x: key,
        y: amount,
      };
    } else {
      graphData[type][key].y += amount;
    }
  };

  // backend response (data) 받아오면 실행
  useEffect(() => {
    if (data) {
      data?.transaction?.map((el) => {
        const key = new Date(el.blockTime).setHours(12, 0, 0, 0);

        if (el.paymentType === "sol") {
          const amount = el.amount / LAMPORTS_PER_SOL;
          setGraphData("sol", key, amount);
        } else {
          const amount = el.amount / 1000000;
          setGraphData("usdc", key, amount);
        }
      });

      ApexCharts.exec("realtime", "updateSeries", [
        {
          name: "SOL",
          data: Object.values(graphData.sol),
        },
        {
          name: "USDC",
          data: Object.values(graphData.usdc),
        },
      ]);
    }
  }, [data, graphData]);

  return (
    <Container>
      <Gragh>
        <Chart options={state} series={state.series} type="line" />
      </Gragh>
      <List>
        {isLoading ? (
          <SpinnerDiv>
            <Spinner />
          </SpinnerDiv>
        ) : (
          <>
            {data?.transaction && data?.transaction?.length > 0 ? (
              <Table>
                <ul>
                  {data?.transaction?.map((el) => (
                    <Element key={el.block}>
                      <Top>
                        {el.receiveUserId.twitch ? (
                          <TwitchId
                            onClick={() =>
                              window.open(
                                `https://www.twitch.tv/${el.receiveUserId.twitch?.displayName}`
                              )
                            }
                          >
                            {el.receiveUserId.twitch.displayName}
                          </TwitchId>
                        ) : (
                          <span>{el.receiveUserId.walletAddress}</span>
                        )}
                      </Top>
                      <Mid>
                        {/* UTC -> 한국 시간 */}
                        <Time>{new Date(el.blockTime).toLocaleString()}</Time>
                        <span>
                          {el.paymentType === "sol"
                            ? el.amount / LAMPORTS_PER_SOL + " SOL"
                            : el.amount / 1000000 + " USDC"}
                        </span>
                      </Mid>
                      <div>
                        <Message>{`"${el.message}"`}</Message>
                      </div>
                      <Bot>
                        <Tx
                          onClick={() =>
                            window.open(
                              `https://solscan.io/tx/${el.txSignature}?cluster=devnet` // devnet
                            )
                          }
                        >
                          Transaction details
                        </Tx>
                      </Bot>
                    </Element>
                  ))}
                </ul>
              </Table>
            ) : (
              <Empty>후원한 내역이 없습니다.</Empty>
            )}
          </>
        )}
      </List>
    </Container>
  );
}

const Message = styled.p`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media screen and (min-width: 767px) {
    max-width: 350px;
  }
  @media screen and (min-width: 1024px) {
    max-width: 650px;
  }
  @media screen and (min-width: 1439px) {
    max-width: 350px;
  }
`;

const Time = styled.span`
  color: ${(props) => props.theme.subTextColor};
`;

const TwitchId = styled.span`
  color: #9147ff;
  cursor: pointer;
`;

const Tx = styled.span`
  cursor: pointer;
`;

const Bot = styled.div`
  color: ${(props) => props.theme.ownColor};
`;

const Mid = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Top = styled.div`
  font-weight: 600;
  margin-bottom: 3px;
`;

const Element = styled.li`
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  font-size: 14px;
  letter-spacing: -0.5px;
  border-bottom: 1px solid ${(props) => props.theme.bgColor};
`;

const SpinnerDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Empty = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.subTextColor};
`;

const Table = styled.div`
  background: ${(props) => props.theme.borderColor};
`;

const List = styled.div`
  height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: ${(props) => props.theme.subTextColor};
  }
`;

const Gragh = styled.div`
  @media screen and (min-width: 767px) {
    width: 630px;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);

  @media screen and (min-width: 1439px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default SendDonationHistory;
