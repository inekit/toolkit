import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DonateWidget from '@/components/DonateWidget/DonateWidget';
import Logo from '@/components/Logo/Logo';
import HeaderDropdown from '@/components/Header/HeaderDropdown';
import Search from '@/components/Search/Search';
import { APP_CONFIG } from '@/config/app';
import { SECTIONS } from '@/config/sections';
import styles from './Header.module.scss';
import { isMobile } from 'react-device-detect';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [ableToOpenDropdown, setAbleToOpenDropdown] = useState(true);

  useEffect(() => {
    setAbleToOpenDropdown(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          to="/"
          className={styles.logo}
          title="Перейти на главную страницу"
          aria-label="Перейти на главную страницу"
        >
          <Logo size="medium" className={styles.logoIcon} />
          <span className={styles.logoText}>{APP_CONFIG.name}</span>
        </Link>

        <nav
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
          aria-label="Главная навигация"
          role="navigation"
        >
          <Link
            to="/"
            className={`${styles.navLink} ${
              isActive('/') ? styles.active : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
            title="Перейти на главную страницу"
            aria-label="Главная страница"
          >
            Главная
          </Link>
          {SECTIONS.map((item) => (
            <div key={item.path} className={styles.navItem}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${
                  isActive(item.path) ? styles.active : ''
                }`}
                onMouseEnter={() => !isMobile && setAbleToOpenDropdown(true)}
                onClick={() => setIsMenuOpen(false)}
                title={`Перейти к ${item.title.toLowerCase()}`}
                aria-label={`Калькуляторы для ${item.title.toLowerCase()}`}
                aria-expanded={isActive(item.path)}
              >
                {item.shortTitle}
              </Link>
              {!isMobile && ableToOpenDropdown ? (
                <HeaderDropdown
                  section={SECTIONS.find((s) => s.id === item.id)!}
                  isOpen={true}
                  onClose={() => {}}
                />
              ) : (
                <></>
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
