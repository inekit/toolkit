import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SECTIONS } from '@/config/sections';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import styles from './EmbedCalculator.module.scss';

const EmbedCalculator: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').slice(1);
  const sectionId = pathParts[1];
  const calculatorId = pathParts[2];

  const [calculator, setCalculator] = useState<any>(null);
  const [section, setSection] = useState<any>(null);

  useEffect(() => {
    if (sectionId && calculatorId) {
      const currentSection = SECTIONS.find((s) => s.id === sectionId);
      if (currentSection) {
        const currentCalculator = currentSection.calculators.find(
          (c) => c.id === calculatorId
        );
        if (currentCalculator) {
          setSection(currentSection);
          setCalculator(currentCalculator);
        }
      }
    }
  }, [sectionId, calculatorId]);

  if (!calculator || !section) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Калькулятор не найден</h2>
          <p>Запрашиваемый калькулятор не существует или был удален.</p>
        </div>
      </div>
    );
  }

  const CalculatorComponent = calculator.component;

  return (
    <div className={styles.embedContainer}>
      <div className={styles.calculatorContent}>
        <ErrorBoundary>
          <CalculatorComponent />
        </ErrorBoundary>
        <div className={styles.embedFooter}>
          <p>
            Калькулятор предоставлен сервисом{' '}
            <a
              href="https://counterplus.ru"
              target="_blank"
              rel="noopener noreferrer"
            >
              Счетчик+
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmbedCalculator;
