import debounce from 'lodash/debounce';
import useSWR from 'swr';

export function useGithubRepos(username: string) {
  const { data, error, isLoading } = useSWR(
    username ? `/api/users/${username}/repos` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      fetcher: debounce(
        (url) => fetch(url).then((res) => res.json()),
        500  // 500ms debounce timeout
      )
    }
  );

  return {
    repos: data?.data?.items ?? [],
    total: data?.data?.total ?? 0,
    error: error || data?.error,
    isLoading
  };
}
