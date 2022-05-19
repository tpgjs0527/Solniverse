// 순위표

import { toggleThemeAtom, userInfoAtom } from "atoms";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { IData } from "./Dashboard";
import Tier from "./Tier";

interface IProps {
  isModalOpen: boolean;
  onClose: Function;
  data: IData | undefined;
}

function Ranking({ isModalOpen, onClose, data }: IProps) {
  const isDark = useRecoilValue(toggleThemeAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const [isOpen, setIsOpen] = useState(false);

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
          height: "85%",
          padding: "0",
          border: "none",
          background: isDark ? "#333333" : "#eeeeee",
          paddingBlock: "25px",
          paddingInline: "24px",
        },
      }}
    >
      <SubTitle>순위표</SubTitle>
      <SubCon>
        현재 나의 순위를 기준으로 ±5 내에 속하는 사용자를 볼 수 있습니다.
      </SubCon>
      <SubBox>
        {data?.previousList?.map((el, index) => (
          <Element key={index}>
            <RankingSize>{data.ranking - 5 + index}</RankingSize>
            <Tier
              tier={el.receiveRank ? el.receiveRank : el.sendRank}
              ranking
            />
            <Name>
              {el.user.twitch
                ? el.user.twitch.displayName
                : el.user.walletAddress}
            </Name>
            <Amount>
              ${" "}
              {el?.receiveTotal
                ? el?.receiveTotal.toFixed(2)
                : el?.sendTotal
                ? el?.sendTotal.toFixed(2)
                : 0}
            </Amount>
          </Element>
        ))}
        {data?.ranking === -1 ? (
          <Element>
            <Empty>아직 후원 내역이 없어 순위를 산정할 수 없습니다.</Empty>
          </Element>
        ) : (
          <Element isActive>
            <RankingSize>{data?.ranking}</RankingSize>
            <Tier
              tier={data?.receiveRank ? data?.receiveRank : data?.sendRank}
              ranking
            />
            <Name>
              {userInfo?.twitch
                ? userInfo?.twitch.displayName
                : userInfo?.walletAddress}
            </Name>
            <Amount>
              ${" "}
              {data?.receiveTotal
                ? data?.receiveTotal.toFixed(2)
                : data?.sendTotal
                ? data?.sendTotal.toFixed(2)
                : 0}
            </Amount>
          </Element>
        )}

        {data?.nextList?.map((el, index) => (
          <Element key={index}>
            <RankingSize>{data.ranking + index + 1}</RankingSize>
            <Tier
              tier={el.receiveRank ? el.receiveRank : el.sendRank}
              ranking
            />
            <Name>
              {el.user.twitch
                ? el.user.twitch.displayName
                : el.user.walletAddress}
            </Name>
            <Amount>
              ${" "}
              {el?.receiveTotal
                ? el?.receiveTotal.toFixed(2)
                : el?.sendTotal
                ? el?.sendTotal.toFixed(2)
                : 0}
            </Amount>
          </Element>
        ))}
      </SubBox>
    </ReactModal>
  );
}

const Empty = styled.span`
  margin: auto;
`;

const Amount = styled.span`
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;

  @media screen and (min-width: 600px) {
    width: 60px;
  }

  @media screen and (min-width: 900px) {
    width: 100px;
  }
`;

const Name = styled.span`
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media screen and (min-width: 600px) {
    width: 100px;
  }

  @media screen and (min-width: 900px) {
    width: 200px;
  }
`;

const TierSize = styled.span`
  width: 50px;

  @media screen and (min-width: 600px) {
    width: 60px;
  }

  @media screen and (min-width: 900px) {
    width: 100px;
  }
`;

const RankingSize = styled.span`
  width: 24px;

  @media screen and (min-width: 900px) {
    width: 50px;
  }
`;

const Element = styled.div<{ isActive?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 15px 14px;
  border-radius: 10px;
  line-height: 20px;
  font-size: 12px;
  letter-spacing: -0.5px;
  background: ${(props) =>
    props.isActive ? props.theme.ownColor : props.theme.subBoxColor2};
  color: ${(props) => (props.isActive ? "whitesmoke" : props.theme.textColor)};
  font-weight: ${(props) => (props.isActive ? "600" : "")};

  @media screen and (min-width: 600px) {
    font-size: 14px;
  }

  @media screen and (min-width: 900px) {
    font-size: 16px;
    padding: 15px 20px;
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

const SubCon = styled.p`
  font-size: 14px;
  letter-spacing: -0.5px;
  text-align: center;
  color: ${(props) => props.theme.subTextColor};
  margin: 15px 0 30px 0;
`;

const SubTitle = styled.p`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
  text-align: center;
  margin-top: 15px;
`;

export default Ranking;
