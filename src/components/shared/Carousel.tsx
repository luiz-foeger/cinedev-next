'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import { MediaItem } from '@/types/tmdb';

export default function Carousel({ titulo, endpoint, tipo, genero }: any) {
  const [dados, setDados] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const carrosselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const API_KEY = 'f28de8ba0645f2c84397c77d12304763';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
  const buscar = async () => {
    // FIX: Se não tiver endpoint (comum na página do ator), encerra aqui.
    if (!endpoint) return; 

    try {
      setLoading(true);
      // O '?' garante que se endpoint for nulo, a função não tenta ler .includes
      let url = `${BASE_URL}${endpoint}${endpoint?.includes('?') ? '&' : '?' }api_key=${API_KEY}&language=pt-BR`;
      
      if (genero) url += `&with_genres=${genero}`;
      
      const res = await fetch(url);
      const json = await res.json();
      const listaFinal = json.cast || json.results || [];
      setDados(listaFinal.filter((item: any) => item.poster_path));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  buscar();
}, [endpoint, genero]);

  const scroll = (dir: 'esq' | 'dir') => {
    if (carrosselRef.current) {
      const { scrollLeft, clientWidth } = carrosselRef.current;
      const move = clientWidth * 0.7;
      carrosselRef.current.scrollTo({ left: dir === 'esq' ? scrollLeft - move : scrollLeft + move, behavior: 'smooth' });
    }
  };

  // COMPONENTE SKELETON
  const SkeletonCard = () => (
    <div className="min-w-[150px] md:min-w-[180px] lg:min-w-[210px] aspect-[2/3] rounded-2xl bg-white/5 animate-pulse overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );

  return (
    <div className="w-full py-10 bg-transparent overflow-hidden">
      {/* CABEÇALHO TÍTULO E VER MAIS */}
      <div className="px-6 md:px-16 lg:px-10 mb-6 flex justify-between items-end">
        <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter border-l-4 border-amber-500 pl-4 text-white">
          {titulo}
        </h2>

        {/* <div className="px-6 md:px-16 lg:px-24 mb-6 flex justify-between items-end group/nav">
        <div className="space-y-1">
          <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-md">
            {titulo}
          </h2>
          <div className="h-1 w-0 group-hover/nav:w-full bg-amber-500 transition-all duration-500" />
        </div> */}

        <button
          onClick={() => router.push(`/explorar?titulo=${titulo}&endpoint=${endpoint}&tipo=${tipo}&genero=${genero || ""}`)} style={{ cursor: "pointer" }}
          className="text-amber-500 font-bold text-[10px] md:text-xs hover:text-white transition-colors uppercase tracking-widest"
        >
          Ver Tudo
        </button>
      </div>

      <div className="relative group w-full">
        {/* SETAS */}
        <button onClick={() => scroll('esq')} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/80 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 hidden md:block" style={{ cursor: "pointer" }}>
          <FaChevronLeft className="text-white" />
        </button>

        <div ref={carrosselRef} className="flex gap-5 overflow-x-auto no-scrollbar snap-x py-6">

          <div className="min-w-[24px] md:min-w-[64px] lg:min-w-[96px] flex-shrink-0" />

          {loading ? (
            // SKELETONS
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            dados.map((movie) => {
              const nota = Math.round((movie.vote_average || 0) * 10);
              const corNota = nota >= 70 ? '#22c55e' : nota >= 50 ? '#eab308' : '#ef4444';

              return (
                <div
                  key={movie.id}
                  onClick={() => router.push(`/detalhes/${tipo}/${movie.id}`)}
                  className="relative min-w-[150px] md:min-w-[180px] lg:min-w-[210px] aspect-[2/3] rounded-2xl cursor-pointer snap-start transition-all duration-500 hover:scale-105 group/card"
                >
                  {/* NOTA TMDB CIRCULAR */}
                  <div className="absolute -top-3 left-3 z-40 bg-[#020202] rounded-full p-[1px] shadow-2xl border border-white/10">
                    <div className="relative w-9 h-9 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-white/5" />
                        <circle cx="18" cy="18" r="15" stroke={corNota} strokeWidth="2.5" fill="transparent"
                          strokeDasharray={94} strokeDashoffset={94 - (94 * nota / 100)} strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-white">{nota}%</span>
                    </div>
                  </div>

                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                    <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="poster" fill sizes="210px" className="object-cover transition-transform duration-700 group-hover/card:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-all p-4 flex flex-col justify-end">
                      <p className="text-white font-black uppercase text-xs md:text-sm leading-tight mb-2 italic">
                        {movie.title || movie.name}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* ESPAÇADOR FINAL */}
          <div className="min-w-[24px] md:min-w-[64px] lg:min-w-[96px] flex-shrink-0" />
        </div>

        <button onClick={() => scroll('dir')} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/80 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 hidden md:block" style={{ cursor: "pointer" }}>
          <FaChevronRight className="text-white" />
        </button>
      </div>
    </div>
  );
}