import PropTypes from "prop-types";

import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export default function ErrorMessage({ error }) {
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
          <p className="sm:text-sm text-yellow-700">{error}</p>
        </div>
      </div>
    </div>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired,
};
