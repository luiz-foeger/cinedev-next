import { MediaItem, TMDBResponse } from "../types/tmdb";

export const BASE_URL = 'https://api.themoviedb.org/3';
export const API_KEY = 'f28de8ba0645f2c84397c77d12304763';
export const tmdbService = {
  getTrending: async (tipo: 'movie' | 'tv'): Promise<MediaItem[]> => {
    try {
      const res = await fetch(
        `${BASE_URL}/trending/${tipo}/week?api_key=${API_KEY}&language=pt-BR`,
        { next: { revalidate: 3600 } }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro na API TMDB:", res.status, errorData);
        return [];
      }

      const data: TMDBResponse<MediaItem> = await res.json();
      return data.results ? data.results.slice(0, 7) : [];

    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      return [];
    }
  },

  buscarPorId: async (id: string, tipo: 'movie' | 'tv'): Promise<MediaItem> => {
    const res = await fetch(
      `${BASE_URL}/${tipo}/${id}?api_key=${API_KEY}&language=pt-BR`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Obra não encontrada");
    return res.json();
  },

  getDetails: async (tipo: string, id: string) => {
    const res = await fetch(`${BASE_URL}/${tipo}/${id}?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error('Erro ao buscar detalhes');
    return res.json();
  },

  getCredits: async (tipo: string, id: string) => {
    const res = await fetch(`${BASE_URL}/${tipo}/${id}/credits?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error('Erro ao buscar créditos');
    return res.json();
  },

  // Busca títulos semelhantes
  getSimilar: async (tipo: string, id: string) => {
    const res = await fetch(`${BASE_URL}/${tipo}/${id}/similar?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error('Erro ao buscar similares');
    return res.json();
  },

  getPersonDetails: async (id: string) => {
    const res = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error('Erro ao buscar detalhes da pessoa');
    return res.json();
  },

  getPersonCredits: async (id: string) => {
    const res = await fetch(`${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error('Erro ao buscar créditos da pessoa');
    return res.json();
  },

  // Método que você já usava no Banner
  // getTrending: async (tipo: string) => {
  //   const res = await fetch(`${BASE_URL}/trending/${tipo}/week?api_key=${API_KEY}&language=pt-BR`);
  //   if (!res.ok) throw new Error('Erro ao buscar tendências');
  //   const data = await res.json();
  //   return data.results;
  // }
};
