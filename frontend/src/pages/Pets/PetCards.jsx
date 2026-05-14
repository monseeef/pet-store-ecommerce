import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, PawPrint } from "lucide-react";

const PetCards = ({
  id,
  isHovered,
  setIsHovered,
  image,
  name,
  age,
  location,
  availability,
  category,
}) => {
  const isDimmed = isHovered && isHovered !== id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: isDimmed ? 0.62 : 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={`/pets/${id}`}
        className="group block h-full overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white shadow-sm shadow-amber-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-950/12 focus:outline-none focus:ring-4 focus:ring-amber-100"
        onMouseOver={() => setIsHovered(id)}
        onMouseLeave={() => setIsHovered(null)}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={image || "/product-placeholder.svg"}
            alt={name || "Pet"}
            onError={(event) => {
              event.currentTarget.src = "/product-placeholder.svg";
            }}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="pet-badge bg-white/90 text-slate-800 shadow-sm backdrop-blur">
              <PawPrint className="mr-1 h-3.5 w-3.5 text-amber-600" />
              {category || "Pet"}
            </span>
          </div>
          <span
            className={`absolute right-3 top-3 pet-badge shadow-sm backdrop-blur ${
              availability
                ? "bg-emerald-50/95 text-emerald-700"
                : "bg-slate-100/95 text-slate-600"
            }`}
          >
            {availability ? "Available" : "Reserved"}
          </span>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-1 text-xl font-black tracking-tight text-slate-950">
            {name || "Pet"}
          </h3>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-amber-600" />
              {age} {Number(age) === 1 ? "year" : "years"} old
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-600" />
              {location || "Location unavailable"}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-black text-amber-700">Meet pet</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition duration-300 group-hover:translate-x-1 group-hover:bg-amber-600">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PetCards;
