import axiosInstance from 'axios';

import { HttpError } from './errors';

export function createAxios({ baseURL }: { baseURL: string } = { baseURL: process.env.NEXTAUTH_URL }) {
  const axios = axiosInstance.create({
    baseURL,
  });

  axios.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      const { data, status } = error?.response || {};
      throw new HttpError(data || error?.message || 'no response from server', status || 500);
    },
  );
  return axios;
}

export const axios = createAxios();
