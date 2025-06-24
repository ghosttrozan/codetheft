"use client";
import { DotLoader } from "@/components/ui/dot-loader";
import Typewriter from "typewriter-effect";

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

export default function Loading({ prompt }: { prompt: string | null }) {
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
        This may take a moment while we analyze the website and generate.
        <Typewriter
          options={{
            strings: [
              "Welcome to CodeTheft 😎",
              "Optimized code for you.",
              "It Can take upto 5 mins. if Website is heavy",
              "Scrapping code for you",
            ],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
    </div>
  );
}
