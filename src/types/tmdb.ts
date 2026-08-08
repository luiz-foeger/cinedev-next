export type MediaType = 'movie' | 'tv';

export interface Genre {
    id: number;
    name: string;
}

export interface MediaItem {
    id: number;
    title?: string;      // para filmes
    name?: string;       // para séries
    backdrop_path: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    genres?: Genre[];
    runtime?: number;    // em minutos
    budget?: number;     // em dólares
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}

export interface CreditsResponse {
    cast: CastMember[];
}

export interface TMDBResponse<T> {
    results: T[];
}