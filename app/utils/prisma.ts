export function connectOptionalName(value: string | null, update = false) {
  return value !== null && value !== ''
    ? { connect: { name: value } }
    : update
    ? { disconnect: true }
    : undefined;
}
