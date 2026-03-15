export function normalizeArgPhone(phone: string): string {
  if (phone.startsWith('54') && !phone.startsWith('549')) {
    return '549' + phone.slice(2);
  }
  return phone;
}