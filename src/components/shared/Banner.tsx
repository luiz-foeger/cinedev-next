'use client';

import { useState, useEffect } from 'react';
import { FaPlay, FaStar, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { MediaItem } from '@/types/tmdb';
import Image from 'next/image';

export default function Banner({ itens, tipo = 'movie' }: { itens: MediaItem[], tipo?: string }) {
  const [indexAtual, setIndexAtual] = useState(0);
  const item = itens[indexAtual];

  useEffect(() => {
    if (!itens || itens.length === 0) return;
    const interval = setInterval(() => {
      setIndexAtual((prev) => (prev + 1) % itens.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [itens]);

  if (!item) return null;

  return (
    <section className="relative w-full h-screen bg-[#020202] flex flex-col justify-end md:justify-center overflow-hidden font-sans">

      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
          alt="bg"
          fill
          className="object-cover opacity-30 transition-opacity duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent md:bg-gradient-to-r md:from-[#020202] md:via-[#020202]/80 md:to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-10">

        <div className="w-full md:max-w-[55%] space-y-4 md:space-y-6 text-left">

          <div className="flex items-center gap-4">
            <span className="text-amber-500 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs">
              {/* Trending Now */}
              EM ALTA ESTA SEMANA
            </span>
            <div className="h-[1px] w-12 bg-amber-500/30" />
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
              <FaStar className="text-amber-500" /> {item.vote_average.toFixed(1)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black italic uppercase leading-[0.95] tracking-tighter drop-shadow-2xl">
            {item.title || item.name}
          </h1>

          <div className="md:border-l-4 md:border-amber-500 md:pl-6 py-1 max-w-xl">
            <p className="text-gray-400 text-xs md:text-sm lg:text-base line-clamp-3 font-medium leading-relaxed drop-shadow-md">
              {item.overview}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button className="flex items-center justify-center gap-3 bg-amber-500 text-black px-6 md:px-10 py-3 md:py-4 rounded-full font-black hover:bg-white transition-all transform hover:scale-105 shadow-xl shadow-amber-900/20" style={{ cursor: 'pointer' }}>
              <FaPlay /> ASSISTIR
            </button>
            <button className="p-3 md:p-4 rounded-full border-2 border-white/20 hover:border-amber-500 transition-all group" style={{ cursor: 'pointer' }}>
              <FaPlus className="text-white group-hover:text-amber-500" />
            </button>
          </div>

          {/* MOBILE ONLY: Seletor horizontal */}
          <div className="md:hidden flex gap-3 overflow-x-auto no-scrollbar pt-8 pb-2">
            {itens.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => setIndexAtual(idx)}
                className={`relative w-32 h-20 lg:w-40 lg:h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 flex-shrink-0
        ${indexAtual === idx
                    ? 'scale-110 ring-2 ring-amber-500 z-20 shadow-[0_0_25px_rgba(245,158,11,0.4)] translate-x-[-12px]'
                    : 'opacity-20 grayscale hover:opacity-60 hover:grayscale-0'}`}
              >
                <Image src={`https://image.tmdb.org/t/p/w300${m.backdrop_path}`} alt="thumb" fill className="object-cover" />
                <span className={`absolute bottom-0 left-2 text-3xl lg:text-4xl font-black italic transition-all duration-500
            ${indexAtual === idx ? 'text-amber-500 opacity-100' : 'text-white opacity-30'}`}
                  style={{ WebkitTextStroke: indexAtual === idx ? '0px' : '1px rgba(255,255,255,0.3)', color: indexAtual === idx ? '' : 'transparent' }}>
                  0{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-4 pr-12 border-r border-white/5 max-h-[70vh] overflow-y-auto no-scrollbar py-6">
          {itens.slice(0, 10).map((m, idx) => (
            <div
              key={m.id}
              onClick={() => setIndexAtual(idx)}
              // Reduzido para w-32/w-36 para dar respiro lateral no notebook
              className={`relative w-32 h-20 lg:w-40 lg:h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 flex-shrink-0
                ${indexAtual === idx
                  ? 'scale-110 ring-2 ring-amber-500 z-20 shadow-[0_0_20px_rgba(245,158,11,0.3)] translate-x-[-15px]'
                  : 'opacity-20 grayscale hover:opacity-60 hover:grayscale-0'}`}
            >
              <Image src={`https://image.tmdb.org/t/p/w300${m.backdrop_path}`} alt="thumb" fill className="object-cover" />
              <span className={`absolute bottom-0 left-2 text-3xl lg:text-5xl font-black italic transition-all
                    ${indexAtual === idx ? 'text-amber-500' : 'text-white opacity-40'}`}
                style={{ WebkitTextStroke: indexAtual === idx ? '0px' : '1px rgba(255,255,255,0.4)', color: indexAtual === idx ? '' : 'transparent' }}>
                0{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 opacity-30">
        <span className="text-[10px] font-black tracking-[0.5em] rotate-90 mb-8 text-white uppercase">Scroll</span>
        <div className="w-[1px] h-32 bg-gradient-to-b from-amber-500 to-transparent" />
      </div>

    </section>
  );
}