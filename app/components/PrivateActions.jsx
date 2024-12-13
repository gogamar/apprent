"use client";

import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";

import Toggle from "./Toggle";

import {
  CalendarDaysIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function PrivateActions({ property, onToggleField, onDelete }) {
  const { user, role } = useAuthContext();
  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
      <div className="flex items-center gap-4">
        {user && role === "admin" && (
          <Toggle
            state={property.featured || false}
            label="Featured"
            onToggle={(newValue) =>
              onToggleField(property.id, "featured", newValue)
            }
          />
        )}

        <Toggle
          state={property.published || true}
          label="Published"
          onToggle={(newValue) =>
            onToggleField(property.id, "published", newValue)
          }
        />
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Link
          href={`/account/properties/${property.id}/availability`}
          className="flex items-center text-teal-600 hover:text-teal-900"
        >
          <CalendarDaysIcon className="h-5 w-5 mr-1" />
          Calendar
        </Link>
        <Link
          href={`/account/properties/${property.id}/edit`}
          className="text-teal-600 hover:text-teal-900"
        >
          <PencilSquareIcon className="h-5 w-5 mr-1" />
        </Link>
        <button
          onClick={() => onDelete(property.id)}
          className="text-red-600 hover:text-red-900"
        >
          <TrashIcon className="h-5 w-5 mr-1" />
        </button>
      </div>
    </div>
  );
}
