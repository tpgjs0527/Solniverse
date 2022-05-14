import styled from "styled-components";
import Container from "./Tag/Container";

export default function Introduction() {
  return (
    <>
      <IntroWrapper>
        <Contents>ㅎㅇ</Contents>
      </IntroWrapper>
      <ImageContainer></ImageContainer>
    </>
  );
}

const IntroWrapper = styled(Container)`
  display: flex;
  padding-top: 5rem;
  min-height: 100%;
`;

const Contents = styled.div`
  flex: 1;
  max-width: 60rem;
`;
const ImageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-start;

  svg {
    max-width: 45rem;
  }
`;
