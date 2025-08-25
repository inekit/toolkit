import React from 'react';
import { Link } from 'react-router-dom';
import { SECTIONS } from '@/config/sections';
import Search from '@/components/Search/Search';
import BookmarkWidget from '@/components/BookmarkWidget/BookmarkWidget';
import SEO from '@/components/SEO/SEO';
import styles from './RepairPage.module.scss';

const RepairPage: React.FC = () => {
  const repairSection = SECTIONS.find((section) => section.id === 'repair');

  if (!repairSection) {
    return <div>Раздел не найден</div>;
  }

  return (
    <div className={styles.repairPage}>
      <SEO
        section="Ремонт"
        description="Калькуляторы для ремонта: расчет краски, плитки, стоимости материалов и других ремонтных работ"
        keywords="ремонт, краска, плитка, калькулятор ремонта, строительные материалы"
        type="website"
      />

      <div className="container">
        <div className={styles.header}>
          <h1>{repairSection.title}</h1>
          <p>{repairSection.description}</p>
        </div>

        <Search variant="page" placeholder="Поиск калькуляторов ремонта..." />

        <BookmarkWidget variant="page" />

        <div className={styles.calculators}>
          {repairSection.calculators.map((calculator) => (
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
                  to={`/${repairSection.id}/${calculator.id}`}
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

export default RepairPage;
