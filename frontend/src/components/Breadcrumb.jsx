import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Breadcrumb = ({ paths }) => {
  return (
    <ol className="flex items-center whitespace-nowrap p-2 border-y border-gray-200 dark:border-neutral-700">
      {paths.map((path, index) => (
        <li className="inline-flex items-center" key={index}>
          {index > 0 && (
            <svg
              className="flex-shrink-0 mx-2 overflow-visible size-4 text-amber-600 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          )}
          <Link
            className="flex items-center text-sm text-gray-500 hover:text-amber-600 focus:outline-none focus:text-amber-600 dark:text-neutral-500 dark:hover:text-amber-500 dark:focus:text-amber-500"
            to={path.href}
          >
            {path.name}
          </Link>
        </li>
      ))}
    </ol>
  );
};

Breadcrumb.propTypes = {
  paths: PropTypes.array.isRequired,
};

export default Breadcrumb;
