import { render } from '@testing-library/react';
import { LeagueCardSkeleton } from '../../components/LeagueCardSkeleton';
import { describe, it, expect } from 'vitest';

describe('LeagueCardSkeleton', () => {
  it('renders skeleton UI elements', () => {
    render(<LeagueCardSkeleton />);
    
    // Get all skeleton elements (animated divs)
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    
    // Check that we have the expected number of skeleton elements
    expect(skeletonElements.length).toBe(3); // Title, sport type, and "also known as" skeletons
    
    // Check that the skeleton elements have the correct classes for styling
    const titleSkeleton = skeletonElements[0];
    expect(titleSkeleton).toHaveClass('bg-gray-200');
    expect(titleSkeleton).toHaveClass('rounded-md');
    
    // Check that the component structure is correct
    const card = document.querySelector('[class*="card"]');
    expect(card).toBeInTheDocument();
  });
});
