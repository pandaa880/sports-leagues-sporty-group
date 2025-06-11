import { ApiService } from './apiService';
import type { LeaguesResponse } from '../../types/api';

export class SportsService {
  private apiService: ApiService;
  
  constructor() {
    this.apiService = new ApiService('https://www.thesportsdb.com/api/v1/json/3');
  }

  async getAllLeagues(): Promise<LeaguesResponse> {
    return this.apiService.get<LeaguesResponse>('/all_leagues.php');
  }
}

export const sportsService = new SportsService();

