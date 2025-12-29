import './About.css';
import ChaosToggle from '../components/ChaosToggle';

export function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About This Project</h1>
        
        <section className="about-section">
          <h2>Overview</h2>
          <p>
            "Should I Bike Tomorrow?" is a full-stack weather decision application that helps cyclists 
            make informed choices about riding based on personalized weather preferences and real-time 
            forecast data.
          </p>
        </section>

        <section className="about-section">
          <h2>Technical Architecture</h2>
          
          <div className="tech-stack">
            <div className="stack-group">
              <h3>Frontend</h3>
              <ul>
                <li><strong>React 19</strong> - UI framework</li>
                <li><strong>TypeScript</strong> - Type safety and developer experience</li>
                <li><strong>Vite</strong> - Build tooling and development server</li>
                <li><strong>Zustand</strong> - Lightweight state management for multi-step form</li>
                <li><strong>TanStack Router</strong> - Type-safe routing</li>
                <li><strong>Vitest + Testing Library</strong> - Comprehensive test coverage</li>
              </ul>
            </div>

            <div className="stack-group">
              <h3>Backend</h3>
              <ul>
                <li><strong>NestJS</strong> - Production-ready Node.js framework</li>
                <li><strong>TypeScript</strong> - End-to-end type safety</li>
                <li><strong>OpenWeatherMap API</strong> - Weather data and geocoding</li>
                <li><strong>Jest</strong> - Backend testing with mocked HTTP responses</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <ul className="feature-list">
            <li>
              <strong>Multi-step Form Flow</strong> - Guided user experience with location lookup 
              and preference configuration
            </li>
            <li>
              <strong>Zip Code Geocoding</strong> - Convert US zip codes to coordinates via dedicated 
              NestJS location service
            </li>
            <li>
              <strong>Personalized Recommendations</strong> - Decision engine compares user preferences 
              against forecast data
            </li>
            <li>
              <strong>Local Preference Storage</strong> - Browser localStorage with abstraction layer 
              for easy backend migration
            </li>
            <li>
              <strong>Responsive Design</strong> - Mobile-friendly interface with animated icons
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Production Patterns Demonstrated</h2>
          <ul className="feature-list">
            <li>
              <strong>Error Handling</strong> - Graceful degradation with user-friendly error messages
            </li>
            <li>
              <strong>API Abstraction</strong> - Service layer isolates external API dependencies
            </li>
            <li>
              <strong>Loading States</strong> - Animated indicators with minimum display times for UX
            </li>
            <li>
              <strong>Type Safety</strong> - Shared TypeScript types between frontend and backend
            </li>
            <li>
              <strong>Test Coverage</strong> - Unit tests for services, component tests for UI
            </li>
            <li>
              <strong>Architecture Decisions</strong> - LocalStorage first, documented for future scaling
            </li>
            <li>
              <strong>Chaos Engineering</strong> - Toggle random delays and errors to demonstrate resilience patterns
            </li>
          </ul>

          <ChaosToggle />
        </section>

        <section className="about-section">
          <h2>API Design</h2>
          <p>RESTful endpoints with clear resource naming:</p>
          <ul className="feature-list">
            <li><code>GET /v1/location/zip?zipCode=10001</code> - Geocoding service</li>
            <li><code>POST /v1/weather/should-i-bike</code> - Decision engine with preferences payload</li>
          </ul>
          <p>
            URI versioning strategy allows breaking changes while maintaining backward compatibility 
            during migration periods.
          </p>
        </section>

        <section className="about-section">
          <h2>Future Enhancements</h2>
          <ul className="feature-list">
            <li>User authentication with preference sync across devices</li>
            <li>Historical decision tracking and statistics</li>
            <li>Multi-day forecast with calendar integration</li>
            <li>Route planning with elevation and wind direction analysis</li>
            <li>Backend preference storage with shareable links</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
