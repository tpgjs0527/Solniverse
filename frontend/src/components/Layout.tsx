import styled from "styled-components";
import Header from "./Navbar/Header";
import Backdrop from "./Navbar/Backdrop";
import Sidebar from "./Navbar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  canGoBack?: boolean;
}

export default function Layout({ children, title, canGoBack }: LayoutProps) {
  return (
    <>
      <Header />
      <Backdrop />
      <Sidebar />
      <DEF>{children}</DEF>
    </>
  );
}

const DEF = styled.div`
  padding-top: 54px;
`;
