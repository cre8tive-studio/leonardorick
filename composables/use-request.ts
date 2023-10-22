const useRequest = () => {
  const { auth } = useAppwrite();
  const request = async (url: Parameters<typeof useFetch>[0], body?: Object) => {
    return useFetch(url, {
      method: 'post',
      ...(body ? { body } : {}),
      headers: {
        Authorization: (await auth.createJWT()).jwt,
      },
    });
  };
  return {
    request,
  };
};

export default useRequest;
