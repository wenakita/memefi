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
    <div className="mt-[120px] container flex justify-center">
      <Card
        className="p-3 border border-neutral-600 rounded-xl bg-black"
        style={{ width: "20rem" }}
      >
        <CardHeader className=" border border-neutral-600 p-4 rounded-xl">
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
                Your omnichain adventure awaits at /goddog with surprises.
                Explore and earn across multiple chains!
              </h6>
            </span>
          </CardTitle>
          <CardDescription className="">
            <div className="flex justify-start gap-2 mt-3">
              <a
                type="button"
                href="https://warpcast.com/~/channel/goddog"
                className="border border-neutral-700 rounded-xl bg-stone-900 p-1"
              >
                <p>
                  <span className="flex justify-start gap-2">
                    <img
                      src="https://github.com/vrypan/farcaster-brand/blob/main/icons/icon-transparent/transparent-white.png?raw=true"
                      alt=""
                      style={{ maxWidth: "15%" }}
                      className="mt-1"
                    />
                    <p className="mt-1.5 font-bold" style={{ fontSize: "8px" }}>
                      Warpcast
                    </p>
                  </span>
                </p>
              </a>
              <a
                type="button"
                href="https://frenmint.goddog.io/#/"
                className="border border-neutral-700 rounded-xl bg-stone-900 p-2"
              >
                <span className="flex justify-start gap-1 w-[80px]">
                  <img
                    src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                  <p style={{ fontSize: "8px" }} className="mt-0.5 font-bold">
                    FrenMint
                  </p>
                </span>
              </a>
            </div>

            <div
              className="flex justify-center mt-4 gap-2 underline text-slate-400"
              style={{ fontSize: "10px" }}
            >
              <a href="https://telegra.ph/GODDOG-Official-Whitepaper-06-01" target="_blank">
                Whitepaper
              </a>
              <a href="https://warpcast.com/~/channel/goddog" target="_blank">
                Warpcast
              </a>
              <a href="https://x.com/goddog_official" target="_blank">
                Twitter
              </a>
              <a href="https://t.me/goddog_official" target="_blank">
                Telegram
              </a>
              <a href="https://telegra.ph/What-is-FrenMint-06-03" target="_blank">
                What is FrenMint?
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
            className="underline text-stone-400"
          >
            0xDDf7d080C82b8048BAAe54e376a3406572429b4e
          </a>
        </div>
      </Card>
    </div>
  );
}

export default Home;
