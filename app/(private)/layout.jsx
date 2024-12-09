import "@/app/globals.css";
import { Rubik } from "next/font/google";

import { SidebarProvider } from "@/app/context/SidebarContext";

// components
import Sidebar from "@/app/components/Sidebar";
import NavbarBackoffice from "@/app/components/NavbarBackoffice";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Apartments and Houses with a view",
  description: "Find the perfect place to stay on your next trip.",
};

export default function PrivateLayout({ children }) {
  return (
    <SidebarProvider>
      <div>
        <Sidebar />

        <div className="lg:pl-72">
          <NavbarBackoffice />
          <main className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
