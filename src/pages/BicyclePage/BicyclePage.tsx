import React from 'react';
import { Link } from 'react-router-dom';
import { SECTIONS } from '@/config/sections';
import Search from '@/components/Search/Search';
import BookmarkWidget from '@/components/BookmarkWidget/BookmarkWidget';
import SEO from '@/components/SEO/SEO';
import styles from './BicyclePage.module.scss';

const BicyclePage: React.FC = () => {
  const bicycleSection = SECTIONS.find((section) => section.id === 'bicycle');

  if (!bicycleSection) {
    return <div>Раздел не найден</div>;
  }

  return (
    <div className={styles.bicyclePage}>
      <SEO
        section="Велосипеды"
        description="Калькуляторы для велосипедов: расчет передач, мощности, маршрутов и других велосипедных параметров"
        keywords="велосипед, передачи, мощность, маршрут, калькулятор велосипеда"
        type="website"
      />

      <div className="container">
        <div className={styles.header}>
          <h1>{bicycleSection.title}</h1>
          <p>{bicycleSection.description}</p>
        </div>

        <Search
          variant="page"
          placeholder="Поиск велосипедных калькуляторов..."
        />

        <BookmarkWidget variant="page" />

        <div className={styles.calculators}>
          {bicycleSection.calculators.map((calculator) => (
            <div key={calculator.id} className="card">
              <div className={styles.calculatorHeader}>
                <span className={styles.calculatorIcon}>{calculator.icon}</span>
                <h3>{calculator.title}</h3>
              </div>
              <p>{calculator.description}</p>
              <div className={styles.calculatorMeta}>
                <span
                  className={`${styles.difficulty} ${
                    styles[calculator.difficulty]
                  }`}
                >
                  {calculator.difficulty === 'easy'
                    ? 'Легко'
                    : calculator.difficulty === 'medium'
                    ? 'Средне'
                    : 'Сложно'}
                </span>
                <Link
                  to={`/${bicycleSection.id}/${calculator.id}`}
                  className="btn btn-primary"
                >
                  Открыть калькулятор
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BicyclePage;
