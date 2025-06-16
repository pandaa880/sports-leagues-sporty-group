import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LeagueCard } from '../../components/LeagueCard';
import { useSeasonContext } from '../../store/SeasonContext';

// Mock the context hook
vi.mock('../../store/SeasonContext', () => ({
  useSeasonContext: vi.fn(),
}));

describe('LeagueCard', () => {
  const mockLeague = {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'EPL, Premier League',
  };

  const mockContextValue = {
    fetchSeasonBadge: vi.fn(),
    toggleBadge: vi.fn(),
    getBadgeStatus: vi.fn().mockReturnValue({
      badgeUrl: '',
      loading: false,
      error: null,
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSeasonContext as any).mockReturnValue(mockContextValue);
  });

  it('renders league information correctly when no badge is loaded', () => {
    render(<LeagueCard league={mockLeague} />);

    // Check that the league name is displayed
    expect(screen.getByText('English Premier League')).toBeInTheDocument();

    // Check that the sport type is displayed
    expect(screen.getByText('Sport: Soccer')).toBeInTheDocument();

    // Check that the alternate name is displayed
    expect(screen.getByText('Also known as: EPL, Premier League')).toBeInTheDocument();
  });

  it('fetches badge when card is clicked and no badge is loaded', () => {
    render(<LeagueCard league={mockLeague} />);

    // Click on the card
    const card = screen.getByText('English Premier League').closest('.card, [class*="card"]');
    fireEvent.click(card!);

    // Check that fetchSeasonBadge was called with the correct league ID
    expect(mockContextValue.fetchSeasonBadge).toHaveBeenCalledWith('4328');
    expect(mockContextValue.toggleBadge).not.toHaveBeenCalled();
  });

  it('toggles badge when card is clicked and badge is already loaded', () => {
    // Update mock to return a badge URL
    mockContextValue.getBadgeStatus.mockReturnValue({
      badgeUrl: 'https://example.com/badge.png',
      loading: false,
      error: null,
    });

    render(<LeagueCard league={mockLeague} />);

    // Check that the image is rendered
    const image = screen.getByAltText('English Premier League badge');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/badge.png');

    // Click on the card
    const card = image.closest('.card, [class*="card"]');
    fireEvent.click(card!);

    // Check that toggleBadge was called with the correct league ID
    expect(mockContextValue.toggleBadge).toHaveBeenCalledWith('4328');
    expect(mockContextValue.fetchSeasonBadge).not.toHaveBeenCalled();
  });

  it('displays loading state when badge is being fetched', () => {
    // Update mock to return loading state
    mockContextValue.getBadgeStatus.mockReturnValue({
      badgeUrl: '',
      loading: true,
      error: null,
    });

    render(<LeagueCard league={mockLeague} />);

    // Check for loading animation elements
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('displays error message when badge fetch fails', () => {
    // Update mock to return error state with a badge URL
    mockContextValue.getBadgeStatus.mockReturnValue({
      badgeUrl: 'https://example.com/badge.png',
      loading: false,
      error: 'Failed to load badge',
    });

    render(<LeagueCard league={mockLeague} />);

    // Check that the error message is displayed
    expect(screen.getByText('Failed to load badge')).toBeInTheDocument();
  });

  it('displays error message when API returns { seasons: null } and clears error on click', () => {
    // First, mock the error state (when API returns { seasons: null })
    mockContextValue.getBadgeStatus.mockReturnValue({
      badgeUrl: null,
      loading: false,
      error: 'No seasons found',
    });

    render(<LeagueCard league={mockLeague} />);

    // Check that the error message is displayed
    expect(screen.getByText('No seasons found')).toBeInTheDocument();
    
    // The league information should not be displayed when there's an error
    expect(screen.queryByText('English Premier League')).not.toBeInTheDocument();
    
    // Click on the card to clear the error
    const card = screen.getByText('No seasons found').closest('.card, [class*="card"]');
    fireEvent.click(card!);
    
    // Verify that toggleBadge was called to clear the error
    expect(mockContextValue.toggleBadge).toHaveBeenCalledWith('4328');
    
    // Now simulate the state after error is cleared
    mockContextValue.getBadgeStatus.mockReturnValue({
      badgeUrl: null,
      loading: false,
      error: null,
    });
    
    // Re-render with updated state
    render(<LeagueCard league={mockLeague} />);
    
    // Now the league information should be displayed
    expect(screen.getByText('English Premier League')).toBeInTheDocument();
    expect(screen.getByText('Sport: Soccer')).toBeInTheDocument();
  });
});
