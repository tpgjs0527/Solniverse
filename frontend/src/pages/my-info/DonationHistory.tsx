import Layout from "components/Layout";
import styled from "styled-components";
import {
  Routes as ReactRouterRoutes,
  Route,
  useMatch,
  useNavigate,
} from "react-router-dom";
import SendDonationHistory from "components/DonationHistory/Send";
import ReceiveDonationHistory from "components/DonationHistory/Receive";

function DonationHistory() {
  const navigate = useNavigate();

  // Active Link
  const giveMatch = useMatch("/donation-history");
  const receiveMatch = useMatch("/donation-history/receive");

  return (
    <Layout>
      <Title>후원 내역</Title>
      <Section>
        <Wrapper>
          <Tabs>
            <Tab
              isActive={giveMatch !== null}
              onClick={() => navigate(`/donation-history`)}
            >
              후원한 내역
            </Tab>
            <Tab
              isActive={receiveMatch !== null}
              onClick={() => navigate(`/donation-history/receive`)}
            >
              후원받은 내역
            </Tab>
          </Tabs>
        </Wrapper>

        <TabComponent>
          <ReactRouterRoutes>
            <Route path="" element={<SendDonationHistory />} />
            <Route path="/receive" element={<ReceiveDonationHistory />} />
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

export default DonationHistory;
