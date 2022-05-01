import Layout from "components/Layout";
import styled from "styled-components";

function Main() {
  return (
    <Layout>
      <Title>후원 순위</Title>
      <Section>
        <BoxWrapper>dd</BoxWrapper>
      </Section>
    </Layout>
  );
}

const BoxWrapper = styled.div`
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
