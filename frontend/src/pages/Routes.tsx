import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import Main from "pages/my-info/Main";
import DonationHistory from "pages/my-info/DonationHistory";
import Donation from "./donation/Donation";
import NftReward from "pages/my-info/NftReward";
import ServiceCenter from "./my-info/ServiceCenter";
import Payment from "./donation/Payment";
import Home from "./home/Home";
import MyPage from "./my-info/MyPage";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Main />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/donation" element={<Donation />} />
      <Route path="/donation-history/*" element={<DonationHistory />} />
      <Route path="/nft-reward" element={<NftReward />} />
      <Route path="/service-center" element={<ServiceCenter />} />
      <Route path="/payment" element={<Payment />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
