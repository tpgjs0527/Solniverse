// 순위표

import { toggleThemeAtom } from "atoms";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Tier from "./Tier";

interface IProps {
  isModalOpen: boolean;
  onClose: Function;
}

function Ranking({ isModalOpen, onClose }: IProps) {
  const isDark = useRecoilValue(toggleThemeAtom);
  const [isOpen, setIsOpen] = useState(false);

  const RankingList = [
    { id: "test", am: 22, rank: 1 },
    { id: "test", am: 22, rank: 2 },
    { id: "test", am: 22, rank: 3 },
    { id: "test", am: 22, rank: 4 },
    { id: "test", am: 22, rank: 5 },
  ];

  useEffect(() => {
    if (!!isModalOpen) {
      setIsOpen(true);
    }
  }, [isModalOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
        onClose();
      }}
      style={{
        overlay: {
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: "1500",
        },
        content: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "50%",
          padding: "0",
          border: "none",
          background: isDark ? "#333333" : "#eeeeee",
          paddingBlock: "25px",
          paddingInline: "24px",
        },
      }}
    >
      <SubTitle>순위 목록</SubTitle>
      <SubBox>
        {RankingList.map((ranking) => (
          <Element key={ranking.rank}>
            <div>{ranking.rank}</div>
            <div>{ranking.id}</div>
            <div>{ranking.am}</div>
          </Element>
        ))}
      </SubBox>
    </ReactModal>
  );
}

const Element = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 24px;
  border-radius: 10px;
  font-size: 12px;
  background: ${(props) => props.theme.subBoxColor2};

  @media screen and (min-width: 600px) {
    font-size: 14px;
  }

  @media screen and (min-width: 900px) {
    font-size: 16px;
  }
`;

const SubBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 1000px;
  margin: 0 auto;

  @media screen and (min-width: 600px) {
    padding: 0 20px;
  }

  @media screen and (min-width: 900px) {
    padding: 0 40px;
  }
`;

const SubTitle = styled.p`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
  text-align: center;
  margin: 30px 0;
`;

export default Ranking;
