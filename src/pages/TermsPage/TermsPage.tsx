import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '@/config/app';
import Logo from '@/components/Logo/Logo';
import SEO from '@/components/SEO/SEO';
import styles from './TermsPage.module.scss';

const TermsPage: React.FC = () => {
  return (
    <div className={styles.termsPage}>
      <SEO
        title="Условия использования"
        description="Условия использования сервиса Счетчик+. Информация о бесплатном использовании, конфиденциальности и встраивании виджетов."
        keywords="условия использования, политика конфиденциальности, встраивание виджетов, бесплатный сервис"
        type="website"
      />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <Logo size="large" />
            <h1>Условия использования</h1>
          </div>
          <p className={styles.subtitle}>
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>📋 Общие положения</h2>
            <p>
              Сервис "{APP_CONFIG.name}" предоставляет бесплатные калькуляторы и
              инструменты для решения различных бытовых задач. Используя наш
              сервис, вы соглашаетесь с настоящими условиями использования.
            </p>
          </section>

          <section className={styles.section}>
            <h2>🆓 Бесплатное использование</h2>
            <p>
              <strong>Сервис является условно бесплатным</strong> и
              предоставляет доступ к калькуляторам без необходимости регистрации
              или оплаты. Все основные функции доступны бесплатно для всех
              пользователей.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.icon}>✅</span>
                <span>Без регистрации</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.icon}>✅</span>
                <span>Без ограничений</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.icon}>✅</span>
                <span>Без рекламы</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>🔒 Конфиденциальность и данные</h2>
            <p>
              <strong>Мы не храним ваши персональные данные.</strong> Все
              расчеты выполняются локально в вашем браузере. Мы не собираем, не
              анализируем и не передаем третьим лицам информацию о ваших
              расчетах.
            </p>
            <div className={styles.privacyFeatures}>
              <div className={styles.privacyFeature}>
                <span className={styles.icon}>🛡️</span>
                <div>
                  <strong>Локальные вычисления</strong>
                  <p>Все расчеты происходят в вашем браузере</p>
                </div>
              </div>
              <div className={styles.privacyFeature}>
                <span className={styles.icon}>🚫</span>
                <div>
                  <strong>Нет отслеживания</strong>
                  <p>Мы не используем cookies для отслеживания</p>
                </div>
              </div>
              <div className={styles.privacyFeature}>
                <span className={styles.icon}>🔐</span>
                <div>
                  <strong>Безопасность</strong>
                  <p>Ваши данные никогда не покидают ваш компьютер</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>📱 Встраивание виджетов</h2>
            <p>
              Вы можете встраивать наши калькуляторы на свои сайты, используя
              предоставленный код. Встраивание доступно бесплатно, но мы
              оставляем за собой право:
            </p>
            <ul className={styles.rightsList}>
              <li>Отключить бесплатные виджеты в любое время</li>
              <li>Перевести сервис на платную модель</li>
              <li>Ограничить функциональность бесплатных версий</li>
              <li>Ввести лимиты на количество запросов</li>
            </ul>
            <div className={styles.notice}>
              <span className={styles.icon}>⚠️</span>
              <p>
                <strong>Важно:</strong> Если вы используете наши виджеты в
                коммерческих проектах, рекомендуем рассмотреть возможность
                доната для поддержки развития сервиса.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>💝 Поддержка проекта</h2>
            <p>
              Если наш сервис помог вам решить задачи и вы хотите поддержать его
              развитие, мы будем благодарны за любую помощь:
            </p>
            <div className={styles.supportOptions}>
              <div className={styles.supportOption}>
                <span className={styles.icon}>💳</span>
                <div>
                  <strong>Донат</strong>
                  <p>Поддержите развитие сервиса любой суммой</p>
                  <Link
                    to="/"
                    className={styles.donateBtn}
                    title="Перейти на страницу поддержки проекта"
                    aria-label="Перейти на страницу поддержки проекта"
                  >
                    Поддержать проект
                  </Link>
                </div>
              </div>
              <div className={styles.supportOption}>
                <span className={styles.icon}>⭐</span>
                <div>
                  <strong>Оценка</strong>
                  <p>Оставьте отзыв и поделитесь с друзьями</p>
                </div>
              </div>
              <div className={styles.supportOption}>
                <span className={styles.icon}>🐛</span>
                <div>
                  <strong>Обратная связь</strong>
                  <p>Сообщите об ошибках или предложите улучшения</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>📞 Контакты</h2>
            <p>
              По всем вопросам, связанным с условиями использования, обращайтесь
              к нам:
            </p>
            <div className={styles.contacts}>
              <div className={styles.contact}>
                <span className={styles.icon}>📧</span>
                <a href={`mailto:${APP_CONFIG.email}`}>{APP_CONFIG.email}</a>
              </div>
              <div className={styles.contact}>
                <span className={styles.icon}>💬</span>
                <a
                  href={APP_CONFIG.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </div>
              <div className={styles.contact}>
                <span className={styles.icon}>🐙</span>
                <a
                  href={APP_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>📝 Изменения условий</h2>
            <p>
              Мы оставляем за собой право изменять настоящие условия
              использования в любое время. О значительных изменениях мы будем
              уведомлять пользователей через обновления на сайте.
            </p>
            <div className={styles.backToHome}>
              <Link
                to="/"
                className={styles.homeBtn}
                title="Перейти на главную страницу"
                aria-label="Перейти на главную страницу"
              >
                ← Вернуться на главную
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
