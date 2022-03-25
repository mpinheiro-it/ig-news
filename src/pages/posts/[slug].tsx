import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
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


export default function Post({ post }: PostProps) {

    console.log(post)

    return(
        <>
        <Head>
            <title>IgNews</title>
        </Head>


        </>
    )
}

//nao pode ser uma pagina estatica porque nao seria protegida
//como o user precisa estar autenticado, usarei GetServerSideProps

export async function GetServerSideProps({ req, params }){

    //gets cookies from the req to check if user is loggedIn
    const session = await getSession( { req } );
    
    const { slug } = params;
    
    // if(!session) {

    // }

    const prismic = createClient();

    const response = await prismic.getByUID('Posts', 'aprendendo-reactjs-em-2022');
    

    const post = {
        slug,
        title: response.data.title,
        content: response.data.content,
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