/**
 * v0 by Vercel.
 * @see https://v0.dev/t/5es0JABOLCj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

const Services = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Discover our wide range of pet-focused services tailored to meet
            your furry friends&apos; needs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-950 animate-fadeIn">
            <div className="flex h-12 w-12 items-center justify-center rounded-full  bg-gray-500 hover:bg-amber-600 ">
              <PawPrintIcon className="h-6 w-6 text-gray-50 " />
            </div>
            <h3 className="text-lg font-semibold">Grooming</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Professional pet grooming services to keep your furry friends
              looking their best.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-950 animate-fadeIn animate-delay-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full  bg-gray-500 hover:bg-amber-600">
              <DogIcon className="h-6 w-6 text-gray-50" />
            </div>
            <h3 className="text-lg font-semibold">Veterinary Care</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comprehensive veterinary services to ensure the health and
              well-being of your pets.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-950 animate-fadeIn animate-delay-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-full  bg-gray-500 hover:bg-amber-600">
              <PawPrintIcon className="h-6 w-6 text-gray-50" />
            </div>
            <h3 className="text-lg font-semibold">Pet Supplies</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Wide selection of high-quality pet supplies to keep your furry
              friends happy and healthy.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-950 animate-fadeIn animate-delay-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full  bg-gray-500 hover:bg-amber-600 dark:bg-gray-800">
              <LassoIcon className="h-6 w-6 text-gray-50" />
            </div>
            <h3 className="text-lg font-semibold">Pet Boarding</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Safe and comfortable boarding services for your pets while
              you&apos;re away.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DogIcon(props) {
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
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
      <path d="M8 14v.5" />
      <path d="M16 14v.5" />
      <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
    </svg>
  );
}

function LassoIcon(props) {
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
      <path d="M7 22a5 5 0 0 1-2-4" />
      <path d="M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1" />
      <path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
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

export default Services;