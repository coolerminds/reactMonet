import { Platform } from 'react-native';

export const palette = {
  canvas: '#fcf9f4',
  card: '#fffdf9',
  ink: '#1c1c19',
  muted: '#4f5649',
  lime: '#b5f09c',
  blush: '#ffd9dd',
  butter: '#f3e18a',
  cobalt: '#376a26',
  orange: '#ffb878',
  mint: '#f6f3ee',
  sky: '#ebe8e3',
  border: '#1c1c19',
  wash: '#f0ede9',
  berry: '#894d55',
  dot: '#c7c1b5',
  shadow: '#1c1c19',
  white: '#ffffff',
};

export const fonts = Platform.select({
  ios: {
    display: 'ui-rounded',
    body: 'system-ui',
    mono: 'ui-monospace',
  },
  web: {
    display: '"Bricolage Grotesque", "Trebuchet MS", "Avenir Next", sans-serif',
    body: '"Be Vietnam Pro", "Avenir Next", system-ui, sans-serif',
    mono: '"Courier Prime", "Courier New", ui-monospace, monospace',
  },
  default: {
    display: 'sans-serif-medium',
    body: 'sans-serif',
    mono: 'monospace',
  },
});

export const layout = {
  screenPadding: 20,
  cardRadius: 24,
  pillRadius: 999,
  outlineWidth: 2,
  tabBarInset: Platform.select({ ios: 48, default: 40 }) ?? 40,
};

export const cardShadow = '4px 4px 0px 0px rgba(28, 28, 25, 1)';
