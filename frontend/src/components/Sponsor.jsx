export default function Sponsor() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* <div className="mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Our Sponsors
          </h2>
        </div> */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-8">
          <a
            className="flex items-center justify-center rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            href="#"
          >
            <img
              alt="Sponsor 1"
              className="max-w-full"
              height={60}
              src="../public/sponsor/google.svg"
              style={{
                aspectRatio: "120/60",
                // objectFit: "cover",
              }}
              width={140}
            />
          </a>
          <a
            className="flex items-center justify-center rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            href="#"
          >
            <img
              alt="Sponsor 2"
              className="max-w-full"
              height={60}
              src="../public/sponsor/spotify.svg"
              style={{
                aspectRatio: "120/60",
                objectFit: "cover",
              }}
              width={120}
            />
          </a>
          <a
            className="flex items-center justify-center rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            href="#"
          >
            <img
              alt="Sponsor 3"
              className="max-w-full"
              height={60}
              src="../public/sponsor/coca-cola.svg"
              style={{
                aspectRatio: "120/60",
                objectFit: "cover",
              }}
              width={120}
            />
          </a>
          <a
            className="flex items-center justify-center rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            href="#"
          >
            <img
              alt="Sponsor 4"
              className="max-w-full"
              height={60}
              src="../public/sponsor/dental.svg"
              style={{
                aspectRatio: "120/60",
                objectFit: "cover",
              }}
              width={120}
            />
          </a>
          <a
            className="flex items-center justify-center rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            href="#"
          >
            <img
              alt="Sponsor 5"
              className="max-w-full"
              height={60}
              src="../public/sponsor/disney.png"
              style={{
                aspectRatio: "120/60",
                objectFit: "cover",
              }}
              width={120}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
