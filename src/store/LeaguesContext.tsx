import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { League } from '../types/sportsService';
import { sportsService } from '../services/api/sportsService';

interface LeaguesState {
  leagues: League[];
  loading: boolean;
  error: Error | null;
  selectedSport: string;
  searchTerm: string;
}

type LeaguesAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: League[] }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'SET_SELECTED_SPORT'; payload: string }
  | { type: 'SET_SEARCH_TERM'; payload: string };

const initialState: LeaguesState = {
  leagues: [],
  loading: false,
  error: null,
  selectedSport: 'all',
  searchTerm: '',
};

const leaguesReducer = (state: LeaguesState, action: LeaguesAction): LeaguesState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, leagues: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SELECTED_SPORT':
      return { ...state, selectedSport: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

interface LeaguesContextType {
  state: LeaguesState;
  dispatch: React.Dispatch<LeaguesAction>;
  fetchLeagues: () => Promise<void>;
  getFilteredLeagues: () => League[];
}

const LeaguesContext = createContext<LeaguesContextType | undefined>(undefined);

export const LeaguesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(leaguesReducer, initialState);

  const fetchLeagues = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await sportsService.getAllLeagues();
      dispatch({ type: 'FETCH_SUCCESS', payload: response.leagues });
    } catch (err) {
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: err instanceof Error ? err : new Error('Failed to fetch leagues') 
      });
    }
  };

  const getFilteredLeagues = () => {
    let filtered = [...state.leagues];
    
    if (state.selectedSport !== 'all') {
      filtered = filtered.filter(league => 
        league.strSport === state.selectedSport
      );
    }
    
    if (state.searchTerm) {
      filtered = filtered.filter(league =>
        league.strLeague.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <LeaguesContext.Provider value={{ 
      state, 
      dispatch, 
      fetchLeagues, 
      getFilteredLeagues
    }}>
      {children}
    </LeaguesContext.Provider>
  );
};

export const useLeaguesContext = () => {
  const context = useContext(LeaguesContext);
  if (context === undefined) {
    throw new Error('useLeaguesContext must be used within a LeaguesProvider');
  }
  return context;
};
