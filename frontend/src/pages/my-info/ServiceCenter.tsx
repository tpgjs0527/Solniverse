import Layout from "components/Layout";
import styled from "styled-components";

function ServiceCenter() {
  return (
    <Layout>
      <Title>고객센터</Title>
      <Section></Section>
    </Layout>
  );
}

const Section = styled.div`
  padding-top: 12px;
`;

const Title = styled.div`
  padding-top: 48px;
  font-size: 30px;
  line-height: 40px;
  font-weight: 700;
`;

export default ServiceCenter;
