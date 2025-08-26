import React, { useState } from 'react';
import styles from './GearCalculator.module.scss';

const GearCalculator: React.FC = () => {
  const [bikeType, setBikeType] = useState('road');
  const [frontChainrings, setFrontChainrings] = useState('2');
  const [rearCogs, setRearCogs] = useState('11');
  const [wheelSize, setWheelSize] = useState('700c');
  const [tireWidth, setTireWidth] = useState('25');
  const [cadence, setCadence] = useState('90');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateGears = () => {
    setError('');

    if (!frontChainrings || !rearCogs || !wheelSize || !tireWidth || !cadence) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const frontCount = parseInt(frontChainrings);
    const rearCount = parseInt(rearCogs);
    const tireWidthNum = parseFloat(tireWidth);
    const cadenceNum = parseFloat(cadence);

    if (
      isNaN(frontCount) ||
      isNaN(rearCount) ||
      isNaN(tireWidthNum) ||
      isNaN(cadenceNum)
    ) {
      setError('Все значения должны быть числами');
      return;
    }

    if (frontCount < 1 || frontCount > 3 || rearCount < 5 || rearCount > 14) {
      setError('Недопустимое количество звезд');
      return;
    }

    // Стандартные размеры звезд
    const frontTeeth = getFrontTeeth(bikeType, frontCount);
    const rearTeeth = getRearTeeth(bikeType, rearCount);

    // Диаметр колеса в мм
    const wheelDiameter = getWheelDiameter(wheelSize, tireWidthNum);

    // Расчет передаточных отношений
    const gearRatios = calculateGearRatios(frontTeeth, rearTeeth);

    // Расчет скоростей
    const speeds = calculateSpeeds(gearRatios, wheelDiameter, cadenceNum);

    // Анализ передач
    const gearAnalysis = analyzeGears(gearRatios, speeds);

    setResult({
      frontTeeth,
      rearTeeth,
      wheelDiameter: wheelDiameter.toFixed(0),
      gearRatios,
      speeds,
      gearAnalysis,
      recommendations: getRecommendations(
        bikeType,
        frontCount,
        rearCount,
        gearAnalysis
      ),
    });
  };

  const getFrontTeeth = (type: string, count: number): number[] => {
    switch (type) {
      case 'road':
        if (count === 1) return [50];
        if (count === 2) return [53, 39];
        return [53, 39, 30];
      case 'mountain':
        if (count === 1) return [32];
        if (count === 2) return [36, 22];
        return [42, 32, 22];
      case 'hybrid':
        if (count === 1) return [44];
        if (count === 2) return [48, 34];
        return [48, 36, 26];
      case 'gravel':
        if (count === 1) return [40];
        if (count === 2) return [46, 30];
        return [46, 36, 26];
      default:
        return [53, 39];
    }
  };

  const getRearTeeth = (type: string, count: number): number[] => {
    switch (type) {
      case 'road':
        if (count === 11) return [11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25];
        if (count === 12)
          return [11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28];
        return [11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28, 32];
      case 'mountain':
        if (count === 10) return [11, 13, 15, 17, 19, 21, 24, 28, 32, 36];
        if (count === 11) return [11, 13, 15, 17, 19, 21, 24, 28, 32, 36, 42];
        return [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 46, 51];
      case 'hybrid':
        if (count === 8) return [11, 13, 15, 18, 21, 24, 28, 32];
        if (count === 9) return [11, 13, 15, 18, 21, 24, 28, 32, 36];
        return [11, 13, 15, 18, 21, 24, 28, 32, 36, 40];
      case 'gravel':
        if (count === 10) return [11, 13, 15, 17, 19, 21, 24, 28, 32, 36];
        if (count === 11) return [11, 13, 15, 17, 19, 21, 24, 28, 32, 36, 42];
        return [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 46];
      default:
        return [11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25];
    }
  };

  const getWheelDiameter = (size: string, tireWidth: number): number => {
    let baseDiameter = 0;

    switch (size) {
      case '700c':
        baseDiameter = 622;
        break;
      case '650b':
        baseDiameter = 584;
        break;
      case '26"':
        baseDiameter = 559;
        break;
      case '27.5"':
        baseDiameter = 584;
        break;
      case '29"':
        baseDiameter = 622;
        break;
      case '20"':
        baseDiameter = 406;
        break;
      case '24"':
        baseDiameter = 507;
        break;
      default:
        baseDiameter = 622;
    }

    // Добавляем толщину покрышки (умножаем на 2, так как покрышка с обеих сторон)
    return baseDiameter + tireWidth * 2;
  };

  const calculateGearRatios = (
    frontTeeth: number[],
    rearTeeth: number[]
  ): any[] => {
    const ratios = [];

    for (const front of frontTeeth) {
      for (const rear of rearTeeth) {
        const ratio = front / rear;
        ratios.push({
          front,
          rear,
          ratio: ratio.toFixed(2),
          gearInches: ((ratio * getWheelDiameter('700c', 25)) / 25.4).toFixed(
            1
          ),
        });
      }
    }

    // Сортируем по убыванию передаточного отношения
    return ratios.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio));
  };

  const calculateSpeeds = (
    gearRatios: any[],
    wheelDiameter: number,
    cadence: number
  ): any[] => {
    return gearRatios.map((gear) => {
      const ratio = parseFloat(gear.ratio);
      // Скорость = (передаточное отношение × диаметр колеса × π × каденс × 60) / (1000 × 1000)
      const speed =
        (ratio * wheelDiameter * Math.PI * cadence * 60) / (1000 * 1000);

      return {
        ...gear,
        speed: speed.toFixed(1),
        speedKmh: (speed * 1.609).toFixed(1), // Конвертируем в км/ч
      };
    });
  };

  const analyzeGears = (ratios: any[], speeds: any[]): any => {
    const maxRatio = parseFloat(ratios[0].ratio);
    const minRatio = parseFloat(ratios[ratios.length - 1].ratio);
    const gearRange = maxRatio / minRatio;

    // Анализ перекрытий
    const overlaps = analyzeOverlaps(ratios);

    // Анализ шагов между передачами
    const steps = analyzeSteps(ratios);

    return {
      maxRatio: maxRatio.toFixed(2),
      minRatio: minRatio.toFixed(2),
      gearRange: gearRange.toFixed(2),
      overlaps,
      steps,
      totalGears: ratios.length,
    };
  };

  const analyzeOverlaps = (ratios: any[]): any => {
    const overlaps = [];
    const uniqueRatios = new Set();

    for (const gear of ratios) {
      const ratio = parseFloat(gear.ratio);
      if (uniqueRatios.has(ratio.toFixed(2))) {
        overlaps.push({
          front: gear.front,
          rear: gear.rear,
          ratio: gear.ratio,
        });
      } else {
        uniqueRatios.add(ratio.toFixed(2));
      }
    }

    return {
      count: overlaps.length,
      gears: overlaps,
    };
  };

  const analyzeSteps = (ratios: any[]): any => {
    const steps = [];

    for (let i = 1; i < ratios.length; i++) {
      const currentRatio = parseFloat(ratios[i].ratio);
      const prevRatio = parseFloat(ratios[i - 1].ratio);
      const step = prevRatio / currentRatio;

      steps.push({
        from: ratios[i - 1],
        to: ratios[i],
        step: step.toFixed(2),
        percentage: ((step - 1) * 100).toFixed(1),
      });
    }

    const avgStep =
      steps.reduce((sum, step) => sum + parseFloat(step.step), 0) /
      steps.length;

    return {
      average: avgStep.toFixed(2),
      steps,
    };
  };

  const getRecommendations = (
    bikeType: string,
    frontCount: number,
    rearCount: number,
    analysis: any
  ): string[] => {
    const recommendations = [];

    // Рекомендации по типу велосипеда
    if (bikeType === 'road' && frontCount === 1) {
      recommendations.push(
        'Односкоростная система подходит для ровных дорог и трека'
      );
    } else if (bikeType === 'mountain' && frontCount === 1) {
      recommendations.push(
        'Односкоростная система упрощает обслуживание и снижает вес'
      );
    }

    // Рекомендации по диапазону передач
    const gearRange = parseFloat(analysis.gearRange);
    if (gearRange < 3) {
      recommendations.push(
        'Узкий диапазон передач подходит для ровной местности'
      );
    } else if (gearRange > 6) {
      recommendations.push(
        'Широкий диапазон передач идеален для горной местности'
      );
    }

    // Рекомендации по перекрытиям
    if (analysis.overlaps.count > 0) {
      recommendations.push(
        `Найдено ${analysis.overlaps.count} перекрывающихся передач - это нормально для ${frontCount}-скоростной системы`
      );
    }

    // Рекомендации по шагам
    const avgStep = parseFloat(analysis.steps.average);
    if (avgStep > 1.3) {
      recommendations.push(
        'Большие шаги между передачами могут затруднить выбор оптимальной передачи'
      );
    } else if (avgStep < 1.1) {
      recommendations.push(
        'Малые шаги обеспечивают плавное переключение передач'
      );
    }

    // Общие рекомендации
    recommendations.push(
      'Выбирайте передачу, поддерживающую комфортный каденс 80-100 об/мин'
    );
    recommendations.push(
      'Используйте передние звезды для грубого переключения, задние - для точного'
    );
    recommendations.push(
      'Избегайте крайних комбинаций (большая передняя + большая задняя)'
    );

    return recommendations;
  };

  const clearForm = () => {
    setBikeType('road');
    setFrontChainrings('2');
    setRearCogs('11');
    setWheelSize('700c');
    setTireWidth('25');
    setCadence('90');
    setResult(null);
    setError('');
  };

  const getBikeTypeName = (type: string): string => {
    switch (type) {
      case 'road':
        return 'Шоссейный';
      case 'mountain':
        return 'Горный';
      case 'hybrid':
        return 'Гибридный';
      case 'gravel':
        return 'Гравийный';
      default:
        return 'Шоссейный';
    }
  };

  const getWheelSizeName = (size: string): string => {
    switch (size) {
      case '700c':
        return '700c (700×25)';
      case '650b':
        return '650b (650×47)';
      case '26"':
        return '26" (559×2.1)';
      case '27.5"':
        return '27.5" (584×2.1)';
      case '29"':
        return '29" (622×2.1)';
      case '20"':
        return '20" (406×1.75)';
      case '24"':
        return '24" (507×1.75)';
      default:
        return '700c';
    }
  };

  return (
    <div className={`${styles.calculator} gearCalculator`}>
      <div className="calculatorHeader">
        <h2>⚙️ Калькулятор передач велосипеда</h2>
        <p>
          Рассчитайте передаточные отношения, скорости и проанализируйте
          трансмиссию вашего велосипеда.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateGears();
        }}
      >
        <div className="inputGroup">
          <label>Тип велосипеда и трансмиссия</label>
          <div className="inputRow">
            <div>
              <label htmlFor="bikeType">Тип велосипеда</label>
              <select
                id="bikeType"
                value={bikeType}
                onChange={(e) => setBikeType(e.target.value)}
              >
                <option value="road">🚴 Шоссейный</option>
                <option value="mountain">🏔️ Горный</option>
                <option value="hybrid">🚲 Гибридный</option>
                <option value="gravel">🌄 Гравийный</option>
              </select>
              <div className="help">
                {getBikeTypeName(bikeType)} - влияет на размеры звезд
              </div>
            </div>
            <div>
              <label htmlFor="frontChainrings">Передние звезды</label>
              <select
                id="frontChainrings"
                value={frontChainrings}
                onChange={(e) => setFrontChainrings(e.target.value)}
              >
                <option value="1">1 звезда</option>
                <option value="2">2 звезды</option>
                <option value="3">3 звезды</option>
              </select>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Задняя кассета и колеса</label>
          <div className="inputRow">
            <div>
              <label htmlFor="rearCogs">Задние звезды</label>
              <select
                id="rearCogs"
                value={rearCogs}
                onChange={(e) => setRearCogs(e.target.value)}
              >
                <option value="8">8 скоростей</option>
                <option value="9">9 скоростей</option>
                <option value="10">10 скоростей</option>
                <option value="11">11 скоростей</option>
                <option value="12">12 скоростей</option>
                <option value="13">13 скоростей</option>
                <option value="14">14 скоростей</option>
              </select>
            </div>
            <div>
              <label htmlFor="wheelSize">Размер колеса</label>
              <select
                id="wheelSize"
                value={wheelSize}
                onChange={(e) => setWheelSize(e.target.value)}
              >
                <option value="700c">700c</option>
                <option value="650b">650b</option>
                <option value='26"'>26"</option>
                <option value='27.5"'>27.5"</option>
                <option value='29"'>29"</option>
                <option value='20"'>20"</option>
                <option value='24"'>24"</option>
              </select>
              <div className="help">{getWheelSizeName(wheelSize)}</div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Дополнительные параметры</label>
          <div className="inputRow">
            <div>
              <label htmlFor="tireWidth">Ширина покрышки (мм)</label>
              <input
                id="tireWidth"
                type="number"
                value={tireWidth}
                onChange={(e) => setTireWidth(e.target.value)}
                placeholder="25"
                step="1"
                min="18"
                max="60"
              />
            </div>
            <div>
              <label htmlFor="cadence">Каденс (об/мин)</label>
              <input
                id="cadence"
                type="number"
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                placeholder="90"
                step="5"
                min="60"
                max="120"
              />
              <div className="help">Для расчета скоростей</div>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать передачи
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className={styles.gearSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Передние звезды:</span>
              <span className={styles.value}>
                {result.frontTeeth.join(', ')} зубьев
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Задние звезды:</span>
              <span className={styles.value}>
                {result.rearTeeth.join(', ')} зубьев
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Диаметр колеса:</span>
              <span className={styles.value}>{result.wheelDiameter} мм</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Всего передач:</span>
              <span className={styles.value}>
                {result.gearAnalysis.totalGears}
              </span>
            </div>
          </div>

          <div className={styles.gearAnalysis}>
            <h4>Анализ передач:</h4>
            <div className={styles.analysisGrid}>
              <div className={styles.analysisItem}>
                <span className={styles.label}>Максимальная передача:</span>
                <span className={styles.value}>
                  {result.gearAnalysis.maxRatio}
                </span>
              </div>
              <div className={styles.analysisItem}>
                <span className={styles.label}>Минимальная передача:</span>
                <span className={styles.value}>
                  {result.gearAnalysis.minRatio}
                </span>
              </div>
              <div className={styles.analysisItem}>
                <span className={styles.label}>Диапазон передач:</span>
                <span className={styles.value}>
                  {result.gearAnalysis.gearRange}
                </span>
              </div>
              <div className={styles.analysisItem}>
                <span className={styles.label}>Средний шаг:</span>
                <span className={styles.value}>
                  {result.gearAnalysis.steps.average}
                </span>
              </div>
              <div className={styles.analysisItem}>
                <span className={styles.label}>Перекрытия:</span>
                <span className={styles.value}>
                  {result.gearAnalysis.overlaps.count}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.gearTable}>
            <h4>Таблица передач:</h4>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Передняя</th>
                    <th>Задняя</th>
                    <th>Передача</th>
                    <th>Дюймы</th>
                    <th>Скорость (миль/ч)</th>
                    <th>Скорость (км/ч)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.speeds
                    .slice(0, 20)
                    .map((gear: any, index: number) => (
                      <tr key={index}>
                        <td>{gear.front}</td>
                        <td>{gear.rear}</td>
                        <td>{gear.ratio}</td>
                        <td>{gear.gearInches}</td>
                        <td>{gear.speed}</td>
                        <td>{gear.speedKmh}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {result.speeds.length > 20 && (
                <p className={styles.tableNote}>
                  Показаны первые 20 передач из {result.speeds.length}
                </p>
              )}
            </div>
          </div>

          <div className={styles.recommendation}>
            <strong>Рекомендации:</strong>
            <ul className={styles.recommendationsList}>
              {result.recommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
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

export default GearCalculator;
