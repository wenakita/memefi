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
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { Button } from "../ui/button";
import { UseWalletsInterface, useWallets } from "@privy-io/react-auth";

import { Outlet } from "react-router-dom";

function Layout() {
  const { login, user } = usePrivy();
  const { ready, authenticated, logout } = usePrivy();
  const disableLogout = !ready || (ready && !authenticated);
  const wallet = user?.wallet;
  let address;
  if (wallet) {
    address = wallet.address;
    console.log(address);
  }
  useEffect(() => {
    console.log("Enter address for a surprise");
  }, []);
  return (
    <div className="container">
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
