import Sidebar from "@/app/components/Sidebar";

export default function PrivateLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-100 border-r border-gray-200 p-4 hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
