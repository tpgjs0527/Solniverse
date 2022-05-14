import React from "react";
import styled from "styled-components";

export const Interaction = () => {
  return (
    <ScrollSection>
      <MainMessage>
        <p>
          <small>원터치 결제</small>Solniverse로
        </p>
      </MainMessage>
      <DescMessage>
        <p>
          팬텀지갑만 있으면 누구든지 Solinivers 세계로 오실 수 있습니다. 당신이
          트위치 크리에이터라면 한번의 터치로 연동할 수 있는 과정을
          만들었습니다. 이제 Solniverse를 즐기세요.
        </p>
        <Pin />
      </DescMessage>
    </ScrollSection>
  );
};

const ScrollSection = styled.section`
  position: relative;
  padding-top: 50vh;
`;
const MainMessage = styled.div`
  display: flex;
  align-items: center;
  color: black;
  justify-content: center;
  top: 35vh;
  margin: 5px 0;
  height: 3em;
  font-size: 3.5rem;
  opacity: 0;
  .p {
    font-weight: bold;
    text-align: center;
    line-height: 1.2;
  }
  .small {
    display: block;
    margin-bottom: 0.5em;
    font-size: 1.2rem;
  }
`;
const DescMessage = styled.div`
  top: 10%;
  left: 40%;
  width: 45%;
  font-weight: bold;
  opacity: 0;
`;
const Pin = styled.div`
  width: 1px;
  height: 100px;
  background: rgb(29, 29, 31);
`;
