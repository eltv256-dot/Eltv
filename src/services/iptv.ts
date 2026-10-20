import { Channel, CountryInfo, EPGProgram } from '../types';
import { getCustomChannels } from './storage';

export const CONTINENTS = [
  'All',
  'Africa',
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Oceania',
] as const;

export const CATEGORIES = [
  'All',
  'News',
  'Sports',
  'Movies',
  'Kids',
  'Music',
  'Entertainment',
  'Documentary',
  'Business',
  'Religious',
] as const;

export const COUNTRIES: CountryInfo[] = [
  { code: 'ALL', name: 'All Countries', flag: '🌐', continent: 'All' },
  { code: 'US', name: 'United States', flag: '🇺🇸', continent: 'North America' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', continent: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', continent: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', continent: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', continent: 'Europe' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', continent: 'North America' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', continent: 'Oceania' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', continent: 'Asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', continent: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', continent: 'Asia' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', continent: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', continent: 'Asia' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', continent: 'South America' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', continent: 'South America' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', continent: 'Africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', continent: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', continent: 'Africa' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', continent: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', continent: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', continent: 'Europe' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', continent: 'Oceania' },
];

export const CONTINENT_MAP: Record<string, string> = {
  US: 'North America',
  CA: 'North America',
  MX: 'North America',
  GB: 'Europe',
  DE: 'Europe',
  FR: 'Europe',
  ES: 'Europe',
  IT: 'Europe',
  NL: 'Europe',
  CH: 'Europe',
  AT: 'Europe',
  SE: 'Europe',
  NO: 'Europe',
  DK: 'Europe',
  JP: 'Asia',
  KR: 'Asia',
  SG: 'Asia',
  QA: 'Asia',
  IN: 'Asia',
  AE: 'Asia',
  CN: 'Asia',
  BR: 'South America',
  AR: 'South America',
  CL: 'South America',
  CO: 'South America',
  ZA: 'Africa',
  NG: 'Africa',
  KE: 'Africa',
  EG: 'Africa',
  GH: 'Africa',
  AU: 'Oceania',
  NZ: 'Oceania',
};

// Auto-detect user's country code based on TimeZone & locale
export function detectUserCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles') || tz.includes('Denver') || tz.includes('America/')) {
      return 'US';
    }
    if (tz.includes('London') || tz.includes('Europe/Belfast')) return 'GB';
    if (tz.includes('Berlin') || tz.includes('Europe/Busingen')) return 'DE';
    if (tz.includes('Paris')) return 'FR';
    if (tz.includes('Madrid')) return 'ES';
    if (tz.includes('Rome')) return 'IT';
    if (tz.includes('Tokyo')) return 'JP';
    if (tz.includes('Seoul')) return 'KR';
    if (tz.includes('Singapore')) return 'SG';
    if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Brisbane')) return 'AU';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'CA';
    if (tz.includes('Johannesburg')) return 'ZA';
    if (tz.includes('Lagos')) return 'NG';
    if (tz.includes('Sao_Paulo')) return 'BR';
    if (tz.includes('Amsterdam')) return 'NL';

    const lang = (navigator.language || '').toUpperCase();
    if (lang.includes('-')) {
      const code = lang.split('-')[1];
      if (COUNTRIES.some((c) => c.code === code)) return code;
    }
  } catch {
    // fallback
  }
  return 'US';
}

// Fallback high-reliability curated channels across all continents
const CURATED_DEFAULT_CHANNELS: Channel[] = [
  {
    id: 'dw-english',
    name: 'DW English HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/320px-Deutsche_Welle_symbol_2012.svg.png',
    category: 'News',
    country: 'DE',
    countryName: 'Germany',
    continent: 'Europe',
    language: 'English',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    nowPlaying: 'DW News Live & Global Perspective',
    isFeatured: true,
  },
  {
    id: 'france24-en',
    name: 'France 24 English HD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/65/France_24_logo.svg/320px-France_24_logo.svg.png',
    category: 'News',
    country: 'FR',
    countryName: 'France',
    continent: 'Europe',
    language: 'English',
    url: 'https://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_2000.m3u8',
    nowPlaying: 'The World This Hour',
    isFeatured: true,
  },
  {
    id: 'nasa-tv',
    name: 'NASA TV Live HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png',
    category: 'Documentary',
    country: 'US',
    countryName: 'United States',
    continent: 'North America',
    language: 'English',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    nowPlaying: 'ISS Live Views & Space Missions',
    isFeatured: true,
  },
  {
    id: 'euronews-en',
    name: 'Euronews HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Euronews_2016_logo.svg/320px-Euronews_2016_logo.svg.png',
    category: 'News',
    country: 'FR',
    countryName: 'France',
    continent: 'Europe',
    language: 'English',
    url: 'https://euronews-euronews-world-1-au.samsung.wurl.tv/playlist.m3u8',
    nowPlaying: 'Europe & Global Headlines',
    isFeatured: true,
  },
  {
    id: 'redbull-tv',
    name: 'Red Bull TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Red_Bull_TV_logo.svg/320px-Red_Bull_TV_logo.svg.png',
    category: 'Sports',
    country: 'AT',
    countryName: 'Austria',
    continent: 'Europe',
    language: 'English',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    nowPlaying: 'Downhill Mountain & Extreme Sports',
    isFeatured: true,
  },
  {
    id: 'bloomberg-orig',
    name: 'Bloomberg Originals',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Bloomberg_logo.svg/320px-Bloomberg_logo.svg.png',
    category: 'Business',
    country: 'US',
    countryName: 'United States',
    continent: 'North America',
    language: 'English',
    url: 'https://bloomberg.com/media-manifest/streams/us.m3u8',
    nowPlaying: 'Global Market Movers & Tech',
    isFeatured: true,
  },
  {
    id: 'cna-singapore',
    name: 'CNA Asia HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/CNA_%28news_channel%29_logo.svg/320px-CNA_%28news_channel%29_logo.svg.png',
    category: 'News',
    country: 'SG',
    countryName: 'Singapore',
    continent: 'Asia',
    language: 'English',
    url: 'https://d2e1asnsl7brco.cloudfront.net/v1/master/613d079550094404962a6e9538a680f40f00f077/cna-live/master.m3u8',
    nowPlaying: 'Asia First & World News',
    isFeatured: false,
  },
  {
    id: 'rtve-canal24h',
    name: 'RTVE 24 Horas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Canal_24_Horas_%282008%29.svg/320px-Canal_24_Horas_%282008%29.svg.png',
    category: 'News',
    country: 'ES',
    countryName: 'Spain',
    continent: 'Europe',
    language: 'Spanish',
    url: 'https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main.m3u8',
    nowPlaying: 'Telediario e Información Internacional',
    isFeatured: false,
  },
  {
    id: 'sabc-news-hd',
    name: 'SABC News HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/SABC_News_logo.svg/320px-SABC_News_logo.svg.png',
    category: 'News',
    country: 'ZA',
    countryName: 'South Africa',
    continent: 'Africa',
    language: 'English',
    url: 'https://edge.tulix.com/sabcnews/sabcnews/playlist.m3u8',
    nowPlaying: 'African Perspective & Prime Live',
    isFeatured: false,
  },
  {
    id: 'channels-tv-ng',
    name: 'Channels Television',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Channels_Television_logo.png/320px-Channels_Television_logo.png',
    category: 'News',
    country: 'NG',
    countryName: 'Nigeria',
    continent: 'Africa',
    language: 'English',
    url: 'https://channelstv.akamaized.net/hls/live/2034032/live/master.m3u8',
    nowPlaying: 'News at 10 & Business Morning',
    isFeatured: false,
  },
  {
    id: 'tv-brasil',
    name: 'TV Brasil HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/TV_Brasil_logo_%282023%29.svg/320px-TV_Brasil_logo_%282023%29.svg.png',
    category: 'Entertainment',
    country: 'BR',
    countryName: 'Brazil',
    continent: 'South America',
    language: 'Portuguese',
    url: 'https://tvbrasil-hls.ebc.com.br/index.m3u8',
    nowPlaying: 'Brasil em Pauta',
    isFeatured: false,
  },
  {
    id: 'abc-news-au',
    name: 'ABC News Australia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/ABC_News_channel_logo_2021.svg/320px-ABC_News_channel_logo_2021.svg.png',
    category: 'News',
    country: 'AU',
    countryName: 'Australia',
    continent: 'Oceania',
    language: 'English',
    url: 'https://abclivestream.akamaized.net/hls/live/2040523/news/master.m3u8',
    nowPlaying: 'ABC News Live & Pacific Beat',
    isFeatured: true,
  },
  {
    id: 'cinema-4k-master',
    name: 'Cinema 4K Showcase',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/320px-Big_buck_bunny_poster_big.jpg',
    category: 'Movies',
    country: 'NL',
    countryName: 'Netherlands',
    continent: 'Europe',
    language: 'English',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    nowPlaying: '4K Ultra HD Master Cinema',
    isFeatured: true,
  },
  {
    id: 'sintel-cinema',
    name: 'Animation Showcase',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sintel_Poster.jpg/320px-Sintel_Poster.jpg',
    category: 'Kids',
    country: 'NL',
    countryName: 'Netherlands',
    continent: 'Europe',
    language: 'English',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    nowPlaying: 'Animated Fantasy Legends',
    isFeatured: true,
  },
  {
    id: 'bipbop-stage',
    name: 'Concert Hall Acoustic',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=320&auto=format&fit=crop&q=80',
    category: 'Music',
    country: 'GB',
    countryName: 'United Kingdom',
    continent: 'Europe',
    language: 'English',
    url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
    nowPlaying: 'Philharmonic Live Symphony',
    isFeatured: false,
  },
  {
    id: 'aljazeera-english',
    name: 'Al Jazeera English',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English_logo.svg/320px-Al_Jazeera_English_logo.svg.png',
    category: 'News',
    country: 'QA',
    countryName: 'Qatar',
    continent: 'Asia',
    language: 'English',
    url: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
    nowPlaying: 'Live World News & Feature Stories',
    isFeatured: false,
  },
  {
    id: 'nhk-world-japan',
    name: 'NHK World Japan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/NHK_World-Japan_logo.svg/320px-NHK_World-Japan_logo.svg.png',
    category: 'News',
    country: 'JP',
    countryName: 'Japan',
    continent: 'Asia',
    language: 'English',
    url: 'https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/2003458/live.m3u8',
    nowPlaying: 'NHK Newsline & Japanese Culture',
    isFeatured: true,
  },
  {
    id: 'kbs-world-kr',
    name: 'KBS World Live',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/KBS_World_logo.svg/320px-KBS_World_logo.svg.png',
    category: 'Entertainment',
    country: 'KR',
    countryName: 'South Korea',
    continent: 'Asia',
    language: 'Korean',
    url: 'https://kbs-world-live.akamaized.net/live/master.m3u8',
    nowPlaying: 'Music Bank & Seoul Primetime',
    isFeatured: false,
  },
];

let cachedChannels: Channel[] | null = null;

export async function fetchChannels(): Promise<Channel[]> {
  if (cachedChannels && cachedChannels.length > 0) {
    return cachedChannels;
  }

  const customChannels = getCustomChannels();
  let overrideChannels: Channel[] = [];

  // 1. Load local channels.json override file
  try {
    const res = await fetch('/channels.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        overrideChannels = data;
      }
    }
  } catch {
    // ignore
  }

  // 2. Fetch iptv-org channels & streams API with 3.5s timeout
  let iptvOrgChannels: Channel[] = [];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const [channelsRes, streamsRes] = await Promise.all([
      fetch('https://iptv-org.github.io/api/channels.json', { signal: controller.signal }),
      fetch('https://iptv-org.github.io/api/streams.json', { signal: controller.signal }),
    ]);
    clearTimeout(timer);

    if (channelsRes.ok && streamsRes.ok) {
      const channelsData = await channelsRes.json();
      const streamsData = await streamsRes.json();

      // Index streams by channel ID
      const streamMap = new Map<string, string>();
      for (const s of streamsData) {
        if (s.channel && s.url && s.url.includes('.m3u8')) {
          if (!streamMap.has(s.channel)) {
            streamMap.set(s.channel, s.url);
          }
        }
      }

      // Map up to 40 popular international channels
      for (const c of channelsData) {
        const streamUrl = streamMap.get(c.id);
        if (streamUrl && c.name && !c.is_nsfw) {
          const countryCode = (c.country || 'US').toUpperCase();
          const continent = CONTINENT_MAP[countryCode] || 'Europe';
          const category = mapCategory(c.categories?.[0] || 'General');

          iptvOrgChannels.push({
            id: `iptv-${c.id}`,
            name: c.name,
            logo: c.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0284c7&color=fff`,
            category,
            country: countryCode,
            countryName: c.country_name || countryCode,
            continent,
            language: c.languages?.[0] || 'English',
            url: streamUrl,
            nowPlaying: `${c.name} Live Broadcast`,
            isFeatured: false,
          });
          if (iptvOrgChannels.length >= 60) break;
        }
      }
    }
  } catch {
    // iptv-org network timeout or blocked - seamlessly continue with curated catalog
  }

  // Merge: custom channels first, then override channels, then iptvOrg, then curated default
  const channelMap = new Map<string, Channel>();

  for (const c of customChannels) {
    channelMap.set(c.id, { ...c, isCustom: true });
  }
  for (const c of overrideChannels) {
    if (!channelMap.has(c.id)) channelMap.set(c.id, c);
  }
  for (const c of iptvOrgChannels) {
    if (!channelMap.has(c.id)) channelMap.set(c.id, c);
  }
  for (const c of CURATED_DEFAULT_CHANNELS) {
    if (!channelMap.has(c.id)) channelMap.set(c.id, c);
  }

  const result = Array.from(channelMap.values());
  cachedChannels = result;
  return result;
}

function mapCategory(cat: string): string {
  const lower = cat.toLowerCase();
  if (lower.includes('news')) return 'News';
  if (lower.includes('sport')) return 'Sports';
  if (lower.includes('movie') || lower.includes('film') || lower.includes('series')) return 'Movies';
  if (lower.includes('kid') || lower.includes('children') || lower.includes('anim')) return 'Kids';
  if (lower.includes('music')) return 'Music';
  if (lower.includes('doc')) return 'Documentary';
  if (lower.includes('biz') || lower.includes('business') || lower.includes('finance')) return 'Business';
  if (lower.includes('relig')) return 'Religious';
  return 'Entertainment';
}

// Generate realistic EPG Schedule for any channel based on the current time
export function getEPGSchedule(channel: Channel): EPGProgram[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const programs: EPGProgram[] = [];

  const programThemes: Record<string, string[]> = {
    News: [
      'Global Headlines Hour',
      'Morning World Briefing',
      'Investigative Reports',
      'The World This Hour',
      'Prime Interview & Debate',
      'International Economy Live',
      'Nightly News Roundup',
    ],
    Sports: [
      'Extreme Sports World Tour',
      'Championship Highlights',
      'Motorsport Live Speed Report',
      'Athletics & Action Magazine',
      'Pro League Match Review',
      'Adventure & Mountain Quest',
    ],
    Movies: [
      'Classic Cinema Matinee',
      'Hollywood Golden Era',
      'Sci-Fi Cinema Spotlight',
      'Primetime Blockbuster',
      'Indie Directors Showcase',
      'Midnight Thriller Cinema',
    ],
    Kids: [
      'Morning Cartoon Adventures',
      'The Magical Kingdom',
      'Animated Legends Hour',
      'Junior Explorers Club',
      'Bedtime Fairy Tales',
    ],
    Music: [
      'Symphony & Acoustic Sessions',
      'Live Concert Hall Series',
      'Acoustic Sunset Unplugged',
      'Global Soundstage Live',
      'Late Night Chill Ambient',
    ],
    Documentary: [
      'Deep Oceans Uncovered',
      'Space Odyssey: Beyond Mars',
      'Earth Wildlife Chronicles',
      'Civilizations of the Past',
      'Future Technology & Cosmos',
    ],
    Business: [
      'Markets Open: Wall Street',
      'Global Forex & Commodities',
      'Tech Founders in Focus',
      'Closing Bell Analysis',
      'Venture Capital & The Future',
    ],
  };

  const pool = programThemes[channel.category] || [
    'Prime Entertainment Live',
    'Special Feature Broadcast',
    'Evening Variety Showcase',
    'Cultural Arts Hour',
  ];

  // Create 5 consecutive time slots: 1 past, 1 current, 3 future
  for (let i = -1; i <= 3; i++) {
    const slotHour = (currentHour + i + 24) % 24;
    const startStr = `${String(slotHour).padStart(2, '0')}:00`;
    const endStr = `${String((slotHour + 1) % 24).padStart(2, '0')}:00`;
    const programIndex = Math.abs(channel.name.length + slotHour) % pool.length;
    const title = pool[programIndex];

    programs.push({
      id: `${channel.id}-${slotHour}`,
      channelId: channel.id,
      title,
      description: `Live high-definition presentation of ${title} on ${channel.name}. Broadcast in stereo and 1080p stream master.`,
      startTime: startStr,
      endTime: endStr,
      durationMinutes: 60,
      category: channel.category,
      rating: 'HD',
    });
  }

  return programs;
}
