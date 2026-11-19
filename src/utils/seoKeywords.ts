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
