import { lazy } from 'react';

// Lazy loading компонентов калькуляторов
const PaintCalculator = lazy(
  () => import('@/components/calculators/PaintCalculator/PaintCalculator')
);
const TileCalculator = lazy(
  () => import('@/components/calculators/TileCalculator/TileCalculator')
);
const RepairCostCalculator = lazy(
  () =>
    import('@/components/calculators/RepairCostCalculator/RepairCostCalculator')
);
const FoundationCalculator = lazy(
  () =>
    import('@/components/calculators/FoundationCalculator/FoundationCalculator')
);

const GearCalculator = lazy(
  () => import('@/components/calculators/GearCalculator/GearCalculator')
);
const PowerCalculator = lazy(
  () => import('@/components/calculators/PowerCalculator/PowerCalculator')
);

const CadenceCalculator = lazy(
  () => import('@/components/calculators/CadenceCalculator/CadenceCalculator')
);
const SpokeCalculator = lazy(
  () => import('@/components/calculators/SpokeCalculator/SpokeCalculator')
);

const MortgageCalculator = lazy(
  () => import('@/components/calculators/MortgageCalculator/MortgageCalculator')
);
const InvestmentCalculator = lazy(
  () =>
    import('@/components/calculators/InvestmentCalculator/InvestmentCalculator')
);
const LoanCalculator = lazy(
  () => import('@/components/calculators/LoanCalculator/LoanCalculator')
);
const CookingCalculator = lazy(
  () => import('@/components/calculators/CookingCalculator/CookingCalculator')
);
const CurrencyConverter = lazy(
  () => import('@/components/calculators/CurrencyConverter/CurrencyConverter')
);
const HealthCalculator = lazy(
  () => import('@/components/calculators/HealthCalculator/HealthCalculator')
);

const DistanceCalculator = lazy(
  () => import('@/components/calculators/DistanceCalculator/DistanceCalculator')
);

const DaysUntilCalculator = lazy(
  () =>
    import('@/components/calculators/DaysUntilCalculator/DaysUntilCalculator')
);

const PetAgeCalculator = lazy(
  () => import('@/components/calculators/PetAgeCalculator/PetAgeCalculator')
);

const UnitConverter = lazy(
  () => import('@/components/calculators/UnitConverter/UnitConverter')
);

export interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Section {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  calculators: Calculator[];
}

export const SECTIONS: Section[] = [
  {
    id: 'repair',
    title: 'Ремонт и строительство',
    shortTitle: 'Ремонт',
    description:
      'Калькуляторы и конвертеры для расчета материалов, стоимости работ и планирования ремонта',
    icon: '🏠',
    color: 'var(--primary-500)',
    path: '/repair',
    calculators: [
      {
        id: 'paint',
        title: 'Расчет краски для стен',
        description:
          'Определите необходимое количество краски для покраски стен',
        icon: '🎨',
        component: PaintCalculator,
        tags: ['краска', 'стены', 'ремонт'],
        difficulty: 'easy',
      },
      {
        id: 'tile',
        title: 'Количество плитки',
        description: 'Рассчитайте нужное количество плитки для облицовки',
        icon: '🧱',
        component: TileCalculator,
        tags: ['плитка', 'облицовка', 'ремонт'],
        difficulty: 'easy',
      },
      {
        id: 'repair-cost',
        title: 'Стоимость ремонта',
        description: 'Оцените стоимость ремонтных работ по площади',
        icon: '💰',
        component: RepairCostCalculator,
        tags: ['стоимость', 'ремонт', 'бюджет'],
        difficulty: 'medium',
      },
      {
        id: 'foundation',
        title: 'Расчет фундамента',
        description: 'Определите параметры и стоимость фундамента',
        icon: '🏗️',
        component: FoundationCalculator,
        tags: ['фундамент', 'строительство', 'расчет'],
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'bicycle',
    title: 'Велосипед',
    shortTitle: 'Велосипед',
    description:
      'Калькуляторы и конвертеры для велосипедистов: передаточные отношения, мощность, маршруты',
    icon: '🚴',
    color: 'var(--success-500)',
    path: '/bicycle',
    calculators: [
      {
        id: 'gear',
        title: 'Калькулятор передач',
        description: 'Рассчитайте оптимальные передаточные отношения',
        icon: '⚙️',
        component: GearCalculator,
        tags: ['передачи', 'велосипед', 'оптимизация'],
        difficulty: 'medium',
      },
      {
        id: 'power',
        title: 'Расчет мощности',
        description: 'Определите необходимую мощность для разных условий',
        icon: '💪',
        component: PowerCalculator,
        tags: ['мощность', 'велосипед', 'физика'],
        difficulty: 'hard',
      },
      {
        id: 'cadence',
        title: 'Оптимальный каденс',
        description: 'Рассчитайте идеальную частоту педалирования',
        icon: '🔄',
        component: CadenceCalculator,
        tags: ['каденс', 'велосипед', 'эффективность'],
        difficulty: 'medium',
      },
      {
        id: 'spoke',
        title: 'Калькулятор спицевания',
        description: 'Рассчитайте паттерн спицевания и длину спиц',
        icon: '🚴',
        component: SpokeCalculator,
        tags: ['спицы', 'велосипед', 'колесо'],
        difficulty: 'medium',
      },
      {
        id: 'distance',
        title: 'Расстояние между координатами',
        description: 'Рассчитайте расстояние между двумя точками на карте',
        icon: '🌍',
        component: DistanceCalculator,
        tags: ['координаты', 'расстояние', 'география'],
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Финансы и инвестиции',
    shortTitle: 'Финансы',
    description:
      'Калькуляторы для расчета кредитов, ипотеки, инвестиций и конвертации валют',
    icon: '💼',
    color: 'var(--info-500)',
    path: '/finance',
    calculators: [
      {
        id: 'mortgage',
        title: 'Калькулятор ипотеки',
        description: 'Рассчитайте ежемесячные платежи и график погашения',
        icon: '🏠',
        component: MortgageCalculator,
        tags: ['ипотека', 'недвижимость', 'кредит'],
        difficulty: 'medium',
      },
      {
        id: 'investment',
        title: 'Калькулятор инвестиций',
        description: 'Рассчитайте будущую стоимость инвестиций',
        icon: '📈',
        component: InvestmentCalculator,
        tags: ['инвестиции', 'сбережения', 'доходность'],
        difficulty: 'hard',
      },
      {
        id: 'loan',
        title: 'Калькулятор кредитов',
        description: 'Рассчитайте условия потребительского кредита',
        icon: '💳',
        component: LoanCalculator,
        tags: ['кредит', 'займ', 'платежи'],
        difficulty: 'medium',
      },
      {
        id: 'currency',
        title: 'Конвертер валют',
        description: 'Актуальные курсы валют и конвертация',
        icon: '💱',
        component: CurrencyConverter,
        tags: ['валюты', 'конвертация', 'курсы'],
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'health',
    title: 'Здоровье и фитнес',
    shortTitle: 'Здоровье',
    description:
      'Калькуляторы для расчета ИМТ, калорий, процента жира и других показателей здоровья',
    icon: '🏥',
    color: 'var(--success-500)',
    path: '/health',
    calculators: [
      {
        id: 'bmi',
        title: 'Калькулятор ИМТ',
        description: 'Рассчитайте индекс массы тела и получите рекомендации',
        icon: '📊',
        component: HealthCalculator,
        tags: ['ИМТ', 'вес', 'здоровье'],
        difficulty: 'easy',
      },
      {
        id: 'calories',
        title: 'Калькулятор калорий',
        description: 'Определите потребность в калориях и макронутриентах',
        icon: '🔥',
        component: HealthCalculator,
        tags: ['калории', 'питание', 'метаболизм'],
        difficulty: 'medium',
      },
      {
        id: 'body-fat',
        title: 'Процент жира в организме',
        description: 'Рассчитайте процент жира по измерениям тела',
        icon: '📏',
        component: HealthCalculator,
        tags: ['жир', 'тело', 'измерения'],
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'other',
    title: 'Полезные инструменты',
    shortTitle: 'Инструменты',
    description: 'Различные калькуляторы и конвертеры для бытовых задач',
    icon: '⚡',
    color: 'var(--warning-500)',
    path: '/other',
    calculators: [
      {
        id: 'cooking',
        title: 'Кулинарные калькуляторы',
        description: 'Пересчет рецептов и расчет калорий',
        icon: '👨‍🍳',
        component: CookingCalculator,
        tags: ['кулинария', 'рецепты', 'калории'],
        difficulty: 'easy',
      },
      {
        id: 'days-until',
        title: 'Дней до события',
        description: 'Рассчитайте количество дней до определенной даты',
        icon: '📅',
        component: DaysUntilCalculator,
        tags: ['дата', 'событие', 'расчет'],
        difficulty: 'easy',
      },
      {
        id: 'pet-age',
        title: 'Калькулятор возраста питомца',
        description: 'Рассчитайте возраст вашего питомца в человеческих годах',
        icon: '🐕',
        component: PetAgeCalculator,
        tags: ['питомец', 'возраст', 'расчет'],
        difficulty: 'easy',
      },
      {
        id: 'unit-converter',
        title: 'Конвертер единиц измерения',
        description:
          'Конвертируйте различные единицы измерения (например, дюймы в сантиметры)',
        icon: '⚖️',
        component: UnitConverter,
        tags: ['единицы', 'конвертация', 'измерение'],
        difficulty: 'easy',
      },
    ],
  },
];

// Вспомогательные функции
export const getSectionById = (id: string): Section | undefined => {
  return SECTIONS.find((section) => section.id === id);
};

export const getCalculatorById = (
  sectionId: string,
  calculatorId: string
): Calculator | undefined => {
  const section = getSectionById(sectionId);
  return section?.calculators.find((calc) => calc.id === calculatorId);
};

export const getAllCalculators = (): Calculator[] => {
  return SECTIONS.flatMap((section) => section.calculators);
};

export const getCalculatorsByTag = (tag: string): Calculator[] => {
  return getAllCalculators().filter((calc) =>
    calc.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
};
