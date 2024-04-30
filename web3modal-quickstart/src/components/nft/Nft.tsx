import { abi } from "@/abi/abi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Alerts from "../main/Alerts";

interface NftData {
  identifier: string;
  image_url: string;
  name: string;
  description?: string; // Make description optional
}

function Nft() {
  const apiKey = process.env.OP_KEY || "";
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [nfts, setNfts] = useState<NftData[]>([]);
  const { address } = useAccount();

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
        setNfts(response.data.nfts);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function handleMint(nftId: string) {
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
  }

  function completeTransaction(nftId: string) {}

  return (
    <div className="mt-10 container flex justify-center">
      <div className="grid grid-rows-1">
        <div className="flex justify-center mb-4">
          {alert && (
            <Alerts title={alert.title} description={alert.description} />
          )}
        </div>
        <div className="flex justify-center">
          <h1 className="underline bold font-bold">GodDog Collection:</h1>
        </div>
        <div className="flex justify-center mt-10">
          <div>
            {nfts.map((nft) => {
              const currentNftSrc = nft.image_url;
              return (
                <Card
                  key={nft.identifier}
                  style={{ width: "12rem" }}
                  className="rounded-xl bg-black border-slate-500"
                >
                  <CardHeader>
                    <CardTitle>
                      {currentNftSrc ? (
                        <img src={currentNftSrc} alt="" />
                      ) : null}
                      <h5 className="text-sm mt-2">{nft.name}</h5>
                    </CardTitle>
                    <CardDescription>
                      {nft.description && (
                        <h5
                          className="text-xs mt-1"
                          style={{ fontSize: "5px" }}
                        >
                          {nft.description}
                        </h5>
                      )}
                    </CardDescription>
                  </CardHeader>
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
              );
            })}
          </div>
          <div className="grid md:grid-cols-1 sm:grid-cols-1 gap-3 mb-10"></div>
        </div>
      </div>
    </div>
  );
}

export default Nft;
