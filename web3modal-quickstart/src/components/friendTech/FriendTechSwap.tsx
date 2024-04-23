import friendTechABI from "@/abi/friendTechABI";
import tokenABI from "@/abi/tokenABI";
import { Input } from "@/components/ui/input";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import calcAbi from "../../abi/calcCaABI";
import Alerts from "../main/Alerts";
function FriendTechSwap() {
  const [price, setPrice] = useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [shareBalance, setShareBalance] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  const [finalyValue, setFInalValue] = useState(0);

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
    args: ["0x7b202496C103DA5BEDFE17aC8080B49Bd0a333f1"],
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
    args: [[address], ["702922675998894831856630517018346639439163503601"]],
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
    args: ["0x7b202496C103DA5BEDFE17aC8080B49Bd0a333f1", Number(buyAmount)],
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
  }, [address]);

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
  async function wrapToken() {
    console.log("buyAmoutn:", buyAmount);
    console.log("price:", price);

    const convertedBuyAmount = Number(buyAmount);
    console.log(convertedBuyAmount);
    console.log(price);
    console.log("tex", finalyValue);

    const temp = finalyValue.toString();
    console.log(temp);
    console.log("difference", finalyValue - Number(buyAmount) * 0.0330625);

    if (address) {
      setAlertStatus(true);

      console.log(buyAmount);

      await write({
        args: [
          "0x7b202496C103DA5BEDFE17aC8080B49Bd0a333f1",
          convertedBuyAmount,
          "0x",
        ],
        value: parseEther(temp),
      });
      setAlert({
        title: "Submitting Transaction",
        description: "Submitting transaction on the contract",
      });
    } else {
      setAlertStatus(true);
      setAlert({
        title: "Wallet Connection",
        description: "Must connect wallet to buy shares",
      });
      console.log("invalid amount");
    }
  }

  useEffect(() => {
    if (gotBuyPrice) {
      let ethAmount = Number(buyPriceAfterFee);
      ethAmount = ethAmount / 10 ** 18;
      console.log("final: ", ethAmount);
      console.log(buyPriceAfterFee);
      setFInalValue(ethAmount);
    }
  }, [buyAmount, buyPriceAfterFee]);

  function unWrapToken() {
    console.log("Unwrapping");
    const sellAmountConverted = Number(sellAmount);
    console.log("Selling: ", sellAmountConverted);
    console.log(price);
    let ethValue = price * sellAmountConverted;

    console.log("val:", ethValue);

    unWrap?.({
      args: ["0x7b202496C103DA5BEDFE17aC8080B49Bd0a333f1", sellAmountConverted],
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
    <div className="container">
      <div className="mt-10">
        {isAlertActive ? (
          <Alerts title={alert.title} description={alert.description} />
        ) : null}
      </div>
      <div className="mt-10 container flex justify-center">
        <div className="mt-5 border p-5 rounded-xl border-slate-500 bg-black">
          <div className="mb-2">
            <div className="flex justify-star mb-1">
              <img
                src="https://www.friend.tech/friendtechlogo.png"
                alt=""
                style={{ maxWidth: "12%" }}
              />
            </div>
            <span className="text-yellow-400 font-mono">
              <h1 className="text-xs mt-2">Mint NFT's of</h1>
              <h1 className="text-xs">Friend.tech shares</h1>
            </span>
          </div>
          <h1 className="text-xs">
            {address
              ? shouldWrap
                ? "Buy Price: " + price + " ETH"
                : "Sell price: 1" + "Share/" + price + " ETH "
              : "Connect wallet to view share price"}
          </h1>
          <h1 className="" style={{ fontSize: "10px" }}>
            (including fees)
          </h1>
          <div className="mb-2 mt-3 font-mono">
            <label
              htmlFor=""
              className="font-light"
              style={{ fontSize: "10px" }}
            >
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
          <div className="mt-3 text-xs font-mono">
            <label htmlFor="" className="" style={{ fontSize: "10px" }}>
              {shouldWrap ? "Value:" : "Recieve:"}
            </label>
            <Input
              readOnly
              className="mt-2 border-slate-500 rounded-xl bg-black"
              value={
                address
                  ? shouldWrap
                    ? Number(buyAmount) * price
                    : Number(sellAmount) * Number(price)
                  : ""
              }
            />
          </div>
          <div className="flex justify-end text-xs">
            <p>
              {address
                ? shouldWrap
                  ? "ETH Balance: " + balanceEth?.formatted
                  : "Shares Balance: " + shareBalance
                : ""}
            </p>
          </div>

          <div className="flex justify-center mt-8 gap-3">
            <UpdateIcon
              className="mt-2 hover:animate-spin"
              type="link"
              onClick={() => {
                checkSwapState;
              }}
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
      </div>
    </div>
  );
}

export default FriendTechSwap;
