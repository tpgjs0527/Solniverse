// index.html body의 id="root"를 가진 div 안에 넣어줌

import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import reportWebVitals from "reportWebVitals";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
