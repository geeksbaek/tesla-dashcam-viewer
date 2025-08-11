import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import './index.css'
import './i18n'
import App from './App.tsx'

const theme = createTheme({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "SF Pro KR", "SF Pro Display", "SF Pro Text", "Malgun Gothic", "맑은 고딕", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontFamilyMonospace: '"SF Mono", Monaco, "Cascadia Mono", "Roboto Mono", monospace',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "SF Pro KR", "SF Pro Display", "Malgun Gothic", "맑은 고딕", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  components: {
    Text: {
      defaultProps: {
        className: 'font-apple',
      },
    },
    Title: {
      defaultProps: {
        className: 'font-apple',
      },
    },
    Button: {
      defaultProps: {
        className: 'font-apple',
      },
    },
  },
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  primaryColor: 'blue',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
)
