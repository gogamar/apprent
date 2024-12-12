"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useSidebar } from "@/app/context/SidebarContext";

import { useAuthContext } from "@/app/context/AuthContext";
import LogoutButton from "@/app/components/LogoutButton";

export default function NavbarBackoffice() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { user, role, loading } = useAuthContext();

  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        {/* Separator */}
        <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            {/* Separator */}
            <div
              aria-hidden="true"
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img
                  alt={user?.displayName || "User avatar"}
                  src={
                    user?.photoURL ||
                    "https://via.placeholder.com/150?text=No+Avatar"
                  }
                  className="size-8 rounded-full bg-gray-50 ring-2 ring-offset-2 ring-teal-600"
                />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    aria-hidden="true"
                    className="ml-4 text-sm/6 font-semibold text-gray-900"
                  >
                    {user?.displayName || "Guest"} {" " + role}
                  </span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="ml-2 size-5 text-gray-400"
                  />
                </span>
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="account/profile"
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                  >
                    Your profile
                  </a>
                </MenuItem>
                {role === "manager" && (
                  <MenuItem>
                    <a
                      href="/account/properties"
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                    >
                      Your properties
                    </a>
                  </MenuItem>
                )}

                {role === "admin" && (
                  <>
                    <MenuItem>
                      <a
                        href="/admin/dashboard"
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                      >
                        Dashboard
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="/admin/all-properties"
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                      >
                        All properties
                      </a>
                    </MenuItem>
                  </>
                )}

                <MenuItem>
                  <LogoutButton classes="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none hover:bg-gray-100 hover:text-gray-900 cursor-pointer" />
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
