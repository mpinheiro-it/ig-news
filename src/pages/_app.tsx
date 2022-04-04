import Link from 'next/link';
import { AppProps} from 'next/app';
import { Header } from '../components/header';

import {SessionProvider as NextAuthProvider} from 'next-auth/react';
import { PrismicProvider } from '@prismicio/react';
import { PrismicPreview } from '@prismicio/next';
import {linkResolver, repositoryName} from '../../prismicio';

import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>
            {children}
          </a>
        </Link>
      )}
    >
      
      <PrismicPreview repositoryName={repositoryName}>

        <NextAuthProvider session={pageProps.session}>
          <Header />
          <Component {...pageProps} />    
        </NextAuthProvider>
      
        
      </PrismicPreview>
    </PrismicProvider>


   
    
  )
}

export default MyApp
