import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";
import Main from "pages/mypage/Main";
import DonationHistory from "pages/mypage/DonationHistory";
import NftReward from "pages/mypage/NftReward";
import ServiceCenter from "./mypage/ServiceCenter";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/mypage" element={<Main />} />
      <Route path="/donation-history" element={<DonationHistory />} />
      <Route path="/nft-reward" element={<NftReward />} />
      <Route path="/service-center" element={<ServiceCenter />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
