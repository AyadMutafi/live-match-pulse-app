import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLiveMatches() {
  const { data, error, isLoading, mutate } = useSWR('/api/matches', fetcher, {
    refreshInterval: (data) => {
      // If we have data and any match is live, refresh every 15s. Otherwise every 5m.
      if (data?.matches?.some((m: any) => m.status === 'live')) {
        return 15000;
      }
      return 300000;
    },
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  const hasLiveMatch = data?.matches?.some((m: any) => m.status === 'live') || false;

  return {
    matches: data?.matches || [],
    sentiments: data?.sentiments || [],
    signals: data?.signals || [],
    isLoading,
    isError: !!error,
    hasLiveMatch,
    refresh: () => mutate(),
  };
}
