const useAlias = (path: string) => {
  const base = import.meta.env.BASE_URL;
  return `${base}${path}`;
};

export default useAlias;
