"use client";

import React from "react";
// import { SignupCard } from "../../components/signup-card";
import { Squares } from "@/components/ui/squares-background";
import { Navbar } from "@/components/ui/mini-navbar";
import { SignInPage } from "@/components/blocks/sign-in-flow-1";

function Auth() {
  return (
    <div className="space-y-8">
      <div>
        <SignInPage />
      </div>
    </div>
  );
}

export default Auth;
