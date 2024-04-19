import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  fantom,
  filecoin,
  kava,
  linea,
  mainnet,
  mantle,
  moonbeam,
  optimism,
  polygon,
  scroll,
} from "wagmi/chains";
import App from "./App";
import "./styles/index.css";

const chains = [
  mainnet,
  base,
  arbitrum,
  bsc,
  linea,
  polygon,
  mantle,
  optimism,
  scroll,
  filecoin,
  moonbeam,
  avalanche,
  fantom,
  celo,
  kava,
];

// 1. Get projectID at https://cloud.walletconnect.com

const projectId = import.meta.env.VITE_PROJECT_ID || "";

const metadata = {
  name: "React Starter Template",
  description: "A React starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);
