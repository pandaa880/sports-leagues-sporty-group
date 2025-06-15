import { useMemo, useEffect } from 'react';

import { useLeaguesContext } from '../store/LeaguesContext';
import { useDebounce } from '../hooks/useDebounce';

import { Dropdown, type DropdownOption } from './ui/dropdown';

import type { League } from '../types/sportsService'

import './LeaguesList.css';
import { LeagueCard } from './league-card/LeagueCard';

const getDropdownOptions = (leagues: League[]): DropdownOption[] => {
  const uniqueSports = Array.from(new Set(leagues.map(league => league.strSport)));
  
  return [
    { value: 'all', label: 'All Sports' },
    ...uniqueSports.map(sport => ({
      value: sport,
      label: sport,
    })),
  ];
}

export const LeaguesList = () => {
    const { state, dispatch, fetchLeagues, getFilteredLeagues } = useLeaguesContext();
    const { leagues, loading, error, searchTerm, selectedSport } = state;
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    useEffect(() => {
        fetchLeagues();
    }, []);
    
    const handleSearchChange = (value: string) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: value });
    };
    
    const handleSportChange = (value: string) => {
        dispatch({ type: 'SET_SELECTED_SPORT', payload: value });
        dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
    };
    
    const filteredLeagues = useMemo(() => {
        return getFilteredLeagues();
    }, [leagues, selectedSport, debouncedSearchTerm]);


    const sportOptions = useMemo(() => getDropdownOptions(leagues), [leagues]);


    if (loading) {
        return <div className="loading">Loading leagues...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>Error loading leagues: {error.message}</p>
                <button onClick={fetchLeagues}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="leagues-container">
            <h2>Sports Leagues</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search leagues..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="search-input"
                />
            </div>
            <div>
                <Dropdown
                    options={sportOptions}
                    value={selectedSport}
                    onChange={handleSportChange}
                    placeholder="Filter by sport"
                    className="sport-dropdown"
                />
            </div>
            <div className="leagues-grid">
                {filteredLeagues.length > 0 ? (
                    filteredLeagues.map((league) => (
                        <LeagueCard key={league.idLeague} league={league} />
                    ))
                ) : (
                    <p className="no-results">No leagues found matching "{searchTerm}"</p>
                )}
            </div>
        </div>
    );
};