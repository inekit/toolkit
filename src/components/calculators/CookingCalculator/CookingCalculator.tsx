import React, { useState } from 'react';
import styles from './CookingCalculator.module.scss';

const CookingCalculator: React.FC = () => {
  const [calculatorType, setCalculatorType] = useState('recipe');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Состояние для калькулятора рецептов
  const [originalServings, setOriginalServings] = useState('');
  const [newServings, setNewServings] = useState('');
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' },
  ]);

  // Состояние для калькулятора калорий
  const [foodName, setFoodName] = useState('');
  const [weight, setWeight] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');

  // Состояние для калькулятора порций
  const [totalWeight, setTotalWeight] = useState('');
  const [portionWeight, setPortionWeight] = useState('');
  const [portionCount, setPortionCount] = useState('');

  const calculateRecipe = () => {
    setError('');

    if (
      !originalServings ||
      !newServings ||
      ingredients.some((ing) => !ing.name || !ing.amount)
    ) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const original = parseFloat(originalServings);
    const newServing = parseFloat(newServings);

    if (
      isNaN(original) ||
      isNaN(newServing) ||
      original <= 0 ||
      newServing <= 0
    ) {
      setError('Количество порций должно быть положительным числом');
      return;
    }

    const multiplier = newServing / original;
    const adjustedIngredients = ingredients.map((ing) => {
      const amount = parseFloat(ing.amount);
      if (isNaN(amount)) return ing;

      return {
        ...ing,
        originalAmount: amount,
        newAmount: (amount * multiplier).toFixed(2),
      };
    });

    setResult({
      type: 'recipe',
      originalServings: original,
      newServings: newServing,
      multiplier: multiplier.toFixed(2),
      ingredients: adjustedIngredients,
    });
  };

  const calculateCalories = () => {
    setError('');

    if (!foodName || !weight || !caloriesPer100g) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const weightNum = parseFloat(weight);
    const calories = parseFloat(caloriesPer100g);

    if (isNaN(weightNum) || isNaN(calories) || weightNum <= 0 || calories < 0) {
      setError('Вес и калории должны быть положительными числами');
      return;
    }

    const totalCalories = (weightNum * calories) / 100;
    const macros = calculateMacros(calories, weightNum);

    setResult({
      type: 'calories',
      foodName,
      weight: weightNum,
      caloriesPer100g: calories,
      totalCalories: totalCalories.toFixed(1),
      macros,
    });
  };

  const calculatePortions = () => {
    setError('');

    if (!totalWeight || (!portionWeight && !portionCount)) {
      setError(
        'Пожалуйста, укажите общий вес и либо вес порции, либо количество порций'
      );
      return;
    }

    const total = parseFloat(totalWeight);
    const portion = portionWeight ? parseFloat(portionWeight) : 0;
    const count = portionCount ? parseInt(portionCount) : 0;

    if (isNaN(total) || total <= 0) {
      setError('Общий вес должен быть положительным числом');
      return;
    }

    let calculatedPortions = 0;
    let calculatedWeight = 0;

    if (portion > 0) {
      calculatedPortions = Math.round(total / portion);
      calculatedWeight = portion;
    } else if (count > 0) {
      calculatedWeight = total / count;
      calculatedPortions = count;
    } else {
      setError('Укажите либо вес порции, либо количество порций');
      return;
    }

    setResult({
      type: 'portions',
      totalWeight: total,
      portionWeight: calculatedWeight.toFixed(1),
      portionCount: calculatedPortions,
      waste: (total - calculatedWeight * calculatedPortions).toFixed(1),
    });
  };

  const calculateMacros = (caloriesPer100g: number, weight: number) => {
    // Примерные пропорции макронутриентов (можно настроить)
    const proteinRatio = 0.25; // 25% белка
    const fatRatio = 0.35; // 35% жиров
    const carbsRatio = 0.4; // 40% углеводов

    const totalCalories = (weight * caloriesPer100g) / 100;

    return {
      protein: ((totalCalories * proteinRatio) / 4).toFixed(1), // 4 ккал на грамм белка
      fat: ((totalCalories * fatRatio) / 9).toFixed(1), // 9 ккал на грамм жира
      carbs: ((totalCalories * carbsRatio) / 4).toFixed(1), // 4 ккал на грамм углеводов
    };
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const clearForm = () => {
    setCalculatorType('recipe');
    setOriginalServings('');
    setNewServings('');
    setIngredients([{ name: '', amount: '', unit: '' }]);
    setFoodName('');
    setWeight('');
    setCaloriesPer100g('');
    setTotalWeight('');
    setPortionWeight('');
    setPortionCount('');
    setResult(null);
    setError('');
  };

  const getUnitOptions = () => [
    'г',
    'кг',
    'мл',
    'л',
    'шт',
    'ст.л.',
    'ч.л.',
    'стакан',
    'по вкусу',
  ];

  const getCookingRecommendations = (type: string, data: any): string[] => {
    const recommendations = [];

    if (type === 'recipe') {
      if (data.multiplier > 2) {
        recommendations.push(
          'При увеличении порций более чем в 2 раза проверьте время приготовления'
        );
        recommendations.push(
          'Возможно, потребуется использовать большую посуду'
        );
      }
      if (data.multiplier < 0.5) {
        recommendations.push(
          'При уменьшении порций уменьшите время приготовления'
        );
        recommendations.push(
          'Используйте меньшую посуду для лучшего результата'
        );
      }
    } else if (type === 'calories') {
      if (data.totalCalories > 500) {
        recommendations.push(
          'Высококалорийное блюдо - рассмотрите возможность уменьшения порции'
        );
      }
      if (data.macros.protein > 30) {
        recommendations.push(
          'Богатое белком блюдо - отлично для восстановления мышц'
        );
      }
    } else if (type === 'portions') {
      if (data.waste > 0) {
        recommendations.push(
          'Есть небольшой остаток - можно использовать для дегустации'
        );
      }
      if (data.portionCount > 10) {
        recommendations.push(
          'Большое количество порций - убедитесь в достаточности ингредиентов'
        );
      }
    }

    recommendations.push('Всегда пробуйте блюдо перед подачей');
    recommendations.push('Записывайте успешные рецепты для повторения');

    return recommendations;
  };

  return (
    <div className={`${styles.calculator} cookingCalculator`}>
      <div className="calculatorHeader">
        <h2>👨‍🍳 Кулинарные калькуляторы</h2>
        <p>
          Пересчитайте рецепты, рассчитайте калории и определите размеры порций
          для идеального результата на кухне.
        </p>
      </div>

      <div className={styles.calculatorTabs}>
        <button
          className={`tab ${calculatorType === 'recipe' ? 'active' : ''}`}
          onClick={() => setCalculatorType('recipe')}
        >
          📝 Пересчет рецептов
        </button>
        <button
          className={`tab ${calculatorType === 'calories' ? 'active' : ''}`}
          onClick={() => setCalculatorType('calories')}
        >
          🔥 Расчет калорий
        </button>
        <button
          className={`tab ${calculatorType === 'portions' ? 'active' : ''}`}
          onClick={() => setCalculatorType('portions')}
        >
          🍽️ Размеры порций
        </button>
      </div>

      {calculatorType === 'recipe' && (
        <form
          className="calculatorForm"
          onSubmit={(e) => {
            e.preventDefault();
            calculateRecipe();
          }}
        >
          <div className="inputGroup">
            <label>Количество порций</label>
            <div className="inputRow">
              <div>
                <label htmlFor="originalServings">Исходное количество</label>
                <input
                  id="originalServings"
                  type="number"
                  value={originalServings}
                  onChange={(e) => setOriginalServings(e.target.value)}
                  placeholder="Например: 4"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label htmlFor="newServings">Новое количество</label>
                <input
                  id="newServings"
                  type="number"
                  value={newServings}
                  onChange={(e) => setNewServings(e.target.value)}
                  placeholder="Например: 6"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <label>Ингредиенты</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientRow}>
                <input
                  type="text"
                  placeholder="Название ингредиента"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(index, 'name', e.target.value)
                  }
                  className="ingredientName"
                />
                <input
                  type="number"
                  placeholder="Количество"
                  value={ingredient.amount}
                  onChange={(e) =>
                    updateIngredient(index, 'amount', e.target.value)
                  }
                  className="ingredientAmount"
                  step="0.1"
                  min="0"
                />
                <select
                  value={ingredient.unit}
                  onChange={(e) =>
                    updateIngredient(index, 'unit', e.target.value)
                  }
                  className="ingredientUnit"
                >
                  <option value="">Единица</option>
                  {getUnitOptions().map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="removeIngredient"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className={styles.addIngredient}
            >
              + Добавить ингредиент
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="inputGroup">
            <button type="submit" className="calculateBtn">
              Пересчитать рецепт
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
            <label htmlFor="foodName">Название продукта/блюда</label>
            <input
              id="foodName"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Например: Куриная грудка"
            />
          </div>

          <div className="inputGroup">
            <label>Параметры</label>
            <div className="inputRow">
              <div>
                <label htmlFor="weight">Вес (г)</label>
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Например: 150"
                  step="1"
                  min="1"
                  max="10000"
                />
              </div>
              <div>
                <label htmlFor="caloriesPer100g">Калории на 100г</label>
                <input
                  id="caloriesPer100g"
                  type="number"
                  value={caloriesPer100g}
                  onChange={(e) => setCaloriesPer100g(e.target.value)}
                  placeholder="Например: 165"
                  step="1"
                  min="0"
                  max="1000"
                />
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

      {calculatorType === 'portions' && (
        <form
          className="calculatorForm"
          onSubmit={(e) => {
            e.preventDefault();
            calculatePortions();
          }}
        >
          <div className="inputGroup">
            <label htmlFor="totalWeight">Общий вес готового блюда (г)</label>
            <input
              id="totalWeight"
              type="number"
              value={totalWeight}
              onChange={(e) => setTotalWeight(e.target.value)}
              placeholder="Например: 1000"
              step="10"
              min="10"
              max="100000"
            />
          </div>

          <div className="inputGroup">
            <label>Определение порций</label>
            <div className="inputRow">
              <div>
                <label htmlFor="portionWeight">Вес одной порции (г)</label>
                <input
                  id="portionWeight"
                  type="number"
                  value={portionWeight}
                  onChange={(e) => setPortionWeight(e.target.value)}
                  placeholder="Например: 200"
                  step="10"
                  min="10"
                  max="10000"
                />
              </div>
              <div>
                <label htmlFor="portionCount">Количество порций</label>
                <input
                  id="portionCount"
                  type="number"
                  value={portionCount}
                  onChange={(e) => setPortionCount(e.target.value)}
                  placeholder="Например: 5"
                  min="1"
                  max="100"
                />
              </div>
            </div>
            <div className="help">
              Укажите либо вес порции, либо количество порций - второе будет
              рассчитано автоматически
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="inputGroup">
            <button type="submit" className="calculateBtn">
              Рассчитать порции
            </button>
          </div>
        </form>
      )}

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          {result.type === 'recipe' && (
            <div className="recipeResult">
              <div className="recipeSummary">
                <div className="summaryItem">
                  <span className="label">Исходное количество порций:</span>
                  <span className="value">{result.originalServings}</span>
                </div>
                <div className="summaryItem">
                  <span className="label">Новое количество порций:</span>
                  <span className="value">{result.newServings}</span>
                </div>
                <div className="summaryItem">
                  <span className="label">Множитель:</span>
                  <span className="value">{result.multiplier}x</span>
                </div>
              </div>

              <div className="ingredientsTable">
                <h4>Скорректированные ингредиенты:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Ингредиент</th>
                      <th>Исходное количество</th>
                      <th>Новое количество</th>
                      <th>Единица</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.ingredients.map((ing: any, index: number) => (
                      <tr key={index}>
                        <td>{ing.name}</td>
                        <td>
                          {ing.originalAmount} {ing.unit}
                        </td>
                        <td>
                          {ing.newAmount} {ing.unit}
                        </td>
                        <td>{ing.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.type === 'calories' && (
            <div className="caloriesResult">
              <div className="caloriesSummary">
                <div className="summaryItem">
                  <span className="label">Продукт:</span>
                  <span className="value">{result.foodName}</span>
                </div>
                <div className="summaryItem">
                  <span className="label">Вес:</span>
                  <span className="value">{result.weight} г</span>
                </div>
                <div className="summaryItem">
                  <span className="label">Калории на 100г:</span>
                  <span className="value">{result.caloriesPer100g} ккал</span>
                </div>
              </div>

              <div className="resultValue">
                <span className="amount">{result.totalCalories}</span>
                <span className="unit">ккал</span>
              </div>

              <div className="macrosAnalysis">
                <h4>Макронутриенты:</h4>
                <div className="macrosGrid">
                  <div className="macroItem protein">
                    <span className="label">Белки:</span>
                    <span className="value">{result.macros.protein} г</span>
                  </div>
                  <div className="macroItem fat">
                    <span className="label">Жиры:</span>
                    <span className="value">{result.macros.fat} г</span>
                  </div>
                  <div className="macroItem carbs">
                    <span className="label">Углеводы:</span>
                    <span className="value">{result.macros.carbs} г</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result.type === 'portions' && (
            <div className="portionsResult">
              <div className="portionsSummary">
                <div className="summaryItem">
                  <span className="label">Общий вес блюда:</span>
                  <span className="value">{result.totalWeight} г</span>
                </div>
                <div className="summaryItem">
                  <span className="label">Вес одной порции:</span>
                  <span className="value">{result.portionWeight} г</span>
                </div>
                <div className="summaryItem">
                  <span className="label">Количество порций:</span>
                  <span className="value">{result.portionCount}</span>
                </div>
                {parseFloat(result.waste) > 0 && (
                  <div className="summaryItem">
                    <span className="label">Остаток:</span>
                    <span className="value">{result.waste} г</span>
                  </div>
                )}
              </div>

              <div className="resultValue">
                <span className="amount">{result.portionWeight}</span>
                <span className="unit">г на порцию</span>
              </div>
            </div>
          )}

          <div className="recommendation">
            <strong>Кулинарные советы:</strong>
            <ul className="recommendationsList">
              {getCookingRecommendations(result.type, result).map(
                (rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                )
              )}
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

export default CookingCalculator;
