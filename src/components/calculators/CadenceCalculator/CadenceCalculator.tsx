import React, { useState } from 'react';
import styles from './CadenceCalculator.module.scss';

const CadenceCalculator: React.FC = () => {
  const [riderType, setRiderType] = useState('recreational');
  const [terrain, setTerrain] = useState('flat');
  const [distance, setDistance] = useState('');
  const [fitness, setFitness] = useState('moderate');
  const [experience, setExperience] = useState('intermediate');
  const [goal, setGoal] = useState('endurance');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateCadence = () => {
    setError('');

    if (!distance) {
      setError('Пожалуйста, укажите расстояние маршрута');
      return;
    }

    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      setError('Расстояние должно быть положительным числом');
      return;
    }

    if (distanceNum > 500) {
      setError('Расстояние слишком большое для данного калькулятора');
      return;
    }

    // Расчет оптимального каденса
    const cadence = calculateOptimalCadence(
      riderType,
      terrain,
      distanceNum,
      fitness,
      experience,
      goal
    );

    // Расчет передаточных отношений
    const gearRatios = calculateGearRatios(cadence, terrain, distanceNum);

    // Рекомендации по тренировке
    const training = generateTrainingPlan(cadence, riderType, fitness, goal);

    // Анализ эффективности
    const efficiency = analyzeEfficiency(
      cadence,
      terrain,
      distanceNum,
      fitness
    );

    setResult({
      distance: distanceNum.toFixed(1),
      cadence,
      gearRatios,
      training,
      efficiency,
      recommendations: getCadenceRecommendations(
        cadence,
        riderType,
        terrain,
        distanceNum,
        fitness,
        experience,
        goal
      ),
    });
  };

  const calculateOptimalCadence = (
    type: string,
    terrainType: string,
    distance: number,
    fitnessLevel: string,
    experienceLevel: string,
    trainingGoal: string
  ): any => {
    // Базовый каденс для разных типов велосипедистов
    let baseCadence = 0;
    switch (type) {
      case 'recreational':
        baseCadence = 70;
        break;
      case 'fitness':
        baseCadence = 80;
        break;
      case 'racing':
        baseCadence = 90;
        break;
      case 'mountain':
        baseCadence = 75;
        break;
      case 'commuter':
        baseCadence = 75;
        break;
      default:
        baseCadence = 80;
    }

    // Корректировка по местности
    let terrainMultiplier = 1.0;
    switch (terrainType) {
      case 'flat':
        terrainMultiplier = 1.0;
        break;
      case 'rolling':
        terrainMultiplier = 0.9;
        break;
      case 'hilly':
        terrainMultiplier = 0.8;
        break;
      case 'mountainous':
        terrainMultiplier = 0.7;
        break;
      default:
        terrainMultiplier = 1.0;
    }

    // Корректировка по дистанции
    let distanceMultiplier = 1.0;
    if (distance < 20) distanceMultiplier = 1.1;
    else if (distance < 50) distanceMultiplier = 1.0;
    else if (distance < 100) distanceMultiplier = 0.95;
    else distanceMultiplier = 0.9;

    // Корректировка по уровню подготовки
    let fitnessMultiplier = 1.0;
    switch (fitnessLevel) {
      case 'beginner':
        fitnessMultiplier = 0.9;
        break;
      case 'moderate':
        fitnessMultiplier = 1.0;
        break;
      case 'advanced':
        fitnessMultiplier = 1.1;
        break;
      case 'elite':
        fitnessMultiplier = 1.15;
        break;
      default:
        fitnessMultiplier = 1.0;
    }

    // Корректировка по опыту
    let experienceMultiplier = 1.0;
    switch (experienceLevel) {
      case 'beginner':
        experienceMultiplier = 0.85;
        break;
      case 'intermediate':
        experienceMultiplier = 1.0;
        break;
      case 'advanced':
        experienceMultiplier = 1.1;
        break;
      case 'expert':
        experienceMultiplier = 1.15;
        break;
      default:
        experienceMultiplier = 1.0;
    }

    // Корректировка по цели
    let goalMultiplier = 1.0;
    switch (trainingGoal) {
      case 'endurance':
        goalMultiplier = 0.95;
        break;
      case 'speed':
        goalMultiplier = 1.1;
        break;
      case 'power':
        goalMultiplier = 0.9;
        break;
      case 'recovery':
        goalMultiplier = 0.8;
        break;
      default:
        goalMultiplier = 1.0;
    }

    // Итоговый каденс
    const optimalCadence = Math.round(
      baseCadence *
        terrainMultiplier *
        distanceMultiplier *
        fitnessMultiplier *
        experienceMultiplier *
        goalMultiplier
    );

    // Диапазон каденса
    const cadenceRange = {
      low: Math.max(optimalCadence - 10, 50),
      optimal: optimalCadence,
      high: Math.min(optimalCadence + 10, 120),
    };

    // Каденс для разных участков
    const cadenceByTerrain = {
      flat: Math.round(optimalCadence * 1.05),
      rolling: optimalCadence,
      hilly: Math.round(optimalCadence * 0.9),
      mountainous: Math.round(optimalCadence * 0.8),
    };

    return {
      range: cadenceRange,
      byTerrain: cadenceByTerrain,
      base: baseCadence,
      factors: {
        terrain: terrainMultiplier,
        distance: distanceMultiplier,
        fitness: fitnessMultiplier,
        experience: experienceMultiplier,
        goal: goalMultiplier,
      },
    };
  };

  const calculateGearRatios = (
    cadence: any,
    terrainType: string,
    distance: number
  ) => {
    // Базовые передаточные отношения для разных местностей
    const baseRatios = {
      flat: { low: 2.0, high: 4.5 },
      rolling: { low: 1.8, high: 4.0 },
      hilly: { low: 1.5, high: 3.5 },
      mountainous: { low: 1.2, high: 3.0 },
    };

    const ratios =
      baseRatios[terrainType as keyof typeof baseRatios] || baseRatios.flat;

    // Корректировка по дистанции
    let distanceAdjustment = 1.0;
    if (distance > 100) distanceAdjustment = 0.9;
    else if (distance < 20) distanceAdjustment = 1.1;

    // Корректировка по каденсу
    let cadenceAdjustment = 1.0;
    if (cadence.range.optimal > 90) cadenceAdjustment = 1.1;
    else if (cadence.range.optimal < 70) cadenceAdjustment = 0.9;

    return {
      recommended: {
        low: (ratios.low * distanceAdjustment * cadenceAdjustment).toFixed(2),
        optimal: (ratios.low + (ratios.high - ratios.low) * 0.6).toFixed(2),
        high: (ratios.high * distanceAdjustment * cadenceAdjustment).toFixed(2),
      },
      explanation: getGearRatioExplanation(
        terrainType,
        distance,
        cadence.range.optimal
      ),
    };
  };

  const getGearRatioExplanation = (
    terrain: string,
    distance: number,
    cadence: number
  ): string => {
    let explanation = '';

    if (terrain === 'flat') {
      explanation =
        'На ровной местности используйте высокие передачи для поддержания скорости';
    } else if (terrain === 'rolling') {
      explanation = 'На холмистой местности адаптируйте передачи под рельеф';
    } else if (terrain === 'hilly') {
      explanation =
        'На горной местности используйте низкие передачи для подъемов';
    } else if (terrain === 'mountainous') {
      explanation = 'В горах приоритет низким передачам для экономии сил';
    }

    if (distance > 100) {
      explanation += ' На длинных дистанциях важна экономия энергии';
    }

    if (cadence > 90) {
      explanation += ' Высокий каденс требует более легких передач';
    } else if (cadence < 70) {
      explanation +=
        ' Низкий каденс позволяет использовать более тяжелые передачи';
    }

    return explanation;
  };

  const generateTrainingPlan = (
    cadence: any,
    type: string,
    fitness: string,
    goal: string
  ) => {
    const plan: any = {};

    // Базовые тренировки
    plan.weekly = {
      easy: Math.round(cadence.range.optimal * 0.8),
      moderate: cadence.range.optimal,
      hard: Math.round(cadence.range.optimal * 1.2),
    };

    // Специфичные тренировки по цели
    if (goal === 'endurance') {
      plan.specific = {
        longRide: Math.round(cadence.range.optimal * 0.85),
        tempo: Math.round(cadence.range.optimal * 1.05),
        recovery: Math.round(cadence.range.optimal * 0.75),
      };
    } else if (goal === 'speed') {
      plan.specific = {
        intervals: Math.round(cadence.range.optimal * 1.15),
        sprints: Math.round(cadence.range.optimal * 1.3),
        threshold: Math.round(cadence.range.optimal * 1.1),
      };
    } else if (goal === 'power') {
      plan.specific = {
        hillClimbs: Math.round(cadence.range.optimal * 0.7),
        bigGear: Math.round(cadence.range.optimal * 0.6),
        standing: Math.round(cadence.range.optimal * 0.8),
      };
    } else {
      plan.specific = {
        recovery: Math.round(cadence.range.optimal * 0.8),
        moderate: cadence.range.optimal,
        easy: Math.round(cadence.range.optimal * 0.9),
      };
    }

    // Рекомендации по тренировкам
    plan.recommendations = getTrainingRecommendations(type, fitness, goal);

    return plan;
  };

  const getTrainingRecommendations = (
    type: string,
    fitness: string,
    goal: string
  ): string[] => {
    const recommendations = [];

    // Рекомендации по типу велосипедиста
    if (type === 'recreational') {
      recommendations.push(
        'Начните с коротких поездок и постепенно увеличивайте дистанцию'
      );
    } else if (type === 'racing') {
      recommendations.push(
        'Включите интервальные тренировки для повышения скорости'
      );
    } else if (type === 'mountain') {
      recommendations.push(
        'Тренируйтесь на технических участках для улучшения навыков'
      );
    }

    // Рекомендации по уровню подготовки
    if (fitness === 'beginner') {
      recommendations.push(
        'Сосредоточьтесь на регулярности тренировок, а не на интенсивности'
      );
    } else if (fitness === 'elite') {
      recommendations.push(
        'Используйте структурированные тренировки с точным контролем нагрузки'
      );
    }

    // Рекомендации по цели
    if (goal === 'endurance') {
      recommendations.push('Увеличивайте длительность поездок постепенно');
    } else if (goal === 'speed') {
      recommendations.push('Включите скоростные интервалы в тренировки');
    } else if (goal === 'power') {
      recommendations.push('Тренируйтесь на подъемах для развития силы');
    }

    return recommendations;
  };

  const analyzeEfficiency = (
    cadence: any,
    terrain: string,
    distance: number,
    fitness: string
  ) => {
    const analysis: any = {};

    // Оценка эффективности каденса
    const optimalCadence = cadence.range.optimal;
    if (optimalCadence >= 80 && optimalCadence <= 100) {
      analysis.cadenceEfficiency = 'Отличная';
      analysis.cadenceScore = 95;
    } else if (optimalCadence >= 70 && optimalCadence <= 110) {
      analysis.cadenceEfficiency = 'Хорошая';
      analysis.cadenceScore = 80;
    } else if (optimalCadence >= 60 && optimalCadence <= 120) {
      analysis.cadenceEfficiency = 'Удовлетворительная';
      analysis.cadenceScore = 65;
    } else {
      analysis.cadenceEfficiency = 'Требует улучшения';
      analysis.cadenceScore = 40;
    }

    // Оценка по местности
    if (terrain === 'flat' && optimalCadence >= 80) {
      analysis.terrainEfficiency = 'Оптимальная';
    } else if (terrain === 'mountainous' && optimalCadence <= 80) {
      analysis.terrainEfficiency = 'Оптимальная';
    } else {
      analysis.terrainEfficiency = 'Хорошая';
    }

    // Оценка по дистанции
    if (distance < 50 && optimalCadence >= 85) {
      analysis.distanceEfficiency = 'Высокая';
    } else if (distance > 100 && optimalCadence <= 85) {
      analysis.distanceEfficiency = 'Высокая';
    } else {
      analysis.distanceEfficiency = 'Средняя';
    }

    // Общая оценка
    const totalScore = Math.round((analysis.cadenceScore + 80 + 70) / 3);

    if (totalScore >= 85) analysis.overall = 'Отличная';
    else if (totalScore >= 70) analysis.overall = 'Хорошая';
    else if (totalScore >= 55) analysis.overall = 'Удовлетворительная';
    else analysis.overall = 'Требует улучшения';

    analysis.totalScore = totalScore;

    return analysis;
  };

  const getCadenceRecommendations = (
    cadence: any,
    type: string,
    terrain: string,
    distance: number,
    fitness: string,
    experience: string,
    goal: string
  ): string[] => {
    const recommendations = [];

    // Рекомендации по каденсу
    if (cadence.range.optimal < 70) {
      recommendations.push(
        'Низкий каденс может привести к усталости мышц - работайте над повышением'
      );
    } else if (cadence.range.optimal > 100) {
      recommendations.push(
        'Высокий каденс требует хорошей техники - следите за плавностью педалирования'
      );
    }

    // Рекомендации по местности
    if (terrain === 'hilly' || terrain === 'mountainous') {
      recommendations.push('На подъемах снижайте каденс для экономии сил');
      recommendations.push(
        'Используйте низкие передачи для поддержания оптимального каденса'
      );
    } else if (terrain === 'flat') {
      recommendations.push(
        'На ровной местности поддерживайте стабильный высокий каденс'
      );
    }

    // Рекомендации по дистанции
    if (distance > 100) {
      recommendations.push(
        'На длинных дистанциях важна экономия энергии - используйте умеренный каденс'
      );
    } else if (distance < 20) {
      recommendations.push(
        'На коротких дистанциях можно использовать более высокий каденс'
      );
    }

    // Рекомендации по опыту
    if (experience === 'beginner') {
      recommendations.push(
        'Начинающим рекомендуется сосредоточиться на комфортном каденсе'
      );
    } else if (experience === 'expert') {
      recommendations.push(
        'Опытные велосипедисты могут экспериментировать с различными каденсами'
      );
    }

    // Общие рекомендации
    recommendations.push('Используйте велокомпьютер для контроля каденса');
    recommendations.push('Практикуйте различные каденса на тренировках');
    recommendations.push(
      'Прислушивайтесь к своему телу - комфорт важнее точных цифр'
    );

    return recommendations;
  };

  const clearForm = () => {
    setRiderType('recreational');
    setTerrain('flat');
    setDistance('');
    setFitness('moderate');
    setExperience('intermediate');
    setGoal('endurance');
    setResult(null);
    setError('');
  };

  const getRiderTypeName = (type: string): string => {
    switch (type) {
      case 'recreational':
        return 'Рекреационный';
      case 'fitness':
        return 'Фитнес';
      case 'racing':
        return 'Гоночный';
      case 'mountain':
        return 'Горный';
      case 'commuter':
        return 'Коммутер';
      default:
        return 'Рекреационный';
    }
  };

  const getTerrainName = (terrain: string): string => {
    switch (terrain) {
      case 'flat':
        return 'Ровная';
      case 'rolling':
        return 'Холмистая';
      case 'hilly':
        return 'Горная';
      case 'mountainous':
        return 'Горная (сложная)';
      default:
        return 'Ровная';
    }
  };

  const getFitnessName = (fitness: string): string => {
    switch (fitness) {
      case 'beginner':
        return 'Начинающий';
      case 'moderate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      case 'elite':
        return 'Элитный';
      default:
        return 'Средний';
    }
  };

  const getExperienceName = (experience: string): string => {
    switch (experience) {
      case 'beginner':
        return 'Начинающий';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      case 'expert':
        return 'Эксперт';
      default:
        return 'Средний';
    }
  };

  const getGoalName = (goal: string): string => {
    switch (goal) {
      case 'endurance':
        return 'Выносливость';
      case 'speed':
        return 'Скорость';
      case 'power':
        return 'Сила';
      case 'recovery':
        return 'Восстановление';
      default:
        return 'Выносливость';
    }
  };

  return (
    <div className={`${styles.calculator} cadenceCalculator`}>
      <div className="calculatorHeader">
        <h2>🔄 Калькулятор оптимального каденса</h2>
        <p>
          Рассчитайте оптимальный каденс для вашего типа езды, местности и
          тренировочных целей.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateCadence();
        }}
      >
        <div className="inputGroup">
          <label>Профиль велосипедиста</label>
          <div className="inputRow">
            <div>
              <label htmlFor="riderType">Тип велосипедиста</label>
              <select
                id="riderType"
                value={riderType}
                onChange={(e) => setRiderType(e.target.value)}
              >
                <option value="recreational">🚴 Рекреационный</option>
                <option value="fitness">💪 Фитнес</option>
                <option value="racing">🏁 Гоночный</option>
                <option value="mountain">🏔️ Горный</option>
                <option value="commuter">🚲 Коммутер</option>
              </select>
              <div className="help">
                {getRiderTypeName(riderType)} - влияет на базовый каденс
              </div>
            </div>
            <div>
              <label htmlFor="terrain">Тип местности</label>
              <select
                id="terrain"
                value={terrain}
                onChange={(e) => setTerrain(e.target.value)}
              >
                <option value="flat">🛣️ Ровная</option>
                <option value="rolling">🌄 Холмистая</option>
                <option value="hilly">⛰️ Горная</option>
                <option value="mountainous">🏔️ Горная (сложная)</option>
              </select>
              <div className="help">
                {getTerrainName(terrain)} - влияет на выбор передач
              </div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Параметры маршрута</label>
          <div className="inputRow">
            <div>
              <label htmlFor="distance">Расстояние (км)</label>
              <input
                id="distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Например: 50"
                step="0.1"
                min="1"
                max="500"
              />
            </div>
            <div>
              <label htmlFor="goal">Тренировочная цель</label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="endurance">⏱️ Выносливость</option>
                <option value="speed">⚡ Скорость</option>
                <option value="power">💪 Сила</option>
                <option value="recovery">🔄 Восстановление</option>
              </select>
              <div className="help">
                {getGoalName(goal)} - влияет на интенсивность
              </div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Уровень подготовки</label>
          <div className="inputRow">
            <div>
              <label htmlFor="fitness">Физическая форма</label>
              <select
                id="fitness"
                value={fitness}
                onChange={(e) => setFitness(e.target.value)}
              >
                <option value="beginner">🌱 Начинающий</option>
                <option value="moderate">🌿 Средний</option>
                <option value="advanced">🌳 Продвинутый</option>
                <option value="elite">🏆 Элитный</option>
              </select>
            </div>
            <div>
              <label htmlFor="experience">Опыт езды</label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="beginner">🎯 Начинающий</option>
                <option value="intermediate">🎯 Средний</option>
                <option value="advanced">🎯 Продвинутый</option>
                <option value="expert">🎯 Эксперт</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать каденс
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className="cadenceSummary">
            <div className="summaryItem">
              <span className="label">Расстояние:</span>
              <span className="value">{result.distance} км</span>
            </div>
            <div className="summaryItem">
              <span className="label">Тип велосипедиста:</span>
              <span className="value">
                {getRiderTypeName(result.riderType)}
              </span>
            </div>
            <div className="summaryItem">
              <span className="label">Местность:</span>
              <span className="value">{getTerrainName(result.terrain)}</span>
            </div>
            <div className="summaryItem">
              <span className="label">Цель:</span>
              <span className="value">{getGoalName(result.goal)}</span>
            </div>
          </div>

          <div className="cadenceResult">
            <h4>Оптимальный каденс:</h4>
            <div className="cadenceRange">
              <div className="rangeItem">
                <span className="label">Низкий:</span>
                <span className="value">{result.cadence.range.low} об/мин</span>
              </div>
              <div className="rangeItem optimal">
                <span className="label">Оптимальный:</span>
                <span className="value">
                  {result.cadence.range.optimal} об/мин
                </span>
              </div>
              <div className="rangeItem">
                <span className="label">Высокий:</span>
                <span className="value">
                  {result.cadence.range.high} об/мин
                </span>
              </div>
            </div>
          </div>

          <div className="cadenceByTerrain">
            <h4>Каденс по местности:</h4>
            <div className="terrainGrid">
              <div className="terrainItem">
                <span className="label">Ровная местность:</span>
                <span className="value">
                  {result.cadence.byTerrain.flat} об/мин
                </span>
              </div>
              <div className="terrainItem">
                <span className="label">Холмистая местность:</span>
                <span className="value">
                  {result.cadence.byTerrain.rolling} об/мин
                </span>
              </div>
              <div className="terrainItem">
                <span className="label">Горная местность:</span>
                <span className="value">
                  {result.cadence.byTerrain.hilly} об/мин
                </span>
              </div>
              <div className="terrainItem">
                <span className="label">Сложная горная:</span>
                <span className="value">
                  {result.cadence.byTerrain.mountainous} об/мин
                </span>
              </div>
            </div>
          </div>

          <div className="gearRecommendations">
            <h4>Рекомендуемые передачи:</h4>
            <div className="gearGrid">
              <div className="gearItem">
                <span className="label">Низкая передача:</span>
                <span className="value">
                  {result.gearRatios.recommended.low}
                </span>
              </div>
              <div className="gearItem">
                <span className="label">Оптимальная передача:</span>
                <span className="value">
                  {result.gearRatios.recommended.optimal}
                </span>
              </div>
              <div className="gearItem">
                <span className="label">Высокая передача:</span>
                <span className="value">
                  {result.gearRatios.recommended.high}
                </span>
              </div>
            </div>
            <p className="gearExplanation">{result.gearRatios.explanation}</p>
          </div>

          <div className="trainingPlan">
            <h4>План тренировок:</h4>
            <div className="trainingGrid">
              <div className="trainingSection">
                <h5>Еженедельные тренировки:</h5>
                <div className="trainingItem">
                  <span className="label">Легкая:</span>
                  <span className="value">
                    {result.training.weekly.easy} об/мин
                  </span>
                </div>
                <div className="trainingItem">
                  <span className="label">Умеренная:</span>
                  <span className="value">
                    {result.training.weekly.moderate} об/мин
                  </span>
                </div>
                <div className="trainingItem">
                  <span className="label">Интенсивная:</span>
                  <span className="value">
                    {result.training.weekly.hard} об/мин
                  </span>
                </div>
              </div>
              <div className="trainingSection">
                <h5>Специфичные тренировки:</h5>
                {Object.entries(result.training.specific).map(
                  ([key, value]) => (
                    <div key={key} className="trainingItem">
                      <span className="label">{getTrainingTypeName(key)}:</span>
                      <span className="value">{value} об/мин</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="efficiencyAnalysis">
            <h4>Анализ эффективности:</h4>
            <div className="efficiencyGrid">
              <div className="efficiencyItem">
                <span className="label">Эффективность каденса:</span>
                <span className="value">
                  {result.efficiency.cadenceEfficiency}
                </span>
              </div>
              <div className="efficiencyItem">
                <span className="label">По местности:</span>
                <span className="value">
                  {result.efficiency.terrainEfficiency}
                </span>
              </div>
              <div className="efficiencyItem">
                <span className="label">По дистанции:</span>
                <span className="value">
                  {result.efficiency.distanceEfficiency}
                </span>
              </div>
              <div className="efficiencyItem overall">
                <span className="label">Общая оценка:</span>
                <span className="value">
                  {result.efficiency.overall} ({result.efficiency.totalScore}
                  /100)
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

const getTrainingTypeName = (key: string): string => {
  switch (key) {
    case 'longRide':
      return 'Длинная поездка';
    case 'tempo':
      return 'Темповая';
    case 'recovery':
      return 'Восстановительная';
    case 'intervals':
      return 'Интервальная';
    case 'sprints':
      return 'Спринт';
    case 'threshold':
      return 'Пороговая';
    case 'hillClimbs':
      return 'Подъемы';
    case 'bigGear':
      return 'Большая передача';
    case 'standing':
      return 'Стоя';
    default:
      return key;
  }
};

export default CadenceCalculator;
