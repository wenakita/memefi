import React, { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useNavigate } from "react-router-dom";
import FriendTechHolding from "./FriendTechHolding";
import axios from "axios";
import { Button } from "../ui/button";
function FriendBalances() {
  interface FriendTechBalance {
    userShareHoldings: string;
    friendTechUrl: unknown;
    id: string;
  }
  interface FriendTechHoldingProps {
    key: number;
    id: number;
  }
  let currentIdentifier;
  const navigate = useNavigate();
  const { address } = useAccount();
  const [currentShareIds, setCurrentShareIds] = useState<string[]>([]);
  const [currentIds, setCurrentIds] = useState([]);
  const [currentHoldings, setCurrentHoldings] = useState([]);

  const [idActive, setIdActive] = useState<boolean | false>(false);

  const [userShareHoldings, setUserShareHoldings] = useState([]);
  //use uri function to slice the part of the url that shows the contract address
  //example response fro contract: https://api.wrap.sh/friends/0x7b202496c103da5bedfe17ac8080b49bd0a333f1
  const [currentArg, setCurrentArg] = useState("");

  let mainId;

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": "3652122689914635ac7806c7547255fe",
      },
    };
    if (address) {
      axios
        .get(
          `https://api.opensea.io/api/v2/chain/base/account/${address}/nfts`,
          options
        )
        .then(function (results) {
          handleResponse(results.data.nfts);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  async function handleResponse(results: any) {
    const targetShareIds: any = [];
    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        if (
          results[i].collection === "wrapped-friendtech" &&
          results[i].token_standard === "erc1155"
        ) {
          targetShareIds.push(results[i].identifier);
        }
      }
      setCurrentIds(targetShareIds);
    }
  }

  return (
    <div className="container mt-20">
      <div className="flex justify-between">
        <h1 className="font-mono">Portfolio Balances: NFT</h1>
        <Button
          className="border border-slate-500 rounded-xl bg-black hover:bg-white hover:text-black"
          onClick={() => {
            navigate("/friend/find");
          }}
        >
          Trending
        </Button>
      </div>
      <div className="grid grid-flow-row flex justify-center">
        {currentIds.map((item, index) => {
          return (
            <>
              <FriendTechHolding id={item} />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default FriendBalances;

//friend tech api key:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg5MjQ1ZDRlNzg5Y2Y5ZWY0YTJhZDE4MDJhZDlmODZkZWQzNGVjZGNiIiwiaWF0IjoxNzE0MjQyMDcyLCJleHAiOjE3MTY4MzQwNzJ9.8ZmaaIZgYbRcEScc95kyngNaHKhMqQVZMCJhnkX23Vw

//"182125954402371335733680432229729854955105224257"
