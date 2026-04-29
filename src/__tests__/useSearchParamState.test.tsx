import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useSearchParamState } from '@/hooks/useSearchParamState';
import type { ReactNode } from 'react';

function makeWrapper(initialUrl = '/') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>;
  };
}

describe('useSearchParamState()', () => {
  it('returns the default value when the param is absent', () => {
    const { result } = renderHook(
      () => useSearchParamState('tab', 'all'),
      { wrapper: makeWrapper() },
    );
    expect(result.current[0]).toBe('all');
  });

  it('reads an existing param from the URL', () => {
    const { result } = renderHook(
      () => useSearchParamState('tab', 'all'),
      { wrapper: makeWrapper('/?tab=active') },
    );
    expect(result.current[0]).toBe('active');
  });

  it('updates the value when the setter is called', () => {
    const { result } = renderHook(
      () => useSearchParamState('tab', 'all'),
      { wrapper: makeWrapper() },
    );
    act(() => {
      result.current[1]('active');
    });
    expect(result.current[0]).toBe('active');
  });

  it('removes the param from the URL when set to the default value', () => {
    const { result } = renderHook(
      () => useSearchParamState('tab', 'all'),
      { wrapper: makeWrapper('/?tab=active') },
    );
    expect(result.current[0]).toBe('active');
    act(() => {
      result.current[1]('all');
    });
    expect(result.current[0]).toBe('all');
  });

  it('works with different keys independently', () => {
    const { result } = renderHook(
      () => ({
        tab: useSearchParamState('tab', 'all'),
        status: useSearchParamState('status', 'any'),
      }),
      { wrapper: makeWrapper('/?tab=active&status=pending') },
    );
    expect(result.current.tab[0]).toBe('active');
    expect(result.current.status[0]).toBe('pending');
  });

  it('setting one param does not clobber other params', () => {
    const { result } = renderHook(
      () => ({
        tab: useSearchParamState('tab', 'all'),
        status: useSearchParamState('status', 'any'),
      }),
      { wrapper: makeWrapper('/?tab=active&status=pending') },
    );
    act(() => {
      result.current.tab[1]('all');
    });
    // tab removed (back to default), status preserved
    expect(result.current.tab[0]).toBe('all');
    expect(result.current.status[0]).toBe('pending');
  });
});
