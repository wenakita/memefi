import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContractRead, useAccount } from "wagmi";

import { NavLink, useNavigate } from "react-router-dom";
import calcAbi from "@/abi/calcCaABI";
function Home() {
  const { address } = useAccount();
  const [currentPrice, setCurrentPrice] = useState(0);
  const navigate = useNavigate();
  const {
    data: supplyResults,
    isError: isReadError,
    isLoading: isReadingLoading,
  } = useContractRead({
    //Contract where you can get the tokens supply
    address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
    abi: calcAbi,
    functionName: "sharesSupply",
    //friendtech supplier address
    args: ["0x7b202496C103DA5BEDFE17aC8080B49Bd0a333f1"],
  });

  useEffect(() => {
    const currentSupply = Number(supplyResults);
    const currentPrice = (currentSupply * currentSupply) / 16000;
    setCurrentPrice(currentPrice);
  }, []);

  return (
    <div className="mt-10 container flex justify-center">
      <Card
        className="p-3 border border-slate-400 rounded-xl bg-black"
        style={{ width: "20rem" }}
      >
        <CardHeader className="border border-slate-400 p-4 rounded-xl">
          <CardTitle className="">
            <span>
              <img
                src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                alt=""
                style={{ maxWidth: "30%" }}
              />
            </span>
            <span className="ms-2">
              <h6 className="text-md">$oooOOO</h6>
              <h6 className="mt-3 text-sm">
                Your omnichain adventure awaits at /goddog with suprises.
                Explore and earn across multiple chains!
              </h6>
            </span>
          </CardTitle>
          <CardDescription className="">
            <div className="flex justify-start gap-2 mt-3">
              <Button
                className="border border-slate-500 rounded-xl bg-stone-900"
                onClick={() => {
                  navigate("/friend/find");
                }}
              >
                <p>
                  <span className="flex justify-center gap-2">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:296/1*Juq6BdPq_ZaihhSok1sh7w.png"
                      alt=""
                      style={{ maxWidth: "15%" }}
                    />
                    <p className="mt-1 font-light" style={{ fontSize: "8px" }}>
                      Mint & Burn erc-1155s
                    </p>
                  </span>
                </p>
              </Button>
              <Button
                className="border border-slate-500 rounded-xl bg-stone-900"
                onClick={() => {
                  navigate("/friend");
                }}
              >
                <span className="flex justify-center gap-1">
                  <img
                    src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                    alt=""
                    style={{ maxWidth: "25%" }}
                  />
                  <p style={{ fontSize: "8px" }} className="mt-0.5">
                    Mint Goddog shares
                  </p>
                </span>
              </Button>
            </div>
            <div className="flex justify-center mt-4 mb-2 gap-1">
              <img
                src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                alt=""
                style={{ maxWidth: "8%" }}
              />
              <p className="mt-1" style={{ fontSize: "10px" }}>
                {address
                  ? currentPrice + " ETH / Friend.tech share"
                  : "Connect wallet to view share price"}
              </p>
            </div>
            <div
              className="flex justify-center mt-4 gap-2 underline text-slate-400"
              style={{ fontSize: "10px" }}
            >
              <a href="https://linktr.ee/goddog69" target="_blank">
                LinkTree
              </a>
              <a
                href=""
                onClick={() => {
                  navigate("/friend/find");
                }}
              >
                Friend.Tech Swap
              </a>
              <a
                href=""
                onClick={() => {
                  navigate("/friend");
                }}
              >
                Friend.Tech
              </a>
              <a
                href=""
                onClick={() => {
                  navigate("/nft");
                }}
              >
                NFT
              </a>
            </div>
          </CardDescription>
        </CardHeader>
        <div
          className="flex justify-center mt-4 overflow-hidden"
          style={{ fontSize: "11px" }}
        >
          <a
            href="https://interchain.axelar.dev/base/0xDDf7d080C82b8048BAAe54e376a3406572429b4e"
            target="_blank"
            className="underline text-slate-200"
          >
            0xDDf7d080C82b8048BAAe54e376a3406572429b4e
          </a>
        </div>
      </Card>
    </div>
  );
}

export default Home;
