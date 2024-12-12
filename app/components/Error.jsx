import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export default function Error({ error }) {
  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="size-5 text-yellow-400"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      </div>
    </div>
  );
}
