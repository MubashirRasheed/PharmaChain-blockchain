import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  // baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_CHAT_HOST }),
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  reducerPath: 'main',
  tagTypes: [],
  endpoints: (build) => ({
    postAiText: build.mutation({
      query: (payload) => ({
        url: 'openai/text',
        method: 'POST',
        body: payload,
      }),
    }),
    postLogin: build.mutation({
      query: (payload) => ({
        url: `${import.meta.env.VITE_BASE_URL}/chat/login`,
        method: 'POST',
        body: payload,
      }),
    }),
    postSignUp: build.mutation({
      query: (payload) => ({
        url: `${import.meta.env.VITE_BASE_URL}/chat/signup`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  usePostAiTextMutation,
  usePostLoginMutation,
  usePostSignUpMutation,
} = api;
