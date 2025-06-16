import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { Season } from '../../types/sportsService';
import { SeasonProvider, useSeasonContext } from '../../store/SeasonContext';
import { sportsService } from '../../services/api/sportsService';

// Mock the API service
vi.mock('../../services/api/sportsService', () => ({
  sportsService: {
    getLeagueSeasons: vi.fn(),
  },
}));

describe('SeasonContext', () => {
  const mockLeagueId = '4328';
  const mockSeasons: Season[] = [
    {
      strSeason: '2023-2024',
      strBadge: 'https://example.com/badge.png',
    },
    {
      strSeason: '2022-2023',
      strBadge: 'https://example.com/old-badge.png',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (sportsService.getLeagueSeasons as any).mockResolvedValue({ seasons: mockSeasons });
  });

  it('provides the initial state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeasonProvider>{children}</SeasonProvider>
    );

    const { result } = renderHook(() => useSeasonContext(), { wrapper });

    expect(result.current.state).toEqual({
      seasonBadges: {},
      loading: {},
      errors: {},
    });
  });

  it('fetches season badge successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeasonProvider>{children}</SeasonProvider>
    );

    const { result } = renderHook(() => useSeasonContext(), { wrapper });

    await act(async () => {
      await result.current.fetchSeasonBadge(mockLeagueId);
    });

    expect(sportsService.getLeagueSeasons).toHaveBeenCalledWith(mockLeagueId);
    expect(result.current.state.seasonBadges[mockLeagueId]).toBe('https://example.com/badge.png');
    expect(result.current.state.loading[mockLeagueId]).toBe(false);
    expect(result.current.state.errors[mockLeagueId]).toBeNull();
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Network error';
    (sportsService.getLeagueSeasons as any).mockRejectedValue(new Error(errorMessage));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeasonProvider>{children}</SeasonProvider>
    );

    const { result } = renderHook(() => useSeasonContext(), { wrapper });

    await act(async () => {
      await result.current.fetchSeasonBadge(mockLeagueId);
    });

    expect(sportsService.getLeagueSeasons).toHaveBeenCalledWith(mockLeagueId);
    expect(result.current.state.seasonBadges[mockLeagueId]).toBeUndefined();
    expect(result.current.state.loading[mockLeagueId]).toBe(false);
    expect(result.current.state.errors[mockLeagueId]).toBe(errorMessage);
  });

  it('handles empty seasons response', async () => {
    (sportsService.getLeagueSeasons as any).mockResolvedValue({ seasons: [] });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeasonProvider>{children}</SeasonProvider>
    );

    const { result } = renderHook(() => useSeasonContext(), { wrapper });

    await act(async () => {
      await result.current.fetchSeasonBadge(mockLeagueId);
    });

    expect(sportsService.getLeagueSeasons).toHaveBeenCalledWith(mockLeagueId);
    expect(result.current.state.seasonBadges[mockLeagueId]).toBeUndefined();
    expect(result.current.state.loading[mockLeagueId]).toBe(false);
    expect(result.current.state.errors[mockLeagueId]).toBe('No seasons found');
  });

  it('handles seasons without badges', async () => {
    const seasonsWithoutBadges = [
      { strSeason: '2023-2024', strBadge: '' },
      { strSeason: '2022-2023', strBadge: null },
    ];
    (sportsService.getLeagueSeasons as any).mockResolvedValue({ seasons: seasonsWithoutBadges });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeasonProvider>{children}</SeasonProvider>
    );

    const { result } = renderHook(() => useSeasonContext(), { wrapper });

    await act(async () => {
      await result.current.fetchSeasonBadge(mockLeagueId);
    });

    expect(sportsService.getLeagueSeasons).toHaveBeenCalledWith(mockLeagueId);
    expect(result.current.state.seasonBadges[mockLeagueId]).toBeUndefined();
    expect(result.current.state.loading[mockLeagueId]).toBe(false);
    expect(result.current.state.errors[mockLeagueId]).toBe('No season badge found');
  });

  it('toggles badge visibility', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeasonProvider>{children}</SeasonProvider>
    );

    const { result } = renderHook(() => useSeasonContext(), { wrapper });

    // First fetch the badge
    await act(async () => {
      await result.current.fetchSeasonBadge(mockLeagueId);
    });

    expect(result.current.state.seasonBadges[mockLeagueId]).toBe('https://example.com/badge.png');

    // Now toggle it off
    act(() => {
      result.current.toggleBadge(mockLeagueId);
    });

    expect(result.current.state.seasonBadges[mockLeagueId]).toBeNull();

    // Toggle it back on
    act(() => {
      result.current.toggleBadge(mockLeagueId);
    });

    expect(result.current.state.seasonBadges[mockLeagueId]).toBeNull(); // Should remain null as per implementation
  });

  it('returns badge status correctly', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeasonProvider>{children}</SeasonProvider>
    );

    const { result } = renderHook(() => useSeasonContext(), { wrapper });

    // Initial status should be empty
    let status = result.current.getBadgeStatus(mockLeagueId);
    expect(status).toEqual({
      badgeUrl: null,
      loading: false,
      error: null,
    });

    // Start fetching
    act(() => {
      result.current.dispatch({ type: 'FETCH_BADGE_START', payload: mockLeagueId });
    });

    status = result.current.getBadgeStatus(mockLeagueId);
    expect(status).toEqual({
      badgeUrl: null,
      loading: true,
      error: null,
    });

    // Fetch success
    act(() => {
      result.current.dispatch({
        type: 'FETCH_BADGE_SUCCESS',
        payload: { leagueId: mockLeagueId, badgeUrl: 'https://example.com/badge.png' },
      });
    });

    status = result.current.getBadgeStatus(mockLeagueId);
    expect(status).toEqual({
      badgeUrl: 'https://example.com/badge.png',
      loading: false,
      error: null,
    });
  });

  it('throws error when hook is used outside provider', () => {
    // Suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useSeasonContext());
    }).toThrow('useSeasonContext must be used within a SeasonProvider');

    // Restore console.error
    console.error = originalConsoleError;
  });
});
