import { useState, useMemo } from 'react';

import { useLeagues } from '../hooks/useLeagues';
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
    const { leagues, loading, error, refetch } = useLeagues();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSport, setSelectedSport] = useState('all');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const filteredLeagues = useMemo(() => {
        let filtered = [...leagues];
        
        if (selectedSport !== 'all') {
            filtered = filtered.filter(league => 
                league.strSport === selectedSport
            );
        }
        
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
                        setSearchTerm('');
                    }}
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