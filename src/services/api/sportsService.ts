import { ApiService } from './apiService';
import type { LeaguesResponse, SeasonsResponse } from '../../types/sportsService';

export class SportsService {
  private apiService: ApiService;
  
  constructor() {
    this.apiService = new ApiService('https://www.thesportsdb.com/api/v1/json/3');
  }

  async getAllLeagues(): Promise<LeaguesResponse> {
    return this.apiService.get<LeaguesResponse>('/all_leagues.php');
  }

  async getLeagueSeasons(leagueId: string): Promise<SeasonsResponse> {
    return this.apiService.get<SeasonsResponse>(`/search_all_seasons.php?badge=1&id=${leagueId}`);
  }
}

export const sportsService = new SportsService();

