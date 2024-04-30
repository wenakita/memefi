import friendTechABI from "@/abi/friendTechABI";
import tokenABI from "@/abi/tokenABI";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { CrossCircledIcon } from "@radix-ui/react-icons";
function FriendTechTool() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [currentTokenAddress, setCurrentTokenAddress] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [searchResults, setSearchResults] = useState<FriendTechSearch | null>(
    null
  );

  const [trendingResults, setTrendingResults] = useState([]);
  const [targetSharesAddress, setTargetShareAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alert, setAlert] = useState({ title: "", description: "" });
  interface FriendTechItem {
    twitterPfpUrl: string;
    ftUsername: string;
    ftName: string;
    address: string;
    displayPrice: string; // Assuming this is a string representation of a numeric value
    followerCount: number; // Assuming this is a number
    rank: number; // Assuming this is a number
    volume: string; // Assuming this is a string representation of a numeric value
    ftPfpUrl: string;
  }
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
    args: [[address], []],
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
    onError(error) {
      setAlert({
        title: "Insufficient Balance",
        description: "Transaction reverted due to insufficient balance",
      });
      setIsAlertActive(true);
    },
    onSuccess(data) {
      setAlert({
        title: "Tx Success",
        description: "successfully bought share reloading now",
      });
      setIsAlertActive(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
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
    args: [targetSharesAddress, Number(tokenAmount)],
  });

  const {
    write: unWrap,
    data: unWrapData,
    isSuccess: isUnwrapSuccess,
  } = useContractWrite({
    //constract that you use to wrap and unwrap tokens
    address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    abi: friendTechABI,
    functionName: "unwrap",
    onError(error) {
      setAlert({
        title: "Insufficient Balance",
        description: "Transaction reverted due to insufficient balance",
      });
      setIsAlertActive(true);
    },
    onSuccess(data) {
      setTimeout(() => {
        window.location.reload();
        setAlert({
          title: "Tx Success",
          description: "successfully bought share",
        });
        setIsAlertActive(true);
      }, 2000);
    },
  });

  useEffect(() => {
    axios
      .get("https://prod-api.kosetto.com/lists/trending")
      .then(function (results) {
        setTrendingResults(results.data.users);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function searchUser() {
    axios
      .get(`https://prod-api.kosetto.com/users/${targetSearch}`)
      .then(function (results) {
        setSearchResults(results.data);
        setSearchSuccess(true);
      })
      .catch(function (error) {
        setSearchSuccess(false);
        setAlert({
          title: "Invalid Address",
          description: "Address searched is invalid try again",
        });
        setIsAlertActive(true);
        console.log(error);
      });
  }

  function calculateFinalBuyAmount() {
    let finalAmount;
    if (isNaN(Number(tokenAmount))) {
      finalAmount = 0;
    } else {
      finalAmount = Number(buyPriceAfterFee) / 10 ** 18;
    }
    return finalAmount;
  }

  function createBuyTx(sharesAddress: unknown) {
    const finalBuyETH = calculateFinalBuyAmount();

    if (finalBuyETH !== 0) {
      wrap?.({
        args: [targetSharesAddress, Number(tokenAmount), "0x"],
        value: parseEther(String(finalBuyETH)),
      });
    }
  }

  function createSellTx(shareAddress: unknown) {
    try {
      unWrap?.({
        args: [targetSharesAddress, Number(tokenAmount)],
      });
    } catch (error) {
      console.log(error);
    }
  }

  function uintConverter(target: unknown) {
    const formattedTarget = Number(target);
    const buyPrice = formattedTarget / 10 ** 18;
    return buyPrice;
  }
  return (
    <div className="mt-10 container">
      <div className="flex justify-center">
        {isAlertActive ? (
          <Alert className="mb-10 mt-2 rounded-xl bg-black border-slate-500">
            <CrossCircledIcon />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        ) : null}
      </div>
      <div className="mt-10 gap-3">
        <div className="flex justify-start mb-1 gap-3">
          <h1
            className="font-mono mt-2"
            style={{ fontSize: "25px", fontWeight: "700" }}
          >
            {searchSuccess
              ? `${searchResults?.ftUsername}'s friend.tech`
              : "friend.tech trending"}
          </h1>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <Input
          type="text"
          placeholder="Enter friend.tech contract or name"
          className="rounded-xl border-slate-500 bg-black"
          onChange={(e) => {
            setTargetSearch(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            searchUser();
          }}
          className=" border rounded-xl bg-black hover:bg-white hover:text-black"
        >
          Search
        </Button>
        <Button
          className="border rounded-xl bg-black hover:bg-white hover:text-black"
          onClick={() => {
            setSearchSuccess(false);
          }}
        >
          Trending
        </Button>
      </div>
      <div className="flex justify-center mt-3">
        {address ? (
          <Button
            className="border rounded-xl bg-black hover:bg-white hover:text-black"
            onClick={() => {
              navigate("/friend/balances");
            }}
          >
            Balance
          </Button>
        ) : null}
      </div>
      <div className="flex justify-center gap-2"></div>
      {searchSuccess ? (
        <div className="flex justify-center mt-10">
          <Card
            style={{ width: "18rem" }}
            className="rounded-xl p-2 bg-black border-slate-500"
          >
            <CardHeader>
              <img
                src={searchResults?.ftPfpUrl}
                alt=""
                className="border border-slate-500 rounded-full w-36"
              />

              <CardTitle>
                <a
                  href={`https://www.friend.tech/${searchResults?.address}`}
                  target="_blank"
                  className="mt-5 font-mono"
                >
                  {searchResults?.ftUsername}
                </a>
              </CardTitle>
              <CardDescription>
                <h3 className="mt-1">
                  Price/Share: {uintConverter(searchResults?.displayPrice)} Ξ
                </h3>
                <h3 className="mt-1">
                  Followers: {searchResults?.followerCount}
                </h3>
                <h3 className="mt-1">Holders: {searchResults?.holderCount}</h3>
                <h3 className="mt-2">Rank: {searchResults?.rank}</h3>
                <div className="flex justify-center gap-2 mt-5">
                  <Dialog>
                    <DialogTrigger asChild>
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
                          <img
                            src={searchResults?.ftPfpUrl}
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
                            <p className="mt-2">
                              Mint {searchResults?.ftName} shares
                            </p>
                          </div>
                        </DialogTitle>
                        <DialogTitle>
                          <div className="flex justify-start">
                            <a
                              href={`https://www.friend.tech/${searchResults?.address}`}
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
                            className="mt-2 font-mono"
                            style={{ fontSize: "10px" }}
                          >
                            Contract: {searchResults?.address}
                          </h3>
                        </DialogTitle>
                        <DialogDescription>
                          <div className="mt-2">
                            <h1 className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 ">
                              Price:{" "}
                              {uintConverter(searchResults?.displayPrice)}
                              ETH / Share
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
                                className="border border-slate-500 rounded-xl bg-black hover:bg-white hover:text-black"
                                onClick={() => {
                                  const targetAddress = searchResults?.address
                                    ? searchResults?.address
                                    : "";
                                  setTargetShareAddress(targetAddress);
                                  createBuyTx(searchResults?.address);
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
                    <DialogTrigger asChild>
                      <Button
                        className="border border-slate-500 rounded-xl font-bold bg-black hover:bg-red-600 w-20"
                        style={{ fontSize: "10px" }}
                        onClick={() => {
                          const targetAddress = searchResults?.address
                            ? searchResults?.address
                            : "";
                          setTargetShareAddress(targetAddress);
                          createSellTx(searchResults?.address);
                        }}
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
                        <img
                          src={searchResults?.ftPfpUrl}
                          alt=""
                          className="border border-slate-500 rounded-full mb-2"
                          style={{ maxWidth: "15%" }}
                        />
                        <DialogTitle>
                          <div className="flex justify-start gap-1">
                            <img
                              src="https://media3.giphy.com/media/J2awouDsf23R2vo2p5/giphy.gif?cid=6c09b95271qkr9h7zeqhzcchzf0g93pzapi9qzlx1f8ha35c&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=e"
                              alt=""
                              style={{ maxWidth: "7%" }}
                            />
                            <p className="mt-2">
                              Burn {searchResults?.ftName} shares
                            </p>
                          </div>
                        </DialogTitle>
                        <DialogTitle>
                          <div className="flex justify-start">
                            <a
                              href={`https://www.friend.tech/${searchResults?.address}`}
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
                            className="font-mono"
                            style={{ fontSize: "10px" }}
                          >
                            Contract: {searchResults?.address}
                          </h3>
                        </DialogTitle>
                        <DialogDescription>
                          <div className="mt-2">
                            <h1 className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 ">
                              Price:{" "}
                              {uintConverter(searchResults?.displayPrice)} ETH /
                              Share
                            </h1>
                          </div>
                          <div className="mt-5">
                            <Input
                              type="text"
                              placeholder="Enter amount shares to burn..."
                              style={{ fontSize: "12px" }}
                              className="rounded-xl border-slate-500"
                              onChange={(e) => {
                                setTokenAmount(e.target.value);
                              }}
                            />
                            <div className="flex justify-center mt-2">
                              <Button
                                className="border border-slate-500 rounded-xl bg-black hover:bg-white hover:text-black"
                                onClick={() => {
                                  const targetAddress = searchResults?.address
                                    ? searchResults?.address
                                    : "";
                                  setTargetShareAddress(targetAddress);
                                  createSellTx(searchResults?.address);
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
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className="mt-10">
          <div className="flex justify-center mb-5"></div>
          {trendingResults.map((item: FriendTechItem, index) => {
            const sharePrice = uintConverter(item.displayPrice);
            console.log(item);
            return (
              <div
                key={index}
                className="border border-slate-500 rounded-xl p-2 bg-black mb-3"
              >
                <div className="md:grid md:grid-cols-3 auto-cols-max gap-2">
                  <div className="flex justify-start gap-2">
                    <img
                      src={item.ftPfpUrl}
                      alt=""
                      style={{ maxWidth: "15%" }}
                      className="rounded-full"
                    />
                    <h1
                      className="text-white mt-2 font-mono font-bold"
                      style={{ fontSize: "12px" }}
                    >
                      {item.ftName}
                    </h1>
                  </div>
                  <div className="ms-5 mt-1 sm:mt-2">
                    <h1 className="text-white" style={{ fontSize: "10px" }}>
                      Price / Share: {sharePrice} Ξ
                    </h1>
                    <h1 className="text-white" style={{ fontSize: "10px" }}>
                      Volume: {uintConverter(Number(item.volume))} Ξ
                    </h1>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
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
                            <img
                              src={item.ftPfpUrl}
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
                              <p className="mt-2">Mint {item?.ftName} shares</p>
                            </div>
                          </DialogTitle>
                          <DialogTitle>
                            <div className="flex justify-start">
                              <a
                                href={`https://www.friend.tech/${item?.address}`}
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
                              Contract: {item.address}
                            </h3>
                          </DialogTitle>

                          <DialogDescription>
                            <div className="mt-1">
                              <h1
                                className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 "
                                style={{ fontSize: "10px" }}
                              >
                                Price: {sharePrice} ETH / Share
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
                                    setTargetShareAddress(item.address);
                                    createBuyTx(item.address);
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
                      <DialogTrigger asChild>
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
                            <img
                              src={item.ftPfpUrl}
                              alt=""
                              className="rounded-full mb-2"
                              style={{ maxWidth: "15%" }}
                            />
                          </DialogTitle>

                          <DialogTitle>
                            <a
                              href={`https://www.friend.tech/${item?.address}`}
                              target="_blank"
                            >
                              <div className="flex justify-start gap-1">
                                <img
                                  src="https://media3.giphy.com/media/J2awouDsf23R2vo2p5/giphy.gif?cid=6c09b95271qkr9h7zeqhzcchzf0g93pzapi9qzlx1f8ha35c&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=e"
                                  alt=""
                                  style={{ maxWidth: "7%" }}
                                />
                                <h3 className="mt-2">
                                  Burn {item?.ftName} shares
                                </h3>
                              </div>
                            </a>
                          </DialogTitle>
                          <DialogTitle>
                            <div className="flex justify-start">
                              <a
                                href={`https://www.friend.tech/${item?.address}`}
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
                              className="font-mono"
                              style={{ fontSize: "10px" }}
                            >
                              Contract: {item.address}
                            </h3>
                          </DialogTitle>
                          <DialogDescription>
                            <div className="">
                              <h1
                                className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 "
                                style={{ fontSize: "12px" }}
                              >
                                Price: {sharePrice} ETH / Share
                              </h1>
                            </div>
                            <div className="mt-5">
                              <Input
                                type="text"
                                placeholder="Enter amount shares to burn..."
                                style={{ fontSize: "12px" }}
                                className="rounded-xl border-slate-500"
                                onChange={(e) => {
                                  setTokenAmount(e.target.value);
                                }}
                              />
                              <div className="flex justify-center mt-2">
                                <Button
                                  className="border border-slate-500 rounded-xl bg-black hover:bg-white hover:text-black"
                                  onClick={() => {
                                    setTargetShareAddress(item.address);
                                    createSellTx(item.address);
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
          })}
        </div>
      )}
    </div>
  );
}

export default FriendTechTool;
