import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DonateWidget from '@/components/DonateWidget/DonateWidget';
import Logo from '@/components/Logo/Logo';
import HeaderDropdown from '@/components/Header/HeaderDropdown';
import Search from '@/components/Search/Search';
import { APP_CONFIG } from '@/config/app';
import { SECTIONS } from '@/config/sections';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navigation = SECTIONS.map((section) => ({
    path: section.path,
    label: section.title,
    id: section.id,
  }));

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Logo size="medium" className={styles.logoIcon} />
          <span className={styles.logoText}>{APP_CONFIG.name}</span>
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link
            to="/"
            className={`${styles.navLink} ${
              isActive('/') ? styles.active : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Главная
          </Link>
          {navigation.map((item) => (
            <div
              key={item.path}
              className={styles.navItem}
              onMouseEnter={() => setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.path}
                className={`${styles.navLink} ${
                  isActive(item.path) ? styles.active : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
              {activeDropdown === item.id && (
                <HeaderDropdown
                  section={SECTIONS.find((s) => s.id === item.id)!}
                  isOpen={true}
                  onClose={() => setActiveDropdown(null)}
                />
              )}
            </div>
          ))}
        </nav>

        <div className={styles.actions}>
          <Search variant="header" />

          <DonateWidget />

          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Открыть меню"
          >
            <svg
              className={styles.menuIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={styles.menuLine}
                d="M4 6H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.menuLine}
                d="M4 12H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.menuLine}
                d="M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
