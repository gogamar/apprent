import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find the page you were looking for. It might have
          been removed, renamed, or didn&apos;t exist in the first place.{" "}
        </p>
        <Link
          href="/"
          className="text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded transition-all"
        >
          Go Back to Homepage
        </Link>
      </div>
    </main>
  );
}
