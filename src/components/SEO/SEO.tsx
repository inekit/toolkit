import React, { useEffect } from 'react';
import { APP_CONFIG } from '@/config/app';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'calculator';
  section?: string;
  calculator?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  section,
  calculator,
}) => {
  useEffect(() => {
    // Формируем заголовок
    let pageTitle = title || APP_CONFIG.name;
    if (section && calculator) {
      pageTitle = `${calculator} - ${section} | ${APP_CONFIG.name}`;
    } else if (section) {
      pageTitle = `${section} | ${APP_CONFIG.name}`;
    }

    // Формируем описание
    let pageDescription = description || APP_CONFIG.description;
    if (section && calculator) {
      pageDescription = `Калькулятор ${calculator} для ${section.toLowerCase()}. ${pageDescription}`;
    } else if (section) {
      pageDescription = `Калькуляторы и инструменты для ${section.toLowerCase()}. ${pageDescription}`;
    }

    // Формируем ключевые слова
    let pageKeywords = keywords || 'калькуляторы, конвертеры, бытовые задачи';
    if (section) {
      pageKeywords = `${section.toLowerCase()}, ${pageKeywords}`;
    }
    if (calculator) {
      pageKeywords = `${calculator.toLowerCase()}, ${pageKeywords}`;
    }

    // Формируем URL
    const pageUrl = url || window.location.href;

    // Обновляем title
    document.title = pageTitle;

    // Обновляем meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDescription);

    // Обновляем meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', pageKeywords);

    // Обновляем Open Graph
    updateMetaProperty('og:title', pageTitle);
    updateMetaProperty('og:description', pageDescription);
    updateMetaProperty('og:url', pageUrl);
    updateMetaProperty('og:type', type);
    if (image) {
      updateMetaProperty('og:image', image);
    }

    // Обновляем Twitter
    updateMetaProperty('twitter:title', pageTitle);
    updateMetaProperty('twitter:description', pageDescription);
    updateMetaProperty('twitter:url', pageUrl);
    if (image) {
      updateMetaProperty('twitter:image', image);
    }

    // Добавляем структурированные данные для калькуляторов
    if (type === 'calculator' && section && calculator) {
      addStructuredData(section, calculator);
    }

    // Очистка при размонтировании
    return () => {
      // Восстанавливаем базовые мета-теги
      document.title = APP_CONFIG.name;
      if (metaDescription) {
        metaDescription.setAttribute('content', APP_CONFIG.description);
      }
      if (metaKeywords) {
        metaKeywords.setAttribute(
          'content',
          'калькуляторы, конвертеры, бытовые задачи'
        );
      }
    };
  }, [title, description, keywords, image, url, type, section, calculator]);

  const updateMetaProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const addStructuredData = (section: string, calculator: string) => {
    // Удаляем существующие структурированные данные
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Создаем новые структурированные данные
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: calculator,
      description: `Калькулятор ${calculator} для ${section}`,
      url: window.location.href,
      applicationCategory: 'CalculatorApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'RUB',
      },
      provider: {
        '@type': 'Organization',
        name: APP_CONFIG.name,
        url: window.location.origin,
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };

  return null; // Компонент не рендерит ничего
};

export default SEO;
