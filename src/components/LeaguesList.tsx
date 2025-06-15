import { useState, useMemo } from 'react';

import { useLeagues } from '../hooks/useLeagues';
import { useDebounce } from '../hooks/useDebounce';

import { Dropdown, type DropdownOption } from './ui/dropdown';

import type { League } from '../types/api'

import './LeaguesList.css';

const getDropdownOptions = (leagues: League[]): DropdownOption[] => {
// Get unique sports
  const uniqueSports = Array.from(new Set(leagues.map(league => league.strSport)));
  
  // Create dropdown options with "All" option first
  return [
    { value: 'all', label: 'All Sports' },
    ...uniqueSports.map(sport => ({
      value: sport,
      label: sport,
    })),
  ];
}

export const LeaguesList = () => {
    const { leagues, loading, error, refetch } = useLeagues();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSport, setSelectedSport] = useState('all');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const filteredLeagues = useMemo(() => {
        let filtered = [...leagues];
        
        // First filter by sport if not set to "all"
        if (selectedSport !== 'all') {
            filtered = filtered.filter(league => 
                league.strSport === selectedSport
            );
        }
        
        // Then filter by search term if one exists
        if (debouncedSearchTerm) {
            filtered = filtered.filter(league =>
                league.strLeague.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [leagues, selectedSport, debouncedSearchTerm]);


    const sportOptions = useMemo(() => getDropdownOptions(leagues), [leagues]);


    if (loading) {
        return <div className="loading">Loading leagues...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>Error loading leagues: {error.message}</p>
                <button onClick={refetch}>Try Again</button>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div>
                <Dropdown
                    options={sportOptions}
                    value={selectedSport}
                    onChange={(value: string) => {
                        setSelectedSport(value);
                        setSearchTerm(''); // Reset search when changing sport
                    }}
                    placeholder="Filter by sport"
                    className="sport-dropdown"
                />
            </div>
            <div className="leagues-grid">
                {filteredLeagues.length > 0 ? (
                    filteredLeagues.map((league) => (
                        <div key={league.idLeague} className="league-card">
                            <h3>{league.strLeague}</h3>
                            <p>Sport: {league.strSport}</p>
                            {league.strLeagueAlternate && (
                                <p>Also known as: {league.strLeagueAlternate}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-results">No leagues found matching "{searchTerm}"</p>
                )}
            </div>
        </div>
    );
};