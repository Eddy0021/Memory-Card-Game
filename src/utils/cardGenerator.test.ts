import { generateShuffledCards } from './cardGenerator';

describe('generateShuffledCards', () => {
  test('returns an array of correct length', () => {
    const pairCount = 6;
    const result = generateShuffledCards(pairCount);
    expect(result).toHaveLength(pairCount * 2);
  });

  test('each card has required properties', () => {
    const pairCount = 4;
    const result = generateShuffledCards(pairCount);

    result.forEach(card => {
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('value');
      expect(card).toHaveProperty('isFlipped', false);
      expect(card).toHaveProperty('isMatched', false);
    });
  });

  test('cards are randomly shuffled', () => {
    const pairCount = 5;
    const run1 = generateShuffledCards(pairCount);
    const run2 = generateShuffledCards(pairCount);

    const values1 = run1.map(c => c.value);
    const values2 = run2.map(c => c.value);

    expect(values1).not.toEqual(values2);
  });

  test('each icon appears exactly twice', () => {
    const pairCount = 8;
    const result = generateShuffledCards(pairCount);

    const counts: Record<string, number> = {};
    result.forEach(card => {
      counts[card.value] = (counts[card.value] || 0) + 1;
    });

    Object.values(counts).forEach(count => {
      expect(count).toBe(2);
    });
  });

  test('throws or handles invalid pairCount (optional)', () => {
    const result = generateShuffledCards(0);
    expect(result).toEqual([]);
  });
});