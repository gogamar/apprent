import PropTypes from "prop-types";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function AlertLink({ alertText, actionUrl, actionText }) {
  return (
    <div className="rounded-md bg-teal-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <InformationCircleIcon
            aria-hidden="true"
            className="size-5 text-teal-400"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="sm:text-sm text-teal-700">{alertText}</p>
          <p className="mt-3 sm:text-sm md:ml-6 md:mt-0">
            <a
              href={actionUrl}
              className="whitespace-nowrap font-medium text-teal-700 hover:text-teal-600"
            >
              {actionText}
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

AlertLink.propTypes = {
  alertText: PropTypes.string.isRequired,
  actionUrl: PropTypes.string.isRequired,
  actionText: PropTypes.string.isRequired,
};
