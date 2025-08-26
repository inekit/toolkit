import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SECTIONS } from '@/config/sections';
import Search from '@/components/Search/Search';
import BookmarkWidget from '@/components/BookmarkWidget/BookmarkWidget';
import SEO from '@/components/SEO/SEO';
import styles from './CategoryPage.module.scss';

const CategoryPage: React.FC = () => {
  const location = useLocation();

  const categoryId = location.pathname?.slice(1);

  const category = SECTIONS.find((section) => section.id === categoryId);

  if (!category) {
    return <div>Категория не найдена</div>;
  }

  // Генерируем SEO данные для категории
  const getCategorySEO = () => {
    const seoData = {
      repair: {
        title: 'Калькуляторы для ремонта',
        description:
          'Калькуляторы для ремонта: расчет краски, плитки, стоимости материалов и других ремонтных работ',
        keywords:
          'ремонт, краска, плитка, калькулятор ремонта, строительные материалы, ремонт квартиры',
      },
      bicycle: {
        title: 'Велосипедные калькуляторы',
        description:
          'Калькуляторы для велосипедов: расчет передач, каденса, скорости и других параметров',
        keywords:
          'велосипед, передачи, каденс, скорость, калькулятор велосипеда, велоспорт',
      },
      other: {
        title: 'Другие калькуляторы и конвертеры',
        description:
          'Различные калькуляторы и конвертеры: валюты, единицы измерения, математические расчеты',
        keywords:
          'калькуляторы, конвертеры, валюты, единицы измерения, математика, финансы',
      },
    };

    return (
      seoData[categoryId as keyof typeof seoData] || {
        title: `${category.title} - Калькуляторы`,
        description: category.description,
        keywords: `${category.title.toLowerCase()}, калькуляторы, ${category.description.toLowerCase()}`,
      }
    );
  };

  const seoData = getCategorySEO();

  return (
    <div className={styles.categoryPage}>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
        section={category.title}
      />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.categoryInfo}>
            <div
              className={styles.categoryIcon}
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </div>
            <div>
              <h1>{category.title}</h1>
              <p>{category.description}</p>
            </div>
          </div>
        </div>

        <Search
          variant="page"
          placeholder={`Поиск в ${category.title.toLowerCase()}...`}
          sectionId={categoryId}
        />

        <BookmarkWidget variant="page" />

        <div className={styles.calculators}>
          {category.calculators.map((calculator) => (
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
                  to={`/${category.id}/${calculator.id}`}
                  className="btn btn-primary"
                >
                  Открыть калькулятор
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.categoryStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {category.calculators.length}
            </span>
            <span className={styles.statLabel}>Калькуляторов</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {
                category.calculators.filter((c) => c.difficulty === 'easy')
                  .length
              }
            </span>
            <span className={styles.statLabel}>Легких</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {
                category.calculators.filter((c) => c.difficulty === 'medium')
                  .length
              }
            </span>
            <span className={styles.statLabel}>Средних</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {
                category.calculators.filter((c) => c.difficulty === 'hard')
                  .length
              }
            </span>
            <span className={styles.statLabel}>Сложных</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
