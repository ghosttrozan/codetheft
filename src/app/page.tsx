import React from "react";
import { Squares } from "@/components/ui/squares-background";
import { Navbar } from "@/components/ui/mini-navbar";
import { Hero1 } from "@/components/ui/hero-1";
import { Footer } from "@/components/footer";
import FetchUser from "@/components/fetchUser";

const Home = () => {
  return (
    <div className="space-y-8">
      <FetchUser />
      <Hero1 />
      <Footer />
    </div>
  );
};

export default Home;
