const siteSeoDefaults: Record<string, { focus: string; keywords: string }> = {
  'kreditmotorhonda.tech': {
    focus: 'dealer Honda Bandung',
    keywords: 'dealer Honda Bandung, kredit motor Honda Bandung, harga motor Honda Bandung, promo motor Honda Bandung, simulasi kredit Honda, DP motor Honda, cicilan motor Honda',
  },
  'kreditmotorhonda.id': {
    focus: 'kredit motor Honda Bandung',
    keywords: 'kredit motor Honda Bandung, harga motor Honda OTR Bandung, cicilan motor Honda Bandung, simulasi kredit motor Honda, DP motor Honda, dealer resmi Honda Bandung',
  },
  'wijaya.kreditmotorhonda.tech': {
    focus: 'Honda Wijaya Abadi Bandung',
    keywords: 'Honda Wijaya Abadi Bandung, dealer Honda Wijaya Abadi, harga motor Honda Bandung, kredit motor Honda Bandung, promo Honda Bandung',
  },
  'solusikreditmotor.cloud': {
    focus: 'solusi kredit motor Honda Bandung',
    keywords: 'solusi kredit motor Honda Bandung, kredit motor Honda Bandung, simulasi cicilan motor Honda, DP motor Honda, tenor kredit motor Honda, promo motor Honda Bandung',
  },
};

function normalizedHostname(hostname: string): string {
  return hostname.toLocaleLowerCase('en-US').replace(/:\d+$/, '').replace(/^www\./, '');
}

export function getSiteSeoFocusKeyword(hostname: string, configured: string | undefined, fallback: string): string {
  const keywords = siteSeoDefaults[normalizedHostname(hostname)];
  const value = configured?.trim();
  return !value || value === fallback.trim() ? keywords?.focus || value || fallback : value;
}

export function getSiteSeoKeywords(hostname: string, configured: string | undefined, fallback: string): string {
  const keywords = siteSeoDefaults[normalizedHostname(hostname)];
  const value = configured?.trim();
  return !value || value === fallback.trim() ? keywords?.keywords || value || fallback : value;
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
