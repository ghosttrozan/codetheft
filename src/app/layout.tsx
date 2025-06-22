import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Toaster />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
