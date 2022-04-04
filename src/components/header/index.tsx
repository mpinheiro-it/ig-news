import { SignInButton } from "../signInButton";
import Link  from "next/link";
import Image from 'next/image';
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

export function Header() {

    const { asPath } = useRouter()

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src="/images/logo.svg" width="110" height="31" alt="ig.news" />

                <nav>
                    <Link href="/">
                        <a className={asPath == "/" ? styles.active : ""}> Home</a>
                    </Link>

                    <Link href="/posts">
                        <a className={asPath == "/posts" ? styles.active : ""}> Posts</a>
                    </Link>
                    
                </nav>
                <SignInButton />
            </div>       
        </header>

    );
}