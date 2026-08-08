'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaStar, FaChevronLeft } from 'react-icons/fa';

import { MediaItem } from '@/types/tmdb';
import { API_KEY, BASE_URL } from '@/services/tmdb';
import Link from 'next/link';
import Image from 'next/image';

function ExplorarConteudo() {
    const searchParams = useSearchParams();
    const titulo = searchParams.get('titulo') || 'Explorar';
    const endpoint = searchParams.get('endpoint');
    const tipo = searchParams.get('tipo') as 'movie' | 'tv';
    const genero = searchParams.get('genero');

    const [dados, setDados] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [temMais, setTemMais] = useState(true);

    const observer = useRef<IntersectionObserver | null>(null);

    const buscarDados = useCallback(async (p: number) => {
        if (!endpoint) return;
        setLoading(true);

        try {
            let url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=pt-BR&page=${p}`;
            if (genero) url += genero.startsWith('&') ? genero : `&with_genres=${genero}`;

            const res = await fetch(url);
            const json = await res.json();
            const novosItens = (json.results || []).filter((i: MediaItem) => i.poster_path);

            setDados(prev => p === 1 ? novosItens : [...prev, ...novosItens]);
            setTemMais(json.page < json.total_pages);
        } catch (error) {
            console.error("Erro ao carregar mais títulos:", error);
        } finally {
            setLoading(false);
        }
    }, [endpoint, genero]);

    // RESET AO MUDAR DE CATEGORIA/GENERO
    useEffect(() => {
        setPagina(1);
        setDados([]);
        setTemMais(true);
        buscarDados(1);
    }, [endpoint, genero, buscarDados]);

    // TRIGGER PARA CARREGAR MAIS RESULTADOS
    useEffect(() => {
        if (pagina > 1) buscarDados(pagina);
    }, [pagina, buscarDados]);

    // OBSERVER PARA INFINITE SCROLL
    const ultimoCardRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && temMais) {
                setPagina(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, temMais]);

    return (
        <main className="min-h-screen bg-[#020202] pt-28 pb-20 px-6 md:px-16 lg:px-24">
            {/* HEADER DA PÁGINA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <Link href="/" className="flex items-center gap-2  text-amber-500 font-bold text-[10px] md:text-xs hover:text-white transition-colors uppercase tracking-widest"
                    >
                        <FaChevronLeft /> VOLTAR
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                        {titulo}
                    </h1>
                </div>
                {/* <div className="text-gray-500 font-mono text-sm">
          RESULTADOS ENCONTRADOS: <span className="text-amber-500">{dados.length}</span>
        </div> */}
            </div>

            {/* GRID DE FILMES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
                {dados.map((item, idx) => {
                    const isLast = idx === dados.length - 1;
                    return (
                        <div
                            key={`${item.id}-${idx}`}
                            ref={isLast ? ultimoCardRef : null}
                            className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 transition-all duration-500 hover:scale-105 hover:z-20 shadow-lg"
                        >
                            <Link href={`/detalhes/${tipo || 'movie'}/${item.id}`}>
                                <Image
                                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                    alt={item.title || item.name || ''}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                />

                                {/* OVERLAY AMBER */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-white font-black uppercase text-xs md:text-sm leading-tight mb-2 italic">
                                            {item.title || item.name}
                                        </p>
                                        <div className="flex justify-between items-center text-[10px] md:text-xs">
                                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                                                <FaStar /> {item.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* FEEDBACK DE CARREGAMENTO */}
            {loading && (
                <div className="w-full flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!temMais && dados.length > 0 && (
                <p className="text-center text-gray-600 mt-20 font-bold tracking-widest uppercase text-xs">
                    Não houve mais títulos para {titulo}
                </p>
            )}
        </main>
    );
}

export default function VerTudo() {
    return (
        <Suspense fallback={<div className="bg-[#020202] h-screen" />}>
            <ExplorarConteudo />
        </Suspense>
    );
}