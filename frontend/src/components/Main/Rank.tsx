// 등급표

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

function Rank({ isModalOpen, onClose }: IProps) {
  const isDark = useRecoilValue(toggleThemeAtom);
  const [isOpen, setIsOpen] = useState(false);

  const tierList = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

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
      <SubTitle>등급표</SubTitle>
      <SubBox>
        {tierList.map((tier, index) => (
          <Tier key={index} tier={tier} index={index} />
        ))}
      </SubBox>
    </ReactModal>
  );
}

const SubBox = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 10px;
  grid-row-gap: 50px;
  padding: 48px 40px;

  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    grid-row-gap: 50px;
  }

  @media screen and (min-width: 900px) {
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px;
  }
`;

const SubTitle = styled.p`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
  text-align: center;
  margin: 30px 0;
`;

export default Rank;
