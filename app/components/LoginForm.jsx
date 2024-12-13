"use client";

import PropTypes from "prop-types";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ErrorMessage from "@/app/components/ErrorMessage";

export default function LoginForm({ handleSubmit, error }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const signupLink = query ? `/signup?${query}` : "/signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      return "Email and password are required.";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address.";
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
    handleSubmit(e, { email, password });
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* Display Validation Error */}
        {validationError && <ErrorMessage error={validationError} />}
        {/* Display Server Error */}
        {error && <ErrorMessage error={error} />}

        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <div className="relative -space-y-px rounded-md shadow-sm">
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
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
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
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Not a member?{" "}
          <a
            href={signupLink}
            className="font-semibold text-teal-600 hover:text-teal-500"
          >
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};
