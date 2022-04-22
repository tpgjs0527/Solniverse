import Layout from "components/Layout";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

function MyPage() {
  // query string
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");
  console.log(code);

  useEffect(() => {
    if (code) {
      console.log("변경");
    }
  }, [code]);

  return (
    <Layout>
      <Title>마이페이지</Title>
      <Section>
        <button>
          <a
            href={`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=`}
          >
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

export default MyPage;
