import { CachedApiService } from './cachedApiService';
import type { LeaguesResponse, SeasonsResponse } from '../../types/sportsService';

export class SportsService {
  private apiService: CachedApiService;
  
  constructor() {
    // Use longer cache duration (1 hour) for sports data as it doesn't change frequently
    this.apiService = new CachedApiService(
      'https://www.thesportsdb.com/api/v1/json/3',
      900, // 15 minutes cache duration in seconds
      'sports-league-cache-v1'
    );
  }

  async getAllLeagues(): Promise<LeaguesResponse> {
    return this.apiService.get<LeaguesResponse>('/all_leagues.php');
  }

  async getLeagueSeasons(leagueId: string): Promise<SeasonsResponse> {
    return this.apiService.get<SeasonsResponse>(`/search_all_seasons.php?badge=1&id=${leagueId}`);
  }
}

export const sportsService = new SportsService();

