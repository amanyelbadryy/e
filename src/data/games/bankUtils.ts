export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getRandomItems<T>(items: T[], count: number = 10): T[] {
  const shuffled = shuffleArray(items);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
