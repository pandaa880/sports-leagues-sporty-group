import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial value', 500));
    expect(result.current).toBe('initial value');
  });

  it('should update the value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated value', delay: 500 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial value');
    
    // Fast-forward time by 250ms (half the delay)
    act(() => {
      vi.advanceTimersByTime(250);
    });
    
    // Value should still be the initial value
    expect(result.current).toBe('initial value');
    
    // Fast-forward time by the remaining 250ms
    act(() => {
      vi.advanceTimersByTime(250);
    });
    
    // Now the value should be updated
    expect(result.current).toBe('updated value');
  });

  it('should cancel previous timer when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'intermediate value', delay: 500 });
    
    // Fast-forward time by 250ms (half the delay)
    act(() => {
      vi.advanceTimersByTime(250);
    });
    
    // Value should still be the initial value
    expect(result.current).toBe('initial value');
    
    // Change the value again before the first delay completes
    rerender({ value: 'final value', delay: 500 });
    
    // Fast-forward time by 500ms (the full delay)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // The value should be the final value, skipping the intermediate value
    expect(result.current).toBe('final value');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value and delay
    rerender({ value: 'updated value', delay: 1000 });
    
    // Fast-forward time by 500ms (the original delay)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Value should still be the initial value because we increased the delay
    expect(result.current).toBe('initial value');
    
    // Fast-forward time by another 500ms (to reach the new delay)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Now the value should be updated
    expect(result.current).toBe('updated value');
  });
});
