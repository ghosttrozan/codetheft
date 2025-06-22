"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/mini-navbar";
import { Check, Code, Copy, Github, Heart, Sparkles } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditorProps";
import { Preview } from "@/components/Preview";
import { DotLoader } from "@/components/ui/dot-loader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCodeFromSite } from "@/lib/getCodeFromSite";
import Link from "next/link";
import { StaticPreview } from "@/components/staticPreview";
import { Footer } from "@/components/footer";

const DEFAULT_CODE = `<div class="h-screen w-screen flex bg-gray-100">
  <!-- Sidebar -->
  <div class="w-72 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4 font-bold text-lg border-b border-gray-200">Chats</div>
    <div class="overflow-auto flex-1">
      <!-- Chat items would go here -->
    </div>
  </div>

  <!-- Chat Section -->
  <div class="flex-1 flex flex-col">
    <!-- Chat content would go here -->
  </div>
</div>`;

const LOADER_ANIMATION = [
  [14, 7, 0, 8, 6, 13, 20],
  [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28],
  [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42],
  [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38],
  [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14],
  [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27],
  [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20],
  [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10],
  [14, 6, 13, 20, 9, 7, 21],
];

export default function CodeBlockPage() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language");
  const prompt = searchParams.get("prompt");
  const mode = searchParams.get("mode");

  const [code, setCode] = useState(DEFAULT_CODE);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shouldShowPreview = ["HTML/CSS", "HTML/CSS/JS"].includes(
    language || ""
  );

  const fetchCode = useCallback(async () => {
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
              background: "#14532d", // light:green-50, dark:green-900
              color: "#bbf7d0", // light:green-800, dark:green-200
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
    }
  }, [language, mode, prompt]);

  useEffect(() => {
    fetchCode();
  }, [fetchCode]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-900 to-black h-[100dvh]" />
      <Navbar />

      {isLoading ? (
        <LoadingState prompt={prompt} />
      ) : (
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
                <CodeEditor value={code} onChange={setCode} />
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
      )}
      <Footer />
    </div>
  );
}

function LoadingState({ prompt }: { prompt: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <DotLoader
            frames={LOADER_ANIMATION}
            className="gap-1"
            dotClassName="bg-white/20 [&.active]:bg-purple-500 size-2.5"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Generating Your Code
          </h3>
          <p className="text-gray-400 mt-1">
            Scraping code from:{" "}
            <span className="text-white font-medium">{prompt}</span>
          </p>
        </div>
      </div>
      <div className="max-w-md text-center text-gray-400 text-sm">
        This may take a moment while we analyze the website and generate
        optimized code for you.
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className=" mt-28 md:mt-16">
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
