import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toggleSidebarAtom } from "atoms";

export default function Backdrop() {
  const [isSidebar, setIsSidebar] = useRecoilState(toggleSidebarAtom);

  return (
    <BackDrop
      isSidebar={isSidebar}
      onClick={() => setIsSidebar((prev) => !prev)}
    ></BackDrop>
  );
}

const BackDrop = styled.div<{ isSidebar: Boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: ${(props) => (props.isSidebar ? "block" : "none")};
  z-index: 1500;
`;
