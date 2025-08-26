import React from 'react';
import { APP_CONFIG } from '@/config/app';
import Logo from '@/components/Logo/Logo';
import styles from './Footer.module.scss';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  return (
    <footer
      className={`${styles.footer} ${
        location.pathname === '/' ? styles.home : ''
      }`}
    >
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerBrand}>
              <Logo size="medium" className={styles.logoIcon} />
              <span className={styles.logoText}>{APP_CONFIG.name}</span>
            </div>
            <p className={styles.description}>
              Бесплатные калькуляторы и конвертеры для решения бытовых задач.
              Ремонт, велосипеды, валюты, единицы измерения и многое другое.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3>Категории</h3>
            <ul>
              <li>
                <a href="/repair">Ремонт</a>
              </li>
              <li>
                <a href="/bicycle">Велосипед</a>
              </li>
              <li>
                <a href="/other">Другое</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Поддержать проект</h3>
            <ul>
              <li>
                <a
                  href={`mailto:${APP_CONFIG.email}?subject=Поддержка проекта`}
                >
                  Сделать донат
                </a>
              </li>
              <li>
                <a href={`mailto:${APP_CONFIG.email}?subject=Заказ проекта`}>
                  Заказать проект
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Контакты</h3>
            <ul>
              <li>
                <a href={`mailto:${APP_CONFIG.email}`}>{APP_CONFIG.email}</a>
              </li>
              <li>
                <a
                  href={APP_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={APP_CONFIG.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            © {currentYear} {APP_CONFIG.name}. Все права защищены.
          </div>
          <div className={styles.links}>
            <a href="/terms">Условия использования</a>
            <a href="/privacy">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
