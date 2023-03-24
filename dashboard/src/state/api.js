import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_CHAT_HOST }),
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
        url: 'http://localhost:9002/chat/login',
        method: 'POST',
        body: payload,
      }),
    }),
    postSignUp: build.mutation({
      query: (payload) => ({
        url: 'http://localhost:9002/chat/signup',
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
