import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toggleSidebarAtom } from "atoms";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isSidebar, setIsSidebar] = useRecoilState(toggleSidebarAtom);

  return (
    <SideBar isSidebar={isSidebar}>
      <Col>
        <Icons>
          <Icon
            onClick={() => {
              setIsSidebar((prev) => !prev);
              navigate(`/mypage`);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Icon>
          <Icon onClick={() => setIsSidebar((prev) => !prev)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Icon>
        </Icons>
        <Profile>
          <BasicImg />
          <Nickname>닉네임</Nickname>
        </Profile>
        <Nav>
          <ul>
            <Element
              onClick={() => {
                setIsSidebar((prev) => !prev);
                navigate(`/donation-history`);
              }}
            >
              후원 내역
            </Element>
            <Element
              onClick={() => {
                setIsSidebar((prev) => !prev);
                navigate(`/nft-reward`);
              }}
            >
              NFT 리워드
            </Element>
            <Element
              onClick={() => {
                setIsSidebar((prev) => !prev);
                navigate(`/service-center`);
              }}
            >
              고객센터
            </Element>
          </ul>
        </Nav>
      </Col>
    </SideBar>
  );
}

const Element = styled.li`
  font-size: 36px;
  line-height: 52px;
  font-weight: 700;
  letter-spacing: -0.8px;
  margin-bottom: 36px;
  cursor: pointer;
`;

const Nav = styled.div`
  padding: 47px 0 66px;
`;

const Nickname = styled.div`
  font-size: 17px;
  line-height: 21px;
  font-weight: 700;
`;

const BasicImg = styled.div`
  width: 50px;
  height: 50px;
  background: #e5e8eb;
  border-radius: 50%;
`;

const Profile = styled.div`
  min-width: 152px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 18px 0;
`;

const Icon = styled.div`
  width: 28px;
  height: 28px;
  cursor: pointer;
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const SideBar = styled.div<{ isSidebar: Boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: calc(100% - 45px);
  padding: 0 24px;
  background: ${(props) => props.theme.bgColor};
  transform: ${(props) =>
    props.isSidebar ? "translateX(0%)" : "translateX(200%)"};
  transition: all 0.4s;
`;
