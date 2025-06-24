"use client";

import React from "react";
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
