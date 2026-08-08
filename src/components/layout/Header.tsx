'use client';
import { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '@/context/SearchContext';

export default function Header() {
  const { setResultados, setModoBusca, setPesquisa, pesquisa } = useSearch();
  const [pesquisaAtiva, setPesquisaAtiva] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const buscarFilmes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pesquisa.trim() === '') return;

    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=f28de8ba0645f2c84397c77d12304763&query=${encodeURIComponent(pesquisa)}&language=pt-BR`);
      const dados = await res.json();

      const filtrados = (dados.results || []).filter((item: any) => (
        (item.media_type === 'movie' && item.poster_path && item.title && item.vote_average > 0) ||
        (item.media_type === 'tv' && item.poster_path && item.name && item.vote_average > 0) ||
        (item.media_type === 'person' && item.profile_path && item.name)
      ));

      setResultados(filtrados);
      setModoBusca(true);

      if (pathname !== '/') router.push('/');
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  return (
    <header className="fixed top-6 w-full z-[100] px-6 flex justify-center">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-3 px-8 rounded-2xl flex items-center gap-8 shadow-2xl">
        <h1 onClick={() => setModoBusca(false)} className="text-white font-black italic text-lg cursor-pointer">
          CINE<span className="text-amber-500">DEV</span>
        </h1>
        
        <nav className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <button onClick={() => setModoBusca(false)}>INÍCIO</button>
          <span>SÉRIES</span>
          <span>FILMES</span>
        </nav>

        <form onSubmit={buscarFilmes} className="flex items-center bg-white/5 rounded-xl px-3 border border-white/10">
          <FaSearch className="text-amber-500 text-xs" />
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="BUSCAR..."
            className="bg-transparent py-2 px-3 outline-none text-[10px] font-bold italic w-32 md:w-64"
          />
        </form>
      </div>
    </header>
  );
}