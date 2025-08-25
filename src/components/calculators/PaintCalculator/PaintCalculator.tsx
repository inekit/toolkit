import React, { useState, useEffect } from 'react';
import styles from './PaintCalculator.module.scss';

const PaintCalculator: React.FC = () => {
  const [wallArea, setWallArea] = useState('');
  const [coats, setCoats] = useState('2');
  const [paintCoverage, setPaintCoverage] = useState('10');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    console.log('PaintCalculator component loaded successfully!');
  }, []);

  const calculatePaint = () => {
    const area = parseFloat(wallArea);
    const coatsCount = parseInt(coats);
    const coverage = parseFloat(paintCoverage);

    if (area && coatsCount && coverage) {
      const totalPaint = (area * coatsCount) / coverage;
      setResult(Math.ceil(totalPaint * 100) / 100);
    }
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <h2>🎨 Расчет краски для стен</h2>
        <p>Определите необходимое количество краски для покраски стен</p>
      </div>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="wallArea">Площадь стен (м²)</label>
          <input
            id="wallArea"
            type="number"
            value={wallArea}
            onChange={(e) => setWallArea(e.target.value)}
            placeholder="Введите площадь стен"
            min="0"
            step="0.1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="coats">Количество слоев</label>
          <select
            id="coats"
            value={coats}
            onChange={(e) => setCoats(e.target.value)}
          >
            <option value="1">1 слой</option>
            <option value="2">2 слоя</option>
            <option value="3">3 слоя</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="paintCoverage">Расход краски (м²/л)</label>
          <input
            id="paintCoverage"
            type="number"
            value={paintCoverage}
            onChange={(e) => setPaintCoverage(e.target.value)}
            placeholder="Обычно 8-12 м²/л"
            min="1"
            step="0.1"
          />
        </div>

        <button
          className={styles.calculateBtn}
          onClick={calculatePaint}
          disabled={!wallArea}
        >
          Рассчитать
        </button>
      </div>

      {result !== null && (
        <div className={styles.result}>
          <h3>Результат:</h3>
          <div className={styles.resultValue}>
            <span className={styles.amount}>{result}</span>
            <span className={styles.unit}>литров краски</span>
          </div>
          <p className={styles.recommendation}>
            Рекомендуется взять с запасом:{' '}
            <strong>{Math.ceil(result * 1.1)} л</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default PaintCalculator;
