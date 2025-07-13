// Auth utilities placeholder
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hashPassword(password: string): string {
  // TODO: Implement proper password hashing
  return password;
}
