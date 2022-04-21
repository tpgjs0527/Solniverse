import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import Main from "pages/main/Main";
import DonationHistory from "pages/main/DonationHistory";
import Donation from "./donation/Donation";
import NftReward from "pages/main/NftReward";
import ServiceCenter from "./main/ServiceCenter";
import Payment from "./donation/Payment";
import Home from "./home/Home";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Main />} />
      <Route path="/donation" element={<Donation />} />
      <Route path="/donation-history/*" element={<DonationHistory />} />
      <Route path="/nft-reward" element={<NftReward />} />
      <Route path="/service-center" element={<ServiceCenter />} />
      <Route path="/payment" element={<Payment />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
