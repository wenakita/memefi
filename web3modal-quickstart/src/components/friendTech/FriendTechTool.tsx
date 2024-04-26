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
import { CrossCircledIcon } from "@radix-ui/react-icons";
function FriendTechTool() {
  const { address } = useAccount();
  const [currentTokenAddress, setCurrentTokenAddress] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [trendingResults, setTrendingResults] = useState([]);
  const [targetSharesAddress, setTargetShareAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alert, setAlert] = useState({ title: "", description: "" });

  const {
    data: shareBuyResponse,
    isLoading: isBuyingShares,
    isSuccess: boughtShare,
    write: wrap,
  } = useContractWrite({
    address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    abi: friendTechABI,
    functionName: "wrap",
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
  });

  useEffect(() => {
    axios
      .get("https://prod-api.kosetto.com/lists/trending")
      .then(function (results) {
        console.log(results.data.users);
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
        console.log(results.data);

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
    console.log(tokenAmount);
    if (isNaN(Number(tokenAmount))) {
      console.log("not valid");
      finalAmount = 0;
    } else {
      finalAmount = Number(buyPriceAfterFee) / 10 ** 18;
    }
    return finalAmount;
  }

  function createBuyTx(sharesAddress: unknown) {
    const finalBuyETH = calculateFinalBuyAmount();

    console.log(finalBuyETH);

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
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="Enter friendtech contract or name"
          className="rounded-xl border-slate-500 bg-black"
          onChange={(e) => {
            setTargetSearch(e.target.value);
            console.log(e.target.value);
          }}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => {
            searchUser();
          }}
          className=" mt-10 border rounded-xl bg-black hover:bg-white hover:text-black"
        >
          Search
        </Button>
        <Button
          className=" mt-10 border rounded-xl bg-black hover:bg-white hover:text-black"
          onClick={() => {
            setSearchSuccess(false);
          }}
        >
          Trending
        </Button>
      </div>
      {searchSuccess && searchResults.length > 0 ? (
        <div className="flex justify-center mt-10">
          <Card
            style={{ width: "18rem" }}
            className="rounded-xl bg-black border-slate-500"
          >
            <CardHeader>
              <img
                src={searchResults.twitterPfpUrl}
                alt=""
                className="border border-slate-500 rounded-full w-36"
              />

              <CardTitle>
                <h3 className="mt-5">{searchResults.ftUsername}</h3>
              </CardTitle>
              <CardDescription>
                <h3>
                  Price: {uintConverter(searchResults.displayPrice)} ETH /Share
                </h3>
                <h3 className="mt-2">
                  Followers: {searchResults.followerCount}
                </h3>
                <h3 className="mt-2">Rank: {searchResults.rank}</h3>
                <div className="flex justify-center gap-2 mt-3">
                  <Dialog className="bg-black rounded-xl">
                    <DialogTrigger asChild>
                      <Button
                        className="border border-slate-500 rounded-xl font-bold bg-green-500"
                        style={{ fontSize: "10px" }}
                      >
                        Buy
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-slate-500 rounded-xl bg-black">
                      <DialogHeader>
                        <DialogTitle>
                          <img
                            src={searchResults.twitterPfpUrl}
                            alt=""
                            className="rounded-full mb-2"
                            style={{ maxWidth: "15%" }}
                          />
                        </DialogTitle>
                        <DialogTitle>
                          Buy {searchResults.ftName} shares
                        </DialogTitle>
                        <DialogTitle>
                          <h3
                            className="mt-2 font-mono"
                            style={{ fontSize: "10px" }}
                          >
                            Contract: {searchResults.address}
                          </h3>
                        </DialogTitle>
                        <DialogDescription>
                          <div className="mt-2">
                            <h1 className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 ">
                              Price: {uintConverter(searchResults.displayPrice)}
                              ETH / Share
                            </h1>
                          </div>
                          <div className="mt-5">
                            <Input
                              type="text"
                              placeholder="Enter amount shares to buy..."
                              style={{ fontSize: "12px" }}
                              className="rounded-xl border-slate-500"
                              onChange={(e) => {
                                setTokenAmount(e.target.value);
                                console.log(e.target.value);
                              }}
                            />
                            <div className="flex justify-center mt-2">
                              <Button
                                className="border border-slate-500 rounded-xl bg-black hover:bg-white hover:text-black"
                                onClick={() => {
                                  setTargetShareAddress(searchResults.address);
                                  createBuyTx(searchResults.address);
                                }}
                              >
                                Buy
                              </Button>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Dialog className="bg-black rounded-xl">
                    <DialogTrigger asChild>
                      <Button
                        className="border border-slate-500 rounded-xl font-bold bg-red-500"
                        style={{ fontSize: "10px" }}
                        onClick={() => {
                          setTargetShareAddress(searchResults.address);
                          createSellTx(searchResults.address);
                        }}
                      >
                        Sell
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-slate-500 rounded-xl bg-black">
                      <DialogHeader>
                        <img
                          src={searchResults.twitterPfpUrl}
                          alt=""
                          className="border border-slate-500 rounded-full mb-2"
                          style={{ maxWidth: "15%" }}
                        />
                        <DialogTitle>
                          Sell {searchResults.ftName} shares
                        </DialogTitle>
                        <DialogTitle>
                          <h3
                            className="mt-2 font-mono"
                            style={{ fontSize: "10px" }}
                          >
                            Contract: {searchResults.address}
                          </h3>
                        </DialogTitle>
                        <DialogDescription>
                          <div className="mt-2">
                            <h1 className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 ">
                              Price: {uintConverter(searchResults.displayPrice)}{" "}
                              ETH / Share
                            </h1>
                          </div>
                          <div className="mt-5">
                            <Input
                              type="text"
                              placeholder="Enter amount shares to buy..."
                              style={{ fontSize: "12px" }}
                              className="rounded-xl border-slate-500"
                              onChange={(e) => {
                                setTokenAmount(e.target.value);
                                console.log(e.target.value);
                              }}
                            />
                            <div className="flex justify-center mt-2">
                              <Button
                                className="border border-slate-500 rounded-xl bg-black hover:bg-white hover:text-black"
                                onClick={() => {
                                  setTargetShareAddress(searchResults.address);
                                  createSellTx(searchResults.address);
                                }}
                              >
                                Sell
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
          <div className="flex justify-center mb-5">
            <h1
              className="font-mono mb-5"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              Trending Users
            </h1>
          </div>
          {trendingResults.map((item, index) => {
            const sharePrice = uintConverter(item.displayPrice);
            return (
              <div
                key={index}
                className="border border-slate-500 rounded-xl p-3 bg-black mb-3"
              >
                <div className="md:grid md:grid-cols-3 auto-cols-max gap-2">
                  <div className="flex justify-start gap-2">
                    <img
                      src={item.twitterPfpUrl}
                      alt=""
                      style={{ maxWidth: "16%" }}
                      className="rounded-xl"
                    />
                    <h1
                      className="text-white mt-2"
                      style={{ fontSize: "10px" }}
                    >
                      {item.ftName}
                    </h1>
                  </div>
                  <div className="ms-5 mt-1">
                    <h1 className="text-white" style={{ fontSize: "10px" }}>
                      Price: {sharePrice} ETH /Share
                    </h1>
                    <h1 className="text-white" style={{ fontSize: "10px" }}>
                      Volume: {uintConverter(Number(item.volume))} ETH
                    </h1>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Dialog className="bg-black rounded-xl">
                      <DialogTrigger asChild>
                        <Button
                          className="border border-slate-500 rounded-xl font-bold bg-green-500"
                          style={{ fontSize: "10px" }}
                        >
                          Buy
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-slate-500 rounded-xl bg-black">
                        <DialogHeader>
                          <DialogTitle>
                            <img
                              src={item.twitterPfpUrl}
                              alt=""
                              className="rounded-full mb-2"
                              style={{ maxWidth: "15%" }}
                            />
                          </DialogTitle>

                          <DialogTitle>Buy {item.ftName} shares</DialogTitle>
                          <DialogTitle>
                            <h3
                              className="mt-2 font-mono"
                              style={{ fontSize: "10px" }}
                            >
                              Contract: {item.address}
                            </h3>
                          </DialogTitle>

                          <DialogDescription>
                            <div className="mt-2">
                              <h1 className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 ">
                                Price: {sharePrice} ETH / Share
                              </h1>
                            </div>
                            <div className="mt-5">
                              <Input
                                type="text"
                                placeholder="Enter amount shares to buy..."
                                style={{ fontSize: "12px" }}
                                className="rounded-xl border-slate-500"
                                onChange={(e) => {
                                  setTokenAmount(e.target.value);
                                  console.log(e.target.value);
                                }}
                              />
                              <div className="flex justify-center mt-2">
                                <Button
                                  className="border border-slate-500 rounded-xl bg-black hover:bg-white hover:text-black"
                                  onClick={() => {
                                    setTargetShareAddress(item.address);
                                    createBuyTx(item.address);
                                  }}
                                >
                                  Buy
                                </Button>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Dialog className="bg-black rounded-xl">
                      <DialogTrigger asChild>
                        <Button
                          className="border border-slate-500 rounded-xl font-bold bg-red-500"
                          style={{ fontSize: "10px" }}
                          onClick={() => {
                            setTargetShareAddress(item.address);
                            createSellTx(item.address);
                          }}
                        >
                          Sell
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-slate-500 rounded-xl bg-black">
                        <DialogHeader>
                          <DialogTitle>
                            <img
                              src={item.twitterPfpUrl}
                              alt=""
                              className="rounded-full mb-2"
                              style={{ maxWidth: "15%" }}
                            />
                          </DialogTitle>

                          <DialogTitle>Sell {item.ftName} shares</DialogTitle>
                          <DialogTitle>
                            <h3
                              className="mt-2 font-mono"
                              style={{ fontSize: "10px" }}
                            >
                              Contract: {item.address}
                            </h3>
                          </DialogTitle>
                          <DialogDescription>
                            <div className="mt-2">
                              <h1 className="border border-b-stone-400 border-t-0 border-l-0 border-r-0 ">
                                Price: {sharePrice} ETH / Share
                              </h1>
                            </div>
                            <div className="mt-5">
                              <Input
                                type="text"
                                placeholder="Enter amount shares to buy..."
                                style={{ fontSize: "12px" }}
                                className="rounded-xl border-slate-500"
                                onChange={(e) => {
                                  setTokenAmount(e.target.value);
                                  console.log(e.target.value);
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
                                  Sell
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
