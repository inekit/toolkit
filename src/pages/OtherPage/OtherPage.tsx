import React from 'react';
import { Link } from 'react-router-dom';
import { SECTIONS } from '@/config/sections';
import Search from '@/components/Search/Search';
import BookmarkWidget from '@/components/BookmarkWidget/BookmarkWidget';
import SEO from '@/components/SEO/SEO';
import styles from './OtherPage.module.scss';

const OtherPage: React.FC = () => {
  const otherSection = SECTIONS.find((section) => section.id === 'other');

  if (!otherSection) {
    return <div>Раздел не найден</div>;
  }

  return (
    <div className={styles.otherPage}>
      <SEO
        section="Калькуляторы и конвертеры"
        description="Различные калькуляторы и конвертеры: валюты, единицы измерения, финансы, здоровье и другие полезные инструменты"
        keywords="конвертеры, валюты, единицы измерения, финансы, здоровье, калькуляторы"
        type="website"
      />

      <div className="container">
        <div className={styles.header}>
          <h1>{otherSection.title}</h1>
          <p>{otherSection.description}</p>
        </div>

        <Search
          variant="page"
          placeholder="Поиск калькуляторов и конвертеров..."
        />

        <BookmarkWidget variant="page" />

        <div className={styles.calculators}>
          {otherSection.calculators.map((calculator) => (
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
                  to={`/${otherSection.id}/${calculator.id}`}
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

export default OtherPage;
