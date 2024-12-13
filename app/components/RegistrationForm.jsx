"use client";

import { useState, useEffect } from "react";
import Error from "@/app/components/Error";
import Image from "next/image";

export default function RegistrationForm({
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
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
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

  const validateForm = () => {
    if (!displayName.trim()) {
      return "Display name is required.";
    }

    if (!hideEmailAndPassword) {
      if (!email.trim()) {
        return "Email is required.";
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        return "Please enter a valid email address.";
      }

      if (!password.trim()) {
        return "Password is required.";
      }

      if (password.length < 6) {
        return "Password must be at least 6 characters long.";
      }
    }

    if (avatar && typeof avatar === "object" && avatar.size > 2 * 1024 * 1024) {
      return "Avatar file size should not exceed 2MB.";
    }

    return ""; // No errors
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    setValidationError(""); // Clear any previous validation errors
    handleSubmit(e, { email, password, displayName, avatar });
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            {submitButtonText === "Sign Up"
              ? "Create a new account"
              : "Update your profile"}
          </h2>
        </div>

        {/* Display Validation Error */}
        {validationError && <Error error={validationError} />}
        {/* Display Server Error */}
        {error && <Error error={error} />}

        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="display-name" className="sr-only">
                Your name
              </label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                placeholder="Your Name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm"
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
                    placeholder="Email address"
                    autoComplete="email"
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
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
                    placeholder="Password"
                    autoComplete="current-password"
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
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
                  <Image
                    alt={displayName || "User avatar"}
                    src={
                      avatar || "https://via.placeholder.com/150?text=No+Avatar"
                    }
                    width={32}
                    height={32}
                    className="rounded-full bg-gray-50 ring-2 ring-offset-2 ring-teal-600"
                  />
                )}
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-teal-600 file:py-1 file:px-2 file:text-white file:hover:bg-teal-500"
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
              className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500">
          Already a member?{" "}
          <a
            href="/login"
            className="font-semibold text-teal-600 hover:text-teal-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
