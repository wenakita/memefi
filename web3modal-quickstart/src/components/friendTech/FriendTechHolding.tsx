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
import { AreaChart } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
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
  const [mainChartData, setMainChartData] = useState<PriceData[]>([]);

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

  function getShareEvents() {
    axios
      .get(`https://prod-api.kosetto.com/friends-activity/${shareAddress}`)
      .then(function (results) {
        console.log(results.data.events);
        prepareChartData(results?.data.events);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  interface EventType {
    ethAmount: number;
    shareAmount: number;
    createdAt: string;
    isBuy?: boolean;
  }

  interface PriceData {
    price: number;
    date: string;
  }
  interface MainData {
    price: string;
    date: string;
  }

  function prepareChartData(eventData: EventType[]) {
    const priceData: PriceData[] = [];
    const temp = new Date().toString();
    console.log(temp);

    eventData.map((item: EventType) => {
      const currentBuyEthAmount = unintConverter(item.ethAmount);
      const shareBuyAmount = Number(item?.shareAmount);
      const currentEventTimestamp = String(new Date(item?.createdAt));
      console.log(currentEventTimestamp);
      if (shareBuyAmount === 1 && item?.isBuy) {
        priceData.push({
          price: currentBuyEthAmount,
          date: currentEventTimestamp,
        });
      }

      setMainChartData(priceData);
    });
  }
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
              Value :
              {Number(shareBalanceResult) *
                unintConverter(shareInfo?.displayPrice)}{" "}
              Ξ
            </h3>
          </div>
          <div>
            <h3 className="font-regular" style={{ fontSize: "10px" }}>
              Volume:{unintConverter(shareInfo?.displayPrice)} Ξ
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
                      className="font-mono font-light flex justify-start"
                      style={{ fontSize: "10px" }}
                    >
                      Contract: {shareInfo?.address}
                    </h3>
                  </DialogTitle>
                </DialogTitle>
                <DialogDescription>
                  <div className="">
                    <h1
                      className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 flex justify-start"
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
                    <h3
                      className="flex justify-end mt-1 me-2"
                      style={{ fontSize: "10px" }}
                    >
                      Balance:{" "}
                      {Number(shareBalanceResult) > 1
                        ? Number(shareBalanceResult) + " shares"
                        : Number(shareBalanceResult) + " share"}
                    </h3>
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
                className="border border-slate-500 rounded-xl font-bold bg-black hover:bg-green-600 w-20"
                style={{ fontSize: "10px" }}
                onClick={() => {
                  getShareEvents();
                }}
              >
                <span className="flex justify-center gap-2">
                  <h3 style={{ fontSize: "11px" }} className="mt-0.5">
                    Chart
                  </h3>
                  <img
                    src={
                      "https://media3.giphy.com/media/hZE5xoaM0Oxw4xiqH7/giphy.gif?cid=82a1493b8d9p1o6zrl0qwsz7ve7kglvu0015yeopmy895rvt&ep=v1_gifs_search&rid=giphy.gif&ct=g"
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
                  <div>
                    <img
                      src={shareInfo?.ftPfpUrl}
                      alt=""
                      className="rounded-full"
                      style={{ maxWidth: "15%" }}
                    />
                  </div>
                  <div className="flex justify-start mt-3 gap-1">
                    <img
                      src="https://media3.giphy.com/media/hZE5xoaM0Oxw4xiqH7/giphy.gif?cid=82a1493b8d9p1o6zrl0qwsz7ve7kglvu0015yeopmy895rvt&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                      alt=""
                      style={{ maxWidth: "3.5%" }}
                    />
                    <h3 style={{ fontSize: "12px" }} className="mt-0.5">
                      {shareInfo?.ftUsername} price history
                    </h3>
                  </div>
                  <div className="flex justify-start">
                    <a
                      href={`https://www.friend.tech/${shareInfo?.address}`}
                      target="_blank"
                      className=""
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
                  <div>
                    <h3
                      className="font-mono font-light flex justify-start"
                      style={{ fontSize: "8px" }}
                    >
                      Contract: {shareInfo?.address}
                    </h3>
                  </div>
                </DialogTitle>

                <DialogDescription className="">
                  <div className="mt-2">
                    {mainChartData !== undefined && mainChartData.length > 1 ? (
                      //here we only displat
                      <>
                        <div className="ms-auto me-auto mt-2">
                          <AreaChart
                            width={400}
                            height={200}
                            data={mainChartData}
                            className=""
                          >
                            <XAxis dataKey="date" />

                            <YAxis dataKey="price" />

                            <CartesianGrid />

                            <Tooltip />
                            <Area type={"monotone"} dataKey="price" fill="" />
                            <Area type={"monotone"} dataKey="date" fill="" />
                          </AreaChart>
                        </div>
                        <ScrollArea className="h-20 w-50 rounded-xl p-1">
                          {mainChartData.map(
                            (item: PriceData, index: number) => {
                              return (
                                <div key={index} className="bg-black">
                                  <div className="grid grid-cols-3">
                                    <div className="border border-stone-800 rounded-md h-10">
                                      <h3
                                        className="text-green-500 font-bold flex justify-start mt-3 ms-2"
                                        style={{ fontSize: "10px" }}
                                      >
                                        {item?.price}
                                      </h3>
                                    </div>
                                    <div className="border border-stone-800 rounded-md h-10">
                                      <h3
                                        className="text-green-500 font-bold ms-2 mt-3"
                                        style={{ fontSize: "12px" }}
                                      >
                                        Buy
                                      </h3>
                                    </div>
                                    <div className="border border-stone-800 text-green-500 font-bold rounded-md h-10">
                                      <h3
                                        style={{ fontSize: "8px" }}
                                        className="ms-1"
                                      >
                                        {item?.date}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </ScrollArea>
                      </>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <img
                          src="https://forums.frontier.co.uk/attachments/1000012145-png.391294/"
                          alt=""
                          style={{ maxWidth: "6%" }}
                        />
                        <h3 className="mt-2" style={{ fontSize: "10px" }}>
                          This user does not have enough trades to provide chart
                          data
                        </h3>
                      </div>
                    )}
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
                      className=" font-mono font-light flex justify-start"
                      style={{ fontSize: "10px" }}
                    >
                      Contract: {shareInfo?.address}
                    </h3>
                  </DialogTitle>
                </DialogTitle>
                <DialogDescription>
                  <div className="">
                    <h1
                      className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 flex justify-start"
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
                    <h3
                      className="flex justify-end mt-1 me-2"
                      style={{ fontSize: "10px" }}
                    >
                      Balance:{" "}
                      {Number(shareBalanceResult) > 1
                        ? Number(shareBalanceResult) + " shares"
                        : Number(shareBalanceResult) + " share"}
                    </h3>
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
