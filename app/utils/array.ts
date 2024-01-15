export function merge<T>(
  a: T[],
  b: T[],
  options = { removeDuplicates: false },
) {
  const merged = [...a, ...b];
  return options.removeDuplicates ? [...new Set(merged)] : merged;
}
