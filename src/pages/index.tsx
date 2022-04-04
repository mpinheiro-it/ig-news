import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/subscribeButton'
import { stripe } from '../services/stripe'

import styles from "./home.module.scss"

interface HomeProps{
  product:{
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
        <>
          <Head>
            <title>ig.news</title>
          </Head>

          <main className={styles.contentContainer}>
            <section className={styles.hero}>
                <span>👏 Hey, welcome</span>
                <h1>News about the <span>React</span> world.</h1>
                <p>
                  Get access to all the publications <br />
                  <span>for {product.amount} month</span>
                </p>   
                <SubscribeButton priceId={product.priceId} />        
            </section>

            <img src="/images/avatar.svg" alt="Girl Coding" />          
          </main>       
        </>    
  )
}

/* Some comments on the block of code below:
  
  This code is executed in the Next JS server, not in the browser

  getServerSideProps could also be used. But the fetching data from the 
  API would take place every time someone access the page. That could greatly
  impact peformance.

  getStaticProps uses Static Server Rendering (SSG), which salves a static
  page on the next js server, thus avoiding this issue. This is a good solution
  but can only be used for serving static pages that do not have customized info
  that needs fetching data.

  The revalidate prop defines how many time it would take for the static
  page to be regenerated
*/

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KZlKgAgBRHwch2aMIRN7jIW', {
    expand: ['product']
  })
  
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price.unit_amount / 100), //divide by 100 because it is stored in cents
  };

  return {
      props: {
        product
      },
      revalidate: 60 * 60 * 24, // 24 hours
  }
}