import React, { useState } from 'react';
import styles from './DistanceCalculator.module.scss';

const DistanceCalculator: React.FC = () => {
  const [lat1, setLat1] = useState('');
  const [lon1, setLon1] = useState('');
  const [lat2, setLat2] = useState('');
  const [lon2, setLon2] = useState('');
  const [unit, setUnit] = useState('km');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateDistance = () => {
    setError('');

    // Проверяем ввод
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const lat1Num = parseFloat(lat1);
    const lon1Num = parseFloat(lon1);
    const lat2Num = parseFloat(lat2);
    const lon2Num = parseFloat(lon2);

    if (isNaN(lat1Num) || isNaN(lon1Num) || isNaN(lat2Num) || isNaN(lon2Num)) {
      setError('Пожалуйста, введите корректные числовые значения');
      return;
    }

    if (lat1Num < -90 || lat1Num > 90 || lat2Num < -90 || lat2Num > 90) {
      setError('Широта должна быть в диапазоне от -90 до 90 градусов');
      return;
    }

    if (lon1Num < -180 || lon1Num > 180 || lon2Num < -180 || lon2Num > 180) {
      setError('Долгота должна быть в диапазоне от -180 до 180 градусов');
      return;
    }

    // Формула гаверсинуса для расчета расстояния между двумя точками на сфере
    const R = unit === 'km' ? 6371 : unit === 'miles' ? 3959 : 6371000; // Радиус Земли
    const dLat = ((lat2Num - lat1Num) * Math.PI) / 180;
    const dLon = ((lon2Num - lon1Num) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1Num * Math.PI) / 180) *
        Math.cos((lat2Num * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    setResult(distance);
  };

  const clearForm = () => {
    setLat1('');
    setLon1('');
    setLat2('');
    setLon2('');
    setResult(null);
    setError('');
  };

  const getUnitLabel = () => {
    switch (unit) {
      case 'km':
        return 'километров';
      case 'miles':
        return 'миль';
      case 'm':
        return 'метров';
      default:
        return 'километров';
    }
  };

  return (
    <div className={`${styles.calculator} coordinatesCalculator`}>
      <div className="calculatorHeader">
        <h2>🌍 Расстояние между координатами</h2>
        <p>
          Рассчитайте расстояние между двумя точками на Земле по их
          географическим координатам. Используется формула гаверсинуса для
          точного расчета на сферической поверхности.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateDistance();
        }}
      >
        <div className="inputGroup">
          <label>Первая точка</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="lat1">Широта (от -90 до 90)</label>
              <input
                id="lat1"
                type="number"
                value={lat1}
                onChange={(e) => setLat1(e.target.value)}
                placeholder="Например: 55.7558"
                step="any"
                min="-90"
                max="90"
              />
            </div>
            <div>
              <label htmlFor="lon1">Долгота (от -180 до 180)</label>
              <input
                id="lon1"
                type="number"
                value={lon1}
                onChange={(e) => setLon1(e.target.value)}
                placeholder="Например: 37.6176"
                step="any"
                min="-180"
                max="180"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Вторая точка</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="lat2">Широта (от -90 до 90)</label>
              <input
                id="lat2"
                type="number"
                value={lat2}
                onChange={(e) => setLat2(e.target.value)}
                placeholder="Например: 59.9311"
                step="any"
                min="-90"
                max="90"
              />
            </div>
            <div>
              <label htmlFor="lon2">Долгота (от -180 до 180)</label>
              <input
                id="lon2"
                type="number"
                value={lon2}
                onChange={(e) => setLon2(e.target.value)}
                placeholder="Например: 30.3609"
                step="any"
                min="-180"
                max="180"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="unit">Единица измерения</label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="km">Километры</option>
            <option value="miles">Мили</option>
            <option value="m">Метры</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать расстояние
          </button>
        </div>
      </form>

      {result !== null && (
        <div className="result">
          <h3>Результат расчета</h3>
          <div className="resultValue">
            <span className="amount">{result.toFixed(2)}</span>
            <span className="unit">{getUnitLabel()}</span>
          </div>
          <p className="recommendation">
            <strong>Совет:</strong> Для более точных результатов используйте
            координаты с большим количеством знаков после запятой.
          </p>
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

export default DistanceCalculator;
