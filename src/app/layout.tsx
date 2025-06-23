import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Squares } from "@/components/ui/squares-background";
import { Navbar } from "@/components/ui/mini-navbar";
import FetchUser from "@/components/fetchUser";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FetchUser />
          <Toaster />
          <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060606] h-[100dvh]">
            <Squares
              direction="diagonal"
              speed={0.5}
              squareSize={40}
              borderColor="#333"
              hoverFillColor="#222"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
