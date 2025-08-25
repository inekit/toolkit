import React, { useEffect } from 'react';

interface YandexMetrikaProps {
  counterId: string;
}

declare global {
  interface Window {
    ym: (id: number, action: string, params?: any) => void;
    Ya: any;
  }
}

const YandexMetrika: React.FC<YandexMetrikaProps> = ({ counterId }) => {
  useEffect(() => {
    // Проверяем, что Яндекс.Метрика еще не загружена
    if (window.ym) {
      return;
    }

    // Создаем скрипт для загрузки Яндекс.Метрики
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://mc.yandex.ru/metrika/tag.js`;

    script.onload = () => {
      // Инициализируем счетчик
      if (window.Ya) {
        window.Ya.Metrika.init({
          id: parseInt(counterId),
          defer: true,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: true,
        });
      }
    };

    document.head.appendChild(script);

    // Очистка при размонтировании
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [counterId]);

  // Отслеживаем изменения маршрута
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.ym) {
        window.ym(parseInt(counterId), 'hit', window.location.href);
      }
    };

    // Отслеживаем изменения URL
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    // Отслеживаем popstate (навигация назад/вперед)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [counterId]);

  return null; // Компонент не рендерит ничего
};

export default YandexMetrika;
