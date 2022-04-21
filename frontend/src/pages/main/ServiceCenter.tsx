import Layout from "components/Layout";
import styled from "styled-components";

function ServiceCenter() {
  console.log(process.env.REACT_APP_CLIENT_ID);

  return (
    <Layout>
      <Title>고객센터</Title>
      <Section>
        <button>
          <a href="https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=uve26y4qxaoq0p6t5elsja089p1gn4&redirect_uri=http://localhost:3000&scope=">
            트위치 연동
          </a>
        </button>
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

export default ServiceCenter;
