"use client";

import Link from "next/link";
import { db } from "@/lib/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import Toggle from "./Toggle";

export default function PropertyIndex({ properties }) {
  const handleToggleField = async (propertyId, field, newValue) => {
    const docRef = doc(db, "properties", propertyId);
    try {
      await updateDoc(docRef, {
        [field]: newValue,
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the properties and their details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/account/properties/new"
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add property
          </a>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Score
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Featured</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Published</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="size-11 shrink-0">
                          <img
                            alt=""
                            src={property.mainImageUrl}
                            className="size-11 rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            <a
                              href={property.siteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-teal-600"
                            >
                              {property.title}
                            </a>
                          </div>
                          <div className="mt-1 text-gray-500">
                            {property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {property.score}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <Toggle
                        state={property.featured || false}
                        label="Featured"
                        onToggle={(newValue) =>
                          handleToggleField(property.id, "featured", newValue)
                        }
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <Toggle
                        state={property.published || true}
                        label="Published"
                        onToggle={(newValue) =>
                          handleToggleField(property.id, "published", newValue)
                        }
                      />
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link
                        href={`/account/properties/${property.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {property.title}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
