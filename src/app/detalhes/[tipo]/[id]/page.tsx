'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaClock, FaMoneyBillWave, FaFilm, FaChevronLeft, FaPlay, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

import { tmdbService } from '@/services/tmdb';
import { formatarValorDolar, formatarDataBrasil, formatarDuracao } from '@/formatters';
import Carousel from '@/components/shared/Carousel';

export default function DetalhesPage({ params }: { params: Promise<{ tipo: string; id: string }> }) {
  const { tipo, id } = use(params);
  const router = useRouter();
  
  const [obra, setObra] = useState<any>(null);
  const [creditos, setCreditos] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [detalhes, elenco] = await Promise.all([
          tmdbService.getDetails(tipo, id),
          tmdbService.getCredits(tipo, id)
        ]);
        setObra(detalhes);
        setCreditos(elenco);
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tipo, id]);

  if (loading || !obra) return <div className="h-screen bg-[#020202] animate-pulse" />;

  // Verificação diretor em filmes
  const diretor = creditos?.crew?.find((c: any) => c.job === 'Director')?.name;
  // Verificação link para assistir
  const linkAssistir = obra.homepage && obra.homepage !== "" ? obra.homepage : null;

  return (
    <main className="min-h-screen bg-[#020202] text-white pb-20 overflow-x-hidden relative">
      
      {/* BOTÃO VOLTAR */}
      <button 
        onClick={() => router.back()}  style={{cursor: "pointer"}}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-amber-500 hover:text-black transition-all font-bold text-sm group"
      >
        <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[85vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <Image 
            src={`https://image.tmdb.org/t/p/original${obra.backdrop_path}`}
            alt="backdrop" fill className="object-cover opacity-30" priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent hidden md:block" />
        </div>

        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pb-16 flex flex-col md:flex-row gap-10 items-center md:items-end">
          {/* PÔSTER */}
          <div className="relative w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 hidden lg:block -mb-10 z-20">
            <Image src={`https://image.tmdb.org/t/p/w500${obra.poster_path}`} alt="poster" fill className="object-cover" />
          </div>

          <div className="space-y-6 text-center md:text-left flex-1">
            {/* TÍTULO */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none drop-shadow-2xl">
              {obra.title || obra.name}
            </h1>

            {/* SLOGAN */}
            {obra.tagline && (
              <p className="text-lg md:text-xl text-gray-300 italic font-medium max-w-2xl md:mx-0 mx-auto">
                &ldquo;{obra.tagline}&rdquo;
              </p>
            )}

            {/* DADOS PRINCIPAIS */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-gray-300 items-center">
              {obra.vote_average > 0 && (
                <span className="flex items-center gap-2 text-amber-500 font-black text-lg">
                  <FaStar /> {obra.vote_average.toFixed(1)}
                </span>
              )}
              
              {(obra.runtime || obra.episode_run_time?.[0]) && (
                <span className="flex items-center gap-2"><FaClock /> {formatarDuracao(obra.runtime || obra.episode_run_time?.[0])}</span>
              )}

              {(obra.release_date || obra.first_air_date) && (
                <span className="bg-white/10 px-3 py-1 rounded-full">{formatarDataBrasil(obra.release_date || obra.first_air_date)}</span>
              )}
            </div>

            {/* GÊNEROS */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {obra.genres?.map((g: any) => (
                <button 
                  key={g.id}
                  onClick={() => router.push(`/explorar?titulo=${g.name}&endpoint=/discover/${tipo}&genero=${g.id}&tipo=${tipo}`)} style={{cursor: "pointer"}}
                  className="px-4 py-2 bg-amber-500/5 border border-amber-500/30 text-amber-500 text-[10px] md:text-xs font-black rounded-full hover:bg-amber-500 hover:text-black transition-all uppercase tracking-widest"
                >
                  {g.name}
                </button>
              ))}
            </div>

             {/* ASSISTIR */}
             {linkAssistir && (
                <div className="pt-4 flex justify-center md:justify-start">
                  <Link href={linkAssistir} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-3 bg-amber-500 text-black px-8 py-4 rounded-full font-black hover:bg-white transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20 text-lg" style={{cursor: "pointer"}}>
                      <FaPlay /> ASSISTIR
                      {/* <FaExternalLinkAlt className="text-xs opacity-70 mb-1" /> */}
                    </button>
                  </Link>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* GRID CONTEÚDO */}
      <section className="px-6 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-16 relative z-10">
        
        {/* COLUNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-12">
          {/* SINOPSE */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter border-l-4 border-amber-500 pl-4 text-white">Sinopse</h2>
            <p className="text-gray-300 text-lg leading-relaxed font-medium">
              {obra.overview || "Nenhuma sinopse disponível em português para este título."}
            </p>
          </div>

          {/* ELENCO */}
          {creditos?.cast?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter border-l-4 border-amber-500 pl-4">Elenco Principal</h2>
              
              {/* [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)] */}
              <div className="flex gap-6 overflow-x-auto no-scrollbar pl-5 pb-6 [mask-image:linear-gradient(to_right,transparent,white_2%,white_98%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]">
                {creditos.cast.slice(0, 15).map((ator: any) => (
                  <button style={{cursor: "pointer"}}
                    key={ator.id}
                    onClick={() => router.push(`/ator/${ator.id}`)}
                    className="flex-shrink-0 group text-center space-y-3 w-28"
                  >
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-amber-500 transition-all shadow-xl group-hover:shadow-amber-500/20">
                      <Image 
                        src={ator.profile_path ? `https://image.tmdb.org/t/p/w185${ator.profile_path}` : '/placeholder-actor.png'} 
                        alt={ator.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase leading-tight line-clamp-2">{ator.name}</p>
                      <p className="text-[10px] text-gray-500 italic line-clamp-1">{ator.character}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR TÉCNICA */}
        <aside className="space-y-8 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 h-fit">
          <div className="space-y-6">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
              <FaFilm className="text-amber-500" /> Ficha Técnica
            </h3>

            {/* DIREÇÃO */}
            {diretor && (
              <div className="space-y-1 pb-4 border-b border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Direção</p>
                <p className="font-bold text-amber-500 text-lg">{diretor}</p>
              </div>
            )}

            {/* ESTÚDIO PRODUÇÃO */}
            {obra.production_companies?.[0] && (
               <div className="space-y-1 pb-4 border-b border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Estúdio Principal</p>
                <p className="font-bold">{obra.production_companies[0].name}</p>
              </div>
            )}
            
            {/* FINANCEIRO */}
            {(obra.budget > 0 || obra.revenue > 0) && (
              <div className="grid grid-cols-1 gap-4 pt-2">
                {obra.budget > 0 && (
                  <div className="space-y-1">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <FaMoneyBillWave className="text-red-400" /> Orçamento
                    </p>
                    <p className="font-bold">{formatarValorDolar(obra.budget)}</p>
                  </div>
                )}
                {obra.revenue > 0 && (
                  <div className="space-y-1">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <FaMoneyBillWave className="text-emerald-400" /> Bilheteria
                    </p>
                    <p className="font-bold text-emerald-400">{formatarValorDolar(obra.revenue)}</p>
                  </div>
                )}
              </div>
            )}

             {!diretor && !obra.production_companies?.[0] && obra.budget === 0 && obra.revenue === 0 && (
               <p className="text-gray-500 text-xs italic">Sem informações técnicas adicionais.</p>
             )}
          </div>
        </aside>
      </section>

      {/* TÍTULOS SEMELHANTES */}
      <section className="mt-24 relative z-10">
         <Carousel 
            titulo="Você Também Pode Gostar" 
            endpoint={`/${tipo}/${id}/similar`} 
            tipo={tipo as any} 
         />
      </section>
    </main>
  );
}