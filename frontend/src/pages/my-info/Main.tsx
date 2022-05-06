import Layout from "components/Layout";
import styled from "styled-components";

function Main() {
  return (
    <Layout>
      <Title>대시보드</Title>
      <Section>
        <BoxWrapper>
          <Box>
            <SubTitle>후원한 내역 통계</SubTitle>
            <SubBox>
              <Col>
                <ColTitle>총 횟수</ColTitle>
                <Icon>
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
                </Icon>
                <ColContent>2</ColContent>
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
                <ColContent>200</ColContent>
              </Col>
              <Col>
                <ColTitle>현재 나의 등급</ColTitle>
                <Icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#CD7F32"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </Icon>
                <ColContent>Bronze</ColContent>
              </Col>
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
                <ColContent>100</ColContent>
              </Col>
            </SubBox>
          </Box>
          <Box>
            <SubTitle>후원받은 내역 통계</SubTitle>
            <SubBox>
              <Col>
                <ColTitle>총 횟수</ColTitle>
                <Icon>
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
                </Icon>
                <ColContent>2</ColContent>
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
                <ColContent>200</ColContent>
              </Col>
              <Col>
                <ColTitle>현재 나의 등급</ColTitle>
                <Icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#CD7F32"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </Icon>
                <ColContent>Bronze</ColContent>
              </Col>
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
                <ColContent>100</ColContent>
              </Col>
            </SubBox>
          </Box>
        </BoxWrapper>
      </Section>
    </Layout>
  );
}

const Icon = styled.div`
  margin-top: 14px;
  margin-bottom: 30px;
  width: 92px;
  height: 63px;
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
  /* color: #7f8fa6; */
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
