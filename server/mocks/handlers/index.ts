import { http, HttpResponse } from 'msw';

const useHandlers = () => {
  const { appwrite } = useRuntimeConfig().public;
  const handlers = [
    http.post(`${appwrite.endpoint}/account/jwts`, () => {
      return HttpResponse.json({
        jwt: 'MOCKED_JWT',
      });
    }),
  ];
  return { handlers };
};

export default useHandlers;
