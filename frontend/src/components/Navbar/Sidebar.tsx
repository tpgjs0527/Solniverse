import styled from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  accessTokenAtom,
  toggleSidebarAtom,
  toggleThemeAtom,
  userInfoAtom,
} from "atoms";
import { useNavigate } from "react-router-dom";
import Profile from "components/Navbar/Profile";
import Swal from "sweetalert2";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useRecoilState(toggleThemeAtom);
  const [isSidebar, setIsSidebar] = useRecoilState(toggleSidebarAtom);
  const setUserInfo = useSetRecoilState(userInfoAtom);
  const setAccessToken = useSetRecoilState(accessTokenAtom);

  return (
    <SideBar isSidebar={isSidebar}>
      <Col>
        <Icons>
          <Icon
            onClick={() => {
              setIsSidebar((prev) => !prev);
              navigate(`/main`);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
        <Profile />
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
                navigate(`/snv-world`);
              }}
            >
              SNV World
            </Element>
            <Element
              onClick={() => {
                setIsSidebar((prev) => !prev);
                navigate(`/service`);
              }}
            >
              서비스 안내
            </Element>
          </ul>
        </Nav>
        <div>
          <IconsBottom>
            {/* <SearchToggle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </SearchToggle> */}
            <ThemeToggle onClick={() => setIsDark((prev) => !prev)}>
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </ThemeToggle>
            <Logout
              onClick={() => {
                setIsSidebar((prev) => !prev);
                Swal.fire({
                  title: "로그아웃",
                  text: "지갑 연결을 끊으시겠습니까?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3990e0",
                  cancelButtonColor: "#e96e35",
                  confirmButtonText: "확인",
                  cancelButtonText: "취소",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire(
                      "로그아웃 완료",
                      "로그아웃이 완료되었습니다!",
                      "success"
                    );
                    setUserInfo({
                      twitch: {
                        id: "",
                        displayName: "",
                        profileImageUrl: "",
                      },
                      walletAddress: "",
                      createdAt: "",
                    });
                    setAccessToken("");
                  }
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Logout>
          </IconsBottom>
        </div>
      </Col>
    </SideBar>
  );
}

const Logout = styled.li`
  width: 28px;
  height: 28px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.ownColor};
  }
`;

const SearchToggle = styled.li`
  width: 28px;
  height: 28px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.ownColor};
  }
`;

const ThemeToggle = styled.li`
  width: 28px;
  height: 28px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.ownColor};
  }
`;

const IconsBottom = styled.ul`
  float: right;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Element = styled.li`
  font-size: 36px;
  line-height: 52px;
  font-weight: 700;
  letter-spacing: -0.8px;
  margin-bottom: 36px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.ownColor};
  }
`;

const Nav = styled.div`
  padding: 47px 0 66px;
  flex: 1;
`;

const Icon = styled.div`
  width: 28px;
  height: 28px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.ownColor};
  }
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: 36px;
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
  z-index: 2000;
`;
