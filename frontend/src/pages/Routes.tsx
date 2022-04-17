import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";
import Main from "pages/mypage/Main";
import DonationHistory from "pages/mypage/DonationHistory";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/mypage" element={<Main />} />
      <Route path="/donation-history" element={<DonationHistory />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
