import { userInfoAtom } from "atoms";
import Layout from "components/Layout";
import useMutation from "hooks/useMutation";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

export interface IUser {
  result: string;
  user: {
    createdAt: string;
    twitch?: { id: string; displayName: string; profileImageUrl: string };
    wallet_address: string;
  };
}

function Account() {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoAtom);

  // query string
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");

  // request (code 전송)
  const [connectToTwitch, { data, loading }] = useMutation<IUser>(
    `${process.env.REACT_APP_BASE_URL}/auth/oauth`
  );

  // code 변경 시 실행
  useEffect(() => {
    if (code) {
      connectToTwitch({
        walletAddress: userInfo.walletAddress,
        code: code,
      });
    }
  }, [code]);

  // data 변경 시 실행
  useEffect(() => {
    if (data) {
      navigate(`/account`, { replace: true });
    }
  }, [data, navigate]);

  return (
    <Layout>
      <Title>Account</Title>
      <Section>
        <BoxWrapper>
          <Box>
            <BoxTitle>Wallet</BoxTitle>
            <Card>
              <Balance>$ 0</Balance>
              <Address>{userInfo.walletAddress}</Address>
            </Card>
          </Box>
        </BoxWrapper>
        <BoxWrapper>
          <Box>
            <BoxTitle>Connect</BoxTitle>
            <Oauth1>
              <OauthImg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" fill="#F6F1FF" />
                <path
                  d="M29.8504 18.1498H27.9004V23.9998H29.8504V18.1498Z"
                  fill="#6445A2"
                />
                <path
                  d="M23.0254 18.1498H24.9754V23.9998H23.0254V18.1498Z"
                  fill="#6445A2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2754 16.1998L14.8042 12.2998H35.7004V26.9248L29.8504 32.7748H24.9754L21.9392 35.6998H18.1504V32.7748H13.2754V16.1998ZM29.8504 28.8748L33.7504 24.9748V14.2498H17.1754V28.8748H21.0754V31.7998L24.0004 28.8748H29.8504Z"
                  fill="#6445A2"
                />
              </OauthImg>
              {loading ? (
                "loading..."
              ) : (
                <>
                  {userInfo.twitch.id ? (
                    <HoverNoneDiv>
                      <OauthProfile>
                        <OauthProfileImg
                          src={userInfo.twitch.profileImageUrl}
                        />
                        <Name>{userInfo.twitch.displayName}</Name>
                      </OauthProfile>
                    </HoverNoneDiv>
                  ) : (
                    <HoverDiv
                      onClick={() =>
                        (document.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=`)
                      }
                    >
                      <Name>Twitch</Name>
                      <OauthConnect
                        viewBox="0 0 24 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.5283 8.29458C14.5274 7.82219 14.1452 7.43779 13.6791 7.44164C7.4534 7.49296 6.08789 8.32465 6.09472 11.6985C6.10184 15.2204 7.59312 15.9783 14.5439 15.9927C21.4947 16.007 22.9829 15.2552 22.9758 11.7334C22.9716 9.64465 22.4453 8.52811 20.5678 7.96228C20.0661 7.81109 19.5925 8.22043 19.5936 8.75024L19.5936 8.77892C19.5944 9.18522 19.8815 9.52392 20.2611 9.65628C20.3948 9.70293 20.5078 9.75098 20.6032 9.7995C20.9035 9.95211 21.0122 10.0961 21.0889 10.2703C21.196 10.5135 21.2861 10.9397 21.2877 11.7299C21.2893 12.5201 21.2009 12.9458 21.0948 13.1887C21.0188 13.3626 20.9107 13.5061 20.611 13.6575C20.2515 13.8391 19.6431 14.0131 18.6049 14.1279C17.582 14.241 16.2597 14.2855 14.5405 14.282C12.8212 14.2784 11.4987 14.2284 10.4754 14.1111C9.43667 13.992 8.8276 13.8155 8.46729 13.6324C8.16701 13.4798 8.05834 13.3358 7.98164 13.1616C7.87454 12.9184 7.78443 12.4922 7.78283 11.702C7.78123 10.9118 7.86962 10.4861 7.97574 10.2432C8.05173 10.0693 8.15983 9.92582 8.45949 9.77445C8.81906 9.59282 9.42742 9.41884 10.4656 9.30405C11.3144 9.2102 12.3691 9.16354 13.6858 9.1524C14.1519 9.14845 14.5293 8.76697 14.5283 8.29458Z"
                          fill="#6978A0"
                        />
                        <path
                          d="M2.71135 8.27012C2.71295 9.06029 2.80306 9.48645 2.91016 9.72972C2.98686 9.90394 3.09554 10.0479 3.39581 10.2005C3.49128 10.249 3.60421 10.2971 3.73797 10.3437C4.11756 10.4761 4.4046 10.8148 4.40542 11.2211L4.40548 11.2498C4.40655 11.7796 3.93292 12.1889 3.43123 12.0377C1.55371 11.4719 1.02746 10.3553 1.02324 8.26664C1.01611 4.74476 2.50434 3.99299 9.45513 4.00733C16.4059 4.02167 17.8972 4.77958 17.9043 8.30146C17.9111 11.6754 16.5456 12.507 10.32 12.5584C9.85383 12.5622 9.47166 12.1778 9.4707 11.7054C9.46975 11.233 9.84716 10.8515 10.3133 10.8476C11.6299 10.8365 12.6847 10.7898 13.5334 10.696C14.5716 10.5812 15.18 10.4072 15.5396 10.2256C15.8392 10.0742 15.9473 9.93067 16.0233 9.75677C16.1294 9.51394 16.2178 9.08815 16.2162 8.29798C16.2146 7.5078 16.1245 7.08165 16.0174 6.83837C15.9407 6.66416 15.832 6.52021 15.5317 6.3676C15.1714 6.18448 14.5624 6.00799 13.5237 5.88891C12.5003 5.77159 11.1779 5.72156 9.45859 5.71802C7.73932 5.71447 6.41707 5.75904 5.39416 5.87214C4.35594 5.98694 3.74758 6.16091 3.38801 6.34255C3.08835 6.49392 2.98025 6.63743 2.90426 6.81132C2.79814 7.05415 2.70975 7.47995 2.71135 8.27012Z"
                          fill="#6978A0"
                        />
                      </OauthConnect>
                    </HoverDiv>
                  )}
                </>
              )}
            </Oauth1>
          </Box>
        </BoxWrapper>
      </Section>
    </Layout>
  );
}

const OauthConnect = styled.svg`
  width: 24px;
  height: 20px;
  margin-right: 5px;
  cursor: pointer;

  @media screen and (min-width: 767px) {
    width: 30px;
    height: 26px;
    margin-right: 10px;
  }
`;

const Name = styled.p`
  padding-left: 10px;
  font-size: 14px;
  font-weight: 600;

  @media screen and (min-width: 767px) {
    padding-left: 16px;
    font-size: 16px;
  }
`;

const OauthProfileImg = styled.img`
  margin-left: 10px;
  width: 40px;
  height: 40px;
  background: #e5e8eb;
  border-radius: 50%;

  @media screen and (min-width: 767px) {
    margin-left: 16px;
  }
`;

const OauthProfile = styled.div`
  display: flex;
  align-items: center;
`;

const HoverNoneDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const HoverDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  &:hover {
    background: #f6f1ff;
  }
`;

const OauthImg = styled.svg`
  width: 60px;
  height: 60px;

  @media screen and (min-width: 767px) {
    width: 70px;
    height: 70px;
  }
`;

const Oauth1 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.subBoxColor};
  height: 48px;

  @media screen and (min-width: 767px) {
    height: 60px;
  }
`;

const Address = styled.p`
  color: white;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.03em;
  word-break: break-all;

  @media screen and (min-width: 767px) {
    font-size: 16px;
  }
`;

const Balance = styled.p`
  color: white;
  font-size: 28px;
  font-weight: 500;

  @media screen and (min-width: 767px) {
    font-size: 32px;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(320deg, #d41e7f, rgba(255, 0, 0, 0) 60%),
    linear-gradient(180deg, #20204d, rgba(0, 255, 0, 0) 100%),
    linear-gradient(380deg, #781cff, rgba(0, 0, 255, 0) 100%);
  box-shadow: 4px 12px 15px 6px rgb(0 0 0 / 9%);
  height: 200px;
  border-radius: 30px;
  padding: 40px 30px;
`;

const BoxTitle = styled.p`
  font-size: 22px;
  line-height: 32px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Box = styled.div`
  height: 350px;
  padding: 25px 24px;
  border-radius: 14px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  background: ${(props) => props.theme.boxColor};
`;

const BoxWrapper = styled.div`
  margin-top: 36px;
  width: 100%;

  @media screen and (min-width: 767px) {
    padding: 0 18px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 12px;

  @media screen and (min-width: 1024px) {
    flex-direction: row;
  }
`;

const Title = styled.div`
  padding-top: 48px;
  font-size: 30px;
  line-height: 40px;
  font-weight: 700;
`;

export default Account;
