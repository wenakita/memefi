import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Outlet } from "react-router-dom";
function Layout() {
  return (
    <div className="container">
      <center>
        <NavigationMenu className="border border-slate-400 p-3 bg-black rounded-xl">
          <NavigationMenuList className="">
            <NavigationMenuItem className="">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Avatar>
                    <AvatarImage src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46" />
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-black rounded-xl border-black">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46" />
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@GodDog</h4>
                      <p className="text-sm">
                        The future of omnichain memecoins. For teh tech
                      </p>
                      <div className="flex justify-center pt-2 ">
                        <a
                          href="https://interchain.axelar.dev/base/0xDDf7d080C82b8048BAAe54e376a3406572429b4e"
                          className="text-xs text-stone-100"
                        >
                          Interchain
                        </a>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </NavigationMenuItem>
            <NavigationMenuItem className="">
              <w3m-network-button />
            </NavigationMenuItem>
            <NavigationMenuItem className="">
              <w3m-button />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </center>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
