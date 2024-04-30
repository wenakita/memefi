import friendTechABI from "@/abi/friendTechABI";
import tokenABI from "@/abi/tokenABI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
interface passedParams {
  id: string;
}
function FriendTechHolding(props: passedParams) {
  const navigate = useNavigate();
  interface FriendTechSearch {
    id: number;
    address: string;
    twitterUsername: string;
    twitterName: string;
    twitterPfpUrl: string;
    twitterUserId: string;
    lastOnline: number;
    holderCount: number;
    holdingCount: number;
    shareSupply: number;
    displayPrice: string;
    lifetimeFeesCollectedInWei: string;
    ftName: string;
    followerCount: number;
    ftUsername: string;
    rank: number;
    ftPfpUrl: string;
  }

  const { address } = useAccount();
  const id: unknown = props.id;
  const [shareAddress, setShareAddress] = useState("");
  const [shareInfo, setShareInfo] = useState<FriendTechSearch | null>(null);
  const [tokenAmount, setTokenAmount] = useState("");

  const { data: friendTechUrl, isSuccess: successUrl } = useContractRead({
    address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    abi: friendTechABI,
    functionName: "uri",
    args: [id],
  });
  const {
    data: shareBalanceResult,
    isError: isShareBalanceError,
    isLoading: isReadingShareBalance,
    isSuccess: isShareBalanceLoaded,
  } = useContractRead({
    address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    abi: friendTechABI,
    functionName: "balanceOfBatch",
    //userAddress and FriendTech token id
    args: [[address], [id]],
  });

  const {
    data: buyPriceAfterFee,
    isError: cannotGetBuyPrice,
    isLoading: gettingBuyPrice,
    isSuccess: gotBuyPrice,
  } = useContractRead({
    address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
    abi: tokenABI,
    functionName: "getBuyPriceAfterFee",
    args: [shareInfo?.address, Number(tokenAmount)],
  });

  const {
    write: unWrap,
    data: unWrapData,
    isSuccess: isUnwrapSuccess,
  } = useContractWrite({
    address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    abi: friendTechABI,
    functionName: "unwrap",
    onSuccess(data) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
  });

  const {
    data: shareBuyResponse,
    isLoading: isBuyingShares,
    isSuccess: boughtShare,
    write: wrap,
  } = useContractWrite({
    address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    abi: friendTechABI,
    functionName: "wrap",
    onSuccess(data) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
  });

  useEffect(() => {
    if (isShareBalanceLoaded && successUrl) {
      const url: string = String(friendTechUrl);
      setShareAddress(url.slice(28, url.length));
    }
  }, []);

  useEffect(() => {
    axios
      .get(`https://prod-api.kosetto.com/users/${shareAddress}`)
      .then(function (results) {
        setShareInfo(results.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [shareAddress]);

  function unintConverter(target: unknown) {
    return Number(target) / 10 ** 18;
  }

  function createBuyTx() {
    if (gotBuyPrice) {
      const finalBuyPrice = String(unintConverter(buyPriceAfterFee));

      if (finalBuyPrice !== "0") {
        wrap?.({
          args: [shareAddress, Number(tokenAmount), "0x"],
          value: parseEther(finalBuyPrice),
        });
      }
    }
  }

  function createSellTx() {
    unWrap?.({
      args: [shareAddress, Number(tokenAmount)],
    });
  }

  function fetchUser() {}
  return (
    <div className="border border-slate-500 rounded-xl p-2 bg-black mb-3 mt-5">
      {/* <h1 className="text-white">{shareInfo?.address}</h1> */}
      <div className="md:grid md:grid-cols-3 auto-cols-max gap-2">
        <div className="flex justify-start gap-2">
          <img
            src={shareInfo?.ftPfpUrl}
            alt=""
            style={{ maxWidth: "15%" }}
            className="rounded-full"
          />
          <h1
            className="text-white mt-2 font-mono font-bold"
            style={{ fontSize: "12px" }}
          >
            {shareInfo?.ftName}
          </h1>
        </div>
        <div className="">
          <div className="">
            <h3 className="font-regular" style={{ fontSize: "10px" }}>
              Balance:{" "}
              {Number(shareBalanceResult) > 1
                ? Number(shareBalanceResult) + " shares"
                : Number(shareBalanceResult) + "share"}
            </h3>
          </div>
          <div>
            <h3 className="font-regular" style={{ fontSize: "10px" }}>
              Volume:{unintConverter(shareInfo?.displayPrice)} Ξ
            </h3>
          </div>
          <div>
            <h3 className="font-light" style={{ fontSize: "10px" }}>
              Value :
              {Number(shareBalanceResult) *
                unintConverter(shareInfo?.displayPrice)}{" "}
              Ξ
            </h3>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger>
              <Button
                className="border border-slate-500 rounded-xl font-bold bg-black hover:bg-green-600 w-20"
                style={{ fontSize: "10px" }}
              >
                <span className="flex justify-center gap-2">
                  <h3 style={{ fontSize: "11px" }} className="mt-0.5">
                    Mint
                  </h3>
                  <img
                    src={
                      "https://i.pinimg.com/originals/49/02/54/4902548424a02117b7913c17d2e379ff.gif"
                    }
                    className=""
                    alt=""
                    style={{ maxWidth: "50%" }}
                  />
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-slate-500 rounded-xl bg-black">
              <DialogHeader>
                <DialogTitle>
                  <DialogTitle>
                    <img
                      src={shareInfo?.ftPfpUrl}
                      alt=""
                      className="rounded-full mb-2"
                      style={{ maxWidth: "15%" }}
                    />
                  </DialogTitle>

                  <DialogTitle>
                    <div className="flex justify-start gap-1">
                      <img
                        src="https://i.pinimg.com/originals/49/02/54/4902548424a02117b7913c17d2e379ff.gif"
                        alt=""
                        style={{ maxWidth: "7%" }}
                      />
                      <p className="mt-2">Mint {shareInfo?.ftName} shares</p>
                    </div>
                  </DialogTitle>
                  <DialogTitle>
                    <div className="flex justify-start">
                      <a
                        href={`https://www.friend.tech/${shareInfo?.address}`}
                        target="_blank"
                        className="mt-2"
                      >
                        <span className="flex">
                          <h3
                            className="mt-3.5 font-mono"
                            style={{ fontSize: "10px" }}
                          >
                            friend.tech profile
                          </h3>
                          <img
                            src="https://freepngimg.com/thumb/twitter/108250-badge-twitter-verified-download-free-image-thumb.png"
                            alt=""
                            style={{ maxWidth: "12%" }}
                          />
                        </span>
                      </a>
                    </div>
                  </DialogTitle>
                  <DialogTitle>
                    <h3
                      className="font-mono font-light"
                      style={{ fontSize: "10px" }}
                    >
                      Contract: {shareInfo?.address}
                    </h3>
                  </DialogTitle>
                </DialogTitle>
                <DialogDescription>
                  <div className="mt-1">
                    <h1
                      className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 "
                      style={{ fontSize: "10px" }}
                    >
                      Price: {unintConverter(shareInfo?.displayPrice)} ETH /
                      Share
                    </h1>
                  </div>
                  <div className="mt-5">
                    <Input
                      type="text"
                      placeholder="Enter amount shares to mint..."
                      style={{ fontSize: "12px" }}
                      className="rounded-xl border-slate-500"
                      onChange={(e) => {
                        setTokenAmount(e.target.value);
                      }}
                    />
                    <div className="flex justify-center mt-2">
                      <Button
                        className="border border-slate-600 rounded-xl bg-black hover:bg-white hover:text-black"
                        onClick={() => {
                          createBuyTx();
                        }}
                      >
                        <img
                          src="https://i.pinimg.com/originals/49/02/54/4902548424a02117b7913c17d2e379ff.gif"
                          alt=""
                          style={{ maxWidth: "5%" }}
                        />
                        <h3>Mint</h3>
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <Button
                className="border border-slate-500 rounded-xl font-bold bg-black hover:bg-red-600 w-20"
                style={{ fontSize: "10px" }}
              >
                <span className="flex justify-center gap-2">
                  <h3 style={{ fontSize: "12px" }}>Burn</h3>
                  <img
                    src={
                      "https://media3.giphy.com/media/J2awouDsf23R2vo2p5/giphy.gif?cid=6c09b95271qkr9h7zeqhzcchzf0g93pzapi9qzlx1f8ha35c&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=e"
                    }
                    className=""
                    alt=""
                    style={{ maxWidth: "40%" }}
                  />
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-slate-500 rounded-xl bg-black">
              <DialogHeader>
                <DialogTitle>
                  <DialogTitle>
                    <img
                      src={shareInfo?.ftPfpUrl}
                      alt=""
                      className="rounded-full mb-2"
                      style={{ maxWidth: "15%" }}
                    />
                  </DialogTitle>

                  <DialogTitle>
                    <div className="flex justify-start gap-1">
                      <img
                        src="https://media3.giphy.com/media/J2awouDsf23R2vo2p5/giphy.gif?cid=6c09b95271qkr9h7zeqhzcchzf0g93pzapi9qzlx1f8ha35c&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=e"
                        alt=""
                        style={{ maxWidth: "7%" }}
                      />
                      <p className="mt-2">Burn {shareInfo?.ftName} shares</p>
                    </div>
                  </DialogTitle>
                  <DialogTitle>
                    <div className="flex justify-start">
                      <a
                        href={`https://www.friend.tech/${shareInfo?.address}`}
                        target="_blank"
                        className="mt-2"
                      >
                        <span className="flex">
                          <h3
                            className="mt-3.5 font-mono"
                            style={{ fontSize: "10px" }}
                          >
                            friend.tech profile
                          </h3>
                          <img
                            src="https://freepngimg.com/thumb/twitter/108250-badge-twitter-verified-download-free-image-thumb.png"
                            alt=""
                            style={{ maxWidth: "12%" }}
                          />
                        </span>
                      </a>
                    </div>
                  </DialogTitle>
                  <DialogTitle>
                    <h3
                      className=" font-mono font-light"
                      style={{ fontSize: "10px" }}
                    >
                      Contract: {shareInfo?.address}
                    </h3>
                  </DialogTitle>
                </DialogTitle>
                <DialogDescription>
                  <div className="mt-1">
                    <h1
                      className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 "
                      style={{ fontSize: "10px" }}
                    >
                      Price: {unintConverter(shareInfo?.displayPrice)} ETH /
                      Share
                    </h1>
                  </div>
                  <div className="mt-5">
                    <Input
                      type="text"
                      placeholder="Enter amount shares to mint..."
                      style={{ fontSize: "12px" }}
                      className="rounded-xl border-slate-500"
                      onChange={(e) => {
                        setTokenAmount(e.target.value);
                      }}
                    />
                    <div className="flex justify-center mt-2">
                      <Button
                        className="border border-slate-600 rounded-xl bg-black hover:bg-white hover:text-black"
                        onClick={() => {
                          createSellTx();
                        }}
                      >
                        <img
                          src="https://media3.giphy.com/media/J2awouDsf23R2vo2p5/giphy.gif?cid=6c09b95271qkr9h7zeqhzcchzf0g93pzapi9qzlx1f8ha35c&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=e"
                          alt=""
                          style={{ maxWidth: "5%" }}
                        />
                        <h3>Burn</h3>
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default FriendTechHolding;
