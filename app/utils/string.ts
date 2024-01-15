export function initCap(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function breakWords(str: string) {
  return str.split(/(?=[A-Z])/).join(' ');
}

export function ellipsize(str: string, maxLength: number) {
  const max = Math.max(5, maxLength);
  return str.length > max ? str.slice(0, max - 3).trimEnd() + '...' : str;
}
