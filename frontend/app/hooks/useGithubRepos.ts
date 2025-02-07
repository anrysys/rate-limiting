import debounce from 'lodash/debounce';
import useSWR, { mutate, mutate as swr_mutate } from 'swr';

// Создаем стабильный debounced fetcher
const createDebouncedFetcher = () => {
  const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    return response.json();
  };

  return debounce(fetchData, 1000, {
    leading: true,   // Выполнить первый запрос сразу
    trailing: true,  // Выполнить последний запрос после задержки
    maxWait: 2000    // Максимальное время ожидания
  });
};

const debouncedFetcher = createDebouncedFetcher();

export function useGithubRepos(username: string) {
  const { data, error, isLoading } = useSWR(
    username ? `/api/users/${username}/repos` : null,
    {
      fetcher: debouncedFetcher,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      shouldRetryOnError: false // Отключаем автоматические retry при ошибках
    }
  );

  // Пример оптимистичного обновления
  const updateRepo = async (repoId: number, newData: any) => {
    try {
      // 1. Немедленно обновляем UI (оптимистично)
      mutate(
        `/api/users/${username}/repos`,
        { ...data, [repoId]: newData },
        false // false = не делать ревалидацию сразу
      );

      // 2. Отправляем запрос на сервер
      const response = await fetch(`/api/repos/${repoId}`, {
        method: 'PUT',
        body: JSON.stringify(newData)
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      // 3. Ревалидируем данные для синхронизации с сервером
      swr_mutate(`/api/users/${username}/repos`, data, true);
    } catch (error) {
      // 4. В случае ошибки откатываем изменения
      mutate(`/api/users/${username}/repos`);
    }
  };

  return {
    repos: data?.data?.items ?? [],
    total: data?.data?.total ?? 0,
    error,
    isLoading,
    updateRepo // Экспортируем функцию мутации
  };
}
// Removed local mutate function as we use SWR's mutate

