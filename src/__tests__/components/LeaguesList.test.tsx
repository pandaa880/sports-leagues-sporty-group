import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LeaguesList } from '../../components/LeaguesList';
import { useLeaguesContext } from '../../store/LeaguesContext';
import type { League } from '../../types/sportsService';

// Mock the context hook
vi.mock('../../store/LeaguesContext', () => ({
  useLeaguesContext: vi.fn()
}));

// Mock the child components
vi.mock('../../components/LeagueCard', () => ({
  LeagueCard: ({ league }: { league: League }) => (
    <div data-testid={`league-card-${league.idLeague}`}>
      {league.strLeague}
    </div>
  )
}));

vi.mock('../../components/LeagueCardSkeleton', () => ({
  LeagueCardSkeleton: () => <div data-testid="league-card-skeleton" />
}));

describe('LeaguesList', () => {
  const mockLeagues = [
    {
      idLeague: '4328',
      strLeague: 'English Premier League',
      strSport: 'Soccer',
      strLeagueAlternate: 'EPL'
    },
    {
      idLeague: '4329',
      strLeague: 'La Liga',
      strSport: 'Soccer',
      strLeagueAlternate: 'Spanish League'
    }
  ];

  const mockContextValue = {
    state: {
      loading: false,
      error: null,
      leagues: mockLeagues,
      filters: { sport: '', search: '' }
    },
    fetchLeagues: vi.fn(),
    getFilteredLeagues: vi.fn().mockReturnValue(mockLeagues)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLeaguesContext as any).mockReturnValue(mockContextValue);
  });

  it('fetches leagues on mount', () => {
    render(<LeaguesList />);
    expect(mockContextValue.fetchLeagues).toHaveBeenCalledTimes(1);
  });

  it('renders league cards when leagues are loaded', () => {
    render(<LeaguesList />);
    
    // Check that both league cards are rendered
    expect(screen.getByTestId('league-card-4328')).toBeInTheDocument();
    expect(screen.getByTestId('league-card-4329')).toBeInTheDocument();
    expect(screen.getByText('English Premier League')).toBeInTheDocument();
    expect(screen.getByText('La Liga')).toBeInTheDocument();
  });

  it('renders skeletons when loading', () => {
    // Update mock to return loading state
    (useLeaguesContext as any).mockReturnValue({
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        loading: true
      }
    });
    
    render(<LeaguesList />);
    
    // Check that skeletons are rendered (10 of them as per the component)
    const skeletons = screen.getAllByTestId('league-card-skeleton');
    expect(skeletons.length).toBe(10);
  });

  it('renders error message when there is an error', () => {
    const errorMessage = 'Failed to load leagues';
    
    // Update mock to return error state
    (useLeaguesContext as any).mockReturnValue({
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        loading: false,
        error: { message: errorMessage }
      }
    });
    
    render(<LeaguesList />);
    
    // Check that the error message is displayed
    expect(screen.getByText('Error loading leagues')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('retries fetching leagues when retry button is clicked', () => {
    const errorMessage = 'Failed to load leagues';
    
    // Update mock to return error state
    (useLeaguesContext as any).mockReturnValue({
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        loading: false,
        error: { message: errorMessage }
      }
    });
    
    render(<LeaguesList />);
    
    // Click the retry button
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    
    // Check that fetchLeagues was called again
    expect(mockContextValue.fetchLeagues).toHaveBeenCalledTimes(2);
  });

  it('displays "No leagues found" message when filtered leagues is empty', () => {
    // Update mock to return empty filtered leagues
    (useLeaguesContext as any).mockReturnValue({
      ...mockContextValue,
      getFilteredLeagues: vi.fn().mockReturnValue([])
    });
    
    render(<LeaguesList />);
    
    // Check that the no leagues message is displayed
    expect(screen.getByText('No leagues found matching your criteria')).toBeInTheDocument();
  });
});
