'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

const SearchContext = createContext<any>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [modoBusca, setModoBusca] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

  return (
    <SearchContext.Provider value={{ resultados, setResultados, modoBusca, setModoBusca, pesquisa, setPesquisa }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);