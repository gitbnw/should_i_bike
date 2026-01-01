import { Link } from '@tanstack/react-router';
import { ChaosStatusIndicator } from './ChaosStatusIndicator';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="nav-links">
            <Link to="/" className="nav-link" activeProps={{ className: 'active' }}>
              Home
            </Link>
            <Link to="/about" className="nav-link" activeProps={{ className: 'active' }}>
              About
            </Link>
          </div>
          <ChaosStatusIndicator />
        </div>
      </nav>
      {children}
      <footer className="app-footer">
        <p className="footer-author">
          Built by Byron Weiss as a portfolio project demonstrating full-stack development skills.
        </p>
        <p>
          Icons and animations created by{' '}
          <a href="https://www.flaticon.com/" 
             target="_blank" 
             rel="noopener noreferrer">
            Freepik - Flaticon
          </a>
        </p>
      </footer>
    </>
  );
}
