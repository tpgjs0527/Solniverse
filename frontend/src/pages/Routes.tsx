import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import Main from "pages/my-info/Main";
import DonationHistory from "pages/my-info/DonationHistory";
import Donation from "./donation/Donation";
import NftReward from "pages/my-info/NftReward";
import ServiceCenter from "./my-info/ServiceCenter";
import Payment from "./donation/Payment";
import Home from "./home/Home";
import Account from "./my-info/Account";
import Confirmed from "./donation/Confirmed";

function Routes() {
  const userInfo = useRecoilValue(userInfoAtom);

  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/donation" element={<Donation />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/confirmed" element={<Confirmed />} />

      {/* URL 직접 접근 제어 */}
      <Route
        path="/main"
        element={
          userInfo.walletAddress ? <Main /> : <Navigate replace to="/" />
        }
      />
      <Route
        path="/account"
        element={
          userInfo.walletAddress ? <Account /> : <Navigate replace to="/" />
        }
      />
      <Route
        path="/donation-history/*"
        element={
          userInfo.walletAddress ? (
            <DonationHistory />
          ) : (
            <Navigate replace to="/" />
          )
        }
      />
      <Route
        path="/nft-reward"
        element={
          userInfo.walletAddress ? <NftReward /> : <Navigate replace to="/" />
        }
      />
      <Route
        path="/service-center"
        element={
          userInfo.walletAddress ? (
            <ServiceCenter />
          ) : (
            <Navigate replace to="/" />
          )
        }
      />
    </ReactRouterRoutes>
  );
}

export default Routes;
