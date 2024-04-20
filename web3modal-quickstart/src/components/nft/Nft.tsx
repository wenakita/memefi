import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Alerts from "../main/Alerts";
import { abi } from "@/abi/abi";
function Nft() {
  const apiKey = process.env.OP_KEY || "";
  console.log(process.env.OP_KEY);
  const [alert, setAlert] = useState(undefined);
  const [nfts, setNfts] = useState([]);
  const { address } = useAccount();
  // const result = useReadContract({
  //   abi,
  //   address: "0x7F35Af9B5310483c8Ad789277c6e86dc3D329D4F",
  //   functionName: "totalSupply",
  // });

  const { data: contractReader, isError } = useContractRead({
    address: "0x7F35Af9B5310483c8Ad789277c6e86dc3D329D4F",
    abi: abi,
    functionName: "getTokenInfo",
  });

  const { config } = usePrepareContractWrite({
    address: "0x7F35Af9B5310483c8Ad789277c6e86dc3D329D4F",
    abi: abi,
    functionName: "mint",
  });

  const { data, isSuccess, write: mintNft } = useContractWrite(config);

  // 3652122689914635ac7806c7547255fe
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": "3652122689914635ac7806c7547255fe",
      },
    };

    axios
      .get("https://api.opensea.io/api/v2/collection/goddog-2/nfts", options)
      .then(function (response) {
        console.log(response.data.nfts);
        setNfts(response.data.nfts);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function handleMint(nftId) {
    console.log(nftId);
    if (!address) {
      setAlert({
        title: "Error",
        description: "Must connect wallet before minting!",
      });
    } else {
      setAlert({
        title: "Patience",
        description: "Feature will be available soon!",
      });
      // completeTransaction(nftId);
    }
    console.log(config);
  }
  function completeTransaction(nftId) {
    console.log(nftId);
    console.log(address);
    mintNft({
      minter: address,
      tokenId: nftId,
      quantity: 1,
      value: 0.00069,
    })
      .then(function (tx) {
        console.log("tx sent: ", tx);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="mt-10 container flex justify-center">
      <div className="grid grid-rows-1">
        <div className="flex justify-center mb-4">
          {alert ? (
            <Alerts title={alert.title} description={alert.description} />
          ) : null}
        </div>
        <div className="flex justify-center">
          <h1 className="underline bold font-bold">GodDog Collection:</h1>
        </div>
        <div className="flex justify-center mt-10">
          <div className="grid md:grid-cols-1 sm:grid-cols-1 gap-3">
            {nfts.map((nft) => {
              const currentNftSrc = nft.image_url;
              return (
                <div key={nft}>
                  <Card
                    style={{ width: "12rem" }}
                    className="rounded-xl bg-black border-slate-500"
                  >
                    <CardHeader>
                      <CardTitle>
                        <img src={`${currentNftSrc}`} alt="" />
                        <h5 className="text-sm mt-2">{nft.name}</h5>
                      </CardTitle>
                      <CardDescription>
                        <h5 className="text-xs mt-1">{nft.description}</h5>
                      </CardDescription>
                    </CardHeader>
                    {/* <CardContent>
                      <p>Card Content</p>
                    </CardContent> */}
                    <CardFooter className="flex justify-center">
                      <Button
                        onClick={() => {
                          handleMint(nft.identifier);
                        }}
                        className="border rounded-xl bg-black hover:bg-white hover:text-black"
                      >
                        Mint
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nft;
