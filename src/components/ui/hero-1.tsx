"use client";

import * as React from "react";
import { Sparkles, Link, X, RocketIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Alert, AlertContent, AlertDescription, AlertTitle } from "./alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const LanguageOption = ({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <Button
    size="sm"
    variant={selected ? "default" : "outline"}
    className={`transition-all ${selected ? "bg-black hover:bg-black" : "hover:bg-black opacity-50 hover:text-white"}`}
    onClick={onClick}
  >
    {name}
  </Button>
);

const ChooseOutput = ({
  onClose,
  onSelect,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (selectedLang: string) => void;
  onSelect: (lang: string) => void;
}) => {
  const [selectedLang, setSelectedLang] = React.useState("JSX");

  const languages = ["JSX", "HTML/CSS", "HTML/CSS/JS", "React"];

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50  bg-opacity-50 backdrop-blur-sm">
      <Alert
        className="w-full max-w-md bg-white border"
        layout="complex"
        isNotification
        size="lg"
        action={
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 p-0 hover:bg-transparent text-gray-400 hover:text-white"
            aria-label="Close notification"
            onClick={onClose}
          >
            <X
              size={16}
              strokeWidth={2}
              className="opacity-80 text-black transition-opacity group-hover:opacity-100"
            />
          </Button>
        }
      >
        <AlertContent>
          <AlertTitle className="text-black font-medium text-lg">
            Select Preferred Output Format
          </AlertTitle>
          <AlertDescription className="text-gray-900 mt-1">
            Choose the language format you want your code examples in
          </AlertDescription>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {languages.map((lang) => (
              <LanguageOption
                key={lang}
                name={lang}
                selected={selectedLang === lang}
                onClick={() => setSelectedLang(lang)}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <Button
              variant="outline"
              className="text-black border-gray-700"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white"
              onClick={() => {
                onSelect(selectedLang);
                onSubmit(selectedLang);
                onClose();
              }}
            >
              Confirm
            </Button>
          </div>
        </AlertContent>
      </Alert>
    </div>
  );
};

const Hero1 = () => {
  const [inputMode, setInputMode] = React.useState<"prompt" | "url">("url");
  const [inputValue, setInputValue] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState("JSX");

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    console.log(selectedLanguage);
  };

  const { user } = useUserStore();

  const router = useRouter();

  const handleSubmit = (selectedLang: string) => {
    if (!inputMode || !inputValue) {
      toast.error("Prompt is Empty !!!", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#7f1d1d",
          color: "#fecaca",
          border: "1px solid #b91c1c",
        },
        iconTheme: {
          primary: "#fecaca",
          secondary: "#7f1d1d",
        },
      });
      return;
    }

    if (!user) {
      toast.error("Sign In to use !!!", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#7f1d1d",
          color: "#fecaca",
          border: "1px solid #b91c1c",
        },
        iconTheme: {
          primary: "#fecaca",
          secondary: "#7f1d1d",
        },
      });
      router.push("/auth/sign-up");
      return;
    }

    if ((user?.credits ?? 0) <= 0) {
      setError(true);
      return;
    }

    if (inputMode === "url") {
      const isVerifiedUrl = verifyUrl(inputValue);
      if (!isVerifiedUrl) {
        return;
      }
    }

    router.push(
      `/code/generate-code?language=${encodeURIComponent(selectedLang)}&prompt=${encodeURIComponent(inputValue)}&mode=${inputMode}`
    );

    console.log(`Submitting ${inputMode}:`, inputValue, selectedLang);
  };

  const verifyUrl = (url: string): boolean => {
    const validTLDs = [
      ".com",
      ".org",
      ".net",
      ".info",
      ".biz",
      ".gov",
      ".in",
      ".app",
      ".dev",
      ".ai",
      ".io",
      ".co",
      ".tech",
      ".shop",
      ".blog",
      ".online",
      ".store",
      ".site",
    ];

    try {
      if (!url) throw new Error("URL cannot be empty");

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      const urlObj = new URL(url);
      const domainParts = urlObj.hostname.split(".");
      const tld = "." + domainParts[domainParts.length - 1];

      if (!validTLDs.includes(tld)) {
        throw new Error(
          `Unsupported domain extension. Use: ${validTLDs.join(", ")}`
        );
      }

      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid URL format",
        {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#7f1d1d",
            color: "#fecaca",
            border: "1px solid #b91c1c",
          },
          iconTheme: {
            primary: "#fecaca",
            secondary: "#7f1d1d",
          },
        }
      );
      return false;
    }
  };

  if (showAlert) {
    return (
      <ChooseOutput
        onClose={() => setShowAlert(false)}
        onSelect={handleLanguageSelect}
        onSubmit={handleSubmit}
      />
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
        <Alert
          className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl"
          layout="complex"
          size="lg"
          action={
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 p-0 hover:bg-transparent text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              aria-label="Close notification"
              onClick={() => setError(false)}
            >
              <X
                size={16}
                strokeWidth={2}
                className="opacity-80 text-gray-600 dark:text-gray-400 transition-opacity group-hover:opacity-100"
              />
            </Button>
          }
        >
          <AlertContent>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <AlertTitle className="text-black dark:text-white font-medium text-lg">
                  Credits Exhausted!
                </AlertTitle>
                <AlertDescription className="text-gray-600 dark:text-gray-300 mt-1">
                  You ve used all your available credits. Upgrade your plan to
                  continue generating code.
                </AlertDescription>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                variant="outline"
                className="text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setError(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                onClick={() => {
                  router.push("/pricing");
                  setError(false);
                }}
              >
                <RocketIcon className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
          </AlertContent>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 pt-20 text-white flex flex-col relative overflow-x-hidden">
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <div className="font-bold text-md">CodeTheft</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex-1 flex justify-center">
            <div className="bg-[#ffffff] text-black rounded-full px-4 py-2 flex items-center gap-2  w-fit mx-4">
              <span className="text-xs flex items-center gap-2">
                ⚡ Beta Version - Join Early Access
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Convert, Generate, and{" "}
            <span className="text-purple-400">Code Faster</span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Turn {inputMode === "prompt" ? "prompts" : "URLs"} into
            production-ready code or convert between frameworks with{" "}
            <span className="font-semibold text-white">
              AI-powered precision
            </span>
            .
          </p>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setInputMode("url")}
              className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-all ${inputMode === "url" ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
            >
              <Link size={16} />
              URL
            </button>
          </div>

          <div className="relative max-w-2xl mx-auto w-full">
            <div className="bg-[#ffffff] text-black rounded-full p-3 flex items-center justify-between">
              <input
                type="text"
                value={inputValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowAlert(true);
                  }
                }}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`${inputMode === "url" ? "Enter Valid URL (must end with .com, .in, etc.)" : '"How CodeTheft can help you today?"'}`}
                className="bg-transparent  flex-1 outline-none text-gray-900 pl-4"
              />
              <button
                onClick={() => setShowAlert(true)}
                className="p-2 rounded-full transition-all"
              >
                <Sparkles className="w-6 h-6 cursor-pointer text-purple-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl mx-auto">
            <button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm transition-all border border-white/10">
              Convert Links/Urls → JSX
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm transition-all border border-white/10">
              Convert Links/Urls → HTMLs
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm transition-all border border-white/10">
              Generate With Tailwind UI
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm transition-all border border-white/10">
              Create React Components
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm transition-all border border-white/10">
              CSS-in-JS to CSS
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export { Hero1 };
