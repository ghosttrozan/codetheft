import React, { useState, useCallback } from "react";
import { Code2, Play, RefreshCw, Copy, Check } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onRun,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();

        const target = e.currentTarget; // Type-safe now ✅
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const newValue =
          value.substring(0, start) + "  " + value.substring(end);
        onChange(newValue);

        // Set cursor position after the inserted spaces
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        }, 0);
      } else if (e.ctrlKey && e.key === "Enter") {
        onRun();
      }
    },
    [value, onChange, onRun]
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Code Input */}
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-6 resize-none focus:outline-none"
          placeholder="Write your JSX code here..."
          spellCheck={false}
        />

        {/* Line numbers (optional enhancement) */}
        <div className="absolute left-0 top-0 p-4 pr-2 text-gray-500 font-mono text-sm leading-6 select-none pointer-events-none">
          {value.split("\n").map((_, index) => (
            <div key={index} className="text-right min-w-[2ch]">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Add left padding to textarea to make room for line numbers */}
        <style jsx>{`
          textarea {
            padding-left: ${Math.max(
              2,
              value.split("\n").length.toString().length
            ) *
              0.6 +
            3}rem;
          }
        `}</style>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Lines: {value.split("\n").length}</span>
          <span>Characters: {value.length}</span>
        </div>
      </div>
    </div>
  );
};
