"use client";

import PropTypes from "prop-types";

import { usePathname } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import Link from "next/link";
import Filters from "@/app/components/Filters";
import { HomeModernIcon, PlusIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const showFilters = pathname === "/";
  const { user, role, loading } = useAuthContext();

  if (showFilters) {
    return <Filters />;
  }

  const navigation = [
    {
      name: "Add property",
      href: "/account/properties/new",
      icon: PlusIcon,
    },
    {
      name: user && role === "admin" ? "All Properties" : "Your Properties",
      href: "/account/properties",
      icon: HomeModernIcon,
    },
  ];

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        isActive
                          ? "bg-gray-50 text-teal-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-teal-600",
                        "group flex gap-x-3 rounded-md p-2 sm:text-sm/6 font-semibold"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          isActive
                            ? "text-teal-600"
                            : "text-gray-400 group-hover:text-teal-600",
                          "size-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node,
};
