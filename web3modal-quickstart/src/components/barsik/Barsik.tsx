import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-[120px] container flex justify-center">
      <Card
        className="p-3 border border-neutral-600 rounded-xl bg-black"
        style={{ width: "20rem" }}
      >
        <CardHeader className="border border-neutral-600 p-4 rounded-xl">
          <CardTitle>
            <span>
              <img
                src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmPMa5t63FHjXVum8jUvsvjqBG9ykoBuw2Zwd2JCJ2y6c5?pinataGatewayToken=Yn-z4l06l9aFDk0xk-gQmyfHbcCrqKcsqSbuEqjtGUOHqRX5DEWFe-t-7SxbqmMf"
                alt=""
                style={{ maxWidth: "30%" }}
              />
            </span>
            <span className="ms-2">
              <h6 className="text-md">Barsik Migration Page</h6>
              <h6 className="mt-3 text-sm">
                Deposit your tokens now to secure your new airdropped tokens during our upcoming migration and rebrand—early deposits get more!
              </h6>
            </span>
          </CardTitle>
        </CardHeader>
        <CardDescription>
          <div className="flex justify-center mt-4 gap-2">
            <Button
              className="bg-primary-500 hover:bg-primary-600"
              onClick={() => {
                navigate("/barsik/migrate");
              }}
            >
              Migrate
            </Button>
          </div>
          <div
            className="flex justify-center mt-4 gap-2 underline text-slate-400"
            style={{ fontSize: "10px" }}
          >
            <a href="https://t.me/BARSIK_Portal" target="_blank">
              Telegram
            </a>
            <a href="https://x.com/Barsik_MetisCat" target="_blank">
              Twitter
            </a>
          </div>
          <div className="flex justify-center mt-4">
            <iframe
              src="https://embed.ipfscdn.io/ipfs/bafybeigdie2yyiazou7grjowoevmuip6akk33nqb55vrpezqdwfssrxyfy/erc20.html?contract=0xd2E8fDCe29Fc90396897c5AB321a8Eb7E44B15d4&chain=%7B%22name%22%3A%22Metis+Andromeda+Mainnet%22%2C%22chain%22%3A%22ETH%22%2C%22rpc%22%3A%5B%22https%3A%2F%2F1088.rpc.thirdweb.com%2F%24%7BTHIRDWEB_API_KEY%7D%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22Metis%22%2C%22symbol%22%3A%22METIS%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22metis-andromeda%22%2C%22chainId%22%3A1088%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22metis-andromeda%22%2C%22icon%22%3A%7B%22url%22%3A%22ipfs%3A%2F%2FQmbWKNucbMtrMPPkHG5ZmVmvNUo8CzqHHcrpk1C2BVQsEG%2F2022_H-Brand_Stacked_WhiteGreen.svg%22%2C%22width%22%3A512%2C%22height%22%3A512%2C%22format%22%3A%22svg%22%7D%7D&clientId=d28ab18baa9d45096fc60b44e95d9b5d&theme=dark&primaryColor=purple"
              width="600px"
              height="600px"
              style={{ maxWidth: "100%" }}
              frameBorder="0"
            ></iframe>
          </div>
        </CardDescription>
      </Card>
    </div>
  );
};

export default Home;