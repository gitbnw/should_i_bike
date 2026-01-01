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
            This is a portfolio project built to demonstrate full-stack development skills and explore 
            production-ready patterns in a practical context.
          </p>
        </section>

        <section className="about-section">
          <h2>Technical Architecture</h2>
          
          <div className="tech-stack">
            <div className="stack-group">
              <h3>Frontend</h3>
              <ul>
                <li><strong>React 19</strong></li>
                <li><strong>TypeScript</strong></li>
                <li><strong>Vite</strong></li>
                <li><strong>Zustand</strong></li>
                <li><strong>TanStack Router</strong></li>
                <li><strong>Vitest + Testing Library</strong></li>
              </ul>
            </div>

            <div className="stack-group">
              <h3>Backend</h3>
              <ul>
                <li><strong>NestJS</strong> - Node.js framework</li>
                <li><strong>OpenWeatherMap API</strong> - Weather data and geocoding</li>
                <li><strong>Google Air Quality API</strong></li>
                <li><strong>Jest</strong> - Backend testing</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <ul className="feature-list">
            <li>
              <strong>Multi-step Form Flow</strong>
            </li>
            <li>
              <strong>Zip Code Geocoding</strong>
            </li>
            <li>
              <strong>Personalized Recommendations</strong>
            </li>
            <li>
              <strong>Local Preference Storage</strong>
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Production Patterns Demonstrated</h2>
          <ul className="feature-list">
            <li>
              <strong>Error Handling</strong>
            </li>
            <li>
              <strong>API Abstraction</strong>
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
              <strong>Chaos Engineering</strong> - Toggle random delays and errors to demonstrate error handling
            </li>
          </ul>

          <div className="chaos-toggle-container">
            <ChaosToggle />
          </div>
        </section>

        <section className="about-section">
          <h2>API Design</h2>
          <p>RESTful endpoints with clear resource naming:</p>
          <ul className="feature-list">
            <li><code>GET /v1/location/zip?zipCode=10001</code> - Geocoding service</li>
            <li><code>POST /v1/weather/should-i-bike</code> - Decision engine with preferences payload</li>
            <li><code>GET /v1/chaos/status</code> - Check if chaos mode is enabled</li>
            <li><code>PUT /v1/chaos/toggle</code> - Toggle chaos mode for error simulation</li>
          </ul>
          <p>
            URI versioning strategy allows breaking changes while maintaining backward compatibility 
            during migration periods.
          </p>
        </section>

      </div>
    </div>
  );
}
