// components/YouTubePreview.tsx
"use client";
import { useEffect, useRef, useState } from "react";

export function StaticPreview({ code }: { code: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    setError(null);

    const iframe = iframeRef.current;
    iframe.srcdoc = ""; // Reset iframe

    try {
      // Process YouTube-style HTML
      const processedCode = processYouTubeHtml(code);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
            ${extractHeadContent(code)}
            <style>
              /* Base reset for YouTube-like environment */
              body, html { 
                margin: 0;
                padding: 0;
                height: 100%;
                font-family: 'Roboto', Arial, sans-serif;
                background: #f9f9f9;
              }
              * { 
                box-sizing: border-box;
                -webkit-font-smoothing: antialiased;
              }
              /* Fix for YouTube's specific elements */
              ytd-app {
                display: block;
                height: 100%;
              }
              /* Add other necessary YouTube-specific fixes here */
            </style>
          </head>
          <body>
            ${processedCode}
          </body>
        </html>
      `);
      doc.close();

      // Listen for errors in the iframe
      iframe.contentWindow?.addEventListener("error", (e) => {
        setError(`Preview Error: ${e.message}`);
      });
    } catch (err) {
      setError("Failed to render YouTube preview");
      console.error("YouTube preview error:", err);
    }
  }, [code]);

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 bg-red-50 text-red-600 border border-red-200 rounded">
        <div className="text-center">
          <h3 className="font-medium text-lg">YouTube Preview Error</h3>
          <p className="text-sm mt-2">{error}</p>
          <pre className="mt-4 p-2 bg-red-100 text-xs overflow-auto max-h-40">
            {code.substring(0, 300)}...
          </pre>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
          >
            Reload Preview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        title="youtube-preview"
        className="w-full h-full border-0 bg-white"
        sandbox="allow-same-origin"
        allow="fullscreen"
      />
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        YouTube Preview Mode
      </div>
    </div>
  );
}

// Special processor for YouTube HTML
function processYouTubeHtml(rawCode: string): string {
  let processed = rawCode
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/gi, "");

  // 3. Fix common YouTube-specific issues
  processed = processed
    .replace(/<style[^>]*nonce="[^"]*"[^>]*>/g, "<style>")
    .replace(/<template[^>]*>([\s\S]*?)<\/template>/gi, "");

  return processed;
}

// Extract head content while filtering unsafe elements
function extractHeadContent(html: string): string {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return "";

  const headContent = headMatch[1]
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/gi, "")
    .replace(/<style[^>]*nonce="[^"]*"[^>]*>/g, "<style>");

  // Preserve only safe meta tags, title, and favicons
  const allowedTags = [
    "title",
    "meta",
    'link[rel="icon"]',
    'link[rel="canonical"]',
    "style",
  ];
  const regex = new RegExp(
    `<(${allowedTags.join("|")})[^>]*>(?:<\/\\1>)?`,
    "gi"
  );

  return headContent.match(regex)?.join("") || "";
}
