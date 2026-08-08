export const formatarValorDolar = (valor: number | undefined): string | null => {
    if (!valor || isNaN(valor)) return null;
    return valor.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
};

export const formatarDataBrasil = (dataStr: string | undefined): string | null => {
    if (!dataStr) return null;
    const data = new Date(dataStr);
    if (isNaN(data.getTime())) return null;
    return data.toLocaleDateString("pt-BR");
};

export const formatarDuracao = (minutagemTotal: number | undefined): string | null => {
    if (!minutagemTotal || isNaN(minutagemTotal)) return null;
    const horas = Math.floor(minutagemTotal / 60);
    const minutos = minutagemTotal % 60;

    if (horas > 0) return `${horas}h ${minutos}min`;
    return `${minutos} minutos`;
};

export const GENRES_MAP: Record<number, string> = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "História",
    27: "Terror",
    10402: "Música",
    9648: "Mistério",
    10749: "Romance",
    878: "Ficção Científica",
    10770: "Cinema TV",
    53: "Thriller",
    10752: "Guerra",
    37: "Faroeste",
    10759: "Ação & Aventura",
    10762: "Infantil",
    10763: "Notícias",
    10764: "Reality Show",
    10765: "Ficção & Fantasia",
    10766: "Novela",
    10767: "Talk Show"
};