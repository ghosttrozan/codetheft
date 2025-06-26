"use client";

import * as React from "react";

function JSXPreview({ jsx }: { jsx: string }) {
  const [Component, setComponent] = React.useState<React.ReactNode>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      // 1. Remove all import statements (we'll provide React)
      const cleanJsx = jsx.replace(
        /import\s+.*?\s+from\s+['"].*?['"];?\n?/g,
        ""
      );

      // 2. Handle default export
      const componentCode = cleanJsx.replace("export default", "return");

      // 3. Create a function that returns the component
      const componentFn = new Function(
        "React",
        `
        try {
          ${componentCode}
        } catch(e) {
          return () => React.createElement('div', null, 'Error: ' + e.message);
        }
      `
      );

      // 4. Execute the function with React
      const component = componentFn(React);

      // 5. Create React element
      setComponent(React.createElement(component));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }, [jsx]);

  return (
    <div className="preview-container">
      {error ? (
        <div className="error-message">
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      ) : (
        Component
      )}
    </div>
  );
}

export default JSXPreview;
