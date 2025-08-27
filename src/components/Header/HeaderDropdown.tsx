import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/config/sections';
import styles from './HeaderDropdown.module.scss';

interface HeaderDropdownProps {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  section,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdown} onMouseLeave={onClose}>
      <div className={styles.dropdownTouch}></div>
      <div className={styles.dropdownContent}>
        <div className={styles.sectionHeader}>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </div>

        <div className={styles.calculatorsList} role="list">
          {section.calculators.slice(0, 6).map((calculator) => (
            <Link
              key={calculator.id}
              to={`/${section.id}/${calculator.id}`}
              className={styles.calculatorItem}
              onClick={onClose}
              title={`Открыть ${calculator.title}`}
              aria-label={`Калькулятор: ${calculator.title}. ${
                calculator.description
              }. Сложность: ${
                calculator.difficulty === 'easy'
                  ? 'Легко'
                  : calculator.difficulty === 'medium'
                  ? 'Средне'
                  : 'Сложно'
              }`}
              role="listitem"
            >
              <span className={styles.calculatorIcon} aria-hidden="true">
                {calculator.icon}
              </span>
              <div className={styles.calculatorInfo}>
                <span className={styles.calculatorTitle}>
                  {calculator.title}
                </span>
                <span className={styles.calculatorDescription}>
                  {calculator.description}
                </span>
              </div>
              <span
                className={`${styles.difficulty} ${
                  styles[calculator.difficulty]
                }`}
                aria-label={`Сложность: ${
                  calculator.difficulty === 'easy'
                    ? 'Легко'
                    : calculator.difficulty === 'medium'
                    ? 'Средне'
                    : 'Сложно'
                }`}
              >
                {calculator.difficulty === 'easy'
                  ? 'Легко'
                  : calculator.difficulty === 'medium'
                  ? 'Средне'
                  : 'Сложно'}
              </span>
            </Link>
          ))}
        </div>

        <div className={styles.dropdownFooter}>
          <Link
            to={section.path}
            className={styles.viewAllLink}
            title={`Перейти к ${section.title.toLowerCase()}`}
            aria-label={`Показать все калькуляторы в разделе ${section.title.toLowerCase()}`}
          >
            Посмотреть все калькуляторы →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderDropdown;
