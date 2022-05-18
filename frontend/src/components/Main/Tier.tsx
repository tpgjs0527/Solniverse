import { useState } from "react";
import styled from "styled-components";
import { ColRef } from "./Dashboard";
import Rank from "./Rank";

interface IProps {
  tier: string | undefined;
  index?: number;
  dashboard?: boolean;
  ranking?: boolean;
}

function Tier({ tier, index, dashboard, ranking }: IProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Col ranking={ranking}>
        {ranking ? null : (
          <>
            {dashboard ? (
              <ColTitle>현재 나의 등급</ColTitle>
            ) : (
              <ColTitleRank>{tier}</ColTitleRank>
            )}
          </>
        )}

        {!(tier === "Platinum") && !(tier === "Diamond") ? (
          <Icon tier={tier} ranking={ranking}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </Icon>
        ) : tier === "Platinum" ? (
          <IconHighTier ranking={ranking}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="url(#Platinum)"
            >
              <defs>
                <radialGradient id="Platinum" spreadMethod="reflect">
                  <stop offset="15%" stopColor="rgba(185, 242, 255, 1)" />
                  <stop offset="35%" stopColor="rgba(235, 251, 255, 1)" />
                  <stop offset="50%" stopColor="rgba(185, 255, 198, 1)" />
                  <stop offset="65%" stopColor="rgba(115, 125, 128, 1)" />
                  <stop offset="85%" stopColor="rgba(0, 0, 0, 1)" />
                  <stop offset="100%" stopColor="rgba(128, 128, 128, 1)" />
                </radialGradient>
              </defs>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </IconHighTier>
        ) : (
          <IconHighTier>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="url(#Diamond)"
            >
              <defs>
                <radialGradient id="Diamond" spreadMethod="reflect">
                  <stop offset="20%" stopColor="rgba(229, 228, 226, 1)" />
                  <stop offset="40%" stopColor="rgba(255, 255, 255, 1)" />
                  <stop offset="60%" stopColor="rgba(229, 226, 227, 1)" />
                  <stop offset="80%" stopColor="rgba(128, 128, 128, 1)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 1)" />
                </radialGradient>
              </defs>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </IconHighTier>
        )}
        {dashboard ? (
          <>
            <ColContent>{tier}</ColContent>
            <ColRef onClick={() => setIsModalOpen(true)}>등급표</ColRef>
          </>
        ) : ranking ? (
          <span>{tier}</span>
        ) : (
          <>
            {!!index ? (
              <ColContentRank>$ {100 * 5 ** (index - 1)}</ColContentRank>
            ) : (
              <ColContentRank>-</ColContentRank>
            )}
          </>
        )}
      </Col>

      <Rank isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

const IconHighTier = styled.div<{ ranking?: boolean }>`
  margin: ${(props) => (props.ranking ? "0" : "14px 0")};
  width: ${(props) => (props.ranking ? "20px" : "92px")};
  height: ${(props) => (props.ranking ? "20px" : "92px")};
`;

const Icon = styled.div<{ tier?: string; ranking?: boolean }>`
  margin: ${(props) => (props.ranking ? "0" : "14px 0")};
  width: ${(props) => (props.ranking ? "20px" : "92px")};
  height: ${(props) => (props.ranking ? "20px" : "92px")};
  color: ${(props) =>
    props.tier === "Bronze"
      ? "#CD7F32"
      : props.tier === "Silver"
      ? "#C0C0C0"
      : props.tier === "Gold"
      ? "#FFD700"
      : ""};
`;

const ColContentRank = styled.span`
  letter-spacing: -0.5px;
  font-weight: 600;
  color: ${(props) => props.theme.subTextColor};
`;

const ColTitleRank = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const ColContent = styled.span`
  letter-spacing: -0.5px;
  font-weight: 600;
`;

const ColTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: ${(props) => props.theme.subTextColor};
`;

const Col = styled.div<{ ranking?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.ranking ? "row" : "column")};
  justify-content: ${(props) => (props.ranking ? "" : "center")};
  align-items: center;
  gap: ${(props) => (props.ranking ? "2px" : "")};
  width: ${(props) => (props.ranking ? "70px" : "")};
  letter-spacing: -0.5px;
  @media screen and (min-width: 600px) {
    width: ${(props) => (props.ranking ? "80px" : "")};
  }

  @media screen and (min-width: 900px) {
    width: ${(props) => (props.ranking ? "110px" : "")};
  }
`;

export default Tier;
