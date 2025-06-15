import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H1, P } from "@/components/ui/typography";
import { LeaguesList } from '../components/LeaguesList';
import { useLeaguesContext } from "../store/LeaguesContext";
import { Button } from "@/components/ui/button";

import { clearAllCaches } from "../utils/cacheUtils";

export const LeaguesPage = () => {
  const { state, dispatch, getSportTypes } = useLeaguesContext();
  const { searchTerm, selectedSport } = state;

  // Get unique sport types from context
  const sportTypes = getSportTypes();

  return (
    <div className="container mx-auto py-6">
      {/**
       * improvement - wrap with layout component for header
       */}
      {/* Main Content */}
      <div className="mb-6">
        <div className="mb-6 flex justify-between items-center mb-6">
          <H1>All Leagues</H1>
          <Button
            variant="outline"
            onClick={clearAllCaches}
          >
            Clear Cache
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 w-full max-w-full sm:max-w-[300px]">
          <div className="relative flex items-center">
            <Input
              type="search"
              placeholder="Search leagues"
              value={searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
              className="w-full pl-8"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div>
            <P className="text-sm font-medium mb-2">Sport Type</P>
            <Select
              value={selectedSport}
              onValueChange={(value) => dispatch({ type: 'SET_SELECTED_SPORT', payload: value })}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select sport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sportTypes.map((sport: string) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-8">
          <LeaguesList />
        </div>
      {/**
       * improvement - pagination        
       */}
        <div className="flex justify-center mt-8 space-x-2">
          {/* Placeholder for pagination */}
        </div>
      </div>
    </div>
  );
};
