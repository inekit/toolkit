import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import CategoryPage from '@/pages/CategoryPage/CategoryPage';
import TermsPage from '@/pages/TermsPage/TermsPage';
import CalculatorWrapper from '@/components/CalculatorWrapper/CalculatorWrapper';
import EmbedCalculator from '@/components/EmbedCalculator/EmbedCalculator';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import YandexMetrika from '@/components/Analytics/YandexMetrika';
import { SECTIONS } from '@/config/sections';

// Создаем роутер
const router = createBrowserRouter([
  // Роуты для встраивания калькуляторов (без лейаута)
  ...SECTIONS.flatMap((section) =>
    section.calculators.map((calculator) => ({
      path: `/embed/${section.id}/${calculator.id}`,
      element: (
        <ErrorBoundary>
          <EmbedCalculator />
        </ErrorBoundary>
      ),
    }))
  ),

  // Основные роуты с лейаутом
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Загрузка...</div>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<div>Загрузка...</div>}>
            <TermsPage />
          </Suspense>
        ),
      },
      // Генерируемые страницы категорий
      ...SECTIONS.map((section) => ({
        path: section.id,
        element: (
          <Suspense fallback={<div>Загрузка...</div>}>
            <CategoryPage />
          </Suspense>
        ),
      })),
      // Роуты для отдельных калькуляторов
      ...SECTIONS.flatMap((section) =>
        section.calculators.map((calculator) => ({
          path: `${section.id}/${calculator.id}`,
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div>Загрузка...</div>}>
                <CalculatorWrapper>
                  <calculator.component />
                </CalculatorWrapper>
              </Suspense>
            </ErrorBoundary>
          ),
        }))
      ),
    ],
  },
]);

const App: React.FC = () => {
  return (
    <>
      {/* Яндекс.Метрика - замените на ваш ID счетчика */}
      <YandexMetrika counterId="103888039" />

      {/* Роутер */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
