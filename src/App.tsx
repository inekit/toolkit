import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import RepairPage from '@/pages/RepairPage/RepairPage';
import BicyclePage from '@/pages/BicyclePage/BicyclePage';
import OtherPage from '@/pages/OtherPage/OtherPage';
import TermsPage from '@/pages/TermsPage/TermsPage';
import CalculatorWrapper from '@/components/CalculatorWrapper/CalculatorWrapper';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import YandexMetrika from '@/components/Analytics/YandexMetrika';
import { SECTIONS } from '@/config/sections';

const App: React.FC = () => {
  return (
    <>
      {/* Яндекс.Метрика - замените на ваш ID счетчика */}
      <YandexMetrika counterId="103888039" />

      <Layout>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/repair" element={<RepairPage />} />
            <Route path="/bicycle" element={<BicyclePage />} />
            <Route path="/other" element={<OtherPage />} />

            {/* Роуты для отдельных калькуляторов */}
            {SECTIONS.map((section) =>
              section.calculators.map((calculator) => (
                <Route
                  key={`${section.id}-${calculator.id}`}
                  path={`/${section.id}/${calculator.id}`}
                  element={
                    <ErrorBoundary>
                      <CalculatorWrapper>
                        <calculator.component />
                      </CalculatorWrapper>
                    </ErrorBoundary>
                  }
                />
              ))
            )}
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
};

export default App;
