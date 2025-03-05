import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export const useQuery = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [queryString] = useSearchParams();
  const query = useMemo(() => Object.fromEntries(queryString), [queryString]);

  const queryToStringify = (object: object) => {
    const arrayWithQuery = Object.entries(object)
      .filter((param) => !!param[1])
      .map((param) => param.join('='));

    return `?${arrayWithQuery.join('&')}`;
  };

  const setQuery = (search: object) => navigate({
    pathname,
    search: queryToStringify(search),
  }, { replace: true });

  return {
    query,
    setQuery,
    queryToStringify,
  };
};
