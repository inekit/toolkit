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
    if (window.ym || isInitialized.current) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.innerHTML = `    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103888039', 'ym');

    ym(103888039, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`;
    script.id = 'yandex-metrika';
    scriptRef.current = script;

    script.onload = () => {
      console.log('✅ Яндекс.Метрика загружена');
    };

    script.onerror = () => {
      console.error('❌ Ошибка загрузки скрипта Яндекс.Метрики');
    };

    document.head.appendChild(script);

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

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [counterId]);

  return null;
};

export default YandexMetrika;
