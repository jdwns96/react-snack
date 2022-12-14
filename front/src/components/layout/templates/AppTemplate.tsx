import React from "react";
import AppBottomNav from "../bottom-nav/AppBottomNav";
import AppHeader from "../headers/AppHeader";

import { Outlet } from "react-router-dom";

interface AppProps {
  children: React.ReactNode;
}
export default function AppTemplate({ children }: AppProps) {
  return (
    <>
      <div className="w-full min-h-screen">
        <AppHeader />
        <div className="relative pt-14 pb-14 md:pb-0 h-full">{children}</div>
        <AppBottomNav />
        {/* <div className="snack-background fixed top-0 bottom-0 left-0 right-0 -z-50"></div> */}
      </div>
    </>
  );
}
