import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCalculatorById, getSectionById } from '@/config/sections';
import { Calculator } from '@/config/sections';
import SEO from '@/components/SEO/SEO';
import styles from './CalculatorWrapper.module.scss';

interface CalculatorWrapperProps {
  children: React.ReactNode;
}

const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({ children }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'calculator' | 'info' | 'embed'>(
    'calculator'
  );

  // Добавляем отладочную информацию
  console.log('CalculatorWrapper params:', location.pathname.split('/'));

  const [sectionId, calculatorId] = location.pathname.split('/').slice(1);
  if (!sectionId || !calculatorId) {
    return <div>Калькулятор не найден: отсутствуют параметры</div>;
  }

  const calculator = getCalculatorById(sectionId, calculatorId);
  console.log('Found calculator:', calculator);

  if (!calculator) {
    return (
      <div>
        Калькулятор не найден: {sectionId}/{calculatorId}
      </div>
    );
  }

  const generateEmbedCode = (calc: Calculator) => {
    const embedUrl = `${window.location.origin}/embed/${sectionId}/${calculatorId}`;
    return `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`;
  };

  const copyEmbedCode = async () => {
    const embedCode = generateEmbedCode(calculator);
    try {
      await navigator.clipboard.writeText(embedCode);
      alert('Код встраивания скопирован в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  const section = getSectionById(sectionId);

  return (
    <div className={styles.wrapper}>
      <SEO
        section={section?.title || sectionId}
        calculator={calculator.title}
        description={`Калькулятор ${calculator.title}: ${calculator.description}`}
        keywords={`${calculator.title.toLowerCase()}, ${calculator.tags.join(
          ', '
        )}, калькулятор`}
        type="calculator"
      />

      <div className={styles.header}>
        <div className={styles.calculatorInfo}>
          <div className={styles.calculatorIcon}>{calculator.icon}</div>
          <div>
            <h1>{calculator.title}</h1>
            <p>{calculator.description}</p>
          </div>
        </div>

        <div className={styles.meta}>
          <span
            className={`${styles.difficulty} ${styles[calculator.difficulty]}`}
          >
            {calculator.difficulty === 'easy'
              ? 'Легко'
              : calculator.difficulty === 'medium'
              ? 'Средне'
              : 'Сложно'}
          </span>
          <span className={styles.tags}>
            {calculator.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === 'calculator' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('calculator')}
        >
          🧮 Калькулятор
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === 'info' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('info')}
        >
          ℹ️ Информация
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === 'embed' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('embed')}
        >
          📱 Встроить на сайт
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'calculator' && (
          <div className={styles.calculatorTab}>{children}</div>
        )}

        {activeTab === 'info' && (
          <div className={styles.infoTab}>
            <div className={styles.infoSection}>
              <h3>📋 Описание</h3>
              <p>{calculator.description}</p>
            </div>

            <div className={styles.infoSection}>
              <h3>🎯 Как использовать</h3>
              <ol>
                <li>Заполните все необходимые поля</li>
                <li>Нажмите кнопку "Рассчитать"</li>
                <li>Получите результат с рекомендациями</li>
              </ol>
            </div>

            <div className={styles.infoSection}>
              <h3>💡 Полезные советы</h3>
              <ul>
                <li>Всегда берите материалы с небольшим запасом</li>
                <li>Учитывайте особенности вашего помещения</li>
                <li>Консультируйтесь с профессионалами для сложных расчетов</li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h3>🔗 Похожие калькуляторы</h3>
              <div className={styles.relatedCalculators}>
                {calculator.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.relatedTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'embed' && (
          <div className={styles.embedTab}>
            <div className={styles.embedInfo}>
              <h3>📱 Встройте калькулятор на ваш сайт</h3>
              <p>
                Скопируйте код ниже и вставьте его на страницу вашего сайта.
                Калькулятор будет работать в iframe и автоматически
                адаптироваться под дизайн.
              </p>
            </div>

            <div className={styles.embedCode}>
              <div className={styles.codeHeader}>
                <span>Код для встраивания:</span>
                <button className={styles.copyBtn} onClick={copyEmbedCode}>
                  📋 Копировать
                </button>
              </div>
              <pre className={styles.code}>
                <code>{generateEmbedCode(calculator)}</code>
              </pre>
            </div>

            <div className={styles.embedPreview}>
              <h4>Предварительный просмотр:</h4>
              <div className={styles.previewFrame}>
                <iframe
                  src={`/embed/${sectionId}/${calculatorId}`}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  title={calculator.title}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorWrapper;
