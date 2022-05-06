import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import styled from "styled-components";

interface ICoin {
  block?: number;
  amount: number;
  blockTime: string;
}

function Give() {
  const [usdc, setUsdc] = useState<ICoin[]>([]);
  const [sol, setSol] = useState<ICoin[]>([]);

  const tmp = [
    {
      message: "깽",
      paymentType: "sol",
      amount: 10000000,
      block: 131444440,
      blockTime: "1651470975000",
      receiveUserId: "받는 지갑주소",
      sendUserId: "보내는 지갑주소",
    },
    {
      message: "후원",
      paymentType: "usdc",
      amount: 100,
      block: 131444441,
      blockTime: "1651470975000",
      receiveUserId: "받는 지갑주소",
      sendUserId: "보내는 지갑주소",
    },
    {
      message: "후원",
      paymentType: "usdc",
      amount: 200,
      block: 131444442,
      blockTime: "1651571977000",
      receiveUserId: "받는 지갑주소",
      sendUserId: "보내는 지갑주소",
    },
    {
      message: "후원",
      paymentType: "usdc",
      amount: 200,
      block: 131444443,
      blockTime: "1651571977000",
      receiveUserId: "받는 지갑주소",
      sendUserId: "보내는 지갑주소",
    },
  ];

  // const d = String(new Date(Number(tmp[2].blockTime)));
  console.log(String(new Date(Number(tmp[2].blockTime))).substring(4, 15));

  // console.log(new Date(Number(tmp[2].blockTime)));

  const Calc = () => {
    tmp.map((t) => {
      console.log(t.blockTime);
      if (t.paymentType === "usdc") {
        console.log(t);

        setUsdc((prev) => [
          ...prev,
          {
            amount: t.amount,
            blockTime: t.blockTime,
          },
        ]);
      } else {
        setSol((prev) => [
          ...prev,
          {
            amount: t.amount,
            blockTime: t.blockTime,
          },
        ]);
      }
    });
  };

  useEffect(() => {
    Calc();
  }, []);

  console.log(usdc);
  console.log(sol);

  return (
    <Container>
      <Gragh>
        <ApexCharts
          series={[
            {
              name: "USDC",
              type: "line",
              data: [0, 100, 200, 600],
            },
            {
              name: "SOL",
              type: "line",
              data: [4, 0, 1, 0],
            },
          ]}
          options={{
            theme: {
              mode: "light",
            },
            // title: {
            //   text: "Traffic Sources",
            // },
            chart: {
              toolbar: {
                show: true, // 확대, 축소, 저장 등
              },
              background: "transparent", // 그래프 배경색
            },
            // grid: { show: true }, // y축 구분선
            stroke: {
              curve: "smooth", // 선 모양 (곡선)
              width: 4, // 선 너비
            },
            // fill: {
            //   colors: ["00a8ff"], // 선 색
            // },
            yaxis: [
              {
                title: {
                  text: "USDC", // 좌
                },
              },
              {
                opposite: true,
                title: {
                  text: "SOL", // 우
                },
              },
            ],
            xaxis: {
              axisBorder: { show: false }, // x축 하단 테두리
              axisTicks: { show: true }, // x축 눈금
              labels: { show: true },
              // categories: tmp?.map((t) => new Date(Number(t.blockTime))),
            },
          }}
        />
      </Gragh>
      <Gragh>
        <ApexCharts
          series={[
            {
              name: "USDC",
              type: "line",
              data: [0, 100, 200, 600],
            },
            {
              name: "SOL",
              type: "line",
              data: [4, 0, 1, 0],
            },
          ]}
          options={{
            theme: {
              mode: "light",
            },
            // title: {
            //   text: "Traffic Sources",
            // },
            chart: {
              toolbar: {
                show: true, // 확대, 축소, 저장 등
              },
              background: "transparent", // 그래프 배경색
            },
            // grid: { show: true }, // y축 구분선
            stroke: {
              curve: "smooth", // 선 모양 (곡선)
              width: 4, // 선 너비
            },
            // fill: {
            //   colors: ["00a8ff"], // 선 색
            // },
            yaxis: [
              {
                title: {
                  text: "USDC", // 좌
                },
              },
              {
                opposite: true,
                title: {
                  text: "SOL", // 우
                },
              },
            ],
            xaxis: {
              axisBorder: { show: false }, // x축 하단 테두리
              axisTicks: { show: true }, // x축 눈금
              labels: { show: true },
              // categories: tmp?.map((t) => new Date(Number(t.blockTime))),
            },
          }}
        />
      </Gragh>
      {/* <List>
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
      </List> */}
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
  width: 100%;
  background: ${(props) => props.theme.borderColor};
`;

const List = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: scroll;
`;

const Gragh = styled.div`
  width: 100%;
  max-height: 400px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 30px;

  @media screen and (min-width: 1024px) {
    flex-direction: row;
  }
`;

export default Give;
