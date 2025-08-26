import React, { useState } from 'react';
import styles from './PetAgeCalculator.module.scss';

const PetAgeCalculator: React.FC = () => {
  const [petType, setPetType] = useState('dog');
  const [petAge, setPetAge] = useState('');
  const [petSize, setPetSize] = useState('medium');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateHumanAge = () => {
    setError('');

    if (!petAge) {
      setError('Пожалуйста, введите возраст питомца');
      return;
    }

    const age = parseFloat(petAge);
    if (isNaN(age) || age < 0 || age > 50) {
      setError('Возраст должен быть от 0 до 50 лет');
      return;
    }

    let humanAge: number;

    switch (petType) {
      case 'dog':
        humanAge = calculateDogAge(age, petSize);
        break;
      case 'cat':
        humanAge = calculateCatAge(age);
        break;
      case 'bird':
        humanAge = calculateBirdAge(age);
        break;
      case 'hamster':
        humanAge = calculateHamsterAge(age);
        break;
      case 'rabbit':
        humanAge = calculateRabbitAge(age);
        break;
      case 'fish':
        humanAge = calculateFishAge(age);
        break;
      default:
        humanAge = age * 7; // Простое умножение для других животных
    }

    setResult(humanAge);
  };

  const calculateDogAge = (dogAge: number, size: string): number => {
    // Формула для собак зависит от размера
    if (dogAge <= 1) {
      return 15;
    } else if (dogAge <= 2) {
      return 15 + 9;
    } else {
      let multiplier: number;
      switch (size) {
        case 'small':
          multiplier = 4;
          break; // Маленькие собаки
        case 'medium':
          multiplier = 5;
          break; // Средние собаки
        case 'large':
          multiplier = 6;
          break; // Большие собаки
        default:
          multiplier = 5;
      }
      return 24 + (dogAge - 2) * multiplier;
    }
  };

  const calculateCatAge = (catAge: number): number => {
    if (catAge <= 1) return 15;
    if (catAge <= 2) return 24;
    return 24 + (catAge - 2) * 4;
  };

  const calculateBirdAge = (birdAge: number): number => {
    // Птицы стареют медленнее
    return birdAge * 3;
  };

  const calculateHamsterAge = (hamsterAge: number): number => {
    // Хомяки стареют очень быстро
    return hamsterAge * 25;
  };

  const calculateRabbitAge = (rabbitAge: number): number => {
    if (rabbitAge <= 1) return 20;
    if (rabbitAge <= 2) return 28;
    return 28 + (rabbitAge - 2) * 6;
  };

  const calculateFishAge = (fishAge: number): number => {
    // Рыбы стареют медленно
    return fishAge * 2;
  };

  const clearForm = () => {
    setPetType('dog');
    setPetAge('');
    setPetSize('medium');
    setResult(null);
    setError('');
  };

  const getPetInfo = () => {
    switch (petType) {
      case 'dog':
        return {
          name: 'Собака',
          icon: '🐕',
          description: 'Лучший друг человека',
          lifeExpectancy: '10-15 лет',
        };
      case 'cat':
        return {
          name: 'Кошка',
          icon: '🐱',
          description: 'Независимый компаньон',
          lifeExpectancy: '12-18 лет',
        };
      case 'bird':
        return {
          name: 'Птица',
          icon: '🐦',
          description: 'Крылатый друг',
          lifeExpectancy: '5-20 лет (зависит от вида)',
        };
      case 'hamster':
        return {
          name: 'Хомяк',
          icon: '🐹',
          description: 'Маленький грызун',
          lifeExpectancy: '2-3 года',
        };
      case 'rabbit':
        return {
          name: 'Кролик',
          icon: '🐰',
          description: 'Пушистый питомец',
          lifeExpectancy: '8-12 лет',
        };
      case 'fish':
        return {
          name: 'Рыбка',
          icon: '🐠',
          description: 'Водный обитатель',
          lifeExpectancy: '3-10 лет (зависит от вида)',
        };
      default:
        return {
          name: 'Животное',
          icon: '🐾',
          description: 'Ваш питомец',
          lifeExpectancy: 'Зависит от вида',
        };
    }
  };

  const getAgeDescription = (humanAge: number) => {
    if (humanAge < 1) return 'Младенец';
    if (humanAge < 3) return 'Малыш';
    if (humanAge < 7) return 'Дошкольник';
    if (humanAge < 12) return 'Ребенок';
    if (humanAge < 18) return 'Подросток';
    if (humanAge < 25) return 'Молодой человек';
    if (humanAge < 35) return 'Взрослый';
    if (humanAge < 50) return 'Зрелый возраст';
    if (humanAge < 65) return 'Средний возраст';
    if (humanAge < 80) return 'Пожилой';
    return 'Долгожитель';
  };

  const getSizeDescription = (size: string) => {
    switch (size) {
      case 'small':
        return 'Маленькая (до 10 кг)';
      case 'medium':
        return 'Средняя (10-25 кг)';
      case 'large':
        return 'Большая (более 25 кг)';
      default:
        return 'Средняя';
    }
  };

  return (
    <div className={`${styles.calculator} ageCalculator`}>
      <div className="calculatorHeader">
        <h2>🐾 Калькулятор возраста питомца</h2>
        <p>
          Узнайте, сколько лет вашему питомцу по человеческим меркам.
          Учитываются особенности старения разных видов животных.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateHumanAge();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="petType">Вид питомца</label>
          <select
            id="petType"
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
          >
            <option value="dog">🐕 Собака</option>
            <option value="cat">🐱 Кошка</option>
            <option value="bird">🐦 Птица</option>
            <option value="hamster">🐹 Хомяк</option>
            <option value="rabbit">🐰 Кролик</option>
            <option value="fish">🐠 Рыбка</option>
          </select>
          <div className="help">
            {getPetInfo().description} • Продолжительность жизни:{' '}
            {getPetInfo().lifeExpectancy}
          </div>
        </div>

        {petType === 'dog' && (
          <div className="inputGroup">
            <label htmlFor="petSize">Размер собаки</label>
            <select
              id="petSize"
              value={petSize}
              onChange={(e) => setPetSize(e.target.value)}
            >
              <option value="small">Маленькая (до 10 кг)</option>
              <option value="medium">Средняя (10-25 кг)</option>
              <option value="large">Большая (более 25 кг)</option>
            </select>
            <div className="help">{getSizeDescription(petSize)}</div>
          </div>
        )}

        <div className="inputGroup">
          <label htmlFor="petAge">Возраст питомца (в годах)</label>
          <input
            id="petAge"
            type="number"
            value={petAge}
            onChange={(e) => setPetAge(e.target.value)}
            placeholder="Например: 3"
            step="0.1"
            min="0"
            max="50"
          />
          <div className="help">
            Введите возраст в годах. Для питомцев младше года используйте
            десятичные дроби (например, 0.5 для 6 месяцев).
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать возраст
          </button>
        </div>
      </form>

      {result !== null && (
        <div className="result ageResult">
          <h3>Результат расчета</h3>
          <div className="resultValue">
            <span className="amount">{result.toFixed(1)}</span>
            <span className="unit">человеческих лет</span>
          </div>

          <div className="petInfo">
            <h4>
              {getPetInfo().icon} {getPetInfo().name}
            </h4>
            <p>
              <strong>Возраст питомца:</strong> {petAge}{' '}
              {parseFloat(petAge) === 1
                ? 'год'
                : parseFloat(petAge) < 5
                ? 'года'
                : 'лет'}
            </p>
            {petType === 'dog' && (
              <p>
                <strong>Размер:</strong> {getSizeDescription(petSize)}
              </p>
            )}
            <p>
              <strong>По человеческим меркам:</strong>{' '}
              {getAgeDescription(result)}
            </p>
          </div>

          <div className="recommendation">
            <strong>Интересный факт:</strong> {getPetTypeFact()}
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

  function getPetTypeFact(): string {
    switch (petType) {
      case 'dog':
        return 'Собаки понимают до 250 слов и жестов, а их интеллект сравним с интеллектом 2-летнего ребенка.';
      case 'cat':
        return 'Кошки проводят 70% своей жизни во сне, что составляет 13-16 часов в день.';
      case 'bird':
        return 'Некоторые попугаи могут жить до 80 лет и запоминать более 1000 слов.';
      case 'hamster':
        return 'Хомяки могут бегать до 8 км за ночь в своем колесе.';
      case 'rabbit':
        return 'Кролики могут поворачивать уши на 270 градусов и видеть на 360 градусов вокруг себя.';
      case 'fish':
        return 'Золотые рыбки могут помнить события до 3 месяцев и различать лица людей.';
      default:
        return 'Каждый питомец уникален и заслуживает любви и заботы!';
    }
  }
};

export default PetAgeCalculator;
