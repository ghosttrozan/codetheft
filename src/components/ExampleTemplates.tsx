import React from "react";
import { FileText, Zap, Layout, Palette } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  code: string;
}

const templates: Template[] = [
  {
    id: "hello-world",
    name: "Hello World",
    description: "Simple greeting component",
    icon: <FileText className="w-4 h-4" />,
    code: `<div className="p-8 text-center">
  <h1 className="text-4xl font-bold text-blue-600 mb-4">
    Hello, World! 👋
  </h1>
  <p className="text-gray-600">
    Welcome to the React Code Editor
  </p>
</div>`,
  },
  {
    id: "counter",
    name: "Counter",
    description: "Interactive counter with state",
    icon: <Zap className="w-4 h-4" />,
    code: `<div className="p-8 text-center">
  <h2 className="text-2xl font-bold mb-4">Counter Example</h2>
  <div className="bg-gray-100 rounded-lg p-6 inline-block">
    <div className="text-4xl font-bold text-blue-600 mb-4">0</div>
    <div className="space-x-2">
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        +
      </button>
      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        -
      </button>
    </div>
  </div>
</div>`,
  },
  {
    id: "card",
    name: "Card Layout",
    description: "Modern card design",
    icon: <Layout className="w-4 h-4" />,
    code: `<div className="p-8 max-w-md mx-auto">
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">Beautiful Card</h3>
      <p className="text-gray-600 mb-4">
        This is a modern card layout with gradient background and clean typography.
      </p>
      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Learn More
      </button>
    </div>
  </div>
</div>`,
  },
  {
    id: "colorful",
    name: "Colorful Grid",
    description: "Vibrant color showcase",
    icon: <Palette className="w-4 h-4" />,
    code: `<div className="p-8">
  <h2 className="text-2xl font-bold text-center mb-6">Color Palette</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="h-24 bg-red-500 rounded-lg flex items-center justify-center text-white font-semibold">Red</div>
    <div className="h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">Blue</div>
    <div className="h-24 bg-green-500 rounded-lg flex items-center justify-center text-white font-semibold">Green</div>
    <div className="h-24 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-semibold">Yellow</div>
    <div className="h-24 bg-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">Purple</div>
    <div className="h-24 bg-pink-500 rounded-lg flex items-center justify-center text-white font-semibold">Pink</div>
    <div className="h-24 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold">Indigo</div>
    <div className="h-24 bg-teal-500 rounded-lg flex items-center justify-center text-white font-semibold">Teal</div>
  </div>
</div>`,
  },
];

interface ExampleTemplatesProps {
  onSelectTemplate: (code: string) => void;
}

export const ExampleTemplates: React.FC<ExampleTemplatesProps> = ({
  onSelectTemplate,
}) => {
  return (
    <div className="p-4 text-white">
      <h3 className="text-sm font-medium text-white mb-3">
        Quick Start Templates
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.code)}
            className="flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="text-gray-500 group-hover:text-blue-600">
              {template.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 group-hover:text-blue-800">
                {template.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {template.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
