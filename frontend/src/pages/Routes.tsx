import {
  Routes as ReactRouterRoutes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import Main from "pages/my-info/Main";
import DonationHistory from "pages/my-info/DonationHistory";
import Donation from "./donation/Donation";
import NftReward from "pages/my-info/NftReward";
import ServiceCenter from "./my-info/ServiceCenter";
import Payment from "./donation/Payment";
import Home from "./home/Home";
import { Message } from "./donation/Message";
import Confirmed from "./donation/Confirmed";
import Settings from "./my-info/Settings";
import { Service } from "./home/Service";
import PageNotFound from "./Error/404";

function Routes() {
  const userInfo = useRecoilValue(userInfoAtom);

  return (
    <ReactRouterRoutes>
      {/* <Route path="/donation/:displayName/:platform" element={<Donation />} /> */}
      <Route path="/donation/:walletAddress" element={<Donation />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/confirmed" element={<Confirmed />} />

      {/* URL 직접 접근 제어 */}
      <Route
        path="/"
        element={
          userInfo.walletAddress ? <Navigate replace to="/main" /> : <Home />
        }
      />
      <Route path="/service" element={<Service />} />
      <Route
        path="/main"
        element={
          userInfo.walletAddress ? <Main /> : <Navigate replace to="/" />
        }
      />
      <Route
        path="/settings/*"
        element={
          userInfo.walletAddress ? <Settings /> : <Navigate replace to="/" />
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
      <Route path="/donation/alertbox/:uuid" element={<Message />} />

      {/* 404 가장 밑에 위치 */}
      <Route
        path="*"
        element={
          userInfo.walletAddress ? (
            <PageNotFound />
          ) : (
            <Navigate replace to="/" />
          )
        }
      />
    </ReactRouterRoutes>
  );
}

export default Routes;
