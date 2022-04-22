import ApexCharts from "react-apexcharts";
import styled from "styled-components";

function Give() {
  return (
    <Container>
      <Gragh>
        <ApexCharts
          type="line"
          series={[
            {
              name: "Price",
              data: [122, 213, 343, 442, 322],
            },
          ]}
          options={{
            theme: {
              mode: "light",
            },
            chart: {
              toolbar: {
                show: true,
              },
              background: "transparent",
            },
            grid: { show: true },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: {
              show: true,
            },
            xaxis: {
              axisBorder: { show: true },
              axisTicks: { show: true },
              labels: { show: true },
            },
          }}
        />
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
