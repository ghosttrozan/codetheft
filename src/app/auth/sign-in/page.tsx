"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Squares } from "@/components/ui/squares-background";
import { Navbar } from "@/components/ui/mini-navbar";
import { Component } from "@/components/ui/sign-in-flo";

function SignInPage() {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060606] h-[100dvh]">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <Navbar />
      <div className="">
        <Component />
        {/* sign in card */}
      </div>
    </div>
  );
}

export default SignInPage;
