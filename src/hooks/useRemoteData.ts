import { useEffect, useState } from 'react';

export function useRemoteData<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    void load()
      .then((result) => {
        if (active) {
          setData(result);
        }
      })
      .catch((loadError: unknown) => {
        console.error('Unable to load data from Supabase.', loadError);
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load data from Supabase.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [load, revision]);

  return {
    data,
    isLoading,
    error,
    reload: () => setRevision((value) => value + 1),
  };
}
