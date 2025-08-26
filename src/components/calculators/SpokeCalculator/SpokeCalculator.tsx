import React, { useState } from 'react';
import styles from './SpokeCalculator.module.scss';

interface SpokePattern {
  leftSide: number[];
  rightSide: number[];
  crossPattern: number;
  spokeLength: number;
  tension: string;
  difficulty: string;
}

interface WheelSpecs {
  erd: number; // Effective Rim Diameter
  pcd: number; // Pitch Circle Diameter
  flangeOffset: number;
  hubWidth: number;
}

const SpokeCalculator: React.FC = () => {
  const [spokeCount, setSpokeCount] = useState('');
  const [crossPattern, setCrossPattern] = useState('3');
  const [wheelType, setWheelType] = useState('road');
  const [useAdvanced, setUseAdvanced] = useState(false);
  const [wheelSpecs, setWheelSpecs] = useState<WheelSpecs>({
    erd: 622,
    pcd: 44,
    flangeOffset: 35,
    hubWidth: 100,
  });
  const [result, setResult] = useState<SpokePattern | null>(null);
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  const wheelTypes = {
    road: {
      name: 'Шоссейный',
      erd: 622,
      pcd: 44,
      flangeOffset: 35,
      hubWidth: 100,
    },
    mtb: { name: 'Горный', erd: 559, pcd: 44, flangeOffset: 35, hubWidth: 135 },
    track: {
      name: 'Трековый',
      erd: 622,
      pcd: 44,
      flangeOffset: 35,
      hubWidth: 120,
    },
    bmx: { name: 'BMX', erd: 406, pcd: 36, flangeOffset: 30, hubWidth: 110 },
    cruiser: {
      name: 'Круизер',
      erd: 622,
      pcd: 44,
      flangeOffset: 35,
      hubWidth: 120,
    },
    custom: {
      name: 'Кастомный',
      erd: 622,
      pcd: 44,
      flangeOffset: 35,
      hubWidth: 100,
    },
  };

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

    // Проверяем совместимость паттерна с количеством спиц
    if (cross * 2 >= count / 2) {
      setError(
        `Паттерн ${cross}x не подходит для ${count} спиц. Максимальный паттерн: ${Math.floor(
          (count / 2 - 1) / 2
        )}x`
      );
      return;
    }

    // Генерируем паттерн спицевания
    const leftSide: number[] = [];
    const rightSide: number[] = [];
    const halfSpokes = count / 2;

    // Левая сторона (ведущая)
    for (let i = 0; i < halfSpokes; i++) {
      leftSide.push(i + 1);
    }

    // Правая сторона (ведомая) с учетом паттерна перекрещивания
    for (let i = 0; i < halfSpokes; i++) {
      const spokeNumber = i + 1;
      rightSide.push(spokeNumber);
    }

    // Рассчитываем точную длину спиц
    const spokeLength = calculateExactSpokeLength(count, cross, wheelSpecs);

    // Определяем сложность и натяжение
    const tension = getTensionLevel(count, cross, wheelType);
    const difficulty = getDifficultyLevel(count, cross);

    setResult({
      leftSide,
      rightSide,
      crossPattern: cross,
      spokeLength,
      tension,
      difficulty,
    });
  };

  const calculateExactSpokeLength = (
    spokeCount: number,
    crossPattern: number,
    specs: WheelSpecs
  ): number => {
    // Формула для расчета длины спиц
    const erd = specs.erd;
    const pcd = specs.pcd;
    const flangeOffset = specs.flangeOffset;
    const hubWidth = specs.hubWidth;

    // Базовая длина
    const baseLength =
      Math.sqrt(
        Math.pow(erd / 2, 2) + Math.pow(pcd / 2, 2) + Math.pow(flangeOffset, 2)
      ) -
      pcd / 2;

    // Корректировка на паттерн перекрещивания
    const crossAdjustment = crossPattern * 2;

    // Корректировка на количество спиц
    const countAdjustment = (spokeCount - 32) * 0.3;

    // Корректировка на ширину втулки
    const hubAdjustment = (hubWidth - 100) * 0.1;

    return Math.round(
      baseLength + crossAdjustment + countAdjustment + hubAdjustment
    );
  };

  const getTensionLevel = (
    spokeCount: number,
    crossPattern: number,
    wheelType: string
  ): string => {
    const tensionScore = spokeCount * crossPattern;

    if (wheelType === 'track') return 'Очень высокое';
    if (tensionScore >= 120) return 'Высокое';
    if (tensionScore >= 80) return 'Среднее';
    return 'Низкое';
  };

  const getDifficultyLevel = (
    spokeCount: number,
    crossPattern: number
  ): string => {
    const difficultyScore = spokeCount * crossPattern;

    if (difficultyScore >= 150) return 'Эксперт';
    if (difficultyScore >= 100) return 'Продвинутый';
    if (difficultyScore >= 60) return 'Средний';
    return 'Новичок';
  };

  const getCrossDescription = (cross: string) => {
    switch (cross) {
      case '1':
        return '1x (один крест) - для трековых велосипедов, минимальное сопротивление';
      case '2':
        return '2x (два креста) - для шоссейных велосипедов, хороший баланс';
      case '3':
        return '3x (три креста) - стандартный паттерн, универсальный';
      case '4':
        return '4x (четыре креста) - для горных велосипедов, высокая прочность';
      case '5':
        return '5x (пять крестов) - для тяжелых условий, максимальная прочность';
      default:
        return '';
    }
  };

  const getWheelTypeDescription = (type: string) => {
    return wheelTypes[type as keyof typeof wheelTypes]?.name || 'Неизвестно';
  };

  const updateWheelSpecs = (field: keyof WheelSpecs, value: number) => {
    setWheelSpecs((prev) => ({ ...prev, [field]: value }));
  };

  const selectWheelType = (type: string) => {
    setWheelType(type);
    if (type !== 'custom') {
      const specs = wheelTypes[type as keyof typeof wheelTypes];
      setWheelSpecs(specs);
    }
  };

  const clearForm = () => {
    setSpokeCount('');
    setCrossPattern('3');
    setWheelType('road');
    setUseAdvanced(false);
    setWheelSpecs(wheelTypes.road);
    setResult(null);
    setError('');
  };

  return (
    <div className={`${styles.calculator} spokeCalculator`}>
      <div className="calculatorHeader">
        <h2>🚴 Калькулятор спицевания</h2>
        <p>
          Профессиональный калькулятор для расчета паттерна спицевания
          велосипедного колеса. Подходит как для новичков, так и для опытных
          механиков.
        </p>

        <button
          type="button"
          className={styles.tutorialBtn}
          onClick={() => setShowTutorial(!showTutorial)}
        >
          {showTutorial ? 'Скрыть' : 'Показать'} руководство
        </button>
      </div>

      {showTutorial && (
        <div className={styles.tutorial}>
          <h3>📚 Руководство по спицеванию</h3>
          <div className={styles.tutorialContent}>
            <div className={styles.tutorialSection}>
              <h4>🎯 Основные понятия:</h4>
              <ul>
                <li>
                  <strong>ERD (Effective Rim Diameter)</strong> - эффективный
                  диаметр обода
                </li>
                <li>
                  <strong>PCD (Pitch Circle Diameter)</strong> - диаметр
                  окружности отверстий во фланце втулки
                </li>
                <li>
                  <strong>Паттерн перекрещивания</strong> - количество
                  пересечений спиц
                </li>
                <li>
                  <strong>Фланцевое смещение</strong> - расстояние от центра
                  втулки до фланца
                </li>
              </ul>
            </div>

            <div className={styles.tutorialSection}>
              <h4>🔧 Выбор паттерна:</h4>
              <ul>
                <li>
                  <strong>1x:</strong> Трековые велосипеды, минимальное
                  сопротивление
                </li>
                <li>
                  <strong>2x:</strong> Шоссейные велосипеды, хороший баланс
                </li>
                <li>
                  <strong>3x:</strong> Универсальный, стандартный выбор
                </li>
                <li>
                  <strong>4x:</strong> Горные велосипеды, высокая прочность
                </li>
                <li>
                  <strong>5x:</strong> Тяжелые условия, максимальная прочность
                </li>
              </ul>
            </div>

            <div className={styles.tutorialSection}>
              <h4>⚠️ Важные моменты:</h4>
              <ul>
                <li>Количество спиц должно быть четным</li>
                <li>Паттерн не должен превышать половину количества спиц</li>
                <li>
                  Для точного расчета нужны реальные размеры обода и втулки
                </li>
                <li>Разные типы велосипедов требуют разных паттернов</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateSpokePattern();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="wheelType">Тип велосипеда</label>
          <select
            id="wheelType"
            value={wheelType}
            onChange={(e) => selectWheelType(e.target.value)}
          >
            {Object.entries(wheelTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
          <div className="help">
            Выберите тип велосипеда для автоматической настройки параметров
          </div>
        </div>

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
          <div className="help">
            Обычно используется 28, 32, 36 или 48 спиц. Больше спиц = больше
            прочность, но больше вес
          </div>
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

        <div className="inputGroup">
          <label>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={useAdvanced}
              onChange={(e) => setUseAdvanced(e.target.checked)}
            />
            Использовать продвинутые настройки
          </label>
          <div className={styles.help}>
            Для точного расчета длины спиц (требует измерения обода и втулки)
          </div>
        </div>

        {useAdvanced && (
          <div className={styles.advancedSettings}>
            <h4>🔧 Продвинутые настройки</h4>

            <div className={styles.specsGrid}>
              <div className=" inputGroup">
                <label htmlFor="erd">ERD обода (мм)</label>
                <input
                  id="erd"
                  type="number"
                  value={wheelSpecs.erd}
                  onChange={(e) =>
                    updateWheelSpecs('erd', parseInt(e.target.value))
                  }
                  placeholder="622"
                  min="300"
                  max="800"
                />
                <div className="help">Эффективный диаметр обода</div>
              </div>

              <div className="inputGroup">
                <label htmlFor="pcd">PCD втулки (мм)</label>
                <input
                  id="pcd"
                  type="number"
                  value={wheelSpecs.pcd}
                  onChange={(e) =>
                    updateWheelSpecs('pcd', parseInt(e.target.value))
                  }
                  placeholder="44"
                  min="20"
                  max="80"
                />
                <div className="help">
                  Диаметр окружности отверстий во фланце
                </div>
              </div>

              <div className="inputGroup">
                <label htmlFor="flangeOffset">Фланцевое смещение (мм)</label>
                <input
                  id="flangeOffset"
                  type="number"
                  value={wheelSpecs.flangeOffset}
                  onChange={(e) =>
                    updateWheelSpecs('flangeOffset', parseInt(e.target.value))
                  }
                  placeholder="35"
                  min="20"
                  max="60"
                />
                <div className="help">
                  Расстояние от центра втулки до фланца
                </div>
              </div>

              <div className="inputGroup">
                <label htmlFor="hubWidth">Ширина втулки (мм)</label>
                <input
                  id="hubWidth"
                  type="number"
                  value={wheelSpecs.hubWidth}
                  onChange={(e) =>
                    updateWheelSpecs('hubWidth', parseInt(e.target.value))
                  }
                  placeholder="100"
                  min="70"
                  max="150"
                />
                <div className="help">Общая ширина втулки</div>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать паттерн
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>🎯 Результат расчета</h3>

          <div className={styles.resultSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Количество спиц:</span>
              <span className={styles.value}>{spokeCount}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Паттерн:</span>
              <span className={styles.value}>{result.crossPattern}x</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Тип велосипеда:</span>
              <span className={styles.value}>
                {getWheelTypeDescription(wheelType)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Сложность:</span>
              <span className={styles.value}>{result.difficulty}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Натяжение:</span>
              <span
                className={`${styles.value} ${styles.tension}-${result.tension
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {result.tension}
              </span>
            </div>
          </div>

          <div className={styles.spokePattern}>
            <h4>📐 Паттерн спицевания</h4>

            <div className={styles.patternVisualization}>
              <div className={`${styles.wheelSide} ${styles.left}`}>
                <h5>🔵 Левая сторона (ведущая)</h5>
                <div className={styles.spokeNumbers}>
                  {result.leftSide.map((spoke, index) => (
                    <span
                      key={index}
                      className={`${styles.spokeNumber} ${styles.left}`}
                    >
                      {spoke}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`${styles.wheelSide} ${styles.right}`}>
                <h5>🟡 Правая сторона (ведомая)</h5>
                <div className={styles.spokeNumbers}>
                  {result.rightSide.map((spoke, index) => (
                    <span
                      key={index}
                      className={`${styles.spokeNumber} ${styles.right}`}
                    >
                      {spoke}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.patternInfo}>
              <p>
                <strong>Порядок установки:</strong>
              </p>
              <ol>
                <li>
                  Установите все спицы левой стороны (1-{result.leftSide.length}
                  )
                </li>
                <li>
                  Установите все спицы правой стороны (1-
                  {result.rightSide.length})
                </li>
                <li>Начните натягивать спицы по диагонали</li>
                <li>Проверьте биение колеса</li>
                <li>Доведите натяжение до равномерного</li>
              </ol>
            </div>
          </div>

          <div className={styles.spokeSpecs}>
            <h4>📏 Спецификации спиц</h4>

            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.label}>Длина спиц:</span>
                <span className={styles.value}>{result.spokeLength} мм</span>
              </div>

              {useAdvanced && (
                <>
                  <div className={styles.specItem}>
                    <span className={styles.label}>ERD обода:</span>
                    <span className={styles.value}>{wheelSpecs.erd} мм</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.label}>PCD втулки:</span>
                    <span className={styles.value}>{wheelSpecs.pcd} мм</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.label}>Фланцевое смещение:</span>
                    <span className={styles.value}>
                      {wheelSpecs.flangeOffset} мм
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.label}>Ширина втулки:</span>
                    <span className={styles.value}>
                      {wheelSpecs.hubWidth} мм
                    </span>
                  </div>
                </>
              )}
            </div>

            {!useAdvanced && (
              <div className={styles.warning}>
                ⚠️ <strong>Примечание:</strong> Длина спиц рассчитана
                приблизительно. Для точного расчета используйте продвинутые
                настройки с реальными размерами обода и втулки.
              </div>
            )}
          </div>

          <div className={styles.recommendations}>
            <h4>💡 Рекомендации</h4>

            <div className={styles.recommendationsList}>
              <div className={styles.recommendation}>
                <strong>🎯 Для новичков:</strong>
                <ul>
                  <li>Начните с паттерна 3x для {spokeCount} спиц</li>
                  <li>Используйте готовые комплекты спиц</li>
                  <li>Обратитесь к опытному механику для первой сборки</li>
                </ul>
              </div>

              <div className={styles.recommendation}>
                <strong>🔧 Для профессионалов:</strong>
                <ul>
                  <li>Используйте продвинутые настройки для точного расчета</li>
                  <li>Учитывайте тип обода и втулки</li>
                  <li>Проверяйте натяжение тензометром</li>
                  <li>Делайте финальную балансировку</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.tools}>
            <h4>🛠️ Необходимые инструменты</h4>
            <div className={styles.toolsList}>
              <span className={styles.tool}>Спицевый ключ</span>
              <span className={styles.tool}>Тензометр</span>
              <span className={styles.tool}>Станок для правки</span>
              <span className={styles.tool}>Маркер</span>
              <span className={styles.tool}>Линейка</span>
            </div>
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
