import React from 'react';
import { APP_CONFIG } from '@/config/app';
import Logo from '@/components/Logo/Logo';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.brand}>
              <Logo size="large" className={styles.logoIcon} />
              <span className={styles.brandText}>{APP_CONFIG.name}</span>
            </div>
            <p className={styles.description}>
              Бесплатные калькуляторы и конвертеры для решения бытовых задач.
              Ремонт, велосипеды, валюты, единицы измерения и многое другое.
            </p>
          </div>

          <div className={styles.center}>
            <h4>Категории</h4>
            <ul className={styles.links}>
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

          <div className={styles.right}>
            <h4>Поддержать проект</h4>
            <p>Если вам нравится проект, поддержите его развитие</p>
            <div className={styles.social}>
              <a
                href={APP_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span className={styles.socialIcon}>📱</span>
                GitHub
              </a>
              <a
                href={APP_CONFIG.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span className={styles.socialIcon}>💬</span>
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {currentYear} {APP_CONFIG.name}. Все права защищены.
          </div>
          <div className={styles.bottomLinks}>
            <a href="/terms">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
