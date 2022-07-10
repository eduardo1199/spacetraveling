import { GetStaticProps } from 'next';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import { Header } from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.posts}>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.postsInfo}>
            <div>
              <AiOutlineCalendar size={20} />
              <span>19 Abr 2021</span>
            </div>
            <div>
              <AiOutlineUser size={20} />
              <span>Danilo Vieira</span>
            </div>
          </div>
        </div>
        <div className={styles.posts}>
          <h1>Criando um app CRA do zero</h1>
          <p>
            Tudo sobre como criar a sua primeira aplicação utilizando Create
            React App.
          </p>
          <div className={styles.postsInfo}>
            <div>
              <AiOutlineCalendar size={20} />
              <span>19 Abr 2021</span>
            </div>
            <div>
              <AiOutlineUser size={20} />
              <span>Danilo Vieira</span>
            </div>
          </div>
        </div>
        <button type="button" className={styles.button}>
          Carregar mais posts
        </button>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismic = getPrismicClient(previewData);
  // const postsResponse = await prismic.getByType('');

  return {
    props: {},
  };
};
