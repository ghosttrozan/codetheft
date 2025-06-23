"use client";

import Editor from "@monaco-editor/react";

type MonacoEditorProps = {
  value: string;
  language: string;
  onChange: (value: string | undefined) => void;
  theme?: string;
};

export default function MonacoEditorClient({
  value,
  language,
  onChange,
  theme = "vs-dark",
}: MonacoEditorProps) {
  return (
    <Editor
      height="500px"
      defaultLanguage={language}
      defaultValue={value}
      onChange={onChange}
      theme={theme}
    />
  );
}
