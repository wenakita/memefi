import React, { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { publicClient } from "./config";
import axios from "axios";
function FriendBalances() {
  interface FriendTechBalance {}
  const { address } = useAccount();
  const [openseaHoldings, setOpenseaHoldings] = useState([]);

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
          console.log(results.data.nfts);
          setOpenseaHoldings(results.data.nfts);
          console.log(openseaHoldings);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);
  return (
    <div className="container flex justify-center mt-20">
      <div className="border p-3 rounded-xl bg-black border-slate-500">
        <h1 className="font-mono">Share Balances:</h1>
      </div>
    </div>
  );
}

export default FriendBalances;

//friend tech api key:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg5MjQ1ZDRlNzg5Y2Y5ZWY0YTJhZDE4MDJhZDlmODZkZWQzNGVjZGNiIiwiaWF0IjoxNzE0MjQyMDcyLCJleHAiOjE3MTY4MzQwNzJ9.8ZmaaIZgYbRcEScc95kyngNaHKhMqQVZMCJhnkX23Vw

//"182125954402371335733680432229729854955105224257"
