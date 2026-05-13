export default function Footer() {
  return (
    <footer className="bg-amber-600 py-6 dark:bg-gray-800 w-full">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <a href="#">
            <PawPrintIcon className="h-6 w-6 text-gray-50 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-50 dark:text-gray-300">
              Pet Store
            </span>
          </a>
        </div>
        <nav className="flex items-center gap-4 ">
          <a
            className="text-sm font-semibold pl-8 text-gray-50 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            href="/"
          >
            Home
          </a>
          <a
            className="text-sm font-semibold text-gray-50 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            href="/pets"
          >
            Pets
          </a>
          <a
            className="text-sm font-semibold text-gray-50 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            href="/products"
          >
            Shop
          </a>
          <a
            className="text-sm font-semibold text-gray-50 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            href="/about"
          >
            About
          </a>
          <a
            className="text-sm font-semibold text-gray-50 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            href="/contact"
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <a aria-label="Facebook" href="#">
            <FacebookIcon className="h-5 w-5 text-gray-50 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
          </a>
          <a aria-label="Twitter" href="#">
            <TwitterIcon className="h-5 w-5 text-gray-50 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
          </a>
          <a aria-label="Instagram" href="#">
            <InstagramIcon className="h-5 w-5 text-gray-50 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
          </a>
        </div>
      </div>
      <div>
        <p className="text-sm flex justify-center items-center text-gray-50 dark:text-gray-400">
          © 2024 Pet Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FacebookIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      {...props}
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function PawPrintIcon(props) {
  return (
    <svg
      {...props}
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
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
