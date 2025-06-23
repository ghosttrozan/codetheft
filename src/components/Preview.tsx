import React, { useState, useEffect } from "react";
import { Eye, AlertCircle, CheckCircle } from "lucide-react";
import { JSXPreview } from "./ui/jsx-preview";

interface PreviewProps {
  code: string;
  isRunning: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ code }) => {
  const [jsx, setJsx] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const isLoading = false;

  // Typing effect + error handling
  useEffect(() => {
    if (!code || typeof code !== "string") {
      setError("Invalid code input");
      return;
    }

    setError(null);
    setJsx("");
    setIsStreaming(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < code.length) {
        setJsx(code.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 1);

    return () => clearInterval(interval);
  }, [code]);

  // Loader timeout when isRunning

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden text-gray-800 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-green-600" />
          <span className="text-gray-800 font-medium">Preview</span>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <div className="flex items-center space-x-1 text-sm text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Rendering...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4 overflow-auto bg-white">
        <div className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <JSXPreview jsx={jsx} isStreaming={isStreaming} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {error
            ? "Fix the error to see preview"
            : "Live preview updates automatically"}
        </div>
      </div>
    </div>
  );
};
