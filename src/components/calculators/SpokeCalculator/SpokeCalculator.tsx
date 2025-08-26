import React, { useState } from 'react';
import styles from './SpokeCalculator.module.scss';

const SpokeCalculator: React.FC = () => {
  const [spokeCount, setSpokeCount] = useState('');
  const [crossPattern, setCrossPattern] = useState('3');
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState('');

  const calculateSpokePattern = () => {
    setError('');

    if (!spokeCount) {
      setError('Пожалуйста, введите количество спиц');
      return;
    }

    const count = parseInt(spokeCount);
    if (isNaN(count) || count < 12 || count > 48) {
      setError('Количество спиц должно быть от 12 до 48');
      return;
    }

    if (count % 2 !== 0) {
      setError('Количество спиц должно быть четным числом');
      return;
    }

    const cross = parseInt(crossPattern);
    if (isNaN(cross) || cross < 1 || cross > 5) {
      setError('Неправильный паттерн перекрещивания');
      return;
    }

    // Генерируем паттерн спицевания
    const pattern: number[] = [];
    const halfSpokes = count / 2;

    for (let i = 0; i < count; i++) {
      let spokeNumber: number;

      if (i < halfSpokes) {
        // Левая сторона (ведущая)
        spokeNumber = i + 1;
      } else {
        // Правая сторона (ведомая)
        const rightIndex = i - halfSpokes;
        spokeNumber = rightIndex + 1;
      }

      pattern.push(spokeNumber);
    }

    setResult(pattern);
  };

  const clearForm = () => {
    setSpokeCount('');
    setCrossPattern('3');
    setResult(null);
    setError('');
  };

  const getCrossDescription = (cross: string) => {
    switch (cross) {
      case '1':
        return '1x (один крест) - для трековых велосипедов';
      case '2':
        return '2x (два креста) - для шоссейных велосипедов';
      case '3':
        return '3x (три креста) - стандартный паттерн';
      case '4':
        return '4x (четыре креста) - для горных велосипедов';
      case '5':
        return '5x (пять крестов) - для тяжелых условий';
      default:
        return '';
    }
  };

  const getSpokeLength = (spokeCount: number, crossPattern: number) => {
    // Примерная формула для расчета длины спиц
    // В реальности нужно учитывать ERD обода, PCD втулки и другие параметры
    const baseLength = 260; // мм
    const crossAdjustment = crossPattern * 2;
    const countAdjustment = (spokeCount - 32) * 0.5;

    return Math.round(baseLength + crossAdjustment + countAdjustment);
  };

  return (
    <div className={`${styles.calculator} spokeCalculator`}>
      <div className="calculatorHeader">
        <h2>🚴 Калькулятор спицевания</h2>
        <p>
          Рассчитайте паттерн спицевания для велосипедного колеса. Определите
          порядок установки спиц и примерную длину.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateSpokePattern();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="spokeCount">Количество спиц</label>
          <input
            id="spokeCount"
            type="number"
            value={spokeCount}
            onChange={(e) => setSpokeCount(e.target.value)}
            placeholder="Например: 32"
            min="12"
            max="48"
            step="2"
          />
          <div className="help">Обычно используется 28, 32, 36 или 48 спиц</div>
        </div>

        <div className="inputGroup">
          <label htmlFor="crossPattern">Паттерн перекрещивания</label>
          <select
            id="crossPattern"
            value={crossPattern}
            onChange={(e) => setCrossPattern(e.target.value)}
          >
            <option value="1">1x (один крест)</option>
            <option value="2">2x (два креста)</option>
            <option value="3">3x (три креста)</option>
            <option value="4">4x (четыре креста)</option>
            <option value="5">5x (пять крестов)</option>
          </select>
          <div className="help">{getCrossDescription(crossPattern)}</div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать паттерн
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Паттерн спицевания</h3>
          <div className="resultValue">
            <span className="amount">{spokeCount}</span>
            <span className="unit">спиц</span>
          </div>

          <div className="spokePattern">
            <h4>Порядок установки спиц:</h4>
            <div className="pattern">
              {result.map((spoke, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    margin: '0 0.25rem',
                    padding: '0.25rem 0.5rem',
                    background:
                      index < parseInt(spokeCount) / 2
                        ? 'var(--primary-100)'
                        : 'var(--accent-100)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  {spoke}
                </span>
              ))}
            </div>
            <p
              style={{
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: 'var(--gray-600)',
              }}
            >
              <span style={{ color: 'var(--primary-600)' }}>🔵</span> - левая
              сторона (ведущая),
              <span style={{ color: 'var(--accent-600)' }}>🟡</span> - правая
              сторона (ведомая)
            </p>
          </div>

          <div className="recommendation">
            <strong>Примерная длина спиц:</strong>{' '}
            {getSpokeLength(parseInt(spokeCount), parseInt(crossPattern))} мм
            <br />
            <strong>Примечание:</strong> Для точного расчета длины спиц
            используйте специальные калькуляторы с учетом ERD обода и PCD
            втулки.
          </div>
        </div>
      )}

      <div className="inputGroup" style={{ marginTop: '2rem' }}>
        <button
          type="button"
          onClick={clearForm}
          className="calculateBtn"
          style={{ background: 'var(--gray-500)' }}
        >
          Очистить форму
        </button>
      </div>
    </div>
  );
};

export default SpokeCalculator;
