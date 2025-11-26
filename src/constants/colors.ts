export const COLORS = {
  primary: '#006EFF',
  primaryHover: '#0056CC',
  primaryLight: '#BFDAFF',
  primaryLighter: '#E3EEFF',
  textPrimary: '#242424',
  textSecondary: '#797979',
  textDisabled: '#A7A7A7',
  bgDefault: '#F3F3F3',
  bgInactive: '#F5F5F5',
  bgHover: '#E2E2E2',
  border: '#E5E5E5',
  borderDark: '#242424',
} as const;

export type ColorKey = keyof typeof COLORS;
