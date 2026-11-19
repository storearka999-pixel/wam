export const MAX_SEO_KEYWORDS_LENGTH = 8000;

const siteSeoDefaults: Record<string, { focus: string; brand: string }> = {
  'kreditmotorhonda.tech': {
    focus: 'dealer Honda Bandung',
    brand: 'Wijaya Abadi',
  },
  'kreditmotorhonda.id': {
    focus: 'kredit motor Honda Bandung',
    brand: 'Wijaya Abadi ID',
  },
  'wijaya.kreditmotorhonda.tech': {
    focus: 'Honda Wijaya Abadi Bandung',
    brand: 'Wijaya Kredit Motor',
  },
  'solusikreditmotor.cloud': {
    focus: 'solusi kredit motor Honda Bandung',
    brand: 'Solusi Kredit Motor',
  },
};

const generalDealerKeywords = [
  'dealer motor Honda Bandung',
  'dealer resmi Honda Bandung',
  'showroom motor Honda Bandung',
  'dealer Honda terdekat Bandung',
  'harga motor Honda Bandung',
  'kredit motor Honda Bandung',
  'simulasi kredit motor Honda Bandung',
  'cicilan motor Honda Bandung',
  'DP motor Honda Bandung',
  'promo motor Honda Bandung',
  'dealer motor Honda Jawa Barat',
  'dealer resmi Honda Jawa Barat',
  'kredit motor Honda Jawa Barat',
  'promo motor Honda Jawa Barat',
  'harga motor Honda Jawa Barat',
  'dealer motor Honda Cimahi',
  'dealer motor Honda Sumedang',
  'dealer motor Honda Garut',
  'dealer motor Honda Tasikmalaya',
  'dealer motor Honda Cianjur',
];

const hondaModels = [
  { name: 'Beat', location: 'Bandung' },
  { name: 'Scoopy', location: 'Bandung' },
  { name: 'Vario 125', location: 'Bandung' },
  { name: 'Vario 160', location: 'Bandung' },
  { name: 'PCX', location: 'Bandung' },
  { name: 'ADV 160', location: 'Bandung' },
  { name: 'Genio', location: 'Cimahi' },
  { name: 'Stylo 160', location: 'Sumedang' },
  { name: 'CBR150R', location: 'Garut' },
  { name: 'CB150R', location: 'Tasikmalaya' },
  { name: 'Supra X 125', location: 'Cianjur' },
  { name: 'Revo', location: 'Sukabumi' },
  { name: 'CRF150L', location: 'Purwakarta' },
  { name: 'EM1 e', location: 'Cirebon' },
];

const modelSearchIntents = [
  (model: string, location: string) => `harga motor Honda ${model} ${location}`,
  (model: string, location: string) => `kredit Honda ${model} ${location}`,
  (model: string, location: string) => `cicilan Honda ${model} ${location}`,
  (model: string, location: string) => `promo Honda ${model} ${location}`,
  (model: string, location: string) => `DP Honda ${model} ${location}`,
];

function normalizeBrandName(value: string): string {
  return value
    .replace(/,/g, ' ')
    .replace(/\b(Honda|dealer|sales counter|pos)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100) || 'Wijaya Abadi';
}

function getBrandKeywords(brand: string, siteType: 'dealer' | 'sales-counter' | 'pos'): string[] {
  if (siteType === 'pos') {
    return [
      `POS ${brand} Honda Bandung`,
      `POS motor Honda ${brand} Bandung`,
      `POS kredit Honda ${brand} Bandung`,
      `POS promo Honda ${brand} Bandung`,
      `POS cicilan Honda ${brand} Bandung`,
      `${brand} POS Honda Bandung`,
      `harga motor Honda ${brand} POS Bandung`,
      `DP motor Honda ${brand} POS Bandung`,
      `simulasi kredit Honda ${brand} POS Bandung`,
      `kontak POS ${brand} Honda Bandung`,
    ];
  }
  if (siteType === 'sales-counter') {
    return [
      `${brand} Sales Counter Honda Bandung`,
      `Sales Counter Honda ${brand} Bandung`,
      `sales motor Honda ${brand} Bandung`,
      `kredit motor Honda ${brand} Bandung`,
      `promo motor Honda ${brand} Bandung`,
      `cicilan motor Honda ${brand} Bandung`,
      `DP motor Honda ${brand} Bandung`,
      `simulasi kredit Honda ${brand} Bandung`,
      `harga motor Honda ${brand} Bandung`,
      `kontak Sales Counter ${brand} Honda Bandung`,
    ];
  }
  return [
    `${brand} Bandung`,
    `dealer Honda ${brand} Bandung`,
    `showroom Honda ${brand} Bandung`,
    `harga motor Honda ${brand} Bandung`,
    `promo motor Honda ${brand} Bandung`,
    `kredit motor Honda ${brand} Bandung`,
    `cicilan motor Honda ${brand} Bandung`,
    `DP motor Honda ${brand} Bandung`,
    `simulasi kredit Honda ${brand} Bandung`,
    `kontak ${brand} Honda Bandung`,
  ];
}

export function generateDealerSeoKeywords(
  siteName: string,
  siteType: 'dealer' | 'sales-counter' | 'pos' = 'dealer',
): string {
  const brand = normalizeBrandName(siteName);
  const keywords = [
    ...generalDealerKeywords,
    ...hondaModels.flatMap(({ name, location }) => modelSearchIntents.map((intent) => intent(name, location))),
    ...getBrandKeywords(brand, siteType),
  ];
  return combineSeoKeywords(keywords.join(', '));
}

export function getSiteSeoFocusKeyword(hostname: string, configured: string | undefined, fallback: string): string {
  const normalizedHost = normalizedHostname(hostname);
  const value = configured?.trim();
  return !value || value === fallback.trim() ? siteSeoDefaults[normalizedHost]?.focus || value || fallback : value;
}

export function getSiteSeoKeywords(
  hostname: string,
  configured: string | undefined,
  fallback: string,
  siteName?: string,
  siteType: 'dealer' | 'sales-counter' | 'pos' = 'dealer',
): string {
  const normalizedHost = normalizedHostname(hostname);
  const configuredKeywords = configured?.trim();
  const defaultKeywords = generateDealerSeoKeywords(
    siteName || siteSeoDefaults[normalizedHost]?.brand || 'Wijaya Abadi',
    siteType,
  );
  const customKeywords = configuredKeywords && configuredKeywords !== fallback.trim() ? configuredKeywords : '';
  return combineSeoKeywords(defaultKeywords, customKeywords) || configuredKeywords || fallback;
}

export function combineSeoKeywords(...groups: Array<string | null | undefined>): string {
  const keywords = new Map<string, string>();
  for (const group of groups) {
    for (const keyword of (group || '').split(',')) {
      const normalized = keyword.trim();
      const key = normalized.toLocaleLowerCase('id-ID');
      if (normalized && !keywords.has(key)) keywords.set(key, normalized);
    }
  }
  return [...keywords.values()].join(', ');
}

function normalizedHostname(hostname: string): string {
  return hostname.toLocaleLowerCase('en-US').replace(/:\d+$/, '').replace(/^www\./, '');
}
