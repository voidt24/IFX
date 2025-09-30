export function isReleased(date: string | null) {
  return new Date(Number(date)).getTime() < Date.now();
}
