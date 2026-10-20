import { Movie } from '../types';
import { getPreferences } from './storage';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w780';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

export const TMDB_GENRES: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Sci-Fi': 878,
  Thriller: 53,
};

// Curated high-fidelity catalog of movies & series for instantaneous playback & offline resilience
export const CURATED_MOVIES: Movie[] = [
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg',
    rating: 8.3,
    releaseYear: 2024,
    genres: ['Sci-Fi', 'Adventure'],
    duration: '2h 46m',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'movie',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: '/src/assets/images/hero_scifi_odyssey_1792444847656.jpg',
    rating: 8.7,
    releaseYear: 2014,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    duration: '2h 49m',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'movie',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    overview: 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos. K\'s discovery leads him on a quest to find Rick Deckard.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdropUrl: '/src/assets/images/hero_action_thriller_1792444848391.jpg',
    rating: 8.0,
    releaseYear: 2017,
    genres: ['Sci-Fi', 'Mystery', 'Action'],
    duration: '2h 44m',
    trailerUrl: 'https://www.youtube.com/embed/gCcx85zbxz4',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'movie',
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Sylvia Hoeks'],
    director: 'Denis Villeneuve',
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II, exploring the moral and political turmoil that followed the Manhattan Project.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/nb3xI8XI3w4pMVZ38VijbsyvjP4.jpg',
    rating: 8.1,
    releaseYear: 2023,
    genres: ['Drama', 'History'],
    duration: '3h 00m',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'movie',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
  },
  {
    id: 'spider-verse-2',
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    rating: 8.4,
    releaseYear: 2023,
    genres: ['Animation', 'Action', 'Adventure'],
    duration: '2h 20m',
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'movie',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    director: 'Joaquim Dos Santos',
  },
  {
    id: 'blue-planet-2',
    title: 'Blue Planet: Deep Oceans',
    overview: 'Journey beneath the waves to encounter extraordinary creatures in the most remote depths on Earth. Narrated with groundbreaking undersea cinematography and bioluminescent spectacles.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/yqC9Yv0wU0QZ3r7o0y7F1u2bN3q.jpg',
    backdropUrl: '/src/assets/images/hero_nature_deepsea_1792444848871.jpg',
    rating: 8.9,
    releaseYear: 2023,
    genres: ['Documentary'],
    duration: '50m',
    trailerUrl: 'https://www.youtube.com/embed/kbflx_k3N4Y',
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    type: 'series',
    cast: ['David Attenborough'],
    director: 'James Honeyborne',
  },
  {
    id: 'severance-series',
    title: 'Severance',
    overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/pWBv52D0gC8FvV4i1XJ4bV91h4G.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/l0qEp9YwioqTq975z1fU4B8pB6.jpg',
    rating: 8.5,
    releaseYear: 2022,
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    duration: 'Season 1 · 9 Episodes',
    trailerUrl: 'https://www.youtube.com/embed/xEQP4VVuyrY',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'series',
    cast: ['Adam Scott', 'Patricia Arquette', 'John Turturro', 'Christopher Walken'],
    director: 'Ben Stiller',
  },
  {
    id: 'the-batman',
    title: 'The Batman',
    overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    rating: 7.7,
    releaseYear: 2022,
    genres: ['Action', 'Crime', 'Drama'],
    duration: '2h 56m',
    trailerUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'movie',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
    director: 'Matt Reeves',
  },
  {
    id: 'top-gun-maverick',
    title: 'Top Gun: Maverick',
    overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission that demands the ultimate sacrifice.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg',
    rating: 8.2,
    releaseYear: 2022,
    genres: ['Action', 'Drama'],
    duration: '2h 11m',
    trailerUrl: 'https://www.youtube.com/embed/giXco2jaZ_4',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'movie',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Jon Hamm'],
    director: 'Joseph Kosinski',
  },
  {
    id: 'arcane-series',
    title: 'Arcane',
    overview: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/fqldf2t8ztc9aiwn397rWW2GvBc.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fqldf2t8ztc9aiwn397rWW2GvBc.jpg',
    rating: 9.0,
    releaseYear: 2021,
    genres: ['Animation', 'Sci-Fi', 'Action'],
    duration: 'Season 2 · 9 Episodes',
    trailerUrl: 'https://www.youtube.com/embed/fXmAurh012s',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'series',
    cast: ['Hailee Steinfeld', 'Ella Purnell', 'Katie Leung'],
    director: 'Pascal Charrue',
  },
];

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const prefs = getPreferences();
  const apiKey = prefs.tmdbApiKey || (import.meta.env.VITE_TMDB_API_KEY as string) || '';

  if (!apiKey) {
    return CURATED_MOVIES;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=${prefs.tmdbLanguage || 'en-US'}`
    );
    if (!res.ok) return CURATED_MOVIES;

    const data = await res.json();
    if (!data.results) return CURATED_MOVIES;

    const liveMovies: Movie[] = data.results.slice(0, 15).map((item: any) => ({
      id: item.id,
      title: item.title || item.name || 'Untitled Feature',
      overview: item.overview || 'No synopsis available for this title.',
      posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : CURATED_MOVIES[0].posterUrl,
      backdropUrl: item.backdrop_path ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}` : CURATED_MOVIES[0].backdropUrl,
      rating: Math.round((item.vote_average || 7.5) * 10) / 10,
      releaseYear: parseInt((item.release_date || item.first_air_date || '2024').substring(0, 4), 10),
      genres: ['Trending', item.media_type === 'tv' ? 'Series' : 'Cinema'],
      duration: item.media_type === 'tv' ? 'TV Series' : '2h 15m',
      trailerUrl: `https://www.youtube.com/embed/Way9Dexny3w`,
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      type: item.media_type === 'tv' ? 'series' : 'movie',
      cast: ['Featured Cast Ensemble'],
    }));

    return liveMovies;
  } catch {
    return CURATED_MOVIES;
  }
}

export async function fetchMoviesByGenre(genre: string): Promise<Movie[]> {
  const filtered = CURATED_MOVIES.filter((m) => m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()));
  if (filtered.length >= 3) return filtered;
  return CURATED_MOVIES;
}
