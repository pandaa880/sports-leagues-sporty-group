# Sports Leagues Directory

A React TypeScript application that displays sports leagues from around the world, with filtering and search capabilities. The app fetches data from TheSportsDB API and implements efficient state management using React Context API.

## Features

- Browse sports leagues from various categories
- Filter leagues by sport type
- Search leagues by name
- View season badges for leagues
- Cached API responses for improved performance
- Responsive design

## Project Structure

```
src/
├── components/            # UI components
│   ├── league-card/       # League card component and styles
│   ├── ui/                # Reusable UI components (Dropdown, etc.)
│   └── LeaguesList.tsx    # Main component for displaying leagues
├── hooks/                 # Custom React hooks
│   ├── useDebounce.ts     # Hook for debouncing search input
│   ├── useImageCache.ts   # Hook for caching images
│   └── useLeagues.ts      # Hook for fetching leagues data
├── pages/                 # Page components
│   └── LeaguesPage.tsx    # Main page for the leagues directory
├── services/              # API and service layer
│   └── api/
│       ├── apiService.ts         # Base API service
│       ├── cachedApiService.ts   # API service with caching
│       └── sportsService.ts      # Sports-specific API service
├── store/                 # Context-based state management
│   ├── LeaguesContext.tsx # Context for leagues data
│   └── SeasonContext.tsx  # Context for season badges
├── types/                 # TypeScript type definitions
│   └── sportsService.ts   # Types for API responses
├── utils/                 # Utility functions
│   └── cacheUtils.ts      # Cache management utilities
├── App.css                # Global styles
├── App.tsx                # Root component
└── main.tsx              # Application entry point
```

## State Management Architecture

The application uses React's Context API with useReducer for state management, split into two separate contexts:

1. **LeaguesContext**: Manages the core leagues data, including:
   - Fetching and storing leagues
   - Filtering by sport type
   - Search functionality
   - Loading and error states

2. **SeasonContext**: Handles season badge-related functionality:
   - Fetching season badges for leagues
   - Managing badge loading states
   - Toggling badge visibility

This separation of concerns allows for better maintainability and scalability.

## API Caching Strategy

The application implements a caching layer using the Cache Storage API to:

- Reduce unnecessary API calls
- Improve application performance
- Provide offline capabilities
- Reduce load on the external API

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/sports-leagues-sporty-group.git
   cd sports-leagues-sporty-group
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Scalability and Future Improvements

### Current Limitations

- Limited to TheSportsDB API capabilities
- No pagination for large datasets
- Basic UI with minimal animations

### Potential Improvements

1. **State Management**:
   - Consider Redux Toolkit for more complex state requirements
   - Implement middleware for side effects (Redux Thunk/Saga)
   - Add state persistence with localStorage/IndexedDB

2. **Performance Optimization**:
   - Implement virtualized lists for handling large datasets
   - Add pagination or infinite scrolling
   - Optimize image loading with lazy loading and placeholders

3. **Feature Enhancements**:
   - Add detailed league views with more information
   - Implement user preferences and favorites
   - Add authentication for personalized experiences
   - Integrate additional sports data sources

4. **Testing**:
   - Add unit tests with Jest/React Testing Library
   - Implement E2E tests with Cypress
   - Add performance monitoring

5. **Developer Experience**:
   - Implement Storybook for component documentation
   - Add CI/CD pipeline
   - Improve error handling and logging

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS Modules
- Cache Storage API
- React Context API

## AI Tools Used

This project leveraged various AI tools to enhance development efficiency:

- **Google Stitch** - Used to generate UI mockups and design concepts
- **Cascade** - 
   - Helped with state management architecture and code organization 
   - Assisted with implementation of the caching layer

These AI tools significantly accelerated the development process while maintaining code quality and best practices.

## License

MIT


```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
