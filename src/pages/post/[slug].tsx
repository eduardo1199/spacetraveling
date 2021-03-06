import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import ptBR from 'date-fns/locale/pt-BR';
import {
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { RichText } from 'prismic-dom';
import { Header } from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const READING_AVARAGE_POST = 200;

  const postReadingTime = post.data.content.reduce(
    (acc, content) => {
      acc.value += content.heading.split(' ').join().length;
      acc.value += RichText.asText(content.body).split(' ').join().length;

      return acc;
    },
    {
      value: 0,
    }
  );

  return (
    <>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      <main className={styles.container}>
        <h1>{post.data.title}</h1>
        <div className={styles.postsInfo}>
          <div>
            <AiOutlineCalendar size={20} />
            <span>{post.first_publication_date}</span>
          </div>
          <div>
            <AiOutlineUser size={20} />
            <span>{post.data.author}</span>
          </div>
          <div>
            <AiOutlineClockCircle size={20} />
            <span>
              {Math.ceil(postReadingTime.value / READING_AVARAGE_POST)} min
            </span>
          </div>
          {/* <div
            dangerouslySetInnerHTML={{
              __html: post.data.content,
            }}
          /> */}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});

  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug));

  const post: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      author: response.data.author,
      banner: response.data.banner,
      content: response.data.content,
      title: response.data.title,
    },
  };

  return {
    props: {
      post,
    },
  };
};
