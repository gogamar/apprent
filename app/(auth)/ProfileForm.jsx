"use client";

import { useState, useEffect } from "react";
import Error from "../components/Error";

export default function SignupForm({
  handleSubmit,
  error,
  initialValues = { email: "", password: "", displayName: "", avatar: null },
  submitButtonText = "Sign Up",
  hideEmailAndPassword = false,
}) {
  const [email, setEmail] = useState(initialValues.email);
  const [password, setPassword] = useState(initialValues.password);
  const [displayName, setDisplayName] = useState(initialValues.displayName);
  const [avatar, setAvatar] = useState(initialValues.avatar);

  useEffect(() => {
    // Populate the form with initial values if provided
    setEmail(initialValues.email);
    setPassword(initialValues.password);
    setDisplayName(initialValues.displayName);
    setAvatar(initialValues.avatar);
  }, [initialValues]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const onSubmit = (e) => {
    handleSubmit(e, { email, password, displayName, avatar });
  };

  console.log("avatar", avatar);

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=teal&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {submitButtonText === "Sign Up"
              ? "Create a new account"
              : "Update your profile"}
          </h2>
        </div>
        {error && <Error error={error} />}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="display-name" className="sr-only">
                Display Name
              </label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                required
                placeholder="Display Name"
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm/6"
              />
            </div>
            {!hideEmailAndPassword && (
              <>
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    placeholder="Email address"
                    autoComplete="email"
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm/6"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    placeholder="Password"
                    autoComplete="current-password"
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm/6"
                  />
                </div>
              </>
            )}
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              >
                Avatar
              </label>
              <div className="mt-4 flex justify-between space-x-4">
                {avatar && typeof avatar === "string" && (
                  <img
                    alt={displayName || "User avatar"}
                    src={
                      avatar || "https://via.placeholder.com/150?text=No+Avatar"
                    }
                    className="size-8 rounded-full bg-gray-50 ring-2 ring-offset-2 ring-teal-600"
                  />
                )}
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-teal-600 file:py-1 file:px-2 file:text-white file:hover:bg-teal-500"
                />
                {avatar && typeof avatar === "object" && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected file: <strong>{avatar.name}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
