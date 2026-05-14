import { Facebook, Instagram, PawPrint, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-amber-100 bg-slate-950 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 md:flex-row md:px-6">
        <a href="/" className="flex items-center gap-3" aria-label="Petopia home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-black text-white">Petopia</span>
            <span className="block text-xs font-semibold text-slate-400">Modern pet commerce</span>
          </span>
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-4">
          {[
            ["Home", "/"],
            ["Pets", "/pets"],
            ["Shop", "/products"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              className="text-sm font-semibold text-slate-300 transition-colors hover:text-amber-300"
              href={href}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a aria-label="Facebook" href="#">
            <Facebook className="h-5 w-5 text-slate-300 transition-colors hover:text-amber-300" />
          </a>
          <a aria-label="Twitter" href="#">
            <Twitter className="h-5 w-5 text-slate-300 transition-colors hover:text-amber-300" />
          </a>
          <a aria-label="Instagram" href="#">
            <Instagram className="h-5 w-5 text-slate-300 transition-colors hover:text-amber-300" />
          </a>
        </div>
      </div>
      <p className="mt-6 flex items-center justify-center text-sm font-semibold text-slate-400">
        &copy; 2026 Petopia. All rights reserved.
      </p>
    </footer>
  );
}
