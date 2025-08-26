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
  const [embedWidth, setEmbedWidth] = useState('100%');
  const [embedHeight, setEmbedHeight] = useState('600');
  const [showBorder, setShowBorder] = useState(true);
  const [showShadow, setShowShadow] = useState(true);

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

    let iframeStyle = 'border: none; border-radius: 8px;';
    if (showBorder) {
      iframeStyle += ' border: 2px solid #e5e7eb;';
    }
    if (showShadow) {
      iframeStyle += ' box-shadow: 0 4px 12px rgba(0,0,0,0.1);';
    }

    return `<iframe src="${embedUrl}" width="${embedWidth}" height="${embedHeight}" frameborder="0" style="${iframeStyle}"></iframe>`;
  };

  const generateDirectLink = () => {
    return `${window.location.origin}/embed/${sectionId}/${calculatorId}`;
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

  const copyDirectLink = async () => {
    const directLink = generateDirectLink();
    try {
      await navigator.clipboard.writeText(directLink);
      alert('Прямая ссылка скопирована в буфер обмена!');
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
              <h3>Описание</h3>
              <p>{calculator.description}</p>
            </div>

            <div className={styles.infoSection}>
              <h3>Теги</h3>
              <div className={styles.tagsList}>
                {calculator.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3>Сложность</h3>
              <span
                className={`${styles.difficulty} ${
                  styles[calculator.difficulty]
                }`}
              >
                {calculator.difficulty === 'easy'
                  ? 'Легко'
                  : calculator.difficulty === 'medium'
                  ? 'Средне'
                  : 'Сложно'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'embed' && (
          <div className={styles.embedTab}>
            <div className={styles.embedOptions}>
              <h3>Настройки встраивания</h3>

              <div className={styles.optionGroup}>
                <label>
                  Ширина:
                  <input
                    type="text"
                    value={embedWidth}
                    onChange={(e) => setEmbedWidth(e.target.value)}
                    placeholder="100% или 400px"
                  />
                </label>
              </div>

              <div className={styles.optionGroup}>
                <label>
                  Высота:
                  <input
                    type="text"
                    value={embedHeight}
                    onChange={(e) => setEmbedHeight(e.target.value)}
                    placeholder="600"
                  />
                </label>
              </div>

              <div className={styles.optionGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={showBorder}
                    onChange={(e) => setShowBorder(e.target.checked)}
                  />
                  Показать рамку
                </label>
              </div>

              <div className={styles.optionGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={showShadow}
                    onChange={(e) => setShowShadow(e.target.checked)}
                  />
                  Показать тень
                </label>
              </div>
            </div>

            <div className={styles.embedPreview}>
              <h3>Предварительный просмотр</h3>
              <div className={styles.previewFrame}>
                <iframe
                  src={`/embed/${sectionId}/${calculatorId}`}
                  width={embedWidth}
                  height={embedHeight}
                  frameBorder="0"
                  style={{
                    border: showBorder ? '2px solid #e5e7eb' : 'none',
                    borderRadius: '8px',
                    boxShadow: showShadow
                      ? '0 4px 12px rgba(0,0,0,0.1)'
                      : 'none',
                  }}
                />
              </div>
            </div>

            <div className={styles.embedCode}>
              <h3>Код для встраивания</h3>
              <div className={styles.codeContainer}>
                <pre className={styles.code}>
                  <code>{generateEmbedCode(calculator)}</code>
                </pre>
                <button onClick={copyEmbedCode} className={styles.copyBtn}>
                  📋 Скопировать код
                </button>
              </div>
            </div>

            <div className={styles.directLink}>
              <h3>Прямая ссылка</h3>
              <div className={styles.linkContainer}>
                <input
                  type="text"
                  value={generateDirectLink()}
                  readOnly
                  className={styles.linkInput}
                />
                <button onClick={copyDirectLink} className={styles.copyBtn}>
                  📋 Скопировать ссылку
                </button>
              </div>
            </div>

            <div className={styles.embedInstructions}>
              <h3>Инструкция по встраиванию</h3>
              <ol>
                <li>Скопируйте код iframe выше</li>
                <li>Вставьте его в HTML-код вашей страницы</li>
                <li>При необходимости измените размеры (width и height)</li>
                <li>Калькулятор автоматически загрузится на вашем сайте</li>
              </ol>
              <p className={styles.note}>
                <strong>Примечание:</strong> Калькулятор работает без
                регистрации и не требует дополнительной настройки.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorWrapper;
