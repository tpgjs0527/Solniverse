import styled from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toggleThemeAtom, toggleSidebarAtom } from "atoms";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useRecoilState(toggleThemeAtom);
  const setIsSidebar = useSetRecoilState(toggleSidebarAtom);

  return (
    <Nav>
      <Col>
        <Logo onClick={() => navigate(`/mypage`)}>Solniverse</Logo>
        <Items>
          <Item onClick={() => setIsDark((prev) => !prev)}>
            {isDark ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
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
          </Item>
          <Item onClick={() => setIsSidebar((prev) => !prev)}>
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Item>
        </Items>
      </Col>
    </Nav>
  );
}

const Item = styled.li`
  width: 28px;
  height: 28px;
  cursor: pointer;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
`;

const Col = styled.div`
  height: 54px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nav = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  border-bottom: 1px solid #dfe6e9;
`;
