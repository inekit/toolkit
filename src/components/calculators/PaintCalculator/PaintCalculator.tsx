import React, { useState } from 'react';
import styles from './PaintCalculator.module.scss';

const PaintCalculator: React.FC = () => {
  const [roomType, setRoomType] = useState('bedroom');
  const [wallHeight, setWallHeight] = useState('');
  const [wallLength, setWallLength] = useState('');
  const [wallWidth, setWallWidth] = useState('');
  const [windowsCount, setWindowsCount] = useState('0');
  const [doorsCount, setDoorsCount] = useState('0');
  const [coats, setCoats] = useState('2');
  const [paintType, setPaintType] = useState('water');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculatePaint = () => {
    setError('');

    if (!wallHeight || !wallLength || !wallWidth) {
      setError('Пожалуйста, заполните все размеры помещения');
      return;
    }

    const height = parseFloat(wallHeight);
    const length = parseFloat(wallLength);
    const width = parseFloat(wallWidth);
    const windows = parseInt(windowsCount);
    const doors = parseInt(doorsCount);
    const coatsCount = parseInt(coats);

    if (
      isNaN(height) ||
      isNaN(length) ||
      isNaN(width) ||
      height <= 0 ||
      length <= 0 ||
      width <= 0
    ) {
      setError('Размеры должны быть положительными числами');
      return;
    }

    // Площадь стен (периметр × высота)
    const perimeter = 2 * (length + width);
    const wallArea = perimeter * height;

    // Площадь проемов
    const windowArea = windows * 1.5; // Примерная площадь окна 1.5 м²
    const doorArea = doors * 2.1; // Примерная площадь двери 2.1 м²
    const openingsArea = windowArea + doorArea;

    // Площадь для покраски
    const paintArea = wallArea - openingsArea;

    if (paintArea <= 0) {
      setError('Площадь для покраски должна быть больше 0');
      return;
    }

    // Расход краски на м² (в литрах)
    const paintConsumption = getPaintConsumption(paintType);

    // Общий расход краски
    const totalPaint = (paintArea * paintConsumption * coatsCount) / 1000; // в литрах

    // Рекомендуемое количество банок
    const canSizes = getCanSizes(paintType);
    const recommendedCans = calculateRecommendedCans(totalPaint, canSizes);

    setResult({
      wallArea: wallArea.toFixed(2),
      openingsArea: openingsArea.toFixed(2),
      paintArea: paintArea.toFixed(2),
      totalPaint: totalPaint.toFixed(2),
      recommendedCans,
      paintType: getPaintTypeName(paintType),
      coatsCount,
    });
  };

  const getPaintConsumption = (type: string): number => {
    switch (type) {
      case 'water':
        return 0.25; // Водоэмульсионная
      case 'acrylic':
        return 0.2; // Акриловая
      case 'latex':
        return 0.15; // Латексная
      case 'oil':
        return 0.3; // Масляная
      case 'alkyd':
        return 0.25; // Алкидная
      default:
        return 0.25;
    }
  };

  const getPaintTypeName = (type: string): string => {
    switch (type) {
      case 'water':
        return 'Водоэмульсионная';
      case 'acrylic':
        return 'Акриловая';
      case 'latex':
        return 'Латексная';
      case 'oil':
        return 'Масляная';
      case 'alkyd':
        return 'Алкидная';
      default:
        return 'Водоэмульсионная';
    }
  };

  const getCanSizes = (type: string): number[] => {
    switch (type) {
      case 'water':
        return [0.9, 2.7, 9, 18]; // л
      case 'acrylic':
        return [0.9, 2.7, 9, 18];
      case 'latex':
        return [0.9, 2.7, 9, 18];
      case 'oil':
        return [0.5, 1, 2.5, 5]; // л
      case 'alkyd':
        return [0.5, 1, 2.5, 5];
      default:
        return [0.9, 2.7, 9, 18];
    }
  };

  const calculateRecommendedCans = (
    totalPaint: number,
    canSizes: number[]
  ): any[] => {
    const recommendations = [];
    let remainingPaint = totalPaint;

    // Сортируем размеры банок по убыванию
    const sortedSizes = [...canSizes].sort((a, b) => b - a);

    for (const size of sortedSizes) {
      if (remainingPaint >= size * 0.8) {
        // Покупаем банку, если нужно минимум 80% от неё
        const count = Math.ceil(remainingPaint / size);
        recommendations.push({
          size,
          count,
          volume: (size * count).toFixed(1),
        });
        remainingPaint = 0;
        break;
      }
    }

    // Если остались небольшие остатки, добавляем маленькую банку
    if (remainingPaint > 0) {
      const smallestCan = Math.min(...canSizes);
      recommendations.push({
        size: smallestCan,
        count: 1,
        volume: smallestCan.toFixed(1),
        note: 'Для небольших подкрасок',
      });
    }

    return recommendations;
  };

  const clearForm = () => {
    setRoomType('bedroom');
    setWallHeight('');
    setWallLength('');
    setWallWidth('');
    setWindowsCount('0');
    setDoorsCount('0');
    setCoats('2');
    setPaintType('water');
    setResult(null);
    setError('');
  };

  const getRoomTypeName = (type: string): string => {
    switch (type) {
      case 'bedroom':
        return 'Спальня';
      case 'living':
        return 'Гостиная';
      case 'kitchen':
        return 'Кухня';
      case 'bathroom':
        return 'Ванная';
      case 'hallway':
        return 'Прихожая';
      case 'office':
        return 'Кабинет';
      default:
        return 'Помещение';
    }
  };

  return (
    <div className={`${styles.calculator} paintCalculator`}>
      <div className="calculatorHeader">
        <h2>🎨 Калькулятор краски для стен</h2>
        <p>
          Рассчитайте необходимое количество краски для покраски стен.
          Учитываются размеры помещения, проемы и тип краски.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculatePaint();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="roomType">Тип помещения</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="bedroom">🛏️ Спальня</option>
            <option value="living">🛋️ Гостиная</option>
            <option value="kitchen">🍳 Кухня</option>
            <option value="bathroom">🚿 Ванная</option>
            <option value="hallway">🚪 Прихожая</option>
            <option value="office">💼 Кабинет</option>
          </select>
          <div className="help">
            {getRoomTypeName(roomType)} - выберите тип помещения для более
            точного расчета
          </div>
        </div>

        <div className="inputGroup">
          <label>Размеры помещения</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="wallHeight">Высота стен (м)</label>
              <input
                id="wallHeight"
                type="number"
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
                placeholder="Например: 2.7"
                step="0.1"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label htmlFor="wallLength">Длина помещения (м)</label>
              <input
                id="wallLength"
                type="number"
                value={wallLength}
                onChange={(e) => setWallLength(e.target.value)}
                placeholder="Например: 4.5"
                step="0.1"
                min="1"
                max="20"
              />
            </div>
            <div>
              <label htmlFor="wallWidth">Ширина помещения (м)</label>
              <input
                id="wallWidth"
                type="number"
                value={wallWidth}
                onChange={(e) => setWallWidth(e.target.value)}
                placeholder="Например: 3.2"
                step="0.1"
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Проемы в помещении</label>
          <div className="inputRow">
            <div>
              <label htmlFor="windowsCount">Количество окон</label>
              <input
                id="windowsCount"
                type="number"
                value={windowsCount}
                onChange={(e) => setWindowsCount(e.target.value)}
                placeholder="0"
                min="0"
                max="10"
              />
            </div>
            <div>
              <label htmlFor="doorsCount">Количество дверей</label>
              <input
                id="doorsCount"
                type="number"
                value={doorsCount}
                onChange={(e) => setDoorsCount(e.target.value)}
                placeholder="0"
                min="0"
                max="5"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Параметры покраски</label>
          <div className="inputRow">
            <div>
              <label htmlFor="coats">Количество слоев</label>
              <select
                id="coats"
                value={coats}
                onChange={(e) => setCoats(e.target.value)}
              >
                <option value="1">1 слой</option>
                <option value="2">2 слоя (рекомендуется)</option>
                <option value="3">3 слоя</option>
              </select>
            </div>
            <div>
              <label htmlFor="paintType">Тип краски</label>
              <select
                id="paintType"
                value={paintType}
                onChange={(e) => setPaintType(e.target.value)}
              >
                <option value="water">Водоэмульсионная</option>
                <option value="acrylic">Акриловая</option>
                <option value="latex">Латексная</option>
                <option value="oil">Масляная</option>
                <option value="alkyd">Алкидная</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать количество краски
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className="paintSummary">
            <div className="summaryItem">
              <span className="label">Общая площадь стен:</span>
              <span className="value">{result.wallArea} м²</span>
            </div>
            <div className="summaryItem">
              <span className="label">Площадь проемов:</span>
              <span className="value">{result.openingsArea} м²</span>
            </div>
            <div className="summaryItem">
              <span className="label">Площадь для покраски:</span>
              <span className="value">{result.paintArea} м²</span>
            </div>
            <div className="summaryItem">
              <span className="label">Тип краски:</span>
              <span className="value">{result.paintType}</span>
            </div>
            <div className="summaryItem">
              <span className="label">Количество слоев:</span>
              <span className="value">{result.coatsCount}</span>
            </div>
          </div>

          <div className="resultValue">
            <span className="amount">{result.totalPaint}</span>
            <span className="unit">литров краски</span>
          </div>

          <div className="recommendation">
            <strong>Рекомендуемые банки:</strong>
            <div className="canRecommendations">
              {result.recommendedCans.map((can: any, index: number) => (
                <div key={index} className="canItem">
                  {can.count} × {can.size} л = {can.volume} л
                  {can.note && <span className="note"> ({can.note})</span>}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <strong>Совет:</strong> Покупайте краску с небольшим запасом
              (10-15%) для подкрасок и исправлений.
            </p>
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

export default PaintCalculator;
