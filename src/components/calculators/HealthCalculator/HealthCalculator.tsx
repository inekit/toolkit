import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './HealthCalculator.module.scss';

const HealthCalculator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [calculatorType, setCalculatorType] = useState('bmi');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Состояние для ИМТ
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');

  // Состояние для калорий
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');

  // Состояние для идеального веса
  const [bodyFrame, setBodyFrame] = useState('medium');

  // Состояние для процента жира
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [neck, setNeck] = useState('');

  // Определяем режим калькулятора из URL параметров
  useEffect(() => {
    const type = location.pathname.split('/').pop();
    if (type && ['bmi', 'calories', 'body-fat'].includes(type)) {
      setCalculatorType(type);
    }
  }, [location.pathname]);

  // Обновляем URL при смене режима
  const handleTypeChange = (type: string) => {
    setCalculatorType(type);
    navigate(`/health/${type}`);
    setResult(null);
    setError('');
  };

  const calculateBMI = () => {
    setError('');

    if (!weight || !height || !age) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
      setError('Все значения должны быть числами');
      return;
    }

    if (weightNum <= 0 || heightNum <= 0 || ageNum <= 0) {
      setError('Все значения должны быть положительными');
      return;
    }

    if (weightNum > 500 || heightNum > 300) {
      setError('Проверьте правильность введенных значений');
      return;
    }

    const heightInMeters = heightNum / 100;
    const bmi = weightNum / (heightInMeters * heightInMeters);

    const bmiCategory = getBMICategory(bmi, ageNum);
    const idealWeight = calculateIdealWeight(heightNum, gender, bodyFrame);
    const weightStatus = getWeightStatus(weightNum, idealWeight);

    const healthRisks = getHealthRisks(bmi);
    const recommendations = getBMIRecommendations(
      bmi,
      weightNum,
      idealWeight,
      ageNum
    );

    setResult({
      type: 'bmi',
      weight: weightNum,
      height: heightNum,
      age: ageNum,
      bmi: bmi.toFixed(1),
      bmiCategory,
      idealWeight: idealWeight.toFixed(1),
      weightStatus,
      healthRisks,
      recommendations,
    });
  };

  const calculateCalories = () => {
    setError('');

    if (!weight || !height || !age || !gender) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
      setError('Все значения должны быть числами');
      return;
    }

    // Расчет базового метаболизма (BMR) по формуле Миффлина-Сан Жеора
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Коэффициенты активности
    const activityMultipliers = {
      sedentary: 1.2, // Сидячий образ жизни
      light: 1.375, // Легкая активность
      moderate: 1.55, // Умеренная активность
      active: 1.725, // Высокая активность
      veryActive: 1.9, // Очень высокая активность
    };

    const tdee =
      bmr *
      activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Корректировка по цели
    const goalMultipliers = {
      lose: 0.85, // Похудение
      maintain: 1.0, // Поддержание веса
      gain: 1.15, // Набор веса
    };

    const targetCalories =
      tdee * goalMultipliers[goal as keyof typeof goalMultipliers];

    // Расчет макронутриентов
    const macros = calculateMacros(targetCalories, goal);

    const recommendations = getCalorieRecommendations(
      goal,
      activityLevel,
      targetCalories
    );

    setResult({
      type: 'calories',
      weight: weightNum,
      height: heightNum,
      age: ageNum,
      gender,
      bmr: bmr.toFixed(0),
      tdee: tdee.toFixed(0),
      targetCalories: targetCalories.toFixed(0),
      activityLevel,
      goal,
      macros,
      recommendations,
    });
  };

  const calculateBodyFat = () => {
    setError('');

    if (!weight || !waist || !hip || !neck || !height || !age || !gender) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const weightNum = parseFloat(weight);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);
    const neckNum = parseFloat(neck);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (
      isNaN(weightNum) ||
      isNaN(waistNum) ||
      isNaN(hipNum) ||
      isNaN(neckNum) ||
      isNaN(heightNum) ||
      isNaN(ageNum)
    ) {
      setError('Все значения должны быть числами');
      return;
    }

    // Расчет процента жира по формуле ВМС США
    let bodyFatPercentage = 0;
    if (gender === 'male') {
      bodyFatPercentage =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waistNum - neckNum) +
            0.15456 * Math.log10(heightNum)) -
        450;
    } else {
      bodyFatPercentage =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waistNum + hipNum - neckNum) +
            0.221 * Math.log10(heightNum)) -
        450;
    }

    const bodyFatCategory = getBodyFatCategory(
      bodyFatPercentage,
      gender,
      ageNum
    );
    const leanMass = weightNum - (weightNum * bodyFatPercentage) / 100;
    const recommendations = getBodyFatRecommendations(
      bodyFatPercentage,
      bodyFatCategory,
      gender
    );

    setResult({
      type: 'body-fat',
      weight: weightNum,
      waist: waistNum,
      hip: hipNum,
      neck: neckNum,
      height: heightNum,
      age: ageNum,
      gender,
      bodyFatPercentage: bodyFatPercentage.toFixed(1),
      bodyFatCategory,
      leanMass: leanMass.toFixed(1),
      recommendations,
    });
  };

  const getBMICategory = (bmi: number, age: number): string => {
    if (age < 18) {
      // Для детей и подростков нужны специальные таблицы
      return 'Требуется консультация врача';
    }

    if (bmi < 16) return 'Выраженный дефицит массы тела';
    if (bmi < 18.5) return 'Недостаточная масса тела';
    if (bmi < 25) return 'Нормальная масса тела';
    if (bmi < 30) return 'Избыточная масса тела';
    if (bmi < 35) return 'Ожирение I степени';
    if (bmi < 40) return 'Ожирение II степени';
    return 'Ожирение III степени';
  };

  const calculateIdealWeight = (
    height: number,
    gender: string,
    frame: string
  ): number => {
    // Формула Лоренца
    let baseWeight = 0;
    if (gender === 'male') {
      baseWeight = height - 100 - (height - 150) / 4;
    } else {
      baseWeight = height - 100 - (height - 150) / 2;
    }

    // Корректировка по типу телосложения
    const frameMultipliers = {
      small: 0.9,
      medium: 1.0,
      large: 1.1,
    };

    return (
      baseWeight * frameMultipliers[frame as keyof typeof frameMultipliers]
    );
  };

  const getWeightStatus = (
    currentWeight: number,
    idealWeight: number
  ): string => {
    const difference = currentWeight - idealWeight;
    const percentage = (difference / idealWeight) * 100;

    if (percentage < -20) return 'Критический дефицит веса';
    if (percentage < -10) return 'Дефицит веса';
    if (percentage < 10) return 'Нормальный вес';
    if (percentage < 20) return 'Избыток веса';
    if (percentage < 30) return 'Ожирение';
    return 'Критическое ожирение';
  };

  const getHealthRisks = (bmi: number): string[] => {
    const risks = [];

    if (bmi < 18.5) {
      risks.push('Повышенный риск инфекционных заболеваний');
      risks.push('Снижение иммунитета');
      risks.push('Проблемы с фертильностью');
    } else if (bmi > 25) {
      risks.push('Повышенный риск сердечно-сосудистых заболеваний');
      risks.push('Риск развития диабета 2 типа');
      risks.push('Повышенная нагрузка на суставы');
    }

    if (bmi > 30) {
      risks.push('Высокий риск метаболического синдрома');
      risks.push('Повышенный риск онкологических заболеваний');
      risks.push('Проблемы с дыханием во сне');
    }

    return risks;
  };

  const calculateMacros = (calories: number, goal: string) => {
    let proteinRatio = 0.25;
    let fatRatio = 0.25;
    let carbsRatio = 0.5;

    if (goal === 'lose') {
      proteinRatio = 0.3;
      fatRatio = 0.3;
      carbsRatio = 0.4;
    } else if (goal === 'gain') {
      proteinRatio = 0.2;
      fatRatio = 0.2;
      carbsRatio = 0.6;
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4),
      fat: Math.round((calories * fatRatio) / 9),
      carbs: Math.round((calories * carbsRatio) / 4),
    };
  };

  const getBodyFatCategory = (
    percentage: number,
    gender: string,
    age: number
  ): string => {
    if (gender === 'male') {
      if (age < 30) {
        if (percentage < 6) return 'Слишком низкий';
        if (percentage < 14) return 'Спортивный';
        if (percentage < 18) return 'Фитнес';
        if (percentage < 25) return 'Приемлемый';
        if (percentage < 32) return 'Высокий';
        return 'Очень высокий';
      } else if (age < 50) {
        if (percentage < 11) return 'Слишком низкий';
        if (percentage < 17) return 'Спортивный';
        if (percentage < 22) return 'Фитнес';
        if (percentage < 27) return 'Приемлемый';
        if (percentage < 34) return 'Высокий';
        return 'Очень высокий';
      } else {
        if (percentage < 13) return 'Слишком низкий';
        if (percentage < 19) return 'Спортивный';
        if (percentage < 24) return 'Фитнес';
        if (percentage < 29) return 'Приемлемый';
        if (percentage < 36) return 'Высокий';
        return 'Очень высокий';
      }
    } else {
      if (age < 30) {
        if (percentage < 14) return 'Слишком низкий';
        if (percentage < 21) return 'Спортивный';
        if (percentage < 25) return 'Фитнес';
        if (percentage < 32) return 'Приемлемый';
        if (percentage < 38) return 'Высокий';
        return 'Очень высокий';
      } else if (age < 50) {
        if (percentage < 16) return 'Слишком низкий';
        if (percentage < 23) return 'Спортивный';
        if (percentage < 27) return 'Фитнес';
        if (percentage < 34) return 'Приемлемый';
        if (percentage < 40) return 'Высокий';
        return 'Очень высокий';
      } else {
        if (percentage < 17) return 'Слишком низкий';
        if (percentage < 24) return 'Спортивный';
        if (percentage < 28) return 'Фитнес';
        if (percentage < 35) return 'Приемлемый';
        if (percentage < 41) return 'Высокий';
        return 'Очень высокий';
      }
    }
  };

  const getBMIRecommendations = (
    bmi: number,
    weight: number,
    idealWeight: number,
    age: number
  ): string[] => {
    const recommendations = [];

    if (bmi < 18.5) {
      recommendations.push('Увеличьте потребление калорий на 300-500 в день');
      recommendations.push(
        'Добавьте силовые тренировки для набора мышечной массы'
      );
      recommendations.push('Проконсультируйтесь с диетологом');
    } else if (bmi > 25) {
      recommendations.push('Создайте дефицит калорий 300-500 в день');
      recommendations.push('Увеличьте физическую активность');
      recommendations.push('Сосредоточьтесь на белковой пище');
    }

    if (age > 50) {
      recommendations.push('Обратите внимание на кальций и витамин D');
      recommendations.push('Включите упражнения на равновесие');
    }

    recommendations.push('Регулярно проходите медицинские осмотры');
    recommendations.push('Ведите дневник питания и активности');

    return recommendations;
  };

  const getCalorieRecommendations = (
    goal: string,
    activityLevel: string,
    calories: number
  ): string[] => {
    const recommendations = [];

    if (goal === 'lose') {
      recommendations.push(
        'Создайте дефицит калорий через питание и упражнения'
      );
      recommendations.push(
        'Увеличьте потребление белка до 1.6-2.2 г на кг веса'
      );
      recommendations.push('Добавьте кардио тренировки 3-5 раз в неделю');
    } else if (goal === 'gain') {
      recommendations.push('Создайте профицит калорий 300-500 в день');
      recommendations.push('Увеличьте потребление углеводов для энергии');
      recommendations.push('Сосредоточьтесь на силовых тренировках');
    } else {
      recommendations.push('Поддерживайте баланс калорий');
      recommendations.push('Разнообразьте физическую активность');
      recommendations.push('Следите за качеством питания');
    }

    if (activityLevel === 'sedentary') {
      recommendations.push('Начните с легких прогулок 30 минут в день');
    } else if (activityLevel === 'veryActive') {
      recommendations.push('Убедитесь в достаточном восстановлении');
      recommendations.push('Следите за качеством сна');
    }

    return recommendations;
  };

  const getBodyFatRecommendations = (
    percentage: number,
    category: string,
    gender: string
  ): string[] => {
    const recommendations = [];

    if (category.includes('Слишком низкий')) {
      recommendations.push('Увеличьте потребление полезных жиров');
      recommendations.push('Добавьте силовые тренировки');
      recommendations.push('Проконсультируйтесь с врачом');
    } else if (
      category.includes('Высокий') ||
      category.includes('Очень высокий')
    ) {
      recommendations.push('Создайте дефицит калорий');
      recommendations.push('Увеличьте кардио тренировки');
      recommendations.push('Сосредоточьтесь на белковой пище');
    }

    if (gender === 'female' && percentage < 15) {
      recommendations.push('Обратите внимание на репродуктивное здоровье');
    }

    recommendations.push('Регулярно измеряйте процент жира');
    recommendations.push('Следите за изменениями в зеркале и одежде');

    return recommendations;
  };

  const clearForm = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setActivityLevel('moderate');
    setGoal('maintain');
    setBodyFrame('medium');
    setWaist('');
    setHip('');
    setNeck('');
    setResult(null);
    setError('');
  };

  return (
    <div className={`${styles.calculator} healthCalculator`}>
      <div className="calculatorHeader">
        <h2>🏥 Калькулятор здоровья</h2>
        <p>
          Рассчитайте ИМТ, потребность в калориях, процент жира в организме и
          получите персональные рекомендации для здоровья.
        </p>
      </div>

      {calculatorType === 'bmi' && (
        <form
          className="calculatorForm"
          onSubmit={(e) => {
            e.preventDefault();
            calculateBMI();
          }}
        >
          <div className="inputGroup">
            <label>Основные параметры</label>
            <div className={styles.inputGrid}>
              <div>
                <label htmlFor="weight">Вес (кг)</label>
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Например: 70"
                  step="0.1"
                  min="20"
                  max="500"
                />
              </div>
              <div>
                <label htmlFor="height">Рост (см)</label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Например: 175"
                  step="1"
                  min="100"
                  max="300"
                />
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <label>Дополнительные параметры</label>
            <div className={styles.inputRow}>
              <div>
                <label htmlFor="age">Возраст (лет)</label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Например: 30"
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label htmlFor="gender">Пол</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>
              <div>
                <label htmlFor="bodyFrame">Тип телосложения</label>
                <select
                  id="bodyFrame"
                  value={bodyFrame}
                  onChange={(e) => setBodyFrame(e.target.value)}
                >
                  <option value="small">Тонкокостный</option>
                  <option value="medium">Среднекостный</option>
                  <option value="large">Ширококостный</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="inputGroup">
            <button type="submit" className="calculateBtn">
              Рассчитать ИМТ
            </button>
          </div>
        </form>
      )}

      {calculatorType === 'calories' && (
        <form
          className="calculatorForm"
          onSubmit={(e) => {
            e.preventDefault();
            calculateCalories();
          }}
        >
          <div className="inputGroup">
            <label>Основные параметры</label>
            <div className="inputGrid">
              <div>
                <label htmlFor="weight">Вес (кг)</label>
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Например: 70"
                  step="0.1"
                  min="20"
                  max="500"
                />
              </div>
              <div>
                <label htmlFor="height">Рост (см)</label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Например: 175"
                  step="1"
                  min="100"
                  max="300"
                />
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <label>Дополнительные параметры</label>
            <div className={styles.inputRow}>
              <div>
                <label htmlFor="age">Возраст (лет)</label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Например: 30"
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label htmlFor="gender">Пол</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <label>Образ жизни и цели</label>
            <div className={styles.inputRow}>
              <div>
                <label htmlFor="activityLevel">Уровень активности</label>
                <select
                  id="activityLevel"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="sedentary">Сидячий образ жизни</option>
                  <option value="light">Легкая активность</option>
                  <option value="moderate">Умеренная активность</option>
                  <option value="active">Высокая активность</option>
                  <option value="veryActive">Очень высокая активность</option>
                </select>
              </div>
              <div>
                <label htmlFor="goal">Цель</label>
                <select
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="lose">Похудение</option>
                  <option value="maintain">Поддержание веса</option>
                  <option value="gain">Набор веса</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="inputGroup">
            <button type="submit" className="calculateBtn">
              Рассчитать калории
            </button>
          </div>
        </form>
      )}

      {calculatorType === 'body-fat' && (
        <form
          className="calculatorForm"
          onSubmit={(e) => {
            e.preventDefault();
            calculateBodyFat();
          }}
        >
          <div className="inputGroup">
            <label>Основные параметры</label>
            <div className="inputGrid">
              <div>
                <label htmlFor="weight">Вес (кг)</label>
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Например: 70"
                  step="0.1"
                  min="30"
                  max="300"
                />
              </div>
              <div>
                <label htmlFor="height">Рост (см)</label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Например: 175"
                  step="1"
                  min="100"
                  max="300"
                />
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <label>Измерения (см)</label>
            <div className="inputGrid">
              <div>
                <label htmlFor="waist">Обхват талии</label>
                <input
                  id="waist"
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="Например: 80"
                  step="0.1"
                  min="40"
                  max="200"
                />
              </div>
              <div>
                <label htmlFor="hip">Обхват бедер</label>
                <input
                  id="hip"
                  type="number"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  placeholder="Например: 95"
                  step="0.1"
                  min="50"
                  max="200"
                />
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <label>Дополнительные измерения</label>
            <div className={styles.inputRow}>
              <div>
                <label htmlFor="neck">Обхват шеи</label>
                <input
                  id="neck"
                  type="number"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  placeholder="Например: 35"
                  step="0.1"
                  min="20"
                  max="80"
                />
              </div>
              <div>
                <label htmlFor="age">Возраст (лет)</label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Например: 30"
                  min="1"
                  max="120"
                />
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <label htmlFor="gender">Пол</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="inputGroup">
            <button type="submit" className="calculateBtn">
              Рассчитать процент жира
            </button>
          </div>
        </form>
      )}

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          {result.type === 'bmi' && (
            <div className={styles.bmiResult}>
              <div className={styles.bmiSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Ваш ИМТ:</span>
                  <span className={styles.value}>{result.bmi}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Категория:</span>
                  <span className={styles.value}>{result.bmiCategory}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Идеальный вес:</span>
                  <span className={styles.value}>{result.idealWeight} кг</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Статус веса:</span>
                  <span className={styles.value}>{result.weightStatus}</span>
                </div>
              </div>

              <div className={styles.resultValue}>
                <span className={styles.amount}>{result.bmi}</span>
                <span className={styles.unit}>ИМТ</span>
              </div>

              {result.healthRisks.length > 0 && (
                <div className={styles.healthRisks}>
                  <h4>Риски для здоровья:</h4>
                  <ul>
                    {result.healthRisks.map((risk: string, index: number) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {result.type === 'calories' && (
            <div className={styles.caloriesResult}>
              <div className={styles.caloriesSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>
                    Базовый метаболизм (BMR):
                  </span>
                  <span className={styles.value}>{result.bmr} ккал/день</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>
                    Общий расход энергии (TDEE):
                  </span>
                  <span className={styles.value}>{result.tdee} ккал/день</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Целевые калории:</span>
                  <span className={styles.value}>
                    {result.targetCalories} ккал/день
                  </span>
                </div>
              </div>

              <div className={styles.resultValue}>
                <span className={styles.amount}>{result.targetCalories}</span>
                <span className={styles.unit}>ккал/день</span>
              </div>

              <div className={styles.macrosAnalysis}>
                <h4>Рекомендуемые макронутриенты:</h4>
                <div className={styles.macrosGrid}>
                  <div className={styles.macroItem + ' ' + styles.protein}>
                    <span className={styles.label}>Белки:</span>
                    <span className={styles.value}>
                      {result.macros.protein} г
                    </span>
                  </div>
                  <div className={styles.macroItem + ' ' + styles.fat}>
                    <span className={styles.label}>Жиры:</span>
                    <span className={styles.value}>{result.macros.fat} г</span>
                  </div>
                  <div className={styles.macroItem + ' ' + styles.carbs}>
                    <span className={styles.label}>Углеводы:</span>
                    <span className={styles.value}>
                      {result.macros.carbs} г
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result.type === 'body-fat' && (
            <div className={styles.bodyFatResult}>
              <div className={styles.bodyFatSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>
                    Процент жира в организме:
                  </span>
                  <span className={styles.value}>
                    {result.bodyFatPercentage}%
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Категория:</span>
                  <span className={styles.value}>{result.bodyFatCategory}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Сухая масса тела:</span>
                  <span className={styles.value}>{result.leanMass} кг</span>
                </div>
              </div>

              <div className={styles.resultValue}>
                <span className={styles.amount}>
                  {result.bodyFatPercentage}%
                </span>
                <span className={styles.unit}>жира в организме</span>
              </div>
            </div>
          )}

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

export default HealthCalculator;
