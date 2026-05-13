import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <nav aria-label="Product pagination">
      <ul className="list-style-none flex justify-center p-4">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className={`relative block rounded px-3 py-1.5 text-sm transition-all duration-300 ${
              currentPage === 1
                ? "text-neutral-400 pointer-events-none"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {[...Array(totalPages).keys()].map((page) => (
          <li key={page + 1}>
            <button
              onClick={() => onPageChange(page + 1)}
              className={`relative block rounded px-3 py-1.5 text-sm transition-all duration-300 ${
                currentPage === page + 1
                  ? "bg-primary-100 text-primary-700"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {page + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className={`relative block rounded px-3 py-1.5 text-sm transition-all duration-300 ${
              currentPage === totalPages
                ? "text-neutral-400 pointer-events-none"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
