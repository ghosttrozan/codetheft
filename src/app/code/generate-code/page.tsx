"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/mini-navbar";
import { Code, Github, Sparkles } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { getCodeFromSite } from "@/lib/getCodeFromSite";
import Link from "next/link";
import { StaticPreview } from "@/components/staticPreview";
import { Footer } from "@/components/footer";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import Loading from "./loading";

const DEFAULT_CODE = ``;

export default function CodeBlockPage() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "";
  const prompt = searchParams.get("prompt") || "";
  const mode = searchParams.get("mode") || "";

  const [code, setCode] = useState(DEFAULT_CODE);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false); // Add this ref to track if we've fetched

  const shouldShowPreview = ["HTML/CSS", "HTML/CSS/JS"].includes(
    language || ""
  );

  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  const fetchCode = useCallback(async () => {
    if (hasFetched.current) return; // Don't fetch if we already have

    try {
      setIsLoading(true);
      const res = await getCodeFromSite({ mode, prompt, language });
      if (res?.code) {
        setCode(res.code);
        toast.success(
          "Code Extracted it Will Work Better On Your System ThankYou !!!",
          {
            style: {
              borderRadius: "10px",
              background: "#14532d",
              color: "#bbf7d0",
              border: "1px solid #166534",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error fetching code:", error);
      toast.error("Failed to generate code");
    } finally {
      setIsLoading(false);
      hasFetched.current = true; // Mark as fetched
    }
  }, [language, mode, prompt]);

  useEffect(() => {
    fetchCode();
  }, []);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <Loading prompt={prompt} /> {/* Or your Loading component */}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-900 to-black h-[100dvh]" />
      <Navbar />
      <div className="pt-16">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Code Editor Section */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 min-h-[600px] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/80">
                <div className="flex mt-6 items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-semibold">Code Editor</h2>
                </div>
              </div>
              <CodeEditor
                value={code}
                language="javascript"
                onChange={() => setCode}
              />
            </div>

            {/* Preview Section */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/80">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <h2 className="text-lg font-semibold ml-2">Live Preview</h2>
                </div>
                <span className="text-sm text-gray-400">
                  {language || "HTML"} Component
                </span>
              </div>
              <div className="h-full min-h-[500px]">
                {shouldShowPreview ? (
                  <StaticPreview code={code} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Code className="h-12 w-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      {language} Code Generated
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Copy this code to your project to use it
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className=" mt-14 md:mt-16">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm bg-gray-800 px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>AI-Powered Code Generation</span>
            </div>
          </div>
          <Link href={"https://www.github.com/ghosttrozan"}>
            <Github className="h-8 text-white bg-black w-8 mr-2" />
          </Link>
        </div>
      </div>
    </header>
  );
}
