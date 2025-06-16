import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { sportsService } from '../../services/api/sportsService';
import type { League } from '../../types/sportsService';
import { LeaguesProvider, useLeaguesContext } from '../../store/LeaguesContext';

// Mock the API service
vi.mock('../../services/api/sportsService', () => ({
  sportsService: {
    getAllLeagues: vi.fn(),
  },
}));

describe('LeaguesContext', () => {
  const mockLeagues: League[] = [
    {
      idLeague: '4328',
      strLeague: 'English Premier League',
      strSport: 'Soccer',
      strLeagueAlternate: 'EPL',
    },
    {
      idLeague: '4329',
      strLeague: 'La Liga',
      strSport: 'Soccer',
      strLeagueAlternate: 'Spanish League',
    },
    {
      idLeague: '4330',
      strLeague: 'NBA',
      strSport: 'Basketball',
      strLeagueAlternate: 'National Basketball Association',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (sportsService.getAllLeagues as any).mockResolvedValue({ leagues: mockLeagues });
  });

  it('provides the initial state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LeaguesProvider>{children}</LeaguesProvider>
    );

    const { result } = renderHook(() => useLeaguesContext(), { wrapper });

    expect(result.current.state).toEqual({
      leagues: [],
      loading: false,
      error: null,
      selectedSport: 'all',
      searchTerm: '',
    });
  });

  it('fetches leagues successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LeaguesProvider>{children}</LeaguesProvider>
    );

    const { result } = renderHook(() => useLeaguesContext(), { wrapper });

    await act(async () => {
      await result.current.fetchLeagues();
    });

    expect(sportsService.getAllLeagues).toHaveBeenCalledTimes(1);
    expect(result.current.state.leagues).toEqual(mockLeagues);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Network error';
    (sportsService.getAllLeagues as any).mockRejectedValue(new Error(errorMessage));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LeaguesProvider>{children}</LeaguesProvider>
    );

    const { result } = renderHook(() => useLeaguesContext(), { wrapper });

    await act(async () => {
      await result.current.fetchLeagues();
    });

    expect(sportsService.getAllLeagues).toHaveBeenCalledTimes(1);
    expect(result.current.state.leagues).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeInstanceOf(Error);
    expect(result.current.state.error?.message).toBe(errorMessage);
  });

  it('filters leagues by sport', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LeaguesProvider>{children}</LeaguesProvider>
    );

    const { result } = renderHook(() => useLeaguesContext(), { wrapper });

    await act(async () => {
      await result.current.fetchLeagues();
    });

    // Set selected sport to Basketball
    act(() => {
      result.current.dispatch({ type: 'SET_SELECTED_SPORT', payload: 'Basketball' });
    });

    // Check filtered leagues
    const filteredLeagues = result.current.getFilteredLeagues();
    expect(filteredLeagues.length).toBe(1);
    expect(filteredLeagues[0].strLeague).toBe('NBA');
  });

  it('filters leagues by search term', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LeaguesProvider>{children}</LeaguesProvider>
    );

    const { result } = renderHook(() => useLeaguesContext(), { wrapper });

    await act(async () => {
      await result.current.fetchLeagues();
    });

    // Set search term
    act(() => {
      result.current.dispatch({ type: 'SET_SEARCH_TERM', payload: 'premier' });
    });

    // Check filtered leagues
    const filteredLeagues = result.current.getFilteredLeagues();
    expect(filteredLeagues.length).toBe(1);
    expect(filteredLeagues[0].strLeague).toBe('English Premier League');
  });

  it('combines sport and search filters', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LeaguesProvider>{children}</LeaguesProvider>
    );

    const { result } = renderHook(() => useLeaguesContext(), { wrapper });

    await act(async () => {
      await result.current.fetchLeagues();
    });

    // Set both filters
    act(() => {
      result.current.dispatch({ type: 'SET_SELECTED_SPORT', payload: 'Soccer' });
      result.current.dispatch({ type: 'SET_SEARCH_TERM', payload: 'liga' });
    });

    // Check filtered leagues
    const filteredLeagues = result.current.getFilteredLeagues();
    expect(filteredLeagues.length).toBe(1);
    expect(filteredLeagues[0].strLeague).toBe('La Liga');
  });

  it('returns unique sport types', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LeaguesProvider>{children}</LeaguesProvider>
    );

    const { result } = renderHook(() => useLeaguesContext(), { wrapper });

    await act(async () => {
      await result.current.fetchLeagues();
    });

    const sportTypes = result.current.getSportTypes();
    expect(sportTypes).toEqual(['Soccer', 'Basketball']);
    expect(sportTypes.length).toBe(2); // Should be unique
  });

  it('throws error when hook is used outside provider', () => {
    // Suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useLeaguesContext());
    }).toThrow('useLeaguesContext must be used within a LeaguesProvider');

    // Restore console.error
    console.error = originalConsoleError;
  });
});
