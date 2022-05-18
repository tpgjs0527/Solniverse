import { toggleSidebarAtom, userInfoAtom } from "atoms";
import useWallet from "hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

export default function Profile() {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoAtom);
  const [isSidebar, setIsSidebar] = useRecoilState(toggleSidebarAtom);
  const [, connectWallet] = useWallet();

  return (
    <>
      {userInfo.walletAddress ? (
        <ProfileDiv
          onClick={() => {
            if (isSidebar) {
              setIsSidebar((prev) => !prev);
            }
            navigate(`/settings`);
          }}
          sidebarStyle={isSidebar}
        >
          <PhantomIcon
            sidebarStyle={isSidebar}
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="17" cy="17" r="17" fill="url(#paint0_linear)" />
            <path
              d="M29.1702 17.2071H26.1733C26.1733 11.0997 21.205 6.14893 15.0758 6.14893C9.02255 6.14893 4.10117 10.9785 3.98072 16.9813C3.85611 23.1863 9.69824 28.5745 15.9261 28.5745H16.7095C22.2001 28.5745 29.5592 24.2916 30.709 19.0732C30.9213 18.1113 30.1588 17.2071 29.1702 17.2071ZM10.6223 17.4792C10.6223 18.2959 9.95192 18.9639 9.13229 18.9639C8.31265 18.9639 7.64231 18.2956 7.64231 17.4792V15.0773C7.64231 14.2606 8.31265 13.5926 9.13229 13.5926C9.95192 13.5926 10.6223 14.2606 10.6223 15.0773V17.4792ZM15.7961 17.4792C15.7961 18.2959 15.1258 18.9639 14.3062 18.9639C13.4865 18.9639 12.8162 18.2956 12.8162 17.4792V15.0773C12.8162 14.2606 13.4868 13.5926 14.3062 13.5926C15.1258 13.5926 15.7961 14.2606 15.7961 15.0773V17.4792Z"
              fill="url(#paint1_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="17"
                y1="0"
                x2="17"
                y2="34"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#534BB1" />
                <stop offset="1" stopColor="#551BF9" />
              </linearGradient>
              <linearGradient
                id="paint1_linear"
                x1="17.3617"
                y1="6.14893"
                x2="17.3617"
                y2="28.5745"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0.82" />
              </linearGradient>
            </defs>
          </PhantomIcon>
          <Nickname sidebarStyle={isSidebar}>{userInfo.walletAddress}</Nickname>
        </ProfileDiv>
      ) : (
        <Login onClick={connectWallet} isMobile={isMobile}>
          지갑 연결
        </Login>
      )}
    </>
  );
}

const Login = styled.div<{ isMobile: boolean }>`
  width: 152px;
  height: 28px;
  display: ${(props) => (props.isMobile ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  background: ${(props) => props.theme.ownColor};
  &:hover {
    background: ${(props) => props.theme.ownColorHover};
  }
`;

// const Item = styled.li`
//   line-height: 40px;
//   font-weight: 500;
//   letter-spacing: -0.5px;
//   text-align: center;
//   cursor: pointer;
//   &:hover {
//     color: ${(props) => props.theme.ownColor};
//   }
// `;

// const Item1 = styled.li`
//   line-height: 40px;
//   font-weight: 500;
//   letter-spacing: -0.5px;
//   text-align: center;
//   cursor: pointer;
//   border-bottom: 1px solid ${(props) => props.theme.borderColor};
//   &:hover {
//     color: ${(props) => props.theme.ownColor};
//   }
// `;

// const Dropdowns = styled.ul`
//   position: absolute;
//   top: 45px;
//   left: -10px;
//   /* padding: 11px 0 13px; */
//   border-bottom-left-radius: 10px;
//   border-bottom-right-radius: 10px;
//   min-width: 142px;
//   background: ${(props) => props.theme.bgColor};
//   border: 1px solid ${(props) => props.theme.borderColor};
//   display: ${(props) => (props.sidebarStyle ? "flex" : "none")};
// `;

const Nickname = styled.div<{ sidebarStyle: boolean }>`
  font-weight: 700;
  letter-spacing: -0.03em;
  overflow: hidden;
  text-overflow: ellipsis;
  width: ${(props) => (props.sidebarStyle ? "200px" : "100px")};
  font-size: ${(props) => (props.sidebarStyle ? "17px" : "12px")};
  line-height: ${(props) => (props.sidebarStyle ? "21px" : "1.4")};
`;

const PhantomIcon = styled.svg<{ sidebarStyle: boolean }>`
  width: ${(props) => (props.sidebarStyle ? "28px" : "18px")};
  height: ${(props) => (props.sidebarStyle ? "28px" : "18px")};
`;

const ProfileDiv = styled.div<{ sidebarStyle: boolean }>`
  min-width: 152px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: ${(props) => (props.sidebarStyle ? "18px 0" : "0 30px 0 0")};
  gap: ${(props) => (props.sidebarStyle ? "10px" : "5px")};
  &:hover {
    color: ${(props) => props.theme.ownColor};
  }

  @media screen and (max-width: 1023px) {
    display: ${(props) => (props.sidebarStyle ? "flex" : "none")};
  }
`;

// const Parents = styled.div<{ sidebarStyle: boolean }>`
//   position: relative;

//   @media screen and (max-width: 1023px) {
//     display: ${(props) => (props.sidebarStyle ? "flex" : "none")};
//   }
// `;
