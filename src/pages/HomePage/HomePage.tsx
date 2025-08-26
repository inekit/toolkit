import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '@/config/app';
import { SECTIONS } from '@/config/sections';
import Logo from '@/components/Logo/Logo';
import Search from '@/components/Search/Search';
import SEO from '@/components/SEO/SEO';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const categories = SECTIONS;
  const [showSearch, setShowSearch] = useState(false);

  const handleStartUsing = () => {
    setShowSearch(true);
    // Прокручиваем к поиску
    setTimeout(() => {
      const searchElement = document.getElementById('homepage-search');
      if (searchElement) {
        searchElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 100);
  };

  const handleLearnMore = () => {
    // Прокручиваем к секции "О проекте"
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.homePage}>
      <SEO
        title="Главная страница"
        description="Бесплатные калькуляторы и конвертеры для решения бытовых задач. Ремонт, велосипеды, конвертеры валют и единиц измерения."
        keywords="калькуляторы, конвертеры, ремонт, велосипеды, бытовые задачи, бесплатные инструменты"
        type="website"
      />

      {/* Hero секция */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Полезные калькуляторы для
              <span className={styles.highlight}> решения задач</span>
            </h1>
            <p className={styles.heroDescription}>
              Бесплатные калькуляторы и конвертеры для решения бытовых задач.
              Ремонт, велосипеды, валюты, единицы измерения и многое другое.
            </p>
            <div className={styles.heroActions}>
              <button onClick={handleStartUsing} className="btn btn-primary">
                Начать использовать
              </button>
              <button onClick={handleLearnMore} className="btn btn-secondary">
                Узнать больше
              </button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroIcon}>
              <Logo size="large" />
              <div className={styles.decoration}></div>
              <div className={styles.decoration}></div>
              <div className={styles.decoration}></div>
              <div className={styles.decoration}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Поиск секция */}
      {showSearch && (
        <section id="homepage-search" className={styles.searchSection}>
          <div className="container">
            <div className={styles.searchHeader}>
              <h2>🔍 Найдите нужный калькулятор</h2>
              <p>Поиск по всем категориям и инструментам</p>
            </div>
            <div className={styles.searchWrapper}>
              <Search
                variant="page"
                placeholder="Поиск калькуляторов и конвертеров..."
              />
            </div>
          </div>
        </section>
      )}

      {/* Бизнес секция */}
      <section className={styles.businessSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>🚀 Для бизнеса и разработчиков</h2>
            <p>
              Встраивайте наши калькуляторы и конвертеры на свои сайты.
              Бесплатно для некоммерческого использования, с возможностью
              заказать индивидуальные решения под ваши задачи. Улучшите
              конверсию с помощью полезных инструментов.
            </p>
          </div>
          <div className={styles.businessFeatures}>
            <div className={styles.businessFeature}>
              <span className={styles.icon}>📱</span>
              <div>
                <h3>Встраивание виджетов</h3>
                <p>Простой iframe код для любого сайта</p>
              </div>
            </div>
            <div className={styles.businessFeature}>
              <span className={styles.icon}>💼</span>
              <div>
                <h3>Индивидуальная разработка</h3>
                <p>Закажите калькулятор под ваши задачи</p>
              </div>
            </div>
            <div className={styles.businessFeature}>
              <span className={styles.icon}>🎯</span>
              <div>
                <h3>SEO оптимизация</h3>
                <p>Улучшите конверсию вашего сайта</p>
              </div>
            </div>
          </div>
          <div className={styles.businessActions}>
            <button
              className={styles.contactBtn}
              onClick={() =>
                window.open(
                  `mailto:${APP_CONFIG.email}?subject=Заказ калькулятора`,
                  '_blank'
                )
              }
            >
              Заказать разработку
            </button>
            <Link to="/terms" className={styles.termsLink}>
              Условия использования
            </Link>
          </div>
        </div>
      </section>

      {/* Информация о проекте */}
      <section id="about-section" className={styles.projectInfo}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>💝 О проекте</h2>
            <p>
              <strong>{APP_CONFIG.name}</strong> - некоммерческий проект,
              созданный для помощи людям в решении повседневных задач. Мы
              предоставляем калькуляторы для ремонта, велосипедов, а также
              конвертеры валют, единиц измерения и другие полезные инструменты.
            </p>
          </div>
          <div className={styles.projectStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {categories
                  .map((category) => category.calculators.length)
                  .reduce((a, b) => a + b, 0)}
                +
              </span>
              <span className={styles.statLabel}>Калькуляторов</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5+</span>
              <span className={styles.statLabel}>Конвертеров</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Бесплатно</span>
            </div>
          </div>
          <div className={styles.supportSection}>
            <h3>Поддержите развитие проекта</h3>
            <p>
              Если наш сервис помог вам, рассмотрите возможность доната. Также
              можете заказать индивидуальную разработку под ваши задачи.
            </p>
            <div className={styles.supportActions}>
              <button
                className={styles.donateBtn}
                onClick={() =>
                  document
                    .querySelector('.donate-widget')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                💝 Поддержать проект
              </button>
              <a
                href={`mailto:${APP_CONFIG.email}?subject=Заказ проекта`}
                className={styles.orderBtn}
              >
                📋 Заказать проект
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className={styles.categories}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Выберите категорию</h2>
            <p>Найдите нужный инструмент для вашей задачи</p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <div
                  className={styles.categoryIcon}
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <ul className={styles.calculatorsList}>
                  {category.calculators.map((calc) => (
                    <li key={calc.id}>{calc.title}</li>
                  ))}
                </ul>
                <Link
                  to={`/${category.id}`}
                  className={styles.categoryButton}
                  style={{ borderColor: category.color, color: category.color }}
                >
                  Перейти к калькуляторам
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Почему выбирают нас</h2>
            <p>Наши преимущества перед конкурентами</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Точность расчетов</h3>
              <p>
                Все формулы проверены профессионалами и дают точные результаты
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Адаптивный дизайн</h3>
              <p>
                Работает на всех устройствах: компьютеры, планшеты, телефоны
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Быстрая работа</h3>
              <p>Мгновенные расчеты без задержек и перезагрузок страницы</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Безопасность</h3>
              <p>Все расчеты происходят локально, ваши данные не передаются</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Готовы начать?</h2>
            <p>Найдите нужный калькулятор и решите свою задачу прямо сейчас</p>
            <div className={styles.ctaActions}>
              <button onClick={handleStartUsing} className="btn btn-primary">
                Начать использовать
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
