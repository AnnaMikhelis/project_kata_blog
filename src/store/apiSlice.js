import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery  from './baseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Article', 'User'],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ limit = 10, offset = 0 }) => `/articles?limit=${limit}&offset=${offset}`,
      providesTags: (result) =>
        result?.articles
          ? [
              ...result.articles.map(({ slug }) => ({ type: 'Article', id: slug })),
              { type: 'Article', id: 'LIST' },
            ]
          : [{ type: 'Article', id: 'LIST' }],
    }),
    getArticleBySlug: builder.query({
      query: (slug) => `/articles/${slug}`,
      providesTags: (slug) => [{ type: 'Article', id: slug }],
    }),
    createArticle: builder.mutation({
      query: (newArticle) => ({
        url: '/articles',
        method: 'POST',
        body: { article: newArticle },
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    updateArticle: builder.mutation({
      query: ({ slug, updatedArticle }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: { article: updatedArticle },
      }),
      invalidatesTags: ({ slug }) => [
        { type: 'Article', id: slug },
        { type: 'Article', id: 'LIST' },
      ],
    }),
    deleteArticle: builder.mutation({
      query: (articleSlug) => ({
        url: `/articles/${articleSlug}`,
        method: 'DELETE',
      }),
      invalidatesTags: (articleSlug) => [
        { type: 'Article', id: articleSlug },
        { type: 'Article', id: 'LIST' },
      ],
    }),
    toggleLike: builder.mutation({
      query: ({ slug, isLiked }) => ({
        url: `/articles/${slug}/favorite`,
        method: isLiked ? 'DELETE' : 'POST',
      }),
      invalidatesTags: ({ slug }) => [
        { type: 'Article', id: slug },
        { type: 'Article', id: 'LIST' },
      ],
    }),

    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: { user: newUser },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (updatedUser) => ({
        url: '/user',
        method: 'PUT',
        body: { user: updatedUser },
      }),
    }),

    loginUser: builder.mutation({
      query: (userCredentials) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: userCredentials },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    getUser: builder.query({
      query: () => '/user',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useToggleLikeMutation,
  useCreateUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} = apiSlice;