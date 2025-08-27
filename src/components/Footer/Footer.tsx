import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '@/config/app';
import Logo from '@/components/Logo/Logo';
import styles from './Footer.module.scss';
import { useLocation } from 'react-router-dom';
import { SECTIONS } from '@/config/sections';

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
            <nav aria-label="Навигация по категориям">
              <ul>
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <Link
                      to={section.path}
                      title={`Перейти к ${section.title.toLowerCase()}`}
                      aria-label={`Калькуляторы для ${section.title.toLowerCase()}`}
                    >
                      {section.icon} {section.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className={styles.footerSection}>
            <h3>Поддержать проект</h3>
            <ul>
              <li>
                <a
                  href={`mailto:${APP_CONFIG.email}?subject=Поддержка проекта`}
                  title="Связаться для поддержки проекта"
                  aria-label="Отправить email для поддержки проекта"
                >
                  Сделать донат
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${APP_CONFIG.email}?subject=Заказ проекта`}
                  title="Заказать разработку проекта"
                  aria-label="Отправить email для заказа проекта"
                >
                  Заказать проект
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Контакты</h3>
            <ul>
              <li>
                <a
                  href={`mailto:${APP_CONFIG.email}`}
                  title="Написать на email"
                  aria-label={`Отправить email на ${APP_CONFIG.email}`}
                >
                  {APP_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={APP_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Открыть GitHub профиль"
                  aria-label="Перейти на GitHub профиль проекта"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={APP_CONFIG.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Написать в Telegram"
                  aria-label="Связаться через Telegram"
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
            <Link
              to="/terms"
              title="Условия использования сайта"
              aria-label="Прочитать условия использования"
            >
              Условия использования
            </Link>
            <Link
              to="/privacy"
              title="Политика конфиденциальности"
              aria-label="Прочитать политику конфиденциальности"
            >
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
