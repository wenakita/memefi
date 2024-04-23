import React, { useEffect, useState } from "react";
import {
  useBalance,
  useAccount,
  useContractWrite,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";
import { Input } from "@/components/ui/input";
import { base } from "wagmi/chains";
import friendTechABI from "@/abi/friendTechABI";
import calcAbi from "../../abi/calcCaABI";
import { parseEther, parseGwei, toHex } from "viem";
import toast, { Toaster } from "react-hot-toast";
import { useWaitForTransaction } from "wagmi";
import Alerts from "../main/Alerts";
import { UpdateIcon } from "@radix-ui/react-icons";
function FriendTechSwap() {
  const [price, setPrice] = useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [shareBalance, setShareBalance] = useState("");

  const [tokenAmount, setTokenAmount] = useState(0);

  const [shouldWrap, setShouldWrap] = useState(true);
  const [shouldUnwrap, setShouldUnwrap] = useState(false);

  const [alert, setAlert] = useState({
    title: "",
    description: "",
  });
  const [isAlertActive, setAlertStatus] = useState(false);

  const { address } = useAccount();
  const { data: balanceEth, refetch } = useBalance({
    address: address,
  });

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
    args: ["0xe662b210d547966eb33b391b9a8292d2a87b5f69"],
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
    args: [[address], ["1315268862033850083011562997827600797723738726249"]],
  });

  const {
    write,
    data: writeData,
    isSuccess: mintSuccess,
    isError: isWrapUnsuccessFul,
  } = useContractWrite({
    //constract that you use to wrap and unwrap tokens
    address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    abi: friendTechABI,
    functionName: "wrap",
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
  const { isLoading } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess: () => {
      toast.success("Token Minted!");
      refetch();
    },
    onError: () => toast.error("An Error Occurred"),
  });

  useEffect(() => {
    if (isShareBalanceLoaded && Array.isArray(shareBalanceResult)) {
      const shareBalanceConverted = Number(shareBalanceResult[0]).toString();
      setShareBalance(shareBalanceConverted);
    }

    const currentSupply = Number(supplyResults);
    console.log(currentSupply);
    const currentPrice = (currentSupply * currentSupply) / 16000;
    console.log(currentPrice);
    setPrice(currentPrice);
  });

  function checkSwapState() {
    console.log("here");
    if (shouldWrap) {
      setShouldWrap(false);
      setShouldUnwrap(true);
    } else if (shouldUnwrap) {
      setShouldUnwrap(false);
      setShouldWrap(true);
    }
  }
  function preTx() {
    if (shouldUnwrap) {
      unWrapToken();
    } else if (wrapToken) {
      wrapToken();
    }
  }
  function wrapToken() {
    const convertedBuyAmount = Number(buyAmount);
    console.log(convertedBuyAmount);
    console.log(price);
    const amountTokens = Math.floor(convertedBuyAmount / price);
    console.log("Amount: ", amountTokens);

    if (address) {
      setAlertStatus(true);
      console.log(buyAmount);

      write({
        args: [
          "0xE662B210d547966eb33b391b9A8292d2a87b5f69",
          amountTokens,
          "0x",
        ],
        value: parseEther(buyAmount),
      });
      if (isWrapUnsuccessFul) {
        setAlert({
          title: "Tx Reverted",
          description: "Transaction Reverted",
        });
      } else if (mintSuccess) {
        setAlert({
          title: "Tx Submission",
          description: "Submitting transaction on the contract",
        });
      }
    } else {
      setAlertStatus(true);
      setAlert({
        title: "Tx Error",
        description: "Insufficient amount to buy shares",
      });
      console.log("invalid amount");
    }
  }

  function unWrapToken() {
    console.log("Unwrapping");
    console.log("Selling: ", sellAmount);
    const sellAmountConverted = Number(sellAmount);
    unWrap?.({
      args: ["0xE662B210d547966eb33b391b9A8292d2a87b5f69", sellAmountConverted],
    });
  }
  const txButtonLabel = shouldWrap === true ? "Wrap Token" : "Unwrap Token";
  if (mintSuccess) {
    setAlert({
      title: "Tx Success",
      description: "Transaction completed successfully",
    });
  }
  console.log(address);
  return (
    <div className="mt-10 container">
      {isAlertActive ? (
        <Alerts title={alert.title} description={alert.description} />
      ) : null}
      <div className="mt-5 border p-5 rounded-xl border-slate-500 bg-black">
        <div className="mb-3">
          <div className="flex justify-start gap-2 mb-1">
            <img
              src="https://www.friend.tech/friendtechlogo.png"
              alt=""
              style={{ maxWidth: "5%" }}
            />
            <h1 className="text-xs mt-2">Buy Shares</h1>
          </div>
          <h1 className="text-xs">on friend.tech</h1>
        </div>
        <h1 className="text-xs">
          {shouldWrap
            ? "Share buy Price: " + price + " ETH/share"
            : "Share sell price: 1" + "Share/" + price + " ETH"}
        </h1>
        <div className="mb-2 mt-2">
          <label htmlFor="" className="text-xs font-light">
            Amount:
          </label>
          <Input
            type="text"
            className="border-slate-500 rounded-xl"
            onChange={(e) => {
              if (shouldWrap) {
                setBuyAmount(e.target.value);
              } else if (shouldUnwrap) {
                setSellAmount(e.target.value);
              }

              console.log(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-end text-xs">
          <a
            href=""
            type="button"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            {shouldWrap
              ? "ETH Balance: " + balanceEth?.formatted
              : "Shares Balance: " + shareBalance}
          </a>
        </div>

        <div className="flex justify-center mt-8 gap-3">
          <UpdateIcon
            className="mt-2 hover:animate-spin"
            type="link"
            onClick={checkSwapState}
          />

          <button
            className="border p-1 rounded-xl bg-stone-950 hover:bg-white hover:text-black font-lighter"
            onClick={() => {
              preTx();
            }}
          >
            {txButtonLabel}
          </button>
        </div>
      </div>
      {/* <div className="border border-slate-500 bg-black mt-8 rounded-xl p-5 ">
        <div>
          <div className="mb-3">
            <img
              src="https://www.friend.tech/friendtechlogo.png"
              alt=""
              style={{ maxWidth: "5%" }}
            />
            <h1 className="mt-1">Buy Shares</h1>
            <h1>on Friend.Tech</h1>
          </div>
          <div className="text-xs">Toke Price: {price} ETH / Share</div>
          <div className="mt-4">
            <div>
              <label htmlFor="" className="text-xs">
                From:
              </label>
              <Input
                type="text"
                className="border-slate-500 rounded-xl"
                onChange={(e) => {
                  setBuyAmount(e.target.value);
                  console.log(e.target.value);
                }}
              />

              <div className="mt-2">
                <label htmlFor="" className="text-xs">
                  Amount:
                </label>
                <Input
                  type="text"
                  className="mt-2 border-slate-500 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end text-xs mt-2">
              <a
                href=""
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                ETH Balance: {balanceEth?.formatted}
              </a>
            </div>
            <div className="flex justify-center mt-5">
              <button
                className="border p-2 rounded-xl bg-stone-950 hover:bg-white hover:text-black font-lighter"
                onClick={() => {
                  wrapToken();
                }}
              >
                {label}
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default FriendTechSwap;
