'use client';

import { useEffect, useState } from 'react';
import Banner from '@/components/shared/Banner';
import Carousel from '@/components/shared/Carousel';
import GridBusca from '@/components/shared/GridBusca';
import { tmdbService } from '@/services/tmdb';
import { useSearch } from '@/context/SearchContext';

export default function Home() {
  const { modoBusca, pesquisa } = useSearch();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await tmdbService.getTrending('movie');
        setMovies(data);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  const carrosseis = [
    {
      titulo: "Bombando nas bilheterias",
      endpoint: "/movie/popular",
      tipo: "movie" as const
    },
    {
      titulo: "Para maratonar: Séries da Semana",
      endpoint: "/trending/tv/week",
      tipo: "tv" as const
    },
    {
      titulo: "Terror e Suspense",
      endpoint: "/discover/movie",
      tipo: "movie" as const,
      genero: "27"
    },
    {
      titulo: "Aclamados pela crítica",
      endpoint: "/movie/top_rated",
      tipo: "movie" as const
    },
    {
      titulo: "Séries de TV mais amadas",
      endpoint: "/tv/popular",
      tipo: "tv" as const,
      genero: "10765&with_original_language=en"
    },
    {
      titulo: "Clássicos do Faroeste Americano",
      endpoint: "/discover/movie",
      tipo: "movie" as const,
      genero: "37&sort_by=popularity.desc&vote_count.gte=2000&with_watch_monetization_types=flatrate&with_original_language=en"
    },
    {
      titulo: "Séries de Romance",
      endpoint: "/discover/tv",
      tipo: "tv" as const,
      genero: "10749"
    },
  ];

  if (loading) return <div className="min-h-screen bg-black animate-pulse" />;

  return (
    <main className="min-h-screen bg-black pb-20">

      {modoBusca ? (
        <GridBusca query={pesquisa} />
      ) : (
        <>
          <Banner itens={movies} tipo="movie" />

          <div className="relative -mt-16 md:-mt-32 z-20 space-y-4">
            {carrosseis.map((item, idx) => (
              <Carousel
                key={idx}
                titulo={item.titulo}
                endpoint={item.endpoint}
                tipo={item.tipo}
                genero={item.genero}
              />
            ))}
          </div>
        </>
      )}
      
    </main>
  );
}