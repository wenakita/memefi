import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
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
console.log(import.meta.env.VITE_NEXT_PUBLIC_PRIVY_APP_ID || "");
const projectId = import.meta.env.VITE_PROJECT_ID || "";

const metadata = {
  name: "React Starter Template",
  description: "A React starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: base });

const handleLogin = (user: any) => {
  console.log(`Welcome back ${user}`);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <PrivyProvider
        appId={import.meta.env.VITE_NEXT_PUBLIC_PRIVY_APP_ID || ""}
        onSuccess={handleLogin}
        config={{
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
          appearance: {
            theme: "dark",
          },
          loginMethods: ["wallet", "farcaster", "email"],
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PrivyProvider>
    </WagmiConfig>
  </React.StrictMode>
);
