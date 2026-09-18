export function generateAnswerOptions(correctAnswer: number, type: string): number[] {
  const range = type === 'identification' ? (correctAnswer > 50 ? 10 : 5) : 3;

  const candidates: number[] = [];
  for (let n = Math.max(0, correctAnswer - range); n <= correctAnswer + range; n++) {
    if (n !== correctAnswer) {
      candidates.push(n);
    }
  }

  // Small answers (e.g. 0 or 1) can leave fewer than 3 distractors; extend upward.
  let next = correctAnswer + range + 1;
  while (candidates.length < 3) {
    candidates.push(next);
    next++;
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return [correctAnswer, ...candidates.slice(0, 3)].sort((a, b) => a - b);
}
