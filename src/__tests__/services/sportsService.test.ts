import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SportsService } from '../../services/api/sportsService';
import { CachedApiService } from '../../services/api/cachedApiService';

// Mock the CachedApiService
vi.mock('../../services/api/cachedApiService', () => ({
  CachedApiService: vi.fn()
}));

describe('SportsService', () => {
  let sportsService: SportsService;
  let mockGet: any;

  beforeEach(() => {
    mockGet = vi.fn();
    (CachedApiService as any).mockImplementation(() => ({
      get: mockGet
    }));
    sportsService = new SportsService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct base URL and cache settings', () => {
    expect(CachedApiService).toHaveBeenCalledWith(
      'https://www.thesportsdb.com/api/v1/json/3',
      900, // 15 minutes
      'sports-league-cache-v1'
    );
  });

  it('should call getAllLeagues with correct endpoint', async () => {
    const mockResponse = { leagues: [{ idLeague: '1', strLeague: 'Test League' }] };
    mockGet.mockResolvedValue(mockResponse);

    const result = await sportsService.getAllLeagues();

    expect(mockGet).toHaveBeenCalledWith('/all_leagues.php');
    expect(result).toEqual(mockResponse);
  });

  it('should call getLeagueSeasons with correct endpoint and parameters', async () => {
    const mockResponse = { seasons: [{ strSeason: '2023', strBadge: 'badge.png' }] };
    mockGet.mockResolvedValue(mockResponse);
    const leagueId = '4328';

    const result = await sportsService.getLeagueSeasons(leagueId);

    expect(mockGet).toHaveBeenCalledWith(`/search_all_seasons.php?badge=1&id=${leagueId}`);
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors properly', async () => {
    const errorMessage = 'API Error';
    mockGet.mockRejectedValue(new Error(errorMessage));

    await expect(sportsService.getAllLeagues()).rejects.toThrow(errorMessage);
  });
});
