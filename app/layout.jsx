import "./globals.css";
import { Inter } from "next/font/google";

// components
import Navbar2 from "./components/Navbar2";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Apartments and Houses with a view",
  description: "Find the perfect place to stay on your next trip.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar2 />

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
