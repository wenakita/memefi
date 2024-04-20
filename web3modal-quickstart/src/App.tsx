import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/main/Home";
import Layout from "./components/main/Layout";
import NotFound from "./components/main/NotFound";
import Nft from "./components/nft/Nft";
export default function App() {
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nft" element={<Nft />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
