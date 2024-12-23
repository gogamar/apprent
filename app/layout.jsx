import "./globals.css";
import { Rubik } from "next/font/google";
import { AuthProvider } from "@/app/context/AuthContext";
import Navbar from "@/app/components/Navbar";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Apartments and Houses with a view",
  description: "Find the perfect place to stay on your next trip.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${rubik.className}`}>
        <AuthProvider>
          <div className="sticky top-0 z-50 bg-white shadow-md">
            <Navbar />
          </div>

          <div className="min-h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
