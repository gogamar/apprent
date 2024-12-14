import "./globals.css";
import { Rubik } from "next/font/google";
import { AuthProvider } from "@/app/context/AuthContext";
import Navbar from "@/app/components/Navbar";
import { Suspense } from "react";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Apartments and Houses with a view",
  description: "Find the perfect place to stay on your next trip.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className=" bg-white">
      <body className={`${rubik.className} overflow-x-hidden`}>
        <AuthProvider>
          <div className="sticky top-0 z-50 bg-white shadow-md">
            <Navbar />
          </div>

          <Suspense
            fallback={<div className="text-center p-6">Loading...</div>}
          >
            <div className="min-h-screen">{children}</div>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
