"use client";

import { useState, useEffect } from "react";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

import Logo from "./Logo";

import Link from "next/link";

import { useAuthContext } from "@/app/context/AuthContext";
import LogoutButton from "@/app/components/LogoutButton";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, loading } = useAuthContext();

  const [mounted, setMounted] = useState(false);

  // Ensure this component is mounted before rendering dynamic classes
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href) => mounted && pathname === href;

  const links = [
    { name: "Home", href: "/" },
    { name: "Map", href: "/map" },
    { name: "Travel Quiz", href: "/quiz" },
    { name: "Top Destinations", href: "/destinations" },
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Logo />
              </Link>
            </div>
            <div className="hidden md:ml-24 md:flex md:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(link.href)
                      ? "border-b-2 border-teal-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="shrink-0">
              <Link
                href="/account/properties/new"
                className="relative inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-100 hover:border-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 focus:outline-none transition"
              >
                <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                Add property
              </Link>
            </div>
            <div className="hidden md:ml-4 md:flex md:shrink-0 md:items-center">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Image
                      alt={user?.displayName || "User avatar"}
                      src={
                        user?.photoURL ||
                        "https://via.placeholder.com/150?text=No+Avatar"
                      }
                      width={32}
                      height={32}
                      className="rounded-full bg-gray-50 ring-2 ring-offset-2 ring-teal-600"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {user ? (
                    <>
                      <MenuItem>
                        <Link
                          href="/account/profile"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Your Profile
                        </Link>
                      </MenuItem>

                      {user && role === "admin" && (
                        <MenuItem>
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          >
                            Dashboard
                          </Link>
                        </MenuItem>
                      )}
                      <MenuItem>
                        <Link
                          href="/account/properties"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          {user && role === "admin"
                            ? "All Properties"
                            : "Your Properties"}
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <LogoutButton classes="block w-full text-left border-t border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:outline-none cursor-pointer" />
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Log in
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          href="/signup"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Sign up
                        </Link>
                      </MenuItem>
                    </>
                  )}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navbar */}

      <DisclosurePanel className="md:hidden">
        <div className="space-y-1 pb-3 pt-2">
          {links.map((link) => (
            <DisclosureButton
              as="a"
              key={link.name}
              href={link.href}
              className={`block border-l-4 py-2 pl-3 pr-4 text-sm font-medium ${
                isActive(link.href)
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {link.name}
            </DisclosureButton>
          ))}
        </div>
        {user ? (
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-4 sm:px-6">
              <div className="shrink-0">
                <Image
                  alt={user?.displayName || "User avatar"}
                  src={
                    user?.photoURL ||
                    "https://via.placeholder.com/150?text=No+Avatar"
                  }
                  width={32}
                  height={32}
                  className="size-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-800">
                  {user.displayName}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 pb-3 pt-2">
            <DisclosureButton
              as="a"
              href="/login"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
            >
              Log in
            </DisclosureButton>
            <DisclosureButton
              as="a"
              href="/signup"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
            >
              Sign up
            </DisclosureButton>
          </div>
        )}

        {user && (
          <div className="mt-3 space-y-1">
            <DisclosureButton
              as="a"
              href="/account/profile"
              className="block px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
            >
              Your Profile
            </DisclosureButton>
            {user && role === "admin" && (
              <DisclosureButton
                as="a"
                href="/admin/dashboard"
                className="block px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
              >
                Dashboard
              </DisclosureButton>
            )}
            <DisclosureButton
              as="a"
              href="/account/properties"
              className="block px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
            >
              {user && role === "admin" ? "All Properties" : "Your Properties"}
            </DisclosureButton>
            <LogoutButton classes="block w-full text-left border-t border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6 cursor-pointer" />
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}
