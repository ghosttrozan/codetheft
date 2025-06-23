"use client";

import React from "react";
// import { SignupCard } from "../../components/signup-card";
import { Squares } from "@/components/ui/squares-background";
import { Navbar } from "@/components/ui/mini-navbar";
import { SignInPage } from "@/components/blocks/sign-in-flow-1";

function Auth() {
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
      <div>
        <SignInPage />
      </div>
    </div>
  );
}

export default Auth;
