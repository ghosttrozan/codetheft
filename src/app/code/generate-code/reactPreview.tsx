"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, AlertTriangle } from "lucide-react";
import * as React from "react";

export default function ComponentPreview({ reactCode }: any) {
  const [code, setCode] = useState(reactCode);
  const [error, setError] = useState<string | null>(null);
  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const compileCode = (sourceCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create a function that returns the component using React.createElement
      const componentFunction = new Function(
        "React",
        `
        ${sourceCode}
        return typeof MyComponent !== 'undefined' ? MyComponent : 
               typeof CardComponent !== 'undefined' ? CardComponent :
               typeof FormExample !== 'undefined' ? FormExample :
               function() { 
                 return React.createElement('div', {
                   className: 'p-4 text-red-500'
                 }, 'Component not found. Make sure your component is named MyComponent, CardComponent, or FormExample'); 
               };
      `
      );

      const Component = componentFunction(React);
      setPreviewComponent(() => Component);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compilation error");
      setPreviewComponent(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      compileCode(code);
    }, 500);

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Preview */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Live Preview</span>
                {isLoading && (
                  <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="min-h-96 lg:min-h-[500px] border border-gray-200 rounded-lg bg-white">
                {error ? (
                  <Alert className="m-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Compilation Error:</strong>
                      <br />
                      <code className="text-sm">{error}</code>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="p-4 h-full overflow-auto">
                    {PreviewComponent && (
                      <div className="flex items-center justify-center min-h-full">
                        <PreviewComponent />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Write Your Component
                  </p>
                  <p className="text-gray-600">
                    Create a React function component using React.createElement
                    syntax. Name it MyComponent, CardComponent, or FormExample.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">See Live Preview</p>
                  <p className="text-gray-600">
                    Your component will render automatically with real-time
                    updates as you type.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Share & Export</p>
                  <p className="text-gray-600">
                    Copy your code to use in your projects or share with others.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
