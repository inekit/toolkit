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
      <div className={styles.dropdownContent}>
        <div className={styles.sectionHeader}>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </div>

        <div className={styles.calculatorsList}>
          {section.calculators.map((calculator) => (
            <Link
              key={calculator.id}
              to={`/${section.id}/${calculator.id}`}
              className={styles.calculatorItem}
              onClick={onClose}
            >
              <span className={styles.calculatorIcon}>{calculator.icon}</span>
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
          <Link to={section.path} className={styles.viewAllLink}>
            Посмотреть все калькуляторы →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderDropdown;
