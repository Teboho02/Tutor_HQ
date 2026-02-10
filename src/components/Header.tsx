import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavigationLink } from '../types';
import './Header.css';

interface HeaderProps {
    variant?: 'default' | 'dark' | 'transparent';
    navigationLinks?: NavigationLink[];
}

const Header: React.FC<HeaderProps> = ({
    variant = 'default',
    navigationLinks = []
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Default navigation links if none provided
    const defaultLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/main' },
        { label: 'Tutoring', href: '/tutoring' },
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Live Classes', href: '/live-classes' },
    ];

    const links = navigationLinks.length > 0 ? navigationLinks : defaultLinks;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        closeMenu();

        // Handle anchor links
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const headerClasses = `header ${variant} ${isScrolled ? 'scrolled' : ''}`;

    return (
        <header className={headerClasses}>
            <nav className="nav container">
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>
                        <img
                            src="/src/assets/logo-hq2.png"
                            alt="Tutor HQ"
                            className="logo-image"
                        />
                    </Link>
                </div>

                <ul className={`nav-links ${isMenuOpen ? 'nav-links--open' : ''}`}>
                    {links.map((link, index) => (
                        <li key={index} className="nav-links__item">
                            {link.external ? (
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`nav-links__link ${location.pathname === link.href ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </a>
                            ) : link.href.startsWith('#') ? (
                                <a
                                    href={link.href}
                                    className="nav-links__link"
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    to={link.href}
                                    className={`nav-links__link ${location.pathname === link.href ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="auth-buttons">
                    <Link to="/login" className="btn btn-outline">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-primary">
                        Get Started
                    </Link>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={toggleMenu}
                    aria-label="Toggle mobile menu"
                >
                    <span className={`hamburger ${isMenuOpen ? 'hamburger--open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </nav>
        </header>
    );
};

export default Header;