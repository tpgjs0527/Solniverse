import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import Main from "pages/my-info/Main";
import DonationHistory from "pages/my-info/DonationHistory";
import Donation from "./donation/Donation";
import SNVWorld from "pages/my-info/SNVWorld";
import ServiceCenter from "./my-info/ServiceCenter";
import Payment from "./donation/Payment";
import Home from "./home/Home";
import { Message } from "./donation/Message";
import Confirmed from "./donation/Confirmed";
import Settings from "./my-info/Settings";
import { Service } from "./home/Service";
import CandyDrop from "./nft/CandyDrop";
import Other from "./nft/Other";
import CandyMachineHome from "./candyMachine/CandyMachineHome";
import PageNotFound from "./Error/404";
import { isMobile } from "react-device-detect";
import PaymentMobile from "./donation/PaymentMobile";
import { MessageTest } from "./donation/MessageTest";

function Routes() {
  const userInfo = useRecoilValue(userInfoAtom);

  return (
    <ReactRouterRoutes>
      {/* <Route path="/donation/:displayName/:platform" element={<Donation />} /> */}
      <Route path="/donation/:walletAddress" element={<Donation />} />
      <Route
        path="/payment"
        element={isMobile ? <PaymentMobile /> : <Payment />}
      />
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
      <Route path="/hi" element={<CandyMachineHome />} />
      <Route
        path="/snv-world/*"
        element={
          userInfo.walletAddress ? <SNVWorld /> : <Navigate replace to="/" />
        }
      >
        <Route path="" element={<CandyMachineHome />} />
        <Route path="other" element={<Other />} />
      </Route>
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
      <Route path="/test/alertboxt" element={<MessageTest />} />
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
