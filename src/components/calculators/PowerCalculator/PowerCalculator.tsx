import React, { useState } from 'react';
import styles from './PowerCalculator.module.scss';

const PowerCalculator: React.FC = () => {
  const [riderWeight, setRiderWeight] = useState('');
  const [bikeWeight, setBikeWeight] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [speed, setSpeed] = useState('');
  const [grade, setGrade] = useState('0');
  const [windSpeed, setWindSpeed] = useState('0');
  const [windDirection, setWindDirection] = useState('headwind');
  const [surface, setSurface] = useState('road');
  const [temperature, setTemperature] = useState('20');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculatePower = () => {
    setError('');

    if (!riderWeight || !bikeWeight || !totalWeight || !speed) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const rider = parseFloat(riderWeight);
    const bike = parseFloat(bikeWeight);
    const total = parseFloat(totalWeight);
    const speedNum = parseFloat(speed);
    const gradeNum = parseFloat(grade);
    const windSpeedNum = parseFloat(windSpeed);
    const tempNum = parseFloat(temperature);

    if (isNaN(rider) || isNaN(bike) || isNaN(total) || isNaN(speedNum)) {
      setError('Все значения должны быть числами');
      return;
    }

    if (rider <= 0 || bike <= 0 || total <= 0 || speedNum <= 0) {
      setError('Все значения должны быть положительными');
      return;
    }

    // Проверяем соответствие общего веса
    if (Math.abs(total - (rider + bike)) > 1) {
      setError(
        'Общий вес должен равняться сумме веса велосипедиста и велосипеда'
      );
      return;
    }

    // Расчет мощности
    const power = calculateTotalPower(
      total,
      speedNum,
      gradeNum,
      windSpeedNum,
      windDirection,
      surface,
      tempNum
    );

    // Разбивка по компонентам
    const powerBreakdown = calculatePowerBreakdown(
      total,
      speedNum,
      gradeNum,
      windSpeedNum,
      windDirection,
      surface,
      tempNum
    );

    // Анализ производительности
    const performance = analyzePerformance(power, rider, speedNum, gradeNum);

    setResult({
      totalWeight: total.toFixed(1),
      speed: speedNum.toFixed(1),
      grade: gradeNum.toFixed(1),
      power: power.toFixed(0),
      powerBreakdown,
      performance,
      recommendations: getRecommendations(
        power,
        rider,
        speedNum,
        gradeNum,
        surface
      ),
    });
  };

  const calculateTotalPower = (
    weight: number,
    speed: number,
    grade: number,
    windSpeed: number,
    windDirection: string,
    surface: string,
    temperature: number
  ): number => {
    // Гравитационная мощность (подъем)
    const gravityPower =
      weight * 9.81 * speed * Math.sin((grade * Math.PI) / 180);

    // Аэродинамическое сопротивление
    const airDensity = 1.225 * (1 - (temperature - 15) * 0.004); // кг/м³
    const frontalArea = 0.5; // м² (примерная площадь велосипедиста)
    const dragCoefficient = 0.9; // коэффициент лобового сопротивления

    // Эффективная скорость ветра
    let effectiveWindSpeed = 0;
    switch (windDirection) {
      case 'headwind':
        effectiveWindSpeed = windSpeed;
        break;
      case 'tailwind':
        effectiveWindSpeed = -windSpeed;
        break;
      case 'crosswind':
        effectiveWindSpeed = windSpeed * 0.5;
        break;
      default:
        effectiveWindSpeed = 0;
    }

    const relativeSpeed = speed + effectiveWindSpeed;
    const aerodynamicPower =
      0.5 *
      airDensity *
      frontalArea *
      dragCoefficient *
      Math.pow(relativeSpeed, 3);

    // Сопротивление качения
    const rollingResistance = getRollingResistance(surface);
    const rollingPower = weight * 9.81 * rollingResistance * speed;

    // Кинетическая энергия (ускорение)
    const kineticPower = (0.5 * weight * Math.pow(speed, 2)) / 3600; // делим на 3600 для перевода в часы

    return gravityPower + aerodynamicPower + rollingPower + kineticPower;
  };

  const calculatePowerBreakdown = (
    weight: number,
    speed: number,
    grade: number,
    windSpeed: number,
    windDirection: string,
    surface: string,
    temperature: number
  ) => {
    const airDensity = 1.225 * (1 - (temperature - 15) * 0.004);
    const frontalArea = 0.5;
    const dragCoefficient = 0.9;

    let effectiveWindSpeed = 0;
    switch (windDirection) {
      case 'headwind':
        effectiveWindSpeed = windSpeed;
        break;
      case 'tailwind':
        effectiveWindSpeed = -windSpeed;
        break;
      case 'crosswind':
        effectiveWindSpeed = windSpeed * 0.5;
        break;
      default:
        effectiveWindSpeed = 0;
    }

    const relativeSpeed = speed + effectiveWindSpeed;

    return {
      gravity: (
        weight *
        9.81 *
        speed *
        Math.sin((grade * Math.PI) / 180)
      ).toFixed(0),
      aerodynamic: (
        0.5 *
        airDensity *
        frontalArea *
        dragCoefficient *
        Math.pow(relativeSpeed, 3)
      ).toFixed(0),
      rolling: (weight * 9.81 * getRollingResistance(surface) * speed).toFixed(
        0
      ),
      kinetic: ((0.5 * weight * Math.pow(speed, 2)) / 3600).toFixed(0),
    };
  };

  const getRollingResistance = (surface: string): number => {
    switch (surface) {
      case 'road':
        return 0.004; // Асфальт
      case 'concrete':
        return 0.005; // Бетон
      case 'gravel':
        return 0.008; // Гравий
      case 'dirt':
        return 0.012; // Грунт
      case 'sand':
        return 0.02; // Песок
      case 'mud':
        return 0.025; // Грязь
      default:
        return 0.004;
    }
  };

  const analyzePerformance = (
    power: number,
    riderWeight: number,
    speed: number,
    grade: number
  ) => {
    // Удельная мощность (Вт/кг)
    const powerToWeight = power / riderWeight;

    // Классификация по мощности
    let powerClass = '';
    if (powerToWeight < 2.5) powerClass = 'Новичок';
    else if (powerToWeight < 3.5) powerClass = 'Любитель';
    else if (powerToWeight < 4.5) powerClass = 'Продвинутый';
    else if (powerToWeight < 5.5) powerClass = 'Эксперт';
    else powerClass = 'Профессионал';

    // Оценка сложности маршрута
    let routeDifficulty = '';
    if (grade < 2) routeDifficulty = 'Легкий';
    else if (grade < 5) routeDifficulty = 'Умеренный';
    else if (grade < 8) routeDifficulty = 'Сложный';
    else if (grade < 12) routeDifficulty = 'Очень сложный';
    else routeDifficulty = 'Экстремальный';

    // Рекомендуемый каденс
    let recommendedCadence = '';
    if (grade > 8) recommendedCadence = '60-70 об/мин (низкая передача)';
    else if (grade > 5) recommendedCadence = '70-80 об/мин';
    else if (grade > 2) recommendedCadence = '80-90 об/мин';
    else recommendedCadence = '90-100 об/мин (высокая передача)';

    return {
      powerToWeight: powerToWeight.toFixed(2),
      powerClass,
      routeDifficulty,
      recommendedCadence,
    };
  };

  const getRecommendations = (
    power: number,
    riderWeight: number,
    speed: number,
    grade: number,
    surface: string
  ): string[] => {
    const recommendations = [];
    const powerToWeight = power / riderWeight;

    // Рекомендации по мощности
    if (powerToWeight < 2.5) {
      recommendations.push(
        'Низкая удельная мощность - сосредоточьтесь на выносливости и базовой подготовке'
      );
    } else if (powerToWeight > 5.0) {
      recommendations.push(
        'Высокая удельная мощность - отличная форма! Работайте над поддержанием уровня'
      );
    }

    // Рекомендации по подъему
    if (grade > 8) {
      recommendations.push(
        'Крутой подъем - используйте низкие передачи и поддерживайте стабильный темп'
      );
    } else if (grade < 2) {
      recommendations.push(
        'Пологая местность - работайте над аэродинамикой и высокой скоростью'
      );
    }

    // Рекомендации по поверхности
    if (surface === 'gravel' || surface === 'dirt') {
      recommendations.push(
        'Сложная поверхность - снизьте скорость и используйте более широкие покрышки'
      );
    } else if (surface === 'sand' || surface === 'mud') {
      recommendations.push(
        'Очень сложная поверхность - рассмотрите возможность пешей прогулки'
      );
    }

    // Общие рекомендации
    recommendations.push(
      'Поддерживайте каденс 80-100 об/мин для оптимальной эффективности'
    );
    recommendations.push(
      'Регулярно тренируйтесь для улучшения силовой выносливости'
    );
    recommendations.push(
      'Используйте правильную посадку для снижения аэродинамического сопротивления'
    );
    recommendations.push('Планируйте маршрут с учетом ветра и рельефа');

    return recommendations;
  };

  const clearForm = () => {
    setRiderWeight('');
    setBikeWeight('');
    setTotalWeight('');
    setSpeed('');
    setGrade('0');
    setWindSpeed('0');
    setWindDirection('headwind');
    setSurface('road');
    setTemperature('20');
    setResult(null);
    setError('');
  };

  const getSurfaceName = (surface: string): string => {
    switch (surface) {
      case 'road':
        return 'Асфальт';
      case 'concrete':
        return 'Бетон';
      case 'gravel':
        return 'Гравий';
      case 'dirt':
        return 'Грунт';
      case 'sand':
        return 'Песок';
      case 'mud':
        return 'Грязь';
      default:
        return 'Асфальт';
    }
  };

  const getWindDirectionName = (direction: string): string => {
    switch (direction) {
      case 'headwind':
        return 'Встречный';
      case 'tailwind':
        return 'Попутный';
      case 'crosswind':
        return 'Боковой';
      default:
        return 'Без ветра';
    }
  };

  const handleWeightChange = (field: string, value: string) => {
    if (field === 'rider') {
      setRiderWeight(value);
      if (bikeWeight) {
        const total = parseFloat(value) + parseFloat(bikeWeight);
        setTotalWeight(total.toFixed(1));
      }
    } else if (field === 'bike') {
      setBikeWeight(value);
      if (riderWeight) {
        const total = parseFloat(value) + parseFloat(riderWeight);
        setTotalWeight(total.toFixed(1));
      }
    }
  };

  return (
    <div className={`${styles.calculator} powerCalculator`}>
      <div className="calculatorHeader">
        <h2>⚡ Калькулятор мощности велосипедиста</h2>
        <p>
          Рассчитайте необходимую мощность для преодоления различных условий
          езды с учетом веса, скорости, подъема и ветра.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculatePower();
        }}
      >
        <div className="inputGroup">
          <label>Вес и скорость</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="riderWeight">Вес велосипедиста (кг)</label>
              <input
                id="riderWeight"
                type="number"
                value={riderWeight}
                onChange={(e) => handleWeightChange('rider', e.target.value)}
                placeholder="Например: 75"
                step="0.1"
                min="30"
                max="200"
              />
            </div>
            <div>
              <label htmlFor="bikeWeight">Вес велосипеда (кг)</label>
              <input
                id="bikeWeight"
                type="number"
                value={bikeWeight}
                onChange={(e) => handleWeightChange('bike', e.target.value)}
                placeholder="Например: 8"
                step="0.1"
                min="5"
                max="25"
              />
            </div>
            <div>
              <label htmlFor="totalWeight">Общий вес (кг)</label>
              <input
                id="totalWeight"
                type="number"
                value={totalWeight}
                onChange={(e) => setTotalWeight(e.target.value)}
                placeholder="Автоматически"
                step="0.1"
                min="35"
                max="225"
                readOnly
              />
              <div className="help">Рассчитывается автоматически</div>
            </div>
            <div>
              <label htmlFor="speed">Скорость (км/ч)</label>
              <input
                id="speed"
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="Например: 25"
                step="0.1"
                min="5"
                max="80"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Условия езды</label>
          <div className="inputRow">
            <div>
              <label htmlFor="grade">Уклон (%)</label>
              <input
                id="grade"
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="0"
                step="0.1"
                min="-20"
                max="25"
              />
              <div className="help">
                Положительные значения - подъем, отрицательные - спуск
              </div>
            </div>
            <div>
              <label htmlFor="surface">Поверхность</label>
              <select
                id="surface"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
              >
                <option value="road">🛣️ Асфальт</option>
                <option value="concrete">🏗️ Бетон</option>
                <option value="gravel">🪨 Гравий</option>
                <option value="dirt">🌱 Грунт</option>
                <option value="sand">🏖️ Песок</option>
                <option value="mud">🌧️ Грязь</option>
              </select>
              <div className="help">
                {getSurfaceName(surface)} - влияет на сопротивление качения
              </div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Внешние факторы</label>
          <div className="inputRow">
            <div>
              <label htmlFor="windSpeed">Скорость ветра (км/ч)</label>
              <input
                id="windSpeed"
                type="number"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
                placeholder="0"
                step="1"
                min="0"
                max="50"
              />
            </div>
            <div>
              <label htmlFor="windDirection">Направление ветра</label>
              <select
                id="windDirection"
                value={windDirection}
                onChange={(e) => setWindDirection(e.target.value)}
              >
                <option value="headwind">💨 Встречный</option>
                <option value="tailwind">🌬️ Попутный</option>
                <option value="crosswind">🌪️ Боковой</option>
              </select>
              <div className="help">
                {getWindDirectionName(windDirection)} - влияет на сопротивление
                воздуха
              </div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="temperature">Температура воздуха (°C)</label>
          <input
            id="temperature"
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="20"
            step="1"
            min="-20"
            max="50"
          />
          <div className="help">
            Влияет на плотность воздуха и аэродинамическое сопротивление
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать мощность
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className="powerSummary">
            <div className="summaryItem">
              <span className="label">Общий вес:</span>
              <span className="value">{result.totalWeight} кг</span>
            </div>
            <div className="summaryItem">
              <span className="label">Скорость:</span>
              <span className="value">{result.speed} км/ч</span>
            </div>
            <div className="summaryItem">
              <span className="label">Уклон:</span>
              <span className="value">{result.grade}%</span>
            </div>
            <div className="summaryItem">
              <span className="label">Поверхность:</span>
              <span className="value">{getSurfaceName(result.surface)}</span>
            </div>
          </div>

          <div className="resultValue">
            <span className="amount">{result.power}</span>
            <span className="unit">ватт</span>
          </div>

          <div className="powerBreakdown">
            <h4>Разбивка мощности:</h4>
            <div className="breakdownGrid">
              <div className="breakdownItem">
                <span className="label">Гравитация (подъем):</span>
                <span className="value">
                  {result.powerBreakdown.gravity} Вт
                </span>
              </div>
              <div className="breakdownItem">
                <span className="label">Аэродинамика (ветер):</span>
                <span className="value">
                  {result.powerBreakdown.aerodynamic} Вт
                </span>
              </div>
              <div className="breakdownItem">
                <span className="label">Качение (поверхность):</span>
                <span className="value">
                  {result.powerBreakdown.rolling} Вт
                </span>
              </div>
              <div className="breakdownItem">
                <span className="label">Кинетика (ускорение):</span>
                <span className="value">
                  {result.powerBreakdown.kinetic} Вт
                </span>
              </div>
            </div>
          </div>

          <div className="performanceAnalysis">
            <h4>Анализ производительности:</h4>
            <div className="performanceGrid">
              <div className="performanceItem">
                <span className="label">Удельная мощность:</span>
                <span className="value">
                  {result.performance.powerToWeight} Вт/кг
                </span>
              </div>
              <div className="performanceItem">
                <span className="label">Класс велосипедиста:</span>
                <span className="value">{result.performance.powerClass}</span>
              </div>
              <div className="performanceItem">
                <span className="label">Сложность маршрута:</span>
                <span className="value">
                  {result.performance.routeDifficulty}
                </span>
              </div>
              <div className="performanceItem">
                <span className="label">Рекомендуемый каденс:</span>
                <span className="value">
                  {result.performance.recommendedCadence}
                </span>
              </div>
            </div>
          </div>

          <div className="recommendation">
            <strong>Рекомендации:</strong>
            <ul className="recommendationsList">
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

export default PowerCalculator;
