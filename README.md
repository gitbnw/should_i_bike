# Should I Bike Tomorrow? - Frontend

React + TypeScript frontend for the "Should I Bike Tomorrow?" weather-based cycling decision app. Built with Vite, TanStack Router, and Zustand for state management.

## What Does This App Do?

Enter your zip code and weather preferences to get a personalized recommendation on whether you should bike tomorrow based on the forecast.

### Features
- **Location Input** - Enter zip code to get local forecast
- **Preferences** - Set your ideal/tolerable temperature, wind, and rain thresholds
- **Decision Display** - Visual recommendation with clear reasoning
- **Chaos Mode** - Toggle backend error simulation to see resilience patterns
- **Preference Storage** - Saves your settings locally

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Backend running (see [api_one README](../api_one/README.md))

### Installation
```bash
# Install dependencies
pnpm install

# Create .env from example
cp .env.example .env

# Update .env with your backend URL
# VITE_API_BASE_URL=http://localhost:3000
```

### Development
```bash
# Start dev server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run both frontend and backend
pnpm dev:all
```

App runs at `http://localhost:5173`

## Project Structure

```
src/
  components/       # React components
    BikeDecisionDisplay.tsx   # Shows recommendation
    BikePreferencesForm.tsx   # User preferences
    LocationForm.tsx          # Zip code input
    ChaosToggle.tsx          # Backend error simulation
    ErrorDisplay.tsx         # Error states
    LoadingIndicator.tsx     # Loading states
  services/         # API clients and business logic
    bikeApi.ts      # Backend HTTP client
    location.ts     # Location service
    biking.ts       # Bike decision logic
  hooks/            # Custom React hooks
    useBikeDecision.ts  # Main decision hook
  store/            # Zustand state management
    formStore.ts    # Form wizard state
  types/            # TypeScript definitions
  routes/           # TanStack Router pages
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **Zustand** - State management
- **Vitest** - Testing framework
- **Testing Library** - Component testing

## Configuration

See [`.env.example`](.env.example):
- `VITE_API_BASE_URL` - Backend API URL (required)
- `VITE_ENABLE_DEVTOOLS` - Show TanStack DevTools (dev only)

## Deployment

See [**api_one/docs/DEPLOYMENT.md**](../api_one/docs/DEPLOYMENT.md) for complete hosting setup.

**Quick deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

Remember to set `VITE_API_BASE_URL` in Vercel environment variables!

## Testing

- **Unit tests** - Services and utilities
- **Component tests** - React Testing Library
- **User interaction tests** - User-event simulations

```bash
pnpm test          # Run all tests
pnpm test:coverage # Generate coverage report
pnpm test:ui       # Interactive test UI
```

## Portfolio Highlights

### User Experience Patterns
- **Form Wizard** - Multi-step form with progress tracking
- **Optimistic UI** - Immediate feedback before API responds
- **Error Boundaries** - Graceful degradation on failures
- **Loading States** - Clear feedback during async operations
- **Preference Persistence** - localStorage for user settings

### Code Quality
- TypeScript strict mode
- Component testing with Testing Library
- ESLint + Prettier
- Modular service architecture

## Related Projects

- **Backend API**: [api_one](../api_one) - NestJS backend with weather integration


