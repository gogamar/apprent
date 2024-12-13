import PropTypes from "prop-types";

import LoadingPropertyCard from "./LoadingPropertyCard";

export default function LoadingList({ itemsPerPage }) {
  return (
    <>
      <div className="flex justify-end px-6">
        <div className="h-10 w-28 bg-gray-300 rounded-md justify-end animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 gap-6 py-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <LoadingPropertyCard key={index} />
        ))}
      </div>
    </>
  );
}

LoadingList.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
};
