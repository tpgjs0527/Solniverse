import Layout from "components/Layout";
import styled from "styled-components";
import {
  Routes as ReactRouterRoutes,
  Route,
  useMatch,
  useNavigate,
} from "react-router-dom";
import Account from "components/Settings/Account";
import SetDonation from "components/Settings/Donation";

function Settings() {
  const navigate = useNavigate();

  // Active Link
  const accountMatch = useMatch("/settings");
  const donationMatch = useMatch("/settings/donation");

  return (
    <Layout>
      <Title>계정</Title>
      <Section>
        <Wrapper>
          <Tabs>
            <Tab
              isActive={accountMatch !== null}
              onClick={() => navigate(`/settings`)}
            >
              계정 상세
            </Tab>
            <Tab
              isActive={donationMatch !== null}
              onClick={() => navigate(`/settings/donation`)}
            >
              후원 설정
            </Tab>
          </Tabs>
        </Wrapper>

        <TabComponent>
          <ReactRouterRoutes>
            <Route path="" element={<Account />} />
            <Route path="/donation" element={<SetDonation />} />
          </ReactRouterRoutes>
        </TabComponent>
      </Section>
    </Layout>
  );
}

const TabComponent = styled.div`
  margin-top: 36px;
`;

const Tab = styled.li<{ isActive: boolean }>`
  margin-right: 10px;
  height: 37px;
  padding: 0 17px;
  font-size: 14px;
  line-height: 37px;
  border-radius: 30px;
  letter-spacing: -0.5px;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.ownColor};
  }
  background: ${(props) =>
    props.isActive ? props.theme.ownColor : props.theme.borderColor};
`;

const Tabs = styled.ul`
  display: flex;
`;

const Wrapper = styled.div`
  margin-top: 36px;
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

export default Settings;
