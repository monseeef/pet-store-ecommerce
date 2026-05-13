"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/services/api";

export default function PetCards() {
  const [activeTab, setActiveTab] = useState("dogs");
  const [dogCards, setDogCards] = useState([]);
  const [catCards, setCatCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get("/pets/featured");
        const data = response.data;
        setDogCards(data.dogs);
        setCatCards(data.cats);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <div className="flex gap-2 md:gap-4">
        <Button
          onClick={() => setActiveTab("dogs")}
          className={`${
            activeTab === "dogs"
              ? "bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900"
              : "bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50"
          } px-2 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-300 ease-in-out`}
        >
          Dogs
        </Button>
        <Button
          onClick={() => setActiveTab("cats")}
          className={`${
            activeTab === "cats"
              ? "bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900"
              : "bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50"
          } px-2 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-300 ease-in-out`}
        >
          Cats
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {activeTab === "dogs"
          ? dogCards.map((card, index) => (
              <Card
                key={index}
                className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out group"
              >
                <div className="relative">
                  <img
                    src={card.image}
                    alt={card.name}
                    width={400}
                    height={300}
                    className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <div className="flex flex-col items-center justify-center h-full text-white">
                      <h3 className="text-xl font-semibold animate-fade-in-up">{card.name}</h3>
                      <p className="text-sm animate-fade-in-up delay-100">{card.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          : catCards.map((card, index) => (
              <Card
                key={index}
                className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out group"
              >
                <div className="relative">
                  <img
                    src={card.image}
                    alt={card.name}
                    width={400}
                    height={300}
                    className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <div className="flex flex-col items-center justify-center h-full text-white">
                      <h3 className="text-xl font-semibold animate-fade-in-up">{card.name}</h3>
                      <p className="text-sm animate-fade-in-up delay-100">{card.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
