import React, { useState, useEffect } from 'react';
import styles from './CookingCalculator.module.scss';

interface Product {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  pricePerKg: number;
  cookingLoss: number; // Потеря веса при готовке в %
}

interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
}

interface RecipeIngredient {
  productId: string;
  amount: number;
  unit: string;
  isOptional: boolean;
}

interface DailyPlan {
  meals: {
    breakfast: Product[];
    lunch: Product[];
    dinner: Product[];
    snacks: Product[];
  };
  totals: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    cost: number;
  };
}

const CookingCalculator: React.FC = () => {
  const [calculatorType, setCalculatorType] = useState('nutrition');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Состояние для конвертера единиц
  const [converterAmount, setConverterAmount] = useState('');
  const [converterFromUnit, setConverterFromUnit] = useState('г');
  const [converterToUnit, setConverterToUnit] = useState('кг');
  const [conversionResult, setConversionResult] = useState<number | null>(null);

  // Состояние для калькулятора готовки
  const [cookingProduct, setCookingProduct] = useState('');
  const [cookingWeight, setCookingWeight] = useState('');
  const [cookingMethod, setCookingMethod] = useState('boiling');
  const [cookingResults, setCookingResults] = useState<any>(null);

  // База данных продуктов
  const productsDatabase: Product[] = [
    // Мясо и птица
    {
      id: 'chicken_breast',
      name: 'Куриная грудка',
      category: 'meat',
      calories: 165,
      protein: 31,
      fat: 3.6,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      pricePerKg: 350,
      cookingLoss: 25,
    },
    {
      id: 'beef_mince',
      name: 'Говяжий фарш',
      category: 'meat',
      calories: 242,
      protein: 26,
      fat: 15,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      pricePerKg: 450,
      cookingLoss: 30,
    },
    {
      id: 'pork_loin',
      name: 'Свиная вырезка',
      category: 'meat',
      calories: 143,
      protein: 21,
      fat: 6,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      pricePerKg: 380,
      cookingLoss: 25,
    },
    {
      id: 'salmon',
      name: 'Лосось',
      category: 'fish',
      calories: 208,
      protein: 25,
      fat: 12,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      pricePerKg: 1200,
      cookingLoss: 20,
    },
    {
      id: 'cod',
      name: 'Треска',
      category: 'fish',
      calories: 82,
      protein: 18,
      fat: 0.7,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      pricePerKg: 450,
      cookingLoss: 20,
    },

    // Крупы и злаки
    {
      id: 'rice_white',
      name: 'Рис белый',
      category: 'grains',
      calories: 130,
      protein: 2.7,
      fat: 0.3,
      carbs: 28,
      fiber: 0.4,
      sugar: 0.1,
      pricePerKg: 80,
      cookingLoss: -200,
    },
    {
      id: 'buckwheat',
      name: 'Гречка',
      category: 'grains',
      calories: 92,
      protein: 3.4,
      fat: 0.6,
      carbs: 19,
      fiber: 2.7,
      sugar: 0.9,
      pricePerKg: 120,
      cookingLoss: -200,
    },
    {
      id: 'quinoa',
      name: 'Киноа',
      category: 'grains',
      calories: 120,
      protein: 4.4,
      fat: 1.9,
      carbs: 22,
      fiber: 2.8,
      sugar: 0.9,
      pricePerKg: 450,
      cookingLoss: -200,
    },
    {
      id: 'oats',
      name: 'Овсянка',
      category: 'grains',
      calories: 68,
      protein: 2.4,
      fat: 1.4,
      carbs: 12,
      fiber: 1.7,
      sugar: 0.3,
      pricePerKg: 90,
      cookingLoss: -150,
    },

    // Овощи
    {
      id: 'broccoli',
      name: 'Брокколи',
      category: 'vegetables',
      calories: 34,
      protein: 2.8,
      fat: 0.4,
      carbs: 7,
      fiber: 2.6,
      sugar: 1.5,
      pricePerKg: 180,
      cookingLoss: 10,
    },
    {
      id: 'carrot',
      name: 'Морковь',
      category: 'vegetables',
      calories: 41,
      protein: 0.9,
      fat: 0.2,
      carbs: 10,
      fiber: 2.8,
      sugar: 4.7,
      pricePerKg: 60,
      cookingLoss: 5,
    },
    {
      id: 'tomato',
      name: 'Помидор',
      category: 'vegetables',
      calories: 18,
      protein: 0.9,
      fat: 0.2,
      carbs: 3.9,
      fiber: 1.2,
      sugar: 2.6,
      pricePerKg: 120,
      cookingLoss: 15,
    },
    {
      id: 'onion',
      name: 'Лук репчатый',
      category: 'vegetables',
      calories: 40,
      protein: 1.1,
      fat: 0.1,
      carbs: 9.3,
      fiber: 1.7,
      sugar: 4.7,
      pricePerKg: 40,
      cookingLoss: 20,
    },
    {
      id: 'potato',
      name: 'Картофель',
      category: 'vegetables',
      calories: 77,
      protein: 2,
      fat: 0.1,
      carbs: 17,
      fiber: 2.2,
      sugar: 0.8,
      pricePerKg: 50,
      cookingLoss: 15,
    },

    // Фрукты
    {
      id: 'apple',
      name: 'Яблоко',
      category: 'fruits',
      calories: 52,
      protein: 0.3,
      fat: 0.2,
      carbs: 14,
      fiber: 2.4,
      sugar: 10.4,
      pricePerKg: 120,
      cookingLoss: 0,
    },
    {
      id: 'banana',
      name: 'Банан',
      category: 'fruits',
      calories: 89,
      protein: 1.1,
      fat: 0.3,
      carbs: 23,
      fiber: 2.6,
      sugar: 12,
      pricePerKg: 140,
      cookingLoss: 0,
    },
    {
      id: 'orange',
      name: 'Апельсин',
      category: 'fruits',
      calories: 47,
      protein: 0.9,
      fat: 0.1,
      carbs: 12,
      fiber: 2.4,
      sugar: 9.4,
      pricePerKg: 160,
      cookingLoss: 0,
    },

    // Молочные продукты
    {
      id: 'milk_3.2',
      name: 'Молоко 3.2%',
      category: 'dairy',
      calories: 64,
      protein: 3.3,
      fat: 3.2,
      carbs: 4.8,
      fiber: 0,
      sugar: 4.8,
      pricePerKg: 80,
      cookingLoss: 0,
    },
    {
      id: 'yogurt_natural',
      name: 'Йогурт натуральный',
      category: 'dairy',
      calories: 59,
      protein: 10,
      fat: 0.4,
      carbs: 3.6,
      fiber: 0,
      sugar: 3.2,
      pricePerKg: 200,
      cookingLoss: 0,
    },
    {
      id: 'cheese_cottage',
      name: 'Творог 5%',
      category: 'dairy',
      calories: 121,
      protein: 17,
      fat: 5,
      carbs: 1.8,
      fiber: 0,
      sugar: 1.8,
      pricePerKg: 300,
      cookingLoss: 0,
    },

    // Яйца и масла
    {
      id: 'egg_chicken',
      name: 'Яйцо куриное',
      category: 'eggs',
      calories: 155,
      protein: 13,
      fat: 11,
      carbs: 1.1,
      fiber: 0,
      sugar: 1.1,
      pricePerKg: 200,
      cookingLoss: 0,
    },
    {
      id: 'olive_oil',
      name: 'Оливковое масло',
      category: 'oils',
      calories: 884,
      protein: 0,
      fat: 100,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      pricePerKg: 800,
      cookingLoss: 0,
    },
    {
      id: 'butter',
      name: 'Сливочное масло',
      category: 'oils',
      calories: 717,
      protein: 0.9,
      fat: 81,
      carbs: 0.1,
      fiber: 0,
      sugar: 0.1,
      pricePerKg: 600,
      cookingLoss: 0,
    },

    // Орехи и семена
    {
      id: 'almonds',
      name: 'Миндаль',
      category: 'nuts',
      calories: 579,
      protein: 21,
      fat: 50,
      carbs: 22,
      fiber: 12.5,
      sugar: 4.8,
      pricePerKg: 1200,
      cookingLoss: 0,
    },
    {
      id: 'walnuts',
      name: 'Грецкий орех',
      category: 'nuts',
      calories: 654,
      protein: 15,
      fat: 65,
      carbs: 14,
      fiber: 6.7,
      sugar: 2.6,
      pricePerKg: 800,
      cookingLoss: 0,
    },
    {
      id: 'sunflower_seeds',
      name: 'Семечки подсолнечника',
      category: 'nuts',
      calories: 584,
      protein: 21,
      fat: 51,
      carbs: 20,
      fiber: 8.6,
      sugar: 2.6,
      pricePerKg: 200,
      cookingLoss: 0,
    },
  ];

  // Состояние для разных калькуляторов
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>({
    meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    totals: { calories: 0, protein: 0, fat: 0, carbs: 0, cost: 0 },
  });
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);

  // Фильтрация продуктов
  const filteredProducts = productsDatabase.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Все категории', icon: '🍽️' },
    { id: 'meat', name: 'Мясо и птица', icon: '🥩' },
    { id: 'fish', name: 'Рыба и морепродукты', icon: '🐟' },
    { id: 'grains', name: 'Крупы и злаки', icon: '🌾' },
    { id: 'vegetables', name: 'Овощи', icon: '🥬' },
    { id: 'fruits', name: 'Фрукты', icon: '🍎' },
    { id: 'dairy', name: 'Молочные продукты', icon: '🥛' },
    { id: 'eggs', name: 'Яйца', icon: '🥚' },
    { id: 'oils', name: 'Масла', icon: '🫗' },
    { id: 'nuts', name: 'Орехи и семена', icon: '🥜' },
  ];

  // Добавление продукта в план
  const addProductToMeal = (
    product: Product,
    mealType: keyof typeof dailyPlan.meals
  ) => {
    setDailyPlan((prev) => {
      const newMeals = { ...prev.meals };
      newMeals[mealType] = [...newMeals[mealType], product];

      // Пересчитываем общие показатели
      const allProducts = Object.values(newMeals).flat();
      const totals = calculateTotals(allProducts);

      return {
        meals: newMeals,
        totals,
      };
    });
  };

  // Удаление продукта из плана
  const removeProductFromMeal = (
    productId: string,
    mealType: keyof typeof dailyPlan.meals
  ) => {
    setDailyPlan((prev) => {
      const newMeals = { ...prev.meals };
      newMeals[mealType] = newMeals[mealType].filter((p) => p.id !== productId);

      const allProducts = Object.values(newMeals).flat();
      const totals = calculateTotals(allProducts);

      return {
        meals: newMeals,
        totals,
      };
    });
  };

  // Расчет общих показателей
  const calculateTotals = (products: Product[]) => {
    return products.reduce(
      (acc, product) => ({
        calories: acc.calories + product.calories,
        protein: acc.protein + product.protein,
        fat: acc.fat + product.fat,
        carbs: acc.carbs + product.carbs,
        cost: acc.cost + product.pricePerKg / 1000, // Переводим в стоимость за грамм
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0, cost: 0 }
    );
  };

  // Конвертер единиц измерения
  const convertUnits = (
    amount: number,
    fromUnit: string,
    toUnit: string
  ): number => {
    const conversions: { [key: string]: { [key: string]: number } } = {
      г: {
        кг: 0.001,
        мл: 1,
        л: 0.001,
        стакан: 0.004,
        'ст.л.': 0.067,
        'ч.л.': 0.2,
      },
      кг: { г: 1000, мл: 1000, л: 1, стакан: 4, 'ст.л.': 67, 'ч.л.': 200 },
      мл: {
        г: 1,
        кг: 0.001,
        л: 0.001,
        стакан: 0.004,
        'ст.л.': 0.067,
        'ч.л.': 0.2,
      },
      л: { г: 1000, кг: 1, мл: 1000, стакан: 4, 'ст.л.': 67, 'ч.л.': 200 },
      стакан: { г: 250, кг: 0.25, мл: 250, л: 0.25, 'ст.л.': 16.7, 'ч.л.': 50 },
      'ст.л.': { г: 15, кг: 0.015, мл: 15, л: 0.015, стакан: 0.06, 'ч.л.': 3 },
      'ч.л.': { г: 5, кг: 0.005, мл: 5, л: 0.005, стакан: 0.02, 'ст.л.': 0.33 },
    };

    if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
      return amount * conversions[fromUnit][toUnit];
    }
    return amount;
  };

  // Расчет времени приготовления
  const calculateCookingTime = (
    method: string,
    weight: number,
    product: Product
  ): number => {
    const baseTimes: { [key: string]: number } = {
      boiling: 15, // варка
      frying: 8, // жарка
      baking: 25, // запекание
      steaming: 12, // пар
      grilling: 10, // гриль
    };

    const baseTime = baseTimes[method] || 15;
    const weightFactor = weight / 100; // на 100г
    const categoryFactor = product.category === 'meat' ? 1.5 : 1;

    return Math.round(baseTime * weightFactor * categoryFactor);
  };

  // Расчет температуры приготовления
  const getCookingTemperature = (method: string, product: Product): string => {
    const temperatures: { [key: string]: { [key: string]: string } } = {
      boiling: {
        meat: '100°C',
        fish: '85°C',
        vegetables: '100°C',
        grains: '100°C',
      },
      frying: { meat: '180-200°C', fish: '160-180°C', vegetables: '160-180°C' },
      baking: {
        meat: '180-200°C',
        fish: '180°C',
        vegetables: '180°C',
        grains: '180°C',
      },
      steaming: { meat: '100°C', fish: '85°C', vegetables: '100°C' },
      grilling: {
        meat: '200-250°C',
        fish: '180-200°C',
        vegetables: '180-200°C',
      },
    };

    return temperatures[method]?.[product.category] || '180°C';
  };

  // Генерация списка покупок
  const generateShoppingList = () => {
    const allProducts = Object.values(dailyPlan.meals).flat();
    const shoppingList = allProducts.reduce(
      (acc: { [key: string]: number }, product) => {
        acc[product.name] = (acc[product.name] || 0) + 100; // 100г на порцию
        return acc;
      },
      {}
    );

    return Object.entries(shoppingList).map(
      ([name, amount]) => `${name}: ${amount}г`
    );
  };

  // Функция конвертации единиц
  const handleConversion = () => {
    if (!converterAmount || isNaN(parseFloat(converterAmount))) {
      setError('Введите корректное количество');
      return;
    }

    const amount = parseFloat(converterAmount);
    const result = convertUnits(amount, converterFromUnit, converterToUnit);
    setConversionResult(result);
    setError('');
  };

  // Функция расчета готовки
  const handleCookingCalculation = () => {
    if (!cookingProduct || !cookingWeight || isNaN(parseFloat(cookingWeight))) {
      setError('Заполните все поля корректно');
      return;
    }

    const product = productsDatabase.find((p) => p.id === cookingProduct);
    if (!product) {
      setError('Продукт не найден');
      return;
    }

    const weight = parseFloat(cookingWeight);
    const cookingTime = calculateCookingTime(cookingMethod, weight, product);
    const temperature = getCookingTemperature(cookingMethod, product);

    // Расчет потери веса при готовке
    let finalWeight = weight;
    let weightLoss = 0;

    if (product.cookingLoss > 0) {
      // Продукт теряет вес (мясо, овощи)
      weightLoss = (weight * product.cookingLoss) / 100;
      finalWeight = weight - weightLoss;
    } else if (product.cookingLoss < 0) {
      // Продукт набирает вес (крупы, макароны)
      weightLoss = Math.abs(product.cookingLoss);
      finalWeight = weight + (weight * weightLoss) / 100;
    }

    setCookingResults({
      product: product.name,
      weight: weight,
      method: cookingMethod,
      cookingTime: cookingTime,
      temperature: temperature,
      weightLoss: weightLoss,
      finalWeight: finalWeight,
      originalLoss: product.cookingLoss,
    });

    setError('');
  };

  // Очистка формы
  const clearForm = () => {
    setCalculatorType('nutrition');
    setResult(null);
    setError('');
    setSelectedProducts([]);
    setDailyPlan({
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      totals: { calories: 0, protein: 0, fat: 0, carbs: 0, cost: 0 },
    });
    setRecipeIngredients([]);
    setCookingMethod('boiling');
    setConverterAmount('');
    setConverterFromUnit('г');
    setConverterToUnit('кг');
    setConversionResult(null);
    setCookingProduct('');
    setCookingWeight('');
    setCookingResults(null);
  };

  return (
    <div className={`${styles.calculator} cookingCalculator`}>
      <div className="calculatorHeader">
        <h2>👨‍🍳 Профессиональный кулинарный калькулятор</h2>
        <p>
          Планируйте рацион, рассчитывайте питательную ценность, конвертируйте
          единицы измерения и создавайте идеальные рецепты с точными расчетами.
        </p>
      </div>

      <div className={styles.calculatorTabs}>
        <button
          className={`${styles.tab} ${
            calculatorType === 'nutrition' ? styles.active : ''
          }`}
          onClick={() => setCalculatorType('nutrition')}
        >
          🥗 Планирование питания
        </button>
        <button
          className={`${styles.tab} ${
            calculatorType === 'converter' ? styles.active : ''
          }`}
          onClick={() => setCalculatorType('converter')}
        >
          🔄 Конвертер единиц
        </button>
        <button
          className={`${styles.tab} ${
            calculatorType === 'cooking' ? styles.active : ''
          }`}
          onClick={() => setCalculatorType('cooking')}
        >
          🍳 Расчет готовки
        </button>
        <button
          className={`${styles.tab} ${
            calculatorType === 'shopping' ? styles.active : ''
          }`}
          onClick={() => setCalculatorType('shopping')}
        >
          🛒 Список покупок
        </button>
      </div>

      {calculatorType === 'nutrition' && (
        <div className={styles.nutritionCalculator}>
          <div className={styles.productSearch}>
            <div className={styles.searchControls}>
              <input
                type="text"
                placeholder="Поиск продуктов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categorySelect}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.productsList}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productInfo}>
                    <h4>{product.name}</h4>
                    <div className={styles.productStats}>
                      <span>{product.calories} ккал/100г</span>
                      <span>Б: {product.protein}г</span>
                      <span>Ж: {product.fat}г</span>
                      <span>У: {product.carbs}г</span>
                    </div>
                    <div className={styles.productPrice}>
                      {product.pricePerKg}₽/кг
                    </div>
                  </div>
                  <div className={styles.mealButtons}>
                    <button
                      onClick={() => addProductToMeal(product, 'breakfast')}
                    >
                      🍳 Завтрак
                    </button>
                    <button onClick={() => addProductToMeal(product, 'lunch')}>
                      🍽️ Обед
                    </button>
                    <button onClick={() => addProductToMeal(product, 'dinner')}>
                      🍴 Ужин
                    </button>
                    <button onClick={() => addProductToMeal(product, 'snacks')}>
                      🍎 Перекус
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.dailyPlan}>
            <h3>📅 План питания на день</h3>

            <div className={styles.mealsGrid}>
              <div className={styles.mealSection}>
                <h4>🍳 Завтрак</h4>
                {dailyPlan.meals.breakfast.map((product, index) => (
                  <div key={index} className={styles.mealProduct}>
                    <span>{product.name}</span>
                    <button
                      onClick={() =>
                        removeProductFromMeal(product.id, 'breakfast')
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.mealSection}>
                <h4>🍽️ Обед</h4>
                {dailyPlan.meals.lunch.map((product, index) => (
                  <div key={index} className={styles.mealProduct}>
                    <span>{product.name}</span>
                    <button
                      onClick={() => removeProductFromMeal(product.id, 'lunch')}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.mealSection}>
                <h4>🍴 Ужин</h4>
                {dailyPlan.meals.dinner.map((product, index) => (
                  <div key={index} className={styles.mealProduct}>
                    <span>{product.name}</span>
                    <button
                      onClick={() =>
                        removeProductFromMeal(product.id, 'dinner')
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.mealSection}>
                <h4>🍎 Перекусы</h4>
                {dailyPlan.meals.snacks.map((product, index) => (
                  <div key={index} className={styles.mealProduct}>
                    <span>{product.name}</span>
                    <button
                      onClick={() =>
                        removeProductFromMeal(product.id, 'snacks')
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.dailyTotals}>
              <h4>📊 Итого за день:</h4>
              <div className={styles.totalsGrid}>
                <div className={styles.totalItem}>
                  <span className={styles.label}>Калории:</span>
                  <span className={styles.value}>
                    {dailyPlan.totals.calories.toFixed(0)} ккал
                  </span>
                </div>
                <div className={styles.totalItem}>
                  <span className={styles.label}>Белки:</span>
                  <span className={styles.value}>
                    {dailyPlan.totals.protein.toFixed(1)} г
                  </span>
                </div>
                <div className={styles.totalItem}>
                  <span className={styles.label}>Жиры:</span>
                  <span className={styles.value}>
                    {dailyPlan.totals.fat.toFixed(1)} г
                  </span>
                </div>
                <div className={styles.totalItem}>
                  <span className={styles.label}>Углеводы:</span>
                  <span className={styles.value}>
                    {dailyPlan.totals.carbs.toFixed(1)} г
                  </span>
                </div>
                <div className={styles.totalItem}>
                  <span className={styles.label}>Стоимость:</span>
                  <span className={styles.value}>
                    {(dailyPlan.totals.cost * 100).toFixed(2)} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {calculatorType === 'converter' && (
        <div className={styles.converterCalculator}>
          <h3>🔄 Конвертер единиц измерения</h3>
          <p>
            Конвертируйте между различными единицами измерения для кулинарии
          </p>

          <div className={styles.converterForm}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Количество</label>
                <input
                  type="number"
                  placeholder="100"
                  min="0"
                  step="0.1"
                  value={converterAmount}
                  onChange={(e) => setConverterAmount(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Из</label>
                <select
                  value={converterFromUnit}
                  onChange={(e) => setConverterFromUnit(e.target.value)}
                >
                  {['г', 'кг', 'мл', 'л', 'стакан', 'ст.л.', 'ч.л.'].map(
                    (unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>В</label>
                <select
                  value={converterToUnit}
                  onChange={(e) => setConverterToUnit(e.target.value)}
                >
                  {['г', 'кг', 'мл', 'л', 'стакан', 'ст.л.', 'ч.л.'].map(
                    (unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <button
                type="button"
                className="calculateBtn"
                onClick={handleConversion}
              >
                Конвертировать
              </button>
            </div>

            {error && <div className="error">{error}</div>}

            {conversionResult !== null && (
              <div className={styles.conversionResult}>
                <h4>Результат конвертации:</h4>
                <div className={styles.resultValue}>
                  <span className={styles.amount}>
                    {conversionResult.toFixed(3)}
                  </span>
                  <span className={styles.unit}>{converterToUnit}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.conversionTable}>
            <h4>📋 Таблица конвертации</h4>
            <table>
              <thead>
                <tr>
                  <th>Единица</th>
                  <th>Граммы</th>
                  <th>Милилитры</th>
                  <th>Стаканы</th>
                  <th>Ст. ложки</th>
                  <th>Ч. ложки</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 стакан</td>
                  <td>250 г</td>
                  <td>250 мл</td>
                  <td>1</td>
                  <td>16.7</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>1 ст. ложка</td>
                  <td>15 г</td>
                  <td>15 мл</td>
                  <td>0.06</td>
                  <td>1</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>1 ч. ложка</td>
                  <td>5 г</td>
                  <td>5 мл</td>
                  <td>0.02</td>
                  <td>0.33</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {calculatorType === 'cooking' && (
        <div className={styles.cookingCalculator}>
          <h3>🍳 Калькулятор приготовления</h3>

          <div className={styles.cookingForm}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Продукт</label>
                <select
                  value={cookingProduct}
                  onChange={(e) => setCookingProduct(e.target.value)}
                >
                  <option value="">Выберите продукт</option>
                  {productsDatabase.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Вес (г)</label>
                <input
                  type="number"
                  placeholder="200"
                  min="1"
                  step="1"
                  value={cookingWeight}
                  onChange={(e) => setCookingWeight(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Способ приготовления</label>
                <select
                  value={cookingMethod}
                  onChange={(e) => setCookingMethod(e.target.value)}
                >
                  <option value="boiling">Варка</option>
                  <option value="frying">Жарка</option>
                  <option value="baking">Запекание</option>
                  <option value="steaming">Пар</option>
                  <option value="grilling">Гриль</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <button
                type="button"
                className="calculateBtn"
                onClick={handleCookingCalculation}
              >
                Рассчитать
              </button>
            </div>

            {error && <div className="error">{error}</div>}
          </div>

          {cookingResults && (
            <div className={styles.cookingResults}>
              <h4>📊 Результаты расчета:</h4>
              <div className={styles.resultsGrid}>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Продукт:</span>
                  <span className={styles.value}>{cookingResults.product}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Исходный вес:</span>
                  <span className={styles.value}>
                    {cookingResults.weight} г
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Способ готовки:</span>
                  <span className={styles.value}>
                    {cookingResults.method === 'boiling'
                      ? 'Варка'
                      : cookingResults.method === 'frying'
                      ? 'Жарка'
                      : cookingResults.method === 'baking'
                      ? 'Запекание'
                      : cookingResults.method === 'steaming'
                      ? 'Пар'
                      : 'Гриль'}
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Время приготовления:</span>
                  <span className={styles.value}>
                    {cookingResults.cookingTime} минут
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Температура:</span>
                  <span className={styles.value}>
                    {cookingResults.temperature}
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Изменение веса:</span>
                  <span className={styles.value}>
                    {cookingResults.originalLoss > 0
                      ? `-${cookingResults.weightLoss.toFixed(1)} г (потеря)`
                      : cookingResults.originalLoss < 0
                      ? `+${cookingResults.weightLoss.toFixed(1)} г (набор)`
                      : 'Без изменений'}
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Финальный вес:</span>
                  <span className={styles.value}>
                    {cookingResults.finalWeight.toFixed(1)} г
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {calculatorType === 'shopping' && (
        <div className={styles.shoppingCalculator}>
          <h3>🛒 Список покупок</h3>

          <div className={styles.shoppingList}>
            <h4>📋 Что нужно купить:</h4>
            <ul>
              {generateShoppingList().map((item, index) => (
                <li key={index} className={styles.shoppingItem}>
                  <input type="checkbox" id={`item-${index}`} />
                  <label htmlFor={`item-${index}`}>{item}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.shoppingSummary}>
            <h4>💰 Итого к оплате:</h4>
            <div className={styles.totalCost}>
              <span className={styles.amount}>
                {(dailyPlan.totals.cost * 100).toFixed(2)}
              </span>
              <span className={styles.unit}>₽</span>
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
          Очистить все
        </button>
      </div>
    </div>
  );
};

export default CookingCalculator;
