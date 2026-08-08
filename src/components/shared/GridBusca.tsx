'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { FaStar, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { API_KEY, BASE_URL } from '@/services/tmdb';

interface GridBuscaProps {
  query: string;
}

export default function GridBusca({ query }: GridBuscaProps) {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [maisResultados, setTemMais] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const buscarDados = useCallback(async (p: number) => {
    if (!query) return;
    setLoading(true);

    try {
      const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${p}&include_adult=false`;
      
      const res = await fetch(url);
      const json = await res.json();
      
      const itensBuscados = (json.results || []).filter((i: any) => i.poster_path || i.profile_path);

      setDados(prev => p === 1 ? itensBuscados : [...prev, ...itensBuscados]);
      setTemMais(json.page < json.total_pages);
    } catch (error) {
      console.error("Erro no escaneamento:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    setPagina(1);
    setDados([]);
    setTemMais(true);
    buscarDados(1);
  }, [query, buscarDados]);

  const ultimoCardRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && maisResultados) {
        setPagina(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, maisResultados]);

  useEffect(() => {
    if (pagina > 1) buscarDados(pagina);
  }, [pagina, buscarDados]);

  return (
    <section className="min-h-screen bg-[#020202] pt-32 pb-20 px-6 md:px-16 lg:px-24">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            BUSCA: <span className="text-amber-500">{query}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
        {dados.map((item, idx) => {
          const isLast = idx === dados.length - 1;
          const tipoMedia = item.media_type || (item.title ? 'movie' : 'tv');
          const path = `/detalhes/${tipoMedia}/${item.id}`;
          const imagem = item.poster_path || item.profile_path;

          return (
            <div
              key={`${item.id}-${idx}`}
              ref={isLast ? ultimoCardRef : null}
              className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 transition-all duration-500 hover:scale-105 hover:z-20 shadow-lg"
            >
              <Link href={path}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${imagem}`}
                  alt={item.title || item.name || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-black uppercase text-xs md:text-sm leading-tight mb-2 italic">
                      {item.title || item.name}
                    </p>
                    <div className="flex justify-between items-center text-[10px] md:text-xs">
                      {item.vote_average > 0 && (
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <FaStar /> {item.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="w-full flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!maisResultados && dados.length > 0 && (
        <p className="text-center text-gray-600 mt-20 font-bold tracking-widest uppercase text-xs">
          Fim dos resultados para {query}
        </p>
      )}
    </section>
  );
}