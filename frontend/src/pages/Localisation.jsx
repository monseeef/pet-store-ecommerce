/**
 * v0 by Vercel.
 * @see https://v0.dev/t/T1ljm8ZMnhH
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import LeafletMapComponent from './Map';

export default function Component() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-6">
        <div className="rounded-lg overflow-hidden h-[400px] w-full">
          <LeafletMapComponent
            style={{
              height: '100%',
              width: '100%',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            }}
            tileLayer={{
              url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
              subdomains: ['a', 'b', 'c'],
            }}
            zoomControl={false}
            zoom={12}
            center={[33.59, -7.63]} // Casablanca coordinates
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter">Nos locaux</h2>
          <div className="space-y-2">
            <p className="text-gray-500 dark:text-gray-400">Venez nous rendre visite à notre siège social :</p>
            <div className="flex items-start gap-2">
              <MapPinIcon className="text-gray-500 dark:text-gray-400 mt-1" />
              <div>
                <p className="font-medium">Acme Inc.</p>
                <p> Boulevard Ghandi, Rond Point Oulmes </p>
                <p>Résidence du Palais Immeuble D au 1 ere étage, Casablanca 20026</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <PhoneIcon className="text-gray-500 dark:text-gray-400 mt-1" />
              <div>
                <p>+212777777777</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MailIcon className="text-gray-500 dark:text-gray-400 mt-1" />
              <div>
                <p>meowtopia@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function MailIcon(props) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon(props) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon(props) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
