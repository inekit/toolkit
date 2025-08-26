import React, { useState } from 'react';
import styles from './TileCalculator.module.scss';

const TileCalculator: React.FC = () => {
  const [roomType, setRoomType] = useState('bathroom');
  const [wallHeight, setWallHeight] = useState('');
  const [wallLength, setWallLength] = useState('');
  const [wallWidth, setWallWidth] = useState('');
  const [windowsCount, setWindowsCount] = useState('0');
  const [doorsCount, setDoorsCount] = useState('0');
  const [tileSize, setTileSize] = useState('300x300');
  const [groutWidth, setGroutWidth] = useState('2');
  const [wastage, setWastage] = useState('10');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateTiles = () => {
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
    const grout = parseFloat(groutWidth);
    const wastagePercent = parseFloat(wastage);

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

    // Площадь для облицовки
    const tileArea = wallArea - openingsArea;

    if (tileArea <= 0) {
      setError('Площадь для облицовки должна быть больше 0');
      return;
    }

    // Размеры плитки
    const [tileLength, tileWidth] = tileSize.split('x').map(Number);
    const tileAreaSingle = (tileLength * tileWidth) / 1000000; // в м²

    // Учитываем ширину швов
    const effectiveTileArea =
      ((tileLength + grout) * (tileWidth + grout)) / 1000000;

    // Количество плиток
    const tilesNeeded = Math.ceil(tileArea / effectiveTileArea);

    // Учитываем запас на отходы
    const wastageMultiplier = 1 + wastagePercent / 100;
    const totalTiles = Math.ceil(tilesNeeded * wastageMultiplier);

    // Количество упаковок
    const tilesPerPack = getTilesPerPack(tileSize);
    const packsNeeded = Math.ceil(totalTiles / tilesPerPack);

    // Стоимость (примерная)
    const pricePerPack = getPricePerPack(tileSize);
    const totalCost = packsNeeded * pricePerPack;

    setResult({
      wallArea: wallArea.toFixed(2),
      openingsArea: openingsArea.toFixed(2),
      tileArea: tileArea.toFixed(2),
      tileSize: `${tileLength}×${tileWidth} мм`,
      tilesNeeded,
      totalTiles,
      packsNeeded,
      tilesPerPack,
      totalCost: totalCost.toFixed(0),
      groutWidth: grout,
      wastagePercent,
    });
  };

  const getTilesPerPack = (size: string): number => {
    switch (size) {
      case '200x200':
        return 25;
      case '250x250':
        return 16;
      case '300x300':
        return 11;
      case '400x400':
        return 6;
      case '500x500':
        return 4;
      case '600x600':
        return 3;
      case '300x600':
        return 8;
      case '400x800':
        return 3;
      default:
        return 11;
    }
  };

  const getPricePerPack = (size: string): number => {
    switch (size) {
      case '200x200':
        return 800;
      case '250x250':
        return 1200;
      case '300x300':
        return 1500;
      case '400x400':
        return 2500;
      case '500x500':
        return 3500;
      case '600x600':
        return 4500;
      case '300x600':
        return 2000;
      case '400x800':
        return 3500;
      default:
        return 1500;
    }
  };

  const clearForm = () => {
    setRoomType('bathroom');
    setWallHeight('');
    setWallLength('');
    setWallWidth('');
    setWindowsCount('0');
    setDoorsCount('0');
    setTileSize('300x300');
    setGroutWidth('2');
    setWastage('10');
    setResult(null);
    setError('');
  };

  const getRoomTypeName = (type: string): string => {
    switch (type) {
      case 'bathroom':
        return 'Ванная комната';
      case 'toilet':
        return 'Туалет';
      case 'kitchen':
        return 'Кухня';
      case 'corridor':
        return 'Коридор';
      case 'balcony':
        return 'Балкон/Лоджия';
      case 'other':
        return 'Другое помещение';
      default:
        return 'Помещение';
    }
  };

  const getTileSizeName = (size: string): string => {
    switch (size) {
      case '200x200':
        return '200×200 мм (мелкая)';
      case '250x250':
        return '250×250 мм (мелкая)';
      case '300x300':
        return '300×300 мм (средняя)';
      case '400x400':
        return '400×400 мм (средняя)';
      case '500x500':
        return '500×500 мм (крупная)';
      case '600x600':
        return '600×600 мм (крупная)';
      case '300x600':
        return '300×600 мм (керамический гранит)';
      case '400x800':
        return '400×800 мм (керамический гранит)';
      default:
        return '300×300 мм';
    }
  };

  return (
    <div className={`${styles.calculator} tileCalculator`}>
      <div className="calculatorHeader">
        <h2>🧱 Калькулятор количества плитки</h2>
        <p>
          Рассчитайте необходимое количество плитки для облицовки стен.
          Учитываются размеры помещения, проемы, размер плитки и отходы.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateTiles();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="roomType">Тип помещения</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="bathroom">🚿 Ванная комната</option>
            <option value="toilet">🚽 Туалет</option>
            <option value="kitchen">🍳 Кухня</option>
            <option value="corridor">🚪 Коридор</option>
            <option value="balcony">🏠 Балкон/Лоджия</option>
            <option value="other">🏢 Другое помещение</option>
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
                placeholder="Например: 2.5"
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
                placeholder="Например: 1.8"
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
                max="5"
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
                max="3"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Параметры плитки</label>
          <div className="inputRow">
            <div>
              <label htmlFor="tileSize">Размер плитки</label>
              <select
                id="tileSize"
                value={tileSize}
                onChange={(e) => setTileSize(e.target.value)}
              >
                <option value="200x200">200×200 мм</option>
                <option value="250x250">250×250 мм</option>
                <option value="300x300">300×300 мм</option>
                <option value="400x400">400×400 мм</option>
                <option value="500x500">500×500 мм</option>
                <option value="600x600">600×600 мм</option>
                <option value="300x600">300×600 мм</option>
                <option value="400x800">400×800 мм</option>
              </select>
              <div className="help">{getTileSizeName(tileSize)}</div>
            </div>
            <div>
              <label htmlFor="groutWidth">Ширина швов (мм)</label>
              <select
                id="groutWidth"
                value={groutWidth}
                onChange={(e) => setGroutWidth(e.target.value)}
              >
                <option value="1">1 мм</option>
                <option value="2">2 мм (рекомендуется)</option>
                <option value="3">3 мм</option>
                <option value="4">4 мм</option>
                <option value="5">5 мм</option>
              </select>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="wastage">Запас на отходы (%)</label>
          <select
            id="wastage"
            value={wastage}
            onChange={(e) => setWastage(e.target.value)}
          >
            <option value="5">5% (минимум)</option>
            <option value="10">10% (рекомендуется)</option>
            <option value="15">15% (с запасом)</option>
            <option value="20">20% (большой запас)</option>
          </select>
          <div className="help">
            Учитывает обрезки, брак и возможные ошибки при укладке
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать количество плитки
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className={styles.tileSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Общая площадь стен:</span>
              <span className={styles.value}>{result.wallArea} м²</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Площадь проемов:</span>
              <span className={styles.value}>{result.openingsArea} м²</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Площадь для облицовки:</span>
              <span className={styles.value}>{result.tileArea} м²</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Размер плитки:</span>
              <span className={styles.value}>{result.tileSize}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ширина швов:</span>
              <span className={styles.value}>{result.groutWidth} мм</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Запас на отходы:</span>
              <span className={styles.value}>{result.wastagePercent}%</span>
            </div>
          </div>

          <div className={styles.resultValue}>
            <span className={styles.amount}>{result.totalTiles}</span>
            <span className={styles.unit}>плиток</span>
          </div>

          <div className={styles.recommendation}>
            <strong>Покупка:</strong>
            <div className={styles.purchaseInfo}>
              <p>
                <strong>Количество упаковок:</strong> {result.packsNeeded} шт.
              </p>
              <p>
                <strong>Плиток в упаковке:</strong> {result.tilesPerPack} шт.
              </p>
              <p>
                <strong>Примерная стоимость:</strong> {result.totalCost} ₽
              </p>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <strong>Совет:</strong> Покупайте плитку из одной партии для
              одинакового оттенка. Рекомендуется взять на 1-2 упаковки больше
              для непредвиденных случаев.
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

export default TileCalculator;
