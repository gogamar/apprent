import PropTypes from "prop-types";

export default function ButtonIcon({ icon: Icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      {Icon && <Icon aria-hidden="true" className="-ml-0.5 size-5" />}
      See on map
    </a>
  );
}

ButtonIcon.propTypes = {
  icon: PropTypes.elementType,
  href: PropTypes.string.isRequired,
};
