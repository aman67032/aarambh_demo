"use client";

import React from "react";
import { FocusCards, type CardType } from "./FocusCards";

const FlagshipEvent: React.FC = () => {
  const cards: CardType[] = [
    {
      title: 'Panache',
      src: '/images/building-6011756_1280.jpg',
    },
    {
      title: 'Hackathon',
      src: '/images/building-6011756_1280.jpg',
    },
    {
      title: 'Business Plan',
      src: '/images/building-6011756_1280.jpg',
    },
    {
      title: 'Band Jam',
      src: '/images/building-6011756_1280.jpg',
    },
    {
      title: 'Robo Wars',
      src: '/images/building-6011756_1280.jpg',
    }
  ];

  return (
    <section className="min-h-screen py-20">
      <div className="w-[80%] mx-auto px-4 py-8 bg-white/5 backdrop-blur-md border border-white/5 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-center cosmic-text mb-12">Flagship Events</h2>
        <FocusCards cards={cards} />
      </div>
    </section>
  );
}

export default FlagshipEvent;
