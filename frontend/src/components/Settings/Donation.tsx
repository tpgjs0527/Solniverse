import { useState } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { accessTokenAtom, userInfoAtom } from "atoms";
import Spinner from "components/Spinner";
import useToken from "hooks/useToken";
import Swal from "sweetalert2";
import { Phantom } from "components/Home/Intro";
import { useTranslation } from "react-i18next";

function SetDonation() {
  const { t } = useTranslation();
  const userInfo = useRecoilValue(userInfoAtom);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [UUID, setUUID] = useState("");
  const [isLoadingUUID, setIsLoadingUUID] = useState(false);
  const [, , checkToken] = useToken();

  // 연동 버튼 클릭 시 Token 유효한지 확인 후 uuid 받기
  const onCheckToken = async () => {
    if (UUID) return;

    setIsLoadingUUID(true);
    const newAccessToken = await checkToken(
      accessToken,
      userInfo.walletAddress
    );

    if (newAccessToken) {
      setAccessToken(newAccessToken);

      const uuid = await getUuid(newAccessToken);
      setUUID(uuid);
      setIsLoadingUUID(false);
    } else {
    }
  };

  // userKey 받아오기
  const getUuid = async (accessToken: string) => {
    const res = await (
      await fetch(`${process.env.REACT_APP_BASE_URL}/auth/userKey`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).json();

    return res.userKey;
  };

  // 클립보드 복사
  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire(t("copy-done"), t("copy-done-text"), "success");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("copy-conflict"),
        html: t("copy-conflict-text"),
      });
    }
  };

  return (
    <Section>
      <BoxWrapper>
        <Box>
          <BoxTitle>{t("donation-link")}</BoxTitle>
          <BoxDescription>{t("donation-link-ex")}</BoxDescription>
          <UrlBox>
            <Url>{`https://solniverse.net/donation/${userInfo.walletAddress}`}</Url>
            <ExtraDiv>
              <Extra
                onClick={() =>
                  handleCopyClipBoard(
                    `https://solniverse.net/donation/${userInfo.walletAddress}`
                  )
                }
              >
                {t("copy")}
              </Extra>
              <Extra
                onClick={() =>
                  window.open(
                    `https://solniverse.net/donation/${userInfo.walletAddress}`
                  )
                }
              >
                {t("open")}
              </Extra>
            </ExtraDiv>
          </UrlBox>
        </Box>
      </BoxWrapper>
      <BoxWrapper>
        <Box>
          <AlertWrapper>
            <AlertTitle>{t("alert-box")}</AlertTitle>
            <ServiceTitle
              onClick={() =>
                window.open(`https://solniverse.net/service#alertBoxSetting`)
              }
            >
              {t("alert-box-guide")}
            </ServiceTitle>
          </AlertWrapper>
          <BoxDescription>
            <BoxWarning>{t("alert-box-ex1")}</BoxWarning>
            <p>{t("alert-box-ex2")}</p>
            <p>{t("alert-box-ex3")}</p>
          </BoxDescription>
          <BoxNotice>{t("alert-box-url")}</BoxNotice>
          <AlarmUrlBox onClick={() => onCheckToken()} isUUID={UUID}>
            {isLoadingUUID ? (
              <SpinnerDiv>
                <Spinner />
              </SpinnerDiv>
            ) : (
              <>
                <AlarmUrl
                  isUUID={UUID}
                >{`https://solniverse.net/donation/alertbox/${UUID}`}</AlarmUrl>
                <ExtraDiv>
                  <ExtraUUID
                    isUUID={UUID}
                    onClick={
                      UUID
                        ? () =>
                            handleCopyClipBoard(
                              `https://solniverse.net/donation/alertbox/${UUID}`
                            )
                        : undefined
                    }
                  >
                    {t("copy")}
                  </ExtraUUID>
                  <ExtraUUID
                    isUUID={UUID}
                    onClick={
                      UUID
                        ? () =>
                            window.open(
                              `https://solniverse.net/donation/alertbox/${UUID}`,
                              "Solniverse AlertBox",
                              "width=800,height=500,location=no,status=no,scrollbars=yes"
                            )
                        : undefined
                    }
                  >
                    {t("open")}
                  </ExtraUUID>
                </ExtraDiv>
              </>
            )}
          </AlarmUrlBox>
          <TestBox
            onClick={() => window.open(`https://solniverse.net/test/alertbox`)}
          >
            {t("alert-test")}
          </TestBox>
        </Box>
      </BoxWrapper>
    </Section>
  );
}

const TestBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  line-height: 20px;
  height: 37px;
  width: 120px;
  padding: 0 17px;
  font-size: 14px;
  border-radius: 10px;
  letter-spacing: -0.5px;
  cursor: pointer;
  background: ${(props) => props.theme.subBoxColor};
  &:hover {
    background: ${(props) => props.theme.ownColor};
  }
`;

const ExtraUUID = styled.div<{ isUUID?: string }>`
  display: flex;
  align-items: center;
  line-height: 20px;
  padding: 10px;
  border-radius: 10px;
  letter-spacing: -0.5px;
  cursor: pointer;
  background: ${(props) => props.theme.subBoxColor};
  &:hover {
    background: ${(props) => (props.isUUID ? props.theme.ownColor : "")};
  }
  filter: ${(props) => (props.isUUID ? "blur(0px)" : "blur(5px)")};
`;

const Extra = styled.div`
  display: flex;
  align-items: center;
  line-height: 20px;
  padding: 10px;
  border-radius: 10px;
  letter-spacing: -0.5px;
  cursor: pointer;
  background: ${(props) => props.theme.subBoxColor};
  &:hover {
    background: ${(props) => props.theme.ownColor};
  }
`;

const ExtraDiv = styled.div`
  display: flex;
  gap: 2px;
  font-size: 12px;

  @media screen and (min-width: 767px) {
    font-size: 14px;
  }
`;

const SpinnerDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const AlarmUrl = styled.a<{ isUUID: string }>`
  font-size: 14px;
  word-break: break-all;
  filter: ${(props) => (props.isUUID ? "blur(0px)" : "blur(5px)")};
`;

const AlarmUrlBox = styled.div<{ isUUID: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.subBoxColor};
  min-height: 48px;
  padding: 12px 16px;
  cursor: ${(props) => (props.isUUID ? "" : "pointer")};

  @media screen and (min-width: 767px) {
    min-height: 60px;
  }
`;

const Url = styled.a`
  font-size: 14px;
  word-break: break-all;
`;

const UrlBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.subBoxColor};
  min-height: 48px;
  padding: 12px 16px;

  @media screen and (min-width: 767px) {
    min-height: 60px;
  }
`;

const BoxNotice = styled.p`
  color: ${(props) => props.theme.ownColor};
  font-size: 14px;
  margin-bottom: 6px;
`;

const BoxWarning = styled.p`
  color: #c23616;
  margin-bottom: 6px;
`;

const BoxDescription = styled.div`
  font-size: 14px;
  letter-spacing: -0.03em;
  color: ${(props) => props.theme.subTextColor};
  margin-bottom: 12px;
`;

const BoxTitle = styled.p`
  font-size: 22px;
  line-height: 32px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Box = styled.div`
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
`;

const ServiceTitle = styled(Phantom)``;

const AlertTitle = styled.span`
  font-size: 22px;
  line-height: 32px;
  font-weight: bold;
  margin-right: 10px;
`;

const AlertWrapper = styled.div`
  margin-bottom: 20px;
`;

export default SetDonation;
