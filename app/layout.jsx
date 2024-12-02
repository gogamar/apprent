import "./globals.css";
import { Rubik } from "next/font/google";

import { SidebarProvider } from "./context/SidebarContext";
// import { UserProvider } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";

// components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Apartments and Houses with a view",
  description: "Find the perfect place to stay on your next trip.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${rubik.className} h-full`}>
        <SidebarProvider>
          <div>
            <Sidebar />

            <div className="lg:pl-72">
              <AuthProvider>
                <Navbar />
                <main className="py-10">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </main>
              </AuthProvider>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
