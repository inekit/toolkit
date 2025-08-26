import React, { useEffect, useRef } from 'react';

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
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Проверяем, что Яндекс.Метрика еще не загружена
    if (window.ym || isInitialized.current) {
      return;
    }

    // Создаем скрипт для загрузки Яндекс.Метрики
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://mc.yandex.ru/metrika/tag.js`;
    scriptRef.current = script;

    // Обработчик успешной загрузки
    script.onload = () => {
      console.log('✅ Яндекс.Метрика загружена');

      // Ждем немного, чтобы скрипт полностью инициализировался
      setTimeout(() => {
        try {
          // Проверяем, что объект Ya доступен
          if (window.Ya && window.Ya.Metrika) {
            window.Ya.Metrika.init({
              id: parseInt(counterId),
              defer: true,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
              ecommerce: true,
            });
            isInitialized.current = true;
            console.log('✅ Яндекс.Метрика инициализирована');
          } else {
            console.warn('⚠️ Объект Ya.Metrika недоступен');
          }
        } catch (error) {
          console.error('❌ Ошибка инициализации Яндекс.Метрики:', error);
        }
      }, 100);
    };

    // Обработчик ошибки загрузки
    script.onerror = () => {
      console.error('❌ Ошибка загрузки скрипта Яндекс.Метрики');
    };

    // Добавляем скрипт в head
    document.head.appendChild(script);

    // Очистка при размонтировании
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [counterId]);

  // Отслеживаем изменения маршрута
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.ym && isInitialized.current) {
        try {
          window.ym(parseInt(counterId), 'hit', window.location.href);
        } catch (error) {
          console.error('❌ Ошибка отслеживания маршрута:', error);
        }
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
