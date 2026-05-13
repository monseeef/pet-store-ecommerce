import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/services/api";

const PetsDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/pets/${id}`);
        setPet(response.data?.data || response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Unable to load pet details.");
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pet-container py-24">Loading pet details...</div>
      </>
    );
  }

  if (error || !pet) {
    return (
      <>
        <Navbar />
        <div className="pet-container py-24">
          <div className="pet-card p-8 text-center text-red-700">
            {error || "Pet not found."}
          </div>
          <Link to="/pets" className="pet-button-secondary mt-6">
            Back to pets
          </Link>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <section className="text-gray-600 body-font overflow-hidden ">
        <div className="container px-5 py-24 mx-auto ">
          <div className="lg:w-4/5 mx-auto flex flex-wrap p-5 ">
            <div className="lg:w-1/2 w-full lg:pr-10  mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Adopt Me!
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                My name&apos;s {pet.name || "your future friend"}!
              </h1>
              <div className="flex mb-4">
                <a className="flex-grow text-primary border-b-2 border-primary py-2 text-lg px-1">
                  Description
                </a>
              </div>
              <p className="leading-relaxed mb-4">{pet.description || "No description available."}</p>
              <div className="flex items-center border-t border-gray-200 py-2">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="#D97706"
                      d="m16 1.25l-.813 1.188s-.539.753-1.062 1.656c-.262.453-.508.926-.719 1.406c-.21.48-.406.922-.406 1.5c0 1.645 1.355 3 3 3s3-1.355 3-3c0-.578-.195-1.02-.406-1.5c-.211-.48-.457-.953-.719-1.406c-.523-.903-1.063-1.657-1.063-1.657zM16 10h-3v4H7c-2.21 0-4 1.79-4 4a4 4 0 0 0 1 2.656V28h24v-7.344A4 4 0 0 0 29 18c0-2.21-1.79-4-4-4h-6v-4zm0-5.125c.066.11.059.102.125.219c.238.41.492.847.656 1.218c.164.372.219.715.219.688c0 .555-.445 1-1 1c-.555 0-1-.445-1-1c0 .027.055-.316.219-.688c.164-.37.418-.808.656-1.218c.066-.117.059-.11.125-.219M15 12h2v2h-2zm-8 4h18c1.191 0 2 .809 2 2c0 1.191-.809 2-2 2c-1.191 0-2-.809-2-2h-2c0 1.191-.809 2-2 2c-1.191 0-2-.809-2-2h-2c0 1.191-.809 2-2 2c-1.191 0-2-.809-2-2H9c0 1.191-.809 2-2 2c-1.191 0-2-.809-2-2c0-1.191.809-2 2-2m3 4.656A3.99 3.99 0 0 0 13 22a3.99 3.99 0 0 0 3-1.344A3.99 3.99 0 0 0 19 22a3.99 3.99 0 0 0 3-1.344A3.99 3.99 0 0 0 25 22c.348 0 .68-.074 1-.156V26H6v-4.156c.32.082.652.156 1 .156a3.99 3.99 0 0 0 3-1.344"
                    />
                  </svg>
                  <span className="text-gray-500">Age</span>
                </div>
                <span className="ml-auto text-gray-900 ">
                  {pet.age ?? 0} {pet.age < 2 ? "year" : "years"} old
                </span>
              </div>
              <div className="flex items-center border-t border-gray-200 py-2">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="#D97706"
                      d="M16 18a5 5 0 1 1 5-5a5.006 5.006 0 0 1-5 5m0-8a3 3 0 1 0 3 3a3.003 3.003 0 0 0-3-3"
                    />
                    <path
                      fill="#D97706"
                      d="m16 30l-8.436-9.949a35 35 0 0 1-.348-.451A10.9 10.9 0 0 1 5 13a11 11 0 0 1 22 0a10.9 10.9 0 0 1-2.215 6.597l-.001.003s-.3.394-.345.447ZM8.813 18.395s.233.308.286.374L16 26.908l6.91-8.15c.044-.055.278-.365.279-.366A8.9 8.9 0 0 0 25 13a9 9 0 1 0-18 0a8.9 8.9 0 0 0 1.813 5.395"
                    />
                  </svg>
                  <span className="text-gray-500">Location</span>
                </div>
                <span className="ml-auto text-gray-900">{pet.location || "Location unavailable"}</span>
              </div>
              <div className="flex items-center border-t border-gray-200 py-2">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="#D97706"
                      d="M22 3v2h3.563l-3.375 3.406A6.962 6.962 0 0 0 18 7c-1.87 0-3.616.74-4.938 2.063a6.94 6.94 0 0 0 .001 9.875c.87.87 1.906 1.495 3.062 1.812c.114-.087.242-.178.344-.28a3.45 3.45 0 0 0 .874-1.532a4.906 4.906 0 0 1-2.875-1.407C13.524 16.588 13 15.336 13 14s.525-2.586 1.47-3.53C15.412 9.523 16.664 9 18 9s2.587.525 3.53 1.47A4.956 4.956 0 0 1 23 14c0 .865-.245 1.67-.656 2.406c.096.516.156 1.058.156 1.594c0 .498-.042.99-.125 1.47c.2-.163.378-.348.563-.532C24.26 17.614 25 15.87 25 14c0-1.53-.504-2.984-1.406-4.188L27 6.438V10h2V3zm-6.125 8.25c-.114.087-.242.178-.344.28c-.432.434-.714.96-.874 1.533c1.09.14 2.085.616 2.875 1.406c.945.943 1.47 2.195 1.47 3.53s-.525 2.586-1.47 3.53C16.588 22.477 15.336 23 14 23s-2.587-.525-3.53-1.47A4.948 4.948 0 0 1 9 18c0-.865.245-1.67.656-2.406A8.789 8.789 0 0 1 9.5 14c0-.498.042-.99.125-1.47c-.2.163-.377.348-.563.533C7.742 14.384 7 16.13 7 18c0 1.53.504 2.984 1.406 4.188L6.72 23.875l-2-2l-1.44 1.406l2 2l-2 2l1.44 1.44l2-2l2 2l1.405-1.44l-2-2l1.688-1.686A6.932 6.932 0 0 0 14 25c1.87 0 3.616-.74 4.938-2.063C20.26 21.616 21 19.87 21 18s-.74-3.614-2.063-4.938c-.87-.87-1.906-1.495-3.062-1.812"
                    />
                  </svg>
                  <span className="text-gray-500">Gender</span>
                </div>
                <span className={`ml-auto capitalize flex items-center font-medium ${pet.gender === "male" ? "text-blue-700" : "text-pink-500"}`}>
                  {pet.gender === "male" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="blue"
                        d="M20 4v6h-2V7.425l-3.975 3.95q.475.7.725 1.488T15 14.5q0 2.3-1.6 3.9T9.5 20t-3.9-1.6T4 14.5t1.6-3.9T9.5 9q.825 0 1.625.237t1.475.738L16.575 6H14V4zM9.5 11q-1.45 0-2.475 1.025T6 14.5t1.025 2.475T9.5 18t2.475-1.025T13 14.5t-1.025-2.475T9.5 11"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#e600b4"
                        d="M11 21v-2H9v-2h2v-2.1q-1.975-.35-3.238-1.888T6.5 9.45q0-2.275 1.613-3.862T12 4t3.888 1.588T17.5 9.45q0 2.025-1.263 3.563T13 14.9V17h2v2h-2v2zm1-8q1.45 0 2.475-1.025T15.5 9.5t-1.025-2.475T12 6T9.525 7.025T8.5 9.5t1.025 2.475T12 13"
                      />
                    </svg>
                  )}{" "}
                  {pet.gender || "Unknown"}
                </span>
              </div>
              <div className="flex items-center border-t border-gray-200 py-2">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#D97706"
                      d="m10.95 17.62l-2.858-2.858l.72-.72l2.138 2.139l4.239-4.239l.719.72zM5.616 21q-.691 0-1.153-.462T4 19.385V6.615q0-.69.463-1.152T5.616 5h1.769V2.77h1.077V5h7.154V2.77h1V5h1.769q.69 0 1.153.463T20 6.616v12.769q0 .69-.462 1.153T18.384 21zm0-1h12.769q.23 0 .423-.192t.192-.424v-8.768H5v8.769q0 .23.192.423t.423.192M5 9.615h14v-3q0-.23-.192-.423T18.384 6H5.616q-.231 0-.424.192T5 6.616zm0 0V6z"
                    />
                  </svg>
                  <span className="text-gray-500">Available</span>
                </div>
                <span
                  className={`ml-auto text-gray-900 text-lg font-bold ${
                    pet.availability ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {pet.availability ? (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="green"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M20 7L10 17l-5-5"
                        />
                      </svg>
                      Yes
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="red"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="m8.464 15.535l7.072-7.07m-7.072 0l7.072 7.07"
                        />
                      </svg>{" "}
                      No
                    </div>
                  )}
                </span>
              </div>

              <div className="flex items-center border-t border-b mb-6 border-gray-200 py-2">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 2048 2048"
                  >
                    <path
                      fill="#D97706"
                      d="m1955 637l-99-99l-166 166l99 99l-90 90l-99-99l-869 870H474l-202 203l-272 90l384-384v-256l870-869l-99-99l90-90l99 99l166-166l-99-99l90-90l544 544zM677 1536l832-832l-165-165l-229 229l82 83l-90 90l-83-82l-102 101l83 83l-90 90l-83-83l-101 102l82 83l-90 90l-83-82l-128 128v165zm923-923l165-165l-165-165l-165 165z"
                    />
                  </svg>
                  <span className="text-gray-500">Vaccinated</span>
                </div>

                <span
                  className={`ml-auto text-gray-900 text-lg font-bold ${
                    pet.isVaccinated ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {pet.isVaccinated ? (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="green"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M20 7L10 17l-5-5"
                        />
                      </svg>
                      Yes
                    </div>
                  ) : (
                    "No"
                  )}{" "}
                </span>
              </div>

              <div className="flex justify-between">
                <Link
                  to={"/pets"}
                  className="flex w-full items-center justify-center text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:bg-secondary "
                >
                  Back
                </Link>

                {/* // WISHLIST FEATURE // 
                
                <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button> */}
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center"
              onError={(event) => {
                event.currentTarget.src = "/product-placeholder.svg";
              }}
              src={pet.image || "/product-placeholder.svg"}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PetsDetails;
