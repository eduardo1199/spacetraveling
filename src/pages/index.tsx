/* eslint-disable react/destructuring-assignment */
import { GetStaticProps } from 'next';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { parse } from 'path';
import { PrismicDocument } from '@prismicio/types';
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

export default function Home(postsPagination: HomeProps): JSX.Element {
  const [dataPagination, setDataPagination] = useState(
    postsPagination.postsPagination.results
  );
  const [nextPage, setNextPage] = useState(
    postsPagination.postsPagination.next_page
  );

  async function onNextPagePost(): Promise<void> {
    try {
      const getNextPagePosts = await fetch(nextPage);
      const getNextPagePostsJson = await getNextPagePosts.json();

      const post: Post = {
        data: {
          author: getNextPagePostsJson.results[0].data.author,
          subtitle: getNextPagePostsJson.results[0].data.subtitle,
          title: getNextPagePostsJson.results[0].data.title,
        },
        first_publication_date: format(
          new Date(getNextPagePostsJson.results[0].first_publication_date),
          'd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        uid: getNextPagePostsJson.results[0].uid,
      };

      const posts: Post[] = [];
      posts.push(post);

      setDataPagination(prev => [...prev, ...posts]);
      setNextPage(getNextPagePostsJson.next_page);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        {dataPagination.map(post => {
          return (
            <a href="/" className={styles.posts} key={post.uid}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div className={styles.postsInfo}>
                <div>
                  <AiOutlineCalendar size={20} />
                  <span>{post.first_publication_date}</span>
                </div>
                <div>
                  <AiOutlineUser size={20} />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </a>
          );
        })}
        {nextPage && (
          <button
            type="button"
            className={styles.button}
            onClick={() => onNextPagePost()}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismic = getPrismicClient(previewData);

  try {
    const postsResponse = await prismic.getByType('posts', {
      pageSize: 1,
    });

    const post: Post = {
      data: {
        author: postsResponse.results[0].data.author,
        subtitle: postsResponse.results[0].data.subtitle,
        title: postsResponse.results[0].data.title,
      },
      first_publication_date: format(
        new Date(postsResponse.results[0].first_publication_date),
        'd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      uid: postsResponse.results[0].uid,
    };

    const posts: Post[] = [];
    posts.push(post);

    const paginationPosts: PostPagination = {
      next_page: postsResponse.next_page,
      results: posts,
    };

    return {
      props: {
        postsPagination: paginationPosts,
      },
    };
  } catch (err) {
    return {
      props: {},
    };
  }
};
