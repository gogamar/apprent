import "./globals.css";
import { Rubik } from "next/font/google";
import { AuthProvider } from "@/app/context/AuthContext";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Apartments and Houses with a view",
  description: "Find the perfect place to stay on your next trip.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${rubik.className} h-full`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
