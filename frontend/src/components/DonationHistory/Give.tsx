import { useEffect, useState } from "react";
import styled from "styled-components";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { toggleThemeAtom, userInfoAtom } from "atoms";

import { fetchReceivedDonation } from "utils/fetcher";
import { useQuery } from "react-query";

interface IRecord {
  x: number;
  y: number;
}

interface IData {
  [index: string]: Record<number, IRecord>;
  sol: Record<number, IRecord>;
  usdc: Record<number, IRecord>;
}

interface IResponse {
  displayName: string;
  message: string;
  platform?: string;
  paymentType: string;
  amount: number;
  block: number;
  blockTime: number;
  receiveUserId: string;
  sendUserId: string;
  txSignature: string;
}

function Give() {
  const isDark = useRecoilValue(toggleThemeAtom);
  const userInfo = useRecoilValue(userInfoAtom);

  // const { isLoading, data: res } = useQuery<any>(
  //   ["receive", userInfo.walletAddress],
  //   () => fetchReceivedDonation(userInfo.walletAddress!)
  //   // {
  //   //   refetchInterval: 5000,
  //   // }
  // );

  // console.log(res);

  const tmp: Array<IResponse> = [];
  const data: IData = { sol: {}, usdc: {} };

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
    // dataLabels: {
    //   enabled: false,  // 선에 y 데이터 값 표시
    // },
    stroke: {
      curve: "smooth", // 선 모양 (곡선)
      width: 4, // 선 너비
    },
    // title: {
    //   text: "Dynamic Updating Chart",
    //   align: "left",
    // },
    xaxis: {
      type: "datetime",
      axisBorder: { show: false }, // x축 하단 테두리
    },
    yaxis: [
      {
        title: {
          text: "SOL", // 좌
        },
      },
      {
        opposite: true,
        title: {
          text: "USDC", // 우
        },
      },
    ],
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
    },
    legend: {
      // 범례
      horizontalAlign: "center", // 위치
      offsetX: 50, // 범례 간 간격
    },
    series: [],
  };

  useEffect(() => {
    const initDate = 1643641200000; //2022년 1월 1일
    const nowDate = 1651762800000; //2022년 5월 5일

    ////////////더미 데이터 초기화 (백엔드에서 이런식의 전체 데이터를 보내줌)
    for (let i = 0; i < 100; i++) {
      tmp.push({
        displayName: "gdgd",
        message: "gdgd",
        paymentType: Math.floor(Math.random() * 10) ? "sol" : "usdc",
        amount: Math.floor(Math.random() * 100000 - 1) + 1,
        block: 131444440,
        blockTime:
          Math.floor(Math.random() * (nowDate - initDate + 1)) + initDate,
        receiveUserId: "626e9c4f5c24a7fca07783fe",
        sendUserId: "626e9c4f5c24a7fca0778400",
        txSignature:
          "3BTwVopjGeyH1yyWCTLyDwXVyUuUBqpiistbC5CjJUhvqLnnuUSQepo12udbZW8p4njDF9zGkqy88fpjPGBH15Lb",
      });
    }

    //오름차순 정렬
    tmp.sort((a, b) => {
      return a.blockTime - b.blockTime;
    });
    //////////// 여기까지 백엔드에서 보내주는 데이터

    tmp.map((t) => {
      const key = new Date(t.blockTime).setHours(0, 0, 0, 0);
      if (!data[t.paymentType][key]) {
        data[t.paymentType][key] = { x: key, y: t.amount };
      } else {
        data[t.paymentType][key].y += t.amount;
      }
    });
    // console.log(data);
    ApexCharts.exec("realtime", "updateSeries", [
      {
        name: "SOL",
        data: Object.values(data.sol),
      },
      {
        name: "USDC",
        data: Object.values(data.usdc),
      },
    ]);
    // window.setInterval(() => {
    //     getNewSeries(lastDate, {
    //         min: 10,
    //         max: 10000,
    //     });

    //     ApexCharts.exec('realtime', 'updateSeries', [
    //         {
    //             data: data,
    //         },
    //     ]);
    // }, 1000);
  }, []);

  return (
    <Container>
      <Gragh>
        <Chart options={state} series={state.series} type="line" />
      </Gragh>
      <List>
        <Table>
          <ul>
            <Element>
              <div>
                <span>[텍스트]</span>
                <span>won</span>
              </div>
              <div>
                <div>2022-4-20 23:07</div>
                <div>500</div>
              </div>
            </Element>
            <Element>
              <div>
                <span>[텍스트]</span>
                <span>won</span>
              </div>
              <div>
                <div>2022-4-22 23:07</div>
                <div>500</div>
              </div>
            </Element>
            <Element>
              <div>
                <span>[텍스트]</span>
                <span>won</span>
              </div>
              <div>
                <div>2022-4-22 23:07</div>
                <div>500</div>
              </div>
            </Element>
            <Element>
              <div>
                <span>[텍스트]</span>
                <span>won</span>
              </div>
              <div>
                <div>2022-4-26 23:07</div>
                <div>500</div>
              </div>
            </Element>
            <Element>
              <div>
                <span>[텍스트]</span>
                <span>won</span>
              </div>
              <div>
                <div>2022-4-20 23:07</div>
                <div>500</div>
              </div>
            </Element>
          </ul>
        </Table>
      </List>
    </Container>
  );
}

const Element = styled.li`
  padding: 16px 24px;
  font-size: 14px;
  letter-spacing: -0.5px;
  border-bottom: 1px solid ${(props) => props.theme.bgColor};
`;

const Table = styled.div`
  background: ${(props) => props.theme.borderColor};
`;

const List = styled.div`
  max-height: 400px;
  overflow-y: scroll;
`;

const Gragh = styled.div`
  @media screen and (min-width: 767px) {
    width: 630px;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  /* grid-gap: 30px; */

  @media screen and (min-width: 1439px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default Give;
