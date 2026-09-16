export function topDentists<T extends { rating: number }>(dentists: T[], limit = 3): T[] {
  return [...dentists].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
