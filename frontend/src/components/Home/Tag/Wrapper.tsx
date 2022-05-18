import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  /* justify-content: center; */
  overflow-y: hidden;
  overflow-x: hidden;

  margin-top: 12%;
  margin-right: 4rem;
  margin-left: 4rem;
  /* height: 800px; */
  @media screen and (min-width: 1200px) {
    /* height: 1300px; */
    padding-top: 10%;
    padding-bottom: 3%;
  }
  @media screen and (max-width: 800px) {
    flex-direction: column;
    margin-top: 0%;
    margin-right: 0rem;
    margin-left: 0rem;
  }
`;
