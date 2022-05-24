import Layout from "components/Layout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function PageNotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Layout>
      <Container>
        <Wrapper>
          <Error>404 Not Found</Error>
          {/* <Message>
            Sorry, we couldn't find the page you were looking for.
          </Message> */}
          <Message>{t("page-not-found")}</Message>

          <SubMessage>
            <span>{t("page-not-found-text1")}</span>
            <span>{t("page-not-found-text2")}</span>
          </SubMessage>
        </Wrapper>
      </Container>
    </Layout>
  );
}

// const Home = styled.div`
//   margin-top: 30px;
//   font-size: 26px;
//   font-weight: 700;
//   color: whitesmoke;
//   background: ${(props) => props.theme.ownColor};
//   padding: 12px 16px;
//   border-radius: 12px;
//   cursor: pointer;
// `;

const SubMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  margin-top: 30px;
`;

const Message = styled.span`
  font-size: 25px;
  line-height: 40px;

  @media screen and (min-width: 1024px) {
    font-size: 38px;
  }
`;

const Error = styled.span`
  font-size: 30px;
  line-height: 40px;
  color: #c23616;
  font-weight: 600;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 150px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export default PageNotFound;
