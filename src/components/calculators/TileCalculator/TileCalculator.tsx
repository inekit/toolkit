import React, { useState } from 'react';
import styles from './TileCalculator.module.scss';

const TileCalculator: React.FC = () => {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [tileLength, setTileLength] = useState('');
  const [tileWidth, setTileWidth] = useState('');
  const [result, setResult] = useState<{ tiles: number; area: number } | null>(
    null
  );

  const calculateTiles = () => {
    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const tileL = parseFloat(tileLength);
    const tileW = parseFloat(tileWidth);

    if (length && width && tileL && tileW) {
      const roomArea = length * width;
      const tileArea = tileL * tileW;
      const tilesNeeded = Math.ceil(roomArea / tileArea);

      setResult({
        tiles: tilesNeeded,
        area: roomArea,
      });
    }
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <h2>🧱 Калькулятор плитки</h2>
        <p>Рассчитайте нужное количество плитки для облицовки</p>
      </div>

      <div className={styles.form}>
        <div className={styles.dimensions}>
          <h3>Размеры помещения</h3>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="roomLength">Длина (м)</label>
              <input
                id="roomLength"
                type="number"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
                placeholder="Длина помещения"
                min="0"
                step="0.1"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="roomWidth">Ширина (м)</label>
              <input
                id="roomWidth"
                type="number"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
                placeholder="Ширина помещения"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className={styles.dimensions}>
          <h3>Размеры плитки</h3>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="tileLength">Длина (см)</label>
              <input
                id="tileLength"
                type="number"
                value={tileLength}
                onChange={(e) => setTileLength(e.target.value)}
                placeholder="Длина плитки"
                min="0"
                step="0.1"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="tileWidth">Ширина (см)</label>
              <input
                id="tileWidth"
                type="number"
                value={tileWidth}
                onChange={(e) => setTileWidth(e.target.value)}
                placeholder="Ширина плитки"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <button
          className={styles.calculateBtn}
          onClick={calculateTiles}
          disabled={!roomLength || !roomWidth || !tileLength || !tileWidth}
        >
          Рассчитать
        </button>
      </div>

      {result && (
        <div className={styles.result}>
          <h3>Результат:</h3>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.label}>Площадь помещения:</span>
              <span className={styles.value}>{result.area} м²</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Количество плиток:</span>
              <span className={styles.value}>{result.tiles} шт</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Рекомендуется с запасом:</span>
              <span className={styles.value}>
                {Math.ceil(result.tiles * 1.1)} шт
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TileCalculator;
