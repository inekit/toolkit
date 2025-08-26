import React, { useState } from 'react';
import styles from './UnitConverter.module.scss';

interface ConversionCategory {
  id: string;
  name: string;
  icon: string;
  units: ConversionUnit[];
}

interface ConversionUnit {
  id: string;
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const UnitConverter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const conversionCategories: ConversionCategory[] = [
    {
      id: 'length',
      name: 'Длина',
      icon: '📏',
      units: [
        {
          id: 'mm',
          name: 'Миллиметр',
          symbol: 'мм',
          toBase: (v) => v / 1000,
          fromBase: (v) => v * 1000,
        },
        {
          id: 'cm',
          name: 'Сантиметр',
          symbol: 'см',
          toBase: (v) => v / 100,
          fromBase: (v) => v * 100,
        },
        {
          id: 'm',
          name: 'Метр',
          symbol: 'м',
          toBase: (v) => v,
          fromBase: (v) => v,
        },
        {
          id: 'km',
          name: 'Километр',
          symbol: 'км',
          toBase: (v) => v * 1000,
          fromBase: (v) => v / 1000,
        },
        {
          id: 'inch',
          name: 'Дюйм',
          symbol: 'дюйм',
          toBase: (v) => v * 0.0254,
          fromBase: (v) => v / 0.0254,
        },
        {
          id: 'ft',
          name: 'Фут',
          symbol: 'фут',
          toBase: (v) => v * 0.3048,
          fromBase: (v) => v / 0.3048,
        },
        {
          id: 'yd',
          name: 'Ярд',
          symbol: 'ярд',
          toBase: (v) => v * 0.9144,
          fromBase: (v) => v / 0.9144,
        },
        {
          id: 'mile',
          name: 'Миля',
          symbol: 'миля',
          toBase: (v) => v * 1609.344,
          fromBase: (v) => v / 1609.344,
        },
      ],
    },
    {
      id: 'weight',
      name: 'Вес',
      icon: '⚖️',
      units: [
        {
          id: 'mg',
          name: 'Миллиграмм',
          symbol: 'мг',
          toBase: (v) => v / 1000000,
          fromBase: (v) => v * 1000000,
        },
        {
          id: 'g',
          name: 'Грамм',
          symbol: 'г',
          toBase: (v) => v / 1000,
          fromBase: (v) => v * 1000,
        },
        {
          id: 'kg',
          name: 'Килограмм',
          symbol: 'кг',
          toBase: (v) => v,
          fromBase: (v) => v,
        },
        {
          id: 't',
          name: 'Тонна',
          symbol: 'т',
          toBase: (v) => v * 1000,
          fromBase: (v) => v / 1000,
        },
        {
          id: 'oz',
          name: 'Унция',
          symbol: 'унция',
          toBase: (v) => v * 0.0283495,
          fromBase: (v) => v / 0.0283495,
        },
        {
          id: 'lb',
          name: 'Фунт',
          symbol: 'фунт',
          toBase: (v) => v * 0.453592,
          fromBase: (v) => v / 0.453592,
        },
      ],
    },
    {
      id: 'area',
      name: 'Площадь',
      icon: '📐',
      units: [
        {
          id: 'mm2',
          name: 'Кв. миллиметр',
          symbol: 'мм²',
          toBase: (v) => v / 1000000,
          fromBase: (v) => v * 1000000,
        },
        {
          id: 'cm2',
          name: 'Кв. сантиметр',
          symbol: 'см²',
          toBase: (v) => v / 10000,
          fromBase: (v) => v * 10000,
        },
        {
          id: 'm2',
          name: 'Кв. метр',
          symbol: 'м²',
          toBase: (v) => v,
          fromBase: (v) => v,
        },
        {
          id: 'km2',
          name: 'Кв. километр',
          symbol: 'км²',
          toBase: (v) => v * 1000000,
          fromBase: (v) => v / 1000000,
        },
        {
          id: 'ha',
          name: 'Гектар',
          symbol: 'га',
          toBase: (v) => v * 10000,
          fromBase: (v) => v / 10000,
        },
        {
          id: 'acre',
          name: 'Акр',
          symbol: 'акр',
          toBase: (v) => v * 4046.86,
          fromBase: (v) => v / 4046.86,
        },
      ],
    },
    {
      id: 'volume',
      name: 'Объем',
      icon: '🧪',
      units: [
        {
          id: 'ml',
          name: 'Миллилитр',
          symbol: 'мл',
          toBase: (v) => v / 1000,
          fromBase: (v) => v * 1000,
        },
        {
          id: 'l',
          name: 'Литр',
          symbol: 'л',
          toBase: (v) => v,
          fromBase: (v) => v,
        },
        {
          id: 'm3',
          name: 'Куб. метр',
          symbol: 'м³',
          toBase: (v) => v * 1000,
          fromBase: (v) => v / 1000,
        },
        {
          id: 'gal',
          name: 'Галлон',
          symbol: 'галлон',
          toBase: (v) => v * 3.78541,
          fromBase: (v) => v / 3.78541,
        },
        {
          id: 'pt',
          name: 'Пинта',
          symbol: 'пинта',
          toBase: (v) => v * 0.473176,
          fromBase: (v) => v / 0.473176,
        },
      ],
    },
    {
      id: 'temperature',
      name: 'Температура',
      icon: '🌡️',
      units: [
        {
          id: 'c',
          name: 'Цельсий',
          symbol: '°C',
          toBase: (v) => v,
          fromBase: (v) => v,
        },
        {
          id: 'f',
          name: 'Фаренгейт',
          symbol: '°F',
          toBase: (v) => ((v - 32) * 5) / 9,
          fromBase: (v) => (v * 9) / 5 + 32,
        },
        {
          id: 'k',
          name: 'Кельвин',
          symbol: 'K',
          toBase: (v) => v - 273.15,
          fromBase: (v) => v + 273.15,
        },
      ],
    },
    {
      id: 'speed',
      name: 'Скорость',
      icon: '🏃',
      units: [
        {
          id: 'mps',
          name: 'М/с',
          symbol: 'м/с',
          toBase: (v) => v,
          fromBase: (v) => v,
        },
        {
          id: 'kmh',
          name: 'Км/ч',
          symbol: 'км/ч',
          toBase: (v) => v / 3.6,
          fromBase: (v) => v * 3.6,
        },
        {
          id: 'mph',
          name: 'Миль/ч',
          symbol: 'миль/ч',
          toBase: (v) => v * 0.44704,
          fromBase: (v) => v / 0.44704,
        },
        {
          id: 'knot',
          name: 'Узел',
          symbol: 'узел',
          toBase: (v) => v * 0.514444,
          fromBase: (v) => v / 0.514444,
        },
      ],
    },
    {
      id: 'time',
      name: 'Время',
      icon: '⏰',
      units: [
        {
          id: 'sec',
          name: 'Секунда',
          symbol: 'сек',
          toBase: (v) => v,
          fromBase: (v) => v,
        },
        {
          id: 'min',
          name: 'Минута',
          symbol: 'мин',
          toBase: (v) => v * 60,
          fromBase: (v) => v / 60,
        },
        {
          id: 'hour',
          name: 'Час',
          symbol: 'ч',
          toBase: (v) => v * 3600,
          fromBase: (v) => v / 3600,
        },
        {
          id: 'day',
          name: 'День',
          symbol: 'дн',
          toBase: (v) => v * 86400,
          fromBase: (v) => v / 86400,
        },
        {
          id: 'week',
          name: 'Неделя',
          symbol: 'нед',
          toBase: (v) => v * 604800,
          fromBase: (v) => v / 604800,
        },
        {
          id: 'month',
          name: 'Месяц',
          symbol: 'мес',
          toBase: (v) => v * 2592000,
          fromBase: (v) => v / 2592000,
        },
        {
          id: 'year',
          name: 'Год',
          symbol: 'г',
          toBase: (v) => v * 31536000,
          fromBase: (v) => v / 31536000,
        },
      ],
    },
  ];

  const currentCategory = conversionCategories.find(
    (cat) => cat.id === selectedCategory
  );

  const convert = () => {
    setError('');

    if (!fromUnit || !toUnit || !fromValue) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setError('Пожалуйста, введите корректное числовое значение');
      return;
    }

    const fromUnitObj = currentCategory?.units.find((u) => u.id === fromUnit);
    const toUnitObj = currentCategory?.units.find((u) => u.id === toUnit);

    if (!fromUnitObj || !toUnitObj) {
      setError('Ошибка в выборе единиц измерения');
      return;
    }

    // Конвертируем в базовую единицу, затем в целевую
    const baseValue = fromUnitObj.toBase(value);
    const resultValue = toUnitObj.fromBase(baseValue);

    setResult(resultValue);
  };

  const clearForm = () => {
    setFromValue('');
    setResult(null);
    setError('');
  };

  const swapUnits = () => {
    if (fromUnit && toUnit) {
      const temp = fromUnit;
      setFromUnit(toUnit);
      setToUnit(temp);
      if (result !== null) {
        setFromValue(result.toString());
        setResult(null);
      }
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFromUnit('');
    setToUnit('');
    setFromValue('');
    setResult(null);
    setError('');
  };

  const getCategoryDescription = (categoryId: string) => {
    switch (categoryId) {
      case 'length':
        return 'Конвертация между различными единицами длины';
      case 'weight':
        return 'Конвертация между различными единицами веса';
      case 'area':
        return 'Конвертация между различными единицами площади';
      case 'volume':
        return 'Конвертация между различными единицами объема';
      case 'temperature':
        return 'Конвертация между различными шкалами температуры';
      case 'speed':
        return 'Конвертация между различными единицами скорости';
      case 'time':
        return 'Конвертация между различными единицами времени';
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.calculator} converterCalculator`}>
      <div className="calculatorHeader">
        <h2>🔄 Универсальный конвертер величин</h2>
        <p>
          Конвертируйте между различными единицами измерения. Поддерживаются
          длина, вес, площадь, объем, температура, скорость и время.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          convert();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {conversionCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <div className="help">{getCategoryDescription(selectedCategory)}</div>
        </div>

        <div className="inputGroup">
          <label>Конвертация</label>
          <div className={styles.conversionInputs}>
            <div>
              <label htmlFor="fromUnit">Из</label>
              <select
                id="fromUnit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                <option value="">Выберите единицу</option>
                {currentCategory?.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.swapButton}>
              <button
                type="button"
                onClick={swapUnits}
                style={{
                  background: 'var(--accent-500)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  width: '2.5rem',
                  height: '2.5rem',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Поменять местами"
              >
                ⇄
              </button>
            </div>

            <div>
              <label htmlFor="toUnit">В</label>
              <select
                id="toUnit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                <option value="">Выберите единицу</option>
                {currentCategory?.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="fromValue">Значение</label>
          <input
            id="fromValue"
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            placeholder="Введите значение"
            step="any"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Конвертировать
          </button>
        </div>
      </form>

      {result !== null && (
        <div className="result conversionResult">
          <h3>Результат конвертации</h3>
          <div className="resultValue">
            <span className="amount">
              {result.toFixed(6).replace(/\.?0+$/, '')}
            </span>
            <span className="unit">
              {currentCategory?.units.find((u) => u.id === toUnit)?.symbol ||
                ''}
            </span>
          </div>

          <div className={styles.conversionDetails}>
            <p>
              <strong>{fromValue}</strong>{' '}
              {currentCategory?.units.find((u) => u.id === fromUnit)?.symbol} =
              <strong> {result.toFixed(6).replace(/\.?0+$/, '')}</strong>{' '}
              {currentCategory?.units.find((u) => u.id === toUnit)?.symbol}
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

export default UnitConverter;
