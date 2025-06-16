# Sports Leagues Directory

A modern React TypeScript application that displays sports leagues from around the world, with filtering and search capabilities. The app fetches data from TheSportsDB API and implements efficient state management using React Context API with shadcn-ui components for a polished user interface.

## Features

- Browse sports leagues from various categories
- Filter leagues by sport type
- Search leagues by name
- View season badges for leagues with toggle functionality
- Cached API responses for improved performance
- Responsive design with shadcn-ui components
- Custom typography with Inter and Poppins fonts
- Code formatting with Prettier

## Project Structure

```
src/
├── components/            # UI components
│   ├── ui/                # shadcn-ui components
│   │   ├── button.tsx     # Button component
│   │   ├── card.tsx       # Card component
│   │   ├── input.tsx      # Input component
│   │   ├── select.tsx     # Select component
│   │   └── typography.tsx # Typography components (H1, P)
│   ├── LeagueCard.tsx     # League card component
│   └── LeaguesList.tsx    # Main component for displaying leagues
├── hooks/                 # Custom React hooks
│   └── useDebounce.ts     # Hook for debouncing search input
├── lib/                   # Library code and utilities
│   ├── fonts.ts           # Font configuration
│   ├── serviceWorkerRegistration.ts # Service worker for caching
│   └── utils.ts           # Utility functions including cache clearing
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
├── styles/                # Style files
│   └── fonts.css          # Font imports and variables
├── types/                 # TypeScript type definitions
│   └── sportsService.ts   # Types for API responses
├── index.css              # Global styles with Tailwind directives
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

## Technologies

### UI Components
- **shadcn-ui**: A collection of reusable components built with Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

### Fonts
- **Fontsource**: Self-hosted font solution for Inter and Poppins fonts
- **Typography Components**: Custom React components for consistent text styling

### Development Tools
- **Vite**: For fast development and optimized builds
- **TypeScript**: For type safety and better developer experience
- **Prettier**: For consistent code formatting

### State Management
- **React Context API**: For global state management
- **useReducer**: For predictable state transitions

### Testing
- **Vitest**: For unit and integration testing with a Jest-compatible API
- **React Testing Library**: For testing React components in a user-centric way
- **MSW (Mock Service Worker)**: For mocking API requests in tests

## Testing Strategy

The project follows a comprehensive testing approach with multiple layers of tests to ensure reliability and maintainability:

### Test Organization

Tests are organized in a dedicated `__tests__` folder that mirrors the source structure:

```
__tests__/
├── components/           # Component tests
│   ├── LeagueCard.test.tsx
│   ├── LeagueCardSkeleton.test.tsx
│   └── LeaguesList.test.tsx
├── hooks/                # Hook tests
│   └── useDebounce.test.ts
├── integration/          # Integration tests
│   └── LeagueSearch.test.tsx
└── services/             # Service tests
    ├── cachedApiService.test.ts
    └── sportsService.test.ts
```

### Testing Layers

1. **Unit Tests**
   - Test individual components, hooks, and utility functions in isolation
   - Mock dependencies to focus on the unit being tested
   - Verify component rendering, state changes, and event handling

2. **Integration Tests**
   - Test interactions between multiple components and contexts
   - Verify search and filtering functionality across the application
   - Test user interactions like typing in search fields and selecting filters

3. **Service Tests**
   - Test API services with mocked network responses
   - Verify correct API endpoint usage and error handling
   - Test caching behavior with mocked localStorage and fetch

### Testing Best Practices

- **Mocking Strategy**: Use Vitest for mocking external dependencies and context providers
- **Accessibility Testing**: Ensure components are accessible by querying by role and accessible name
- **Async Testing**: Use `waitFor` and async/await for testing asynchronous operations
- **Test Isolation**: Reset mocks and clear caches between tests to prevent test pollution

## Future Scope

### End-to-End Testing

Future development will include end-to-end (E2E) tests using Cypress or Playwright to test complete user flows:

- **User Journeys**: Test complete user journeys from landing on the page to filtering and viewing league details
- **Visual Regression**: Implement visual regression tests to catch UI changes
- **Cross-browser Testing**: Ensure the application works consistently across different browsers
- **Performance Testing**: Measure and monitor application performance metrics

### Additional Enhancements

- **Storybook Integration**: Add Storybook for component documentation and visual testing
- **Automated Accessibility Audits**: Integrate tools like axe-core for automated accessibility testing
- **Test Coverage Reports**: Generate and monitor test coverage reports
- **CI/CD Integration**: Set up automated testing in CI/CD pipelines

### API Caching Strategy

The application implements a sophisticated multi-level caching strategy using the Cache Storage API and Service Workers:

#### Cache Types
- **API Cache**: For TheSportsDB API responses with configurable TTL (Time-To-Live)
- **Image Cache**: Separate cache for league badges and other images
- **Static Assets Cache**: For application resources like HTML, CSS, and JavaScript

#### Caching Strategies

1. **API Responses (Network-First with Fallback)**
   - First attempts to fetch fresh data from the network
   - Stores successful responses in the cache with expiration metadata
   - Falls back to cached data when network requests fail
   - Configurable cache expiration (default: 15 minutes)

2. **Images (Cache-First)**
   - Checks cache first for images to improve performance
   - Falls back to network requests if not in cache
   - Special handling for CORS with TheSportsDB images using no-cors mode
   - Indefinite caching for images to reduce bandwidth usage

3. **Static Assets (Stale-While-Revalidate)**
   - Returns cached version immediately if available
   - Simultaneously updates cache in the background
   - Ensures fast loading while keeping content fresh

#### Implementation Details

- Uses Service Worker for intercepting and caching network requests
- Custom headers for cache control with timestamps
- Cache cleanup on service worker activation
- Manual cache clearing functionality via UI

This comprehensive caching strategy provides:
- Significantly reduced API calls
- Improved application performance and responsiveness
- Offline or poor-connection functionality
- Reduced load on TheSportsDB API

## Code Formatting

The project uses Prettier for code formatting. You can format your code using:

```bash
npm run format
```

To check if your code is properly formatted without making changes:

```bash
npm run format:check
```

## Getting Started

### Prerequisites

- Node.js (v20.0.0 or later)
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

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Cache Storage API
- React Context API

## AI Tools Used

This project leveraged various AI tools to enhance development efficiency:

- **Google Stitch** - Used to generate UI mockups and design concepts
- **Cascade** - 
   - Helped with generating html & css for the UI from the mockup image
   - Assisted with implementation of the caching layer
   - Helped with migration of the UI component to shadcn-sui
   - Helped with generating tests

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
