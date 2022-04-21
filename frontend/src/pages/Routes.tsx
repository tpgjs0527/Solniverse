import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import Main from "pages/mypage/Main";
import DonationHistory from "pages/mypage/DonationHistory";
import Donation from "./donation/Donation";
import NftReward from "pages/mypage/NftReward";
import ServiceCenter from "./mypage/ServiceCenter";
import Payment from "./donation/Payment";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/mypage" element={<Main />} />
      <Route path="/donation" element={<Donation />} />
      <Route path="/donation-history/*" element={<DonationHistory />} />
      <Route path="/nft-reward" element={<NftReward />} />
      <Route path="/service-center" element={<ServiceCenter />} />
      <Route path="/payment" element={<Payment />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
