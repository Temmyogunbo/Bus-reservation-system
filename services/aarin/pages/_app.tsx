import '../styles/globals.css'
import { ThemeProvider } from 'emotion-theming'
import theme from '../styles/theme';
import { Header } from '../components/Header';

function MyApp({ Component, pageProps }) {
  return <ThemeProvider theme={theme}>
          <Header />

    <Component {...pageProps} />
    </ThemeProvider>
}

export default MyApp
