import './globals.css';

export const metadata = {
  title: 'AstroVille — O destino da humanidade',
  description: 'Escolha os signos que vão guiar a evolução da Terra.',
};

export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
