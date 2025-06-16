import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { sportsService } from '../services/api/sportsService';

interface SeasonState {
  seasonBadges: Record<string, string | null>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
}

type SeasonAction =
  | { type: 'FETCH_BADGE_START'; payload: string }
  | { type: 'FETCH_BADGE_SUCCESS'; payload: { leagueId: string; badgeUrl: string } }
  | { type: 'FETCH_BADGE_ERROR'; payload: { leagueId: string; error: string } }
  | { type: 'TOGGLE_BADGE'; payload: string };

const initialState: SeasonState = {
  seasonBadges: {},
  loading: {},
  errors: {},
};

const seasonReducer = (state: SeasonState, action: SeasonAction): SeasonState => {
  switch (action.type) {
    case 'FETCH_BADGE_START':
      return {
        ...state,
        loading: { ...state.loading, [action.payload]: true },
        errors: { ...state.errors, [action.payload]: null },
      };
    case 'FETCH_BADGE_SUCCESS':
      return {
        ...state,
        seasonBadges: { ...state.seasonBadges, [action.payload.leagueId]: action.payload.badgeUrl },
        loading: { ...state.loading, [action.payload.leagueId]: false },
      };
    case 'FETCH_BADGE_ERROR':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.leagueId]: false },
        errors: { ...state.errors, [action.payload.leagueId]: action.payload.error },
      };
    case 'TOGGLE_BADGE':
      return {
        ...state,
        seasonBadges: {
          ...state.seasonBadges,
          [action.payload]: state.seasonBadges[action.payload]
            ? null
            : state.seasonBadges[action.payload],
        },
        // Clear any errors when toggling
        errors: {
          ...state.errors,
          [action.payload]: null,
        },
      };
    default:
      return state;
  }
};

interface SeasonContextType {
  state: SeasonState;
  dispatch: React.Dispatch<SeasonAction>;
  fetchSeasonBadge: (leagueId: string) => Promise<void>;
  toggleBadge: (leagueId: string) => void;
  getBadgeStatus: (leagueId: string) => {
    badgeUrl: string | null;
    loading: boolean;
    error: string | null;
  };
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export const SeasonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(seasonReducer, initialState);

  const fetchSeasonBadge = async (leagueId: string) => {
    // If we already have a badge for this league, just toggle it
    if (state.seasonBadges[leagueId]) {
      toggleBadge(leagueId);
      return;
    }

    dispatch({ type: 'FETCH_BADGE_START', payload: leagueId });

    try {
      const data = await sportsService.getLeagueSeasons(leagueId);

      if (data.seasons && data.seasons.length > 0) {
        const seasonWithBadge = data.seasons.find((season) => season.strBadge);

        if (seasonWithBadge) {
          dispatch({
            type: 'FETCH_BADGE_SUCCESS',
            payload: {
              leagueId,
              badgeUrl: seasonWithBadge.strBadge,
            },
          });
        } else {
          dispatch({
            type: 'FETCH_BADGE_ERROR',
            payload: {
              leagueId,
              error: 'No season badge found',
            },
          });
        }
      } else {
        dispatch({
          type: 'FETCH_BADGE_ERROR',
          payload: {
            leagueId,
            error: 'No seasons found',
          },
        });
      }
    } catch (err) {
      dispatch({
        type: 'FETCH_BADGE_ERROR',
        payload: {
          leagueId,
          error: err instanceof Error ? err.message : 'An error occurred',
        },
      });
    }
  };

  // Toggle badge visibility
  const toggleBadge = (leagueId: string) => {
    dispatch({ type: 'TOGGLE_BADGE', payload: leagueId });
  };

  // Get badge status for a specific league
  const getBadgeStatus = (leagueId: string) => {
    return {
      badgeUrl: state.seasonBadges[leagueId] || null,
      loading: state.loading[leagueId] || false,
      error: state.errors[leagueId] || null,
    };
  };

  return (
    <SeasonContext.Provider
      value={{
        state,
        dispatch,
        fetchSeasonBadge,
        toggleBadge,
        getBadgeStatus,
      }}
    >
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeasonContext = () => {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error('useSeasonContext must be used within a SeasonProvider');
  }
  return context;
};
