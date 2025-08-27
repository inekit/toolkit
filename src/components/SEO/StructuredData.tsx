import React from 'react';
import { SECTIONS } from '@/config/sections';
import { APP_CONFIG } from '@/config/app';

interface StructuredDataProps {
  type: 'website' | 'calculator' | 'category';
  title?: string;
  description?: string;
  url?: string;
  calculatorData?: {
    name: string;
    description: string;
    category: string;
  };
}

const StructuredData: React.FC<StructuredDataProps> = ({
  type,
  title,
  description,
  url,
  calculatorData,
}) => {
  const generateWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_CONFIG.name,
    description:
      'Бесплатные калькуляторы и конвертеры для решения бытовых задач',
    url: 'https://counterplus.ru',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://counterplus.ru/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: APP_CONFIG.name,
      url: 'https://counterplus.ru',
    },
  });

  const generateCalculatorSchema = () => {
    if (!calculatorData) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: calculatorData.name,
      description: calculatorData.description,
      applicationCategory: 'CalculatorApplication',
      operatingSystem: 'Web Browser',
      url: url || 'https://counterplus.ru',
      author: {
        '@type': 'Organization',
        name: APP_CONFIG.name,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'RUB',
      },
    };
  };

  const generateCategorySchema = () => {
    const calculators = SECTIONS.flatMap((section) =>
      section.calculators.map((calc) => ({
        '@type': 'SoftwareApplication',
        name: calc.title,
        description: calc.description,
        applicationCategory: 'CalculatorApplication',
        url: `https://counterplus.ru/${section.id}/${calc.id}`,
      }))
    );

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: title || 'Калькуляторы',
      description: description || 'Список калькуляторов и конвертеров',
      numberOfItems: calculators.length,
      itemListElement: calculators.map((calc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: calc,
      })),
    };
  };

  const getSchema = () => {
    switch (type) {
      case 'website':
        return generateWebsiteSchema();
      case 'calculator':
        return generateCalculatorSchema();
      case 'category':
        return generateCategorySchema();
      default:
        return generateWebsiteSchema();
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};

export default StructuredData;
