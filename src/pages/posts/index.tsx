import Head from 'next/head';
import styles from './styles.module.scss';
import { createClient } from '../../../prismicio';
import Link from 'next/link';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
};


interface PostProps {
    posts: Post[]
}

export default function Posts({ posts }: PostProps){

return(

    <>
    <Head>
        <title>Posts | DevNews</title>
    </Head>

    <main className={styles.container}>
        <div className={styles.posts}>

        {posts.map(post => (

            <Link key={post.slug} href={`/posts/${post.slug}`}>

                <a key={post.slug} href='#'>
                    <time>{post.updatedAt}</time>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                </a>
            
            </Link>
            
        ))}
        

        </div>
    </main>    
    
    </>
    )
}

export async function getStaticProps() {
    const client = createClient()
  
    const response = await client.getAllByType('Posts')

    //console.log(JSON.stringify(response, null, 2))

    const posts = response.map(post => {
        return {
            slug: post.uid,
            title: post.data.title[0].text,
            excerpt: post.data.content.find(content => content.type == 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            }) 
        }
    })


    return {
      props: { posts },
    }
  }