'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaChevronLeft, FaBirthdayCake, FaMapMarkerAlt, FaUserTag, FaFilm, FaTv } from 'react-icons/fa';
import { tmdbService } from '@/services/tmdb';
import { formatarDataBrasil } from '@/formatters';

export default function AtorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [pessoa, setPessoa] = useState<any>(null);
  const [filmes, setFilmes] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [expandida, setExpandida] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatarPersonagem = (personagem: string) => {
    if (!personagem) return null;

    const termosSelf = ["self", "self - guest", "self - host", "guest", "self - presenter", "host", "himself", "herself", "him self", "her self"];

    if (termosSelf.includes(personagem.toLowerCase().trim())) {
      return pessoa.name;
    }

    return personagem;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [detalhes, obras] = await Promise.all([
          tmdbService.getPersonDetails(id),
          tmdbService.getPersonCredits(id)
        ]);

        setPessoa(detalhes);

        const cast = obras.cast || [];
        const ordenar = (lista: any[]) => lista.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        setFilmes(ordenar(cast.filter((o: any) => o.media_type === 'movie' && o.poster_path)));
        setSeries(ordenar(cast.filter((o: any) => o.media_type === 'tv' && o.poster_path)));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !pessoa) return <div className="h-screen bg-[#020202] animate-pulse" />;

  const profissao = pessoa.gender === 1 ? 'Atriz' : pessoa.gender === 2 ? 'Ator' : 'Atuação';
  const biografia = pessoa.biography || "";
  const textoBio = !expandida && biografia.length > 450 ? biografia.substring(0, 450) + "..." : biografia;


  const ObraCard = ({ item, tipo }: { item: any; tipo: string }) => {
    const nomePersonagem = formatarPersonagem(item.character);

    return (
      <div
        onClick={() => router.push(`/detalhes/${tipo}/${item.id}`)}
        className="group cursor-pointer flex flex-col gap-2"
      >
        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/5 group-hover:border-amber-500/50 transition-all duration-300 shadow-lg">
          <Image
            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
            alt={item.title || item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="px-1">
          <p className="text-white font-bold text-[11px] md:text-xs uppercase line-clamp-1 italic tracking-tighter">
            {item.title || item.name}
          </p>

          {nomePersonagem && (
            <p className="text-amber-500 font-medium text-[10px] md:text-[12px] line-clamp-1 leading-tight mt-1">
              {nomePersonagem}
            </p>
          )}

          <p className="text-gray-500 text-[10px] font-bold mt-1">
            {(item.release_date || item.first_air_date || "").slice(0, 4)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white pb-20">
      <button
        onClick={() => router.back()} style={{cursor: "pointer"}}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-amber-500 hover:text-black transition-all font-bold text-sm"
      >
        <FaChevronLeft /> VOLTAR
      </button>

      {/* INFORMAÇÕES */}
      <section className="relative pt-28 px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-full md:rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl flex-shrink-0">
            <Image
              src={pessoa.profile_path ? `https://image.tmdb.org/t/p/h632${pessoa.profile_path}` : '/placeholder-actor.png'}
              alt={pessoa.name} fill className="object-cover" priority
            />
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{pessoa.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-black uppercase">
              <span className="flex items-center gap-2 bg-amber-500 text-black px-3 py-1 rounded-full"><FaUserTag /> {profissao}</span>
              {pessoa.birthday && <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-gray-300 border border-white/10"><FaBirthdayCake /> {formatarDataBrasil(pessoa.birthday)}</span>}
            </div>

            {biografia && (
              <div className="space-y-3 max-w-4xl">
                <h2 className="text-xl font-black italic uppercase tracking-tighter border-l-4 border-amber-500 pl-4">Biografia</h2>
                <div className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {textoBio}
                  {biografia.length > 450 && (
                    <button
                      onClick={() => setExpandida(!expandida)} style={{ cursor: "pointer" }}
                      className="ml-2 text-amber-500 font-black text-[10px] hover:underline"
                    >
                      {expandida ? "LER MENOS" : "LER MAIS"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FILMOGRAFIA */}
      <div className="px-6 md:px-16 lg:px-24 mt-20 flex justify-center flex items-center gap-4">
        {/* <FaFilm className="text-amber-500 text-xl" /> */}
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Aparece em:</h2>
      </div>
      <section className="mt-20 px-6 md:px-16 lg:px-24 space-y-20">

        {/* FILMES */}
        {filmes.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              {/* <FaFilm className="text-amber-500 text-xl" /> */}
              <h2 className="text-2xl font-black italic uppercase tracking-tighter border-l-4 border-amber-500 pl-4">Cinema / Filmes</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-8">
              {filmes.map(f => <ObraCard key={f.id} item={f} tipo="movie" />)}
            </div>
          </div>
        )}

        {/* SÉRIES */}
        {series.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              {/* <FaTv className="text-amber-500 text-xl" /> */}
              <h2 className="text-2xl font-black italic uppercase tracking-tighter border-l-4 border-amber-500 pl-4">Televisão / Séries</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-8">
              {series.map(s => <ObraCard key={s.id} item={s} tipo="tv" />)}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}