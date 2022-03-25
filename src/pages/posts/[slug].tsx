import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { RichText }  from 'prismic-dom';
import Head from "next/head";
import { createClient } from '../../../prismicio';

interface PostProps{
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

import styles from './post.module.scss'

export default function Post({post} : PostProps) {

    console.log(post)

    return(
        <>
        <Head>
            <title>{post.title} | IgNews</title>
        </Head>

        <main className={styles.container}>
            <article className={styles.post}>
                <h1>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div 
                    className={styles.postContent}
                    dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
        </main>        
        </>
    )
}

//nao pode ser uma pagina estatica porque nao seria protegida
//como o user precisa estar autenticado, usarei GetServerSideProps

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {

    //gets cookies from the req to check if user is loggedIn
    const session = await getSession( { req } );
    
    const { slug } = params;
    
    // if(!session) {

    // }

    const prismic = createClient(req);

    const response = await prismic.getByUID('Posts', 'aprendendo-reactjs-em-2022');
   
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-br', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) 
    };

    return {
        props: {post}
    }
       

}