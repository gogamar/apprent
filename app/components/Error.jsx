import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export default function Error({ error }) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="size-5 text-red-400"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Attention needed</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
