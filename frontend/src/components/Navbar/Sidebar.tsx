import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { toggleSidebarAtom } from "atoms";

export default function Sidebar() {
  const isSidebar = useRecoilValue(toggleSidebarAtom);

  return <SideBar isSidebar={isSidebar}>sidebar</SideBar>;
}

const SideBar = styled.div<{ isSidebar: Boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: calc(100% - 45px);
  transform: ${(props) =>
    props.isSidebar ? "translateX(0%)" : "translateX(200%)"};
  transition: all 0.4s;
  background: blue;
`;
