import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './MoreInfo.module.scss';
import { useSelector } from 'react-redux';
import {
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
  useToggleLikeMutation,
} from '../../store/apiSlice';

const MoreInfoPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [clickDelete, setClickDelete] = useState(false);
  const [toggleLike] = useToggleLikeMutation();

  const { data: articleData, isLoading, isError, refetch } = useGetArticleBySlugQuery(slug);
  const [deleteArticle] = useDeleteArticleMutation();
  const currentUser = useSelector((state) => state.registration.user);

  const handleConfirmationDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Ошибка удаления статьи:', error);
    }
  };

  const handleLike = async (slug, isLiked) => {
    try {
      await toggleLike({ slug, isLiked }).unwrap();
      refetch();
    } catch (error) {
      console.error('Ошибка при изменении лайка:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !articleData) {
    return <div>Error loading article</div>;
  }

  const { title, author, createdAt, tagList, description, body, favoritesCount, favorited } =
    articleData.article;
  return (
    <div className={styles.article}>
      <div className={styles.wrap}>
        <div className={styles.headerWrap}>
          <h1 className={styles.articleTitle}>{title}</h1>
          <button
            className={styles.articleFavorite}
            onClick={() => handleLike(articleData.article.slug, favorited)}
          >
            {favorited ? '❤️' : '🤍'} {favoritesCount}
          </button>
        </div>
        <div className={styles.articleAuthor}>
          <div>
            <h4>{author.username}</h4>
            <p>
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <img className={styles.articleUserImg} src={author.image} alt="Author" />
        </div>
      </div>
      <div className={styles.tags}>
        {tagList.map((tag, index) => (
          <button key={index} className={styles.articleTags}>
            {tag}
          </button>
        ))}
      </div>
      <div className={styles.articleChange}>
        <p className={styles.description}>{description}</p>
        {currentUser?.userName === author.username && (
          <div className={styles.actions}>
            <button className={styles.btnDelete} onClick={() => setClickDelete(true)}>
              Delete
            </button>
            <button
              className={styles.btnEdit}
              onClick={() =>
                navigate(`/editArticle/${slug}`, { state: { article: articleData?.article } })
              }
            >
              Edit
            </button>
          </div>
        )}
      </div>
      {clickDelete && (
        <div className={styles.confirmation}>
          <h4 className={styles.confirmationTitle}>Delete the article</h4>
          <p className={styles.confirmationText}>Are you sure to delete this article?</p>
          <div className={styles.confirmationButtons}>
            <button onClick={() => setClickDelete(false)} className={styles.btnNo}>
              No
            </button>
            <button onClick={handleConfirmationDelete} className={styles.btnYes}>
              Yes
            </button>
          </div>
        </div>
      )}
      <ReactMarkdown className={styles.body}>{body}</ReactMarkdown>
    </div>
  );
};

export default MoreInfoPage;