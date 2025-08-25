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
const RoutePlanner = lazy(
  () => import('@/components/calculators/RoutePlanner/RoutePlanner')
);
const CadenceCalculator = lazy(
  () => import('@/components/calculators/CadenceCalculator/CadenceCalculator')
);

const FinancialCalculator = lazy(
  () =>
    import('@/components/calculators/FinancialCalculator/FinancialCalculator')
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
        id: 'route',
        title: 'Планировщик маршрутов',
        description: 'Спланируйте оптимальный маршрут для поездки',
        icon: '🗺️',
        component: RoutePlanner,
        tags: ['маршрут', 'планирование', 'велосипед'],
        difficulty: 'easy',
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
    ],
  },
  {
    id: 'other',
    title: 'Калькуляторы и конвертеры',
    description:
      'Полезные инструменты для решения различных бытовых задач, включая конвертеры валют, единиц измерения и другие',
    icon: '⚡',
    color: 'var(--warning-500)',
    path: '/other',
    calculators: [
      {
        id: 'financial',
        title: 'Финансовые расчеты',
        description: 'Калькуляторы кредитов, ипотеки и инвестиций',
        icon: '💳',
        component: FinancialCalculator,
        tags: ['финансы', 'кредит', 'инвестиции'],
        difficulty: 'medium',
      },
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
        id: 'currency',
        title: 'Конвертер валют',
        description: 'Актуальные курсы валют и конвертация',
        icon: '💱',
        component: CurrencyConverter,
        tags: ['валюты', 'конвертация', 'курсы'],
        difficulty: 'easy',
      },
      {
        id: 'health',
        title: 'Калькулятор здоровья',
        description: 'ИМТ, калории и другие показатели здоровья',
        icon: '🏥',
        component: HealthCalculator,
        tags: ['здоровье', 'ИМТ', 'калории'],
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
