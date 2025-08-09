import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'tesla-red',
  colors: {
    'tesla-red': [
      '#ffe5e7',
      '#fdb8bb',
      '#f78a8f',
      '#f15c63',
      '#eb2e37',
      '#E82127', // Tesla signature red (main shade)
      '#d01d23',
      '#b8191f',
      '#a0151b',
      '#881117'
    ]
  },
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: 'md',
});