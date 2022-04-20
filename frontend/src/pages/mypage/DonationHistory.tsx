import Layout from "components/Layout";
import styled from "styled-components";

function DonationHistory() {
  return (
    <Layout>
      <Title>후원 내역</Title>
      <Section>
        <div>
          <ul></ul>
        </div>
      </Section>
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

export default DonationHistory;
