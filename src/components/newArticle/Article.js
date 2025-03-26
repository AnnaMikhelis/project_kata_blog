import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateArticleMutation, useUpdateArticleMutation } from '../../store/apiSlice';
import { Tag, Input, Button } from 'antd';
import styles from './Article.module.scss';

const Article = ({ mode = 'create', initialData = {}, articleSlug }) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState(initialData.tagList || []);
  const [inputValue, setInputValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      shortDescription: initialData.description || '',
      text: initialData.body || '',
    },
  });

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (removedTag) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const onSubmit = async (data) => {
    const formattedData = {
      title: data.title,
      description: data.shortDescription,
      body: data.text,
      tagList: tags,
    };
    if (mode === 'create') {
      await createArticle(formattedData).unwrap();
      navigate('/');
    } else if (mode === 'edit') {
      await updateArticle({ slug: articleSlug, updatedArticle: formattedData }).unwrap();
      reset({
        title: formattedData.title,
        shortDescription: formattedData.description,
        text: formattedData.body,
      });
      navigate('/');
    }
    reset();
  };

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      for (const [key, value] of Object.entries(initialData)) {
        setValue(key, value);
      }
      setTags(initialData.tagList || []);
    }
  }, [mode, initialData, setValue]);

  return (
    <div className={styles.signIn}>
      <h2 className={styles.mainTitle}>
        {mode === 'create' ? 'Create new article' : 'Edit article'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrap}>
          <label className={styles.labelTitle} htmlFor="title">
            Заголовок
          </label>
          <input
            {...register('title', { required: 'Enter title' })}
            placeholder="Title"
            type="text"
            className={styles.title}
            onBlur={() => trigger('title')}
          />
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}

          <label className={styles.labelShortDescription} htmlFor="shortDescription">
            Short description
          </label>
          <input
            {...register('shortDescription', { required: 'Enter description' })}
            placeholder="Short description"
            type="text"
            className={styles.shortDescription}
            onBlur={() => trigger('shortDescription')}
          />
          {errors.shortDescription && (
            <p className={styles.error}>{errors.shortDescription.message}</p>
          )}

          <label className={styles.labelShortDescription} htmlFor="text">
            Text
          </label>
          <input
            {...register('text', { required: 'Enter text' })}
            placeholder="Text"
            type="text"
            className={styles.textInput}
            onBlur={() => trigger('text')}
          />
          {errors.text && <p className={styles.error}>{errors.text.message}</p>}

          <label className={styles.labelTags} htmlFor="tags">
            Tags
          </label>
          <div className={styles.tagsContainer}>
            {tags.map((tag) => (
              <Tag key={tag} closable onClose={() => handleRemoveTag(tag)} className={styles.tag}>
                {tag}
              </Tag>
            ))}
          </div>
          <div className={styles.addTagContainer}>
            <Input
              type="text"
              placeholder="Tag"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.addTagInput}
            />
            <Button type="primary" onClick={handleAddTag} className={styles.addTagButton}>
              Add tag
            </Button>
          </div>
        </div>
        <Button type="primary" htmlType="submit" className={styles.btnLogin}>
          {mode === 'create' ? 'Send' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default Article;