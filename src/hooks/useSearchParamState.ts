import { useSearchParams } from 'react-router';

/**
 * Binds a single URL search param to a typed state value.
 * When set to the default value the param is removed from the URL.
 */
export function useSearchParamState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = (searchParams.get(key) ?? defaultValue) as T;

  function setValue(next: T) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === defaultValue) {
          params.delete(key);
        } else {
          params.set(key, next);
        }
        return params;
      },
      { replace: true },
    );
  }

  return [value, setValue];
}
