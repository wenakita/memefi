import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink, useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();

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
              <Button className="border rounded-xl bg-stone-900">
                <a href="https://warpcast.com/~/channel/goddog" target="_blank">
                  <span className="flex justify-start gap-2">
                    <img
                      src="https://github.com/vrypan/farcaster-brand/blob/main/icons/icon-transparent/transparent-white.png?raw=true"
                      alt=""
                      style={{ maxWidth: "15%" }}
                    />
                    <p className="mt-1 text-xs">/Goddog</p>
                  </span>
                </a>
              </Button>
              <Button className="border rounded-xl bg-stone-900">
                <a
                  href="https://app.uniswap.org/swap?outputCurrency=0xDDf7d080C82b8048BAAe54e376a3406572429b4e&chain=base"
                  target="_blank"
                >
                  Buy Now
                </a>
              </Button>
            </div>
            <div className="flex justify-center mt-4 text-xs gap-2 underline text-slate-400">
              <a href="https://linktr.ee/goddog69" target="_blank">
                LinkTree
              </a>
              <a href="https://warpcast.com/~/channel/goddog" target="_blank">
                Warpcast
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
