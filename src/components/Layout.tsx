import { Link } from '@tanstack/react-router';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <nav className="nav-bar">
        <div className="nav-content">
          <Link to="/" className="nav-link" activeProps={{ className: 'active' }}>
            Home
          </Link>
          <Link to="/about" className="nav-link" activeProps={{ className: 'active' }}>
            About
          </Link>
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
