import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow-y: hidden;
  overflow-x: hidden;
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  } */
  margin-top: 11%;
  margin-right: 5rem;
  margin-left: 4rem;
  height: 700px;
  @media screen and (min-width: 1600px) {
    height: 1050px;
  }
  @media screen and (max-width: 800px) {
    flex-direction: column;
    margin-top: 20%;
    margin-right: 0rem;
    margin-left: 0rem;
  }
`;
