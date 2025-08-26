import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './DaysUntilCalculator.module.scss';

const DaysUntilCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isEmbedded, setIsEmbeded] = useState(false);
  const [preset, setPreset] = useState('');

  // Проверяем, открыт ли калькулятор в embed режиме
  useEffect(() => {
    const isEmbed = window.location.pathname.includes('/embed/');
    setIsEmbeded(isEmbed);
  }, []);

  // Получаем дату из URL параметров (для embed)
  useEffect(() => {
    const dateFromUrl = searchParams.get('date');
    const presetFromUrl = searchParams.get('preset');

    if (presetFromUrl) {
      setPreset(presetFromUrl);
    }

    if (dateFromUrl) {
      setTargetDate(dateFromUrl);
      calculateDaysUntil(dateFromUrl);
    }
  }, [searchParams]);

  const calculateDaysUntil = (dateString: string) => {
    setError('');

    if (!dateString) {
      setError('Пожалуйста, выберите дату');
      return;
    }

    const target = new Date(dateString);
    const today = new Date();

    if (isNaN(target.getTime())) {
      setError('Пожалуйста, введите корректную дату');
      return;
    }

    // Сбрасываем время до полуночи для точного расчета дней
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult(diffDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateDaysUntil(targetDate);
  };

  const clearForm = () => {
    setTargetDate('');
    setResult(null);
    setError('');
  };

  const setPresetDate = (preset: string) => {
    let date: Date;

    setPreset(preset);

    switch (preset) {
      case 'newyear':
        date = new Date(new Date().getFullYear() + 1, 0, 1); // 1 января следующего года
        break;
      case 'christmas':
        const currentYear = new Date().getFullYear();
        const christmas = new Date(currentYear, 11, 25); // 25 декабря
        if (christmas < new Date()) {
          christmas.setFullYear(currentYear + 1); // Если Рождество уже прошло, берем следующий год
        }
        date = christmas;
        break;
      case 'birthday':
        // Запрашиваем день рождения у пользователя
        const month = prompt('Введите месяц рождения (1-12):');
        const day = prompt('Введите день рождения (1-31):');
        if (month && day) {
          const currentYear = new Date().getFullYear();
          date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
          if (date < new Date()) {
            date.setFullYear(currentYear + 1);
          }
        } else {
          return;
        }
        break;
      case 'summer':
        const currentYear2 = new Date().getFullYear();
        date = new Date(currentYear2, 5, 1); // 1 июня
        if (date < new Date()) {
          date.setFullYear(currentYear2 + 1);
        }
        break;
      case 'vacation':
        // Через 3 месяца
        date = new Date();
        date.setMonth(date.getMonth() + 3);
        break;
      case 'weekend':
        // Следующая пятница
        date = new Date();
        const daysUntilFriday = (5 - date.getDay() + 7) % 7;
        if (daysUntilFriday === 0) {
          date.setDate(date.getDate() + 7); // Если сегодня пятница, берем следующую
        } else {
          date.setDate(date.getDate() + daysUntilFriday);
        }
        break;
      default:
        return;
    }

    const dateString = date.toISOString().split('T')[0];
    setTargetDate(dateString);
    calculateDaysUntil(dateString);
  };

  const getPresetDescription = (preset: string) => {
    switch (preset) {
      case 'newyear':
        return 'до Нового года';
      case 'christmas':
        return 'до Рождества';
      case 'birthday':
        return 'до дня рождения';
      case 'summer':
        return 'до лета';
      case 'vacation':
        return 'до отпуска (через 3 месяца)';
      case 'weekend':
        return 'до выходных';
      default:
        return '';
    }
  };

  const getResultDescription = (days: number) => {
    if (days === 0) return 'Это уже сегодня!';
    if (days === 1) return 'Это уже завтра!';
    if (days === -1) return 'Это был вчера';
    if (days === 7) return 'Это через неделю';
    if (days === 30) return 'Еще месяц';
    if (days === 365) return 'Еще год';

    if (days > 0) {
      if (days < 7) return `Еще ${days} ${getDayWord(days)}`;
      if (days < 30)
        return `Еще ${Math.floor(days / 7)} ${getWeekWord(
          Math.floor(days / 7)
        )}`;
      if (days < 365)
        return `Еще ${Math.floor(days / 30)} ${getMonthWord(
          Math.floor(days / 30)
        )}`;
      return `Еще ${Math.floor(days / 365)} ${getYearWord(
        Math.floor(days / 365)
      )}`;
    } else {
      const absDays = Math.abs(days);
      if (absDays < 7) return `${absDays} ${getDayWord(absDays)} назад`;
      if (absDays < 30)
        return `${Math.floor(absDays / 7)} ${getWeekWord(
          Math.floor(absDays / 7)
        )} назад`;
      if (absDays < 365)
        return `${Math.floor(absDays / 30)} ${getMonthWord(
          Math.floor(absDays / 30)
        )} назад`;
      return `${Math.floor(absDays / 365)} ${getYearWord(
        Math.floor(absDays / 365)
      )} назад`;
    }
  };

  const getDayWord = (days: number) => {
    if (days === 1) return 'день';
    if (days < 5) return 'дня';
    return 'дней';
  };

  const getWeekWord = (weeks: number) => {
    if (weeks === 1) return 'неделя';
    if (weeks < 5) return 'недели';
    return 'недель';
  };

  const getMonthWord = (months: number) => {
    if (months === 1) return 'месяц';
    if (months < 5) return 'месяца';
    return 'месяцев';
  };

  const getYearWord = (years: number) => {
    if (years === 1) return 'год';
    if (years < 5) return 'года';
    return 'лет';
  };

  const getEmbedUrl = () => {
    if (!targetDate) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/embed/other/days-until?date=${targetDate}&preset=${preset}`;
  };

  const copyEmbedUrl = async () => {
    const url = getEmbedUrl();
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        alert('Ссылка скопирована в буфер обмена!');
      } catch (err) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Ссылка скопирована в буфер обмена!');
      }
    }
  };

  return (
    <div className={`${styles.calculator} dateCalculator`}>
      <div className="calculatorHeader">
        <h2>⏰ Счетчик дней {getPresetDescription(preset)}</h2>
        {!isEmbedded && (
          <p>
            Узнайте, сколько дней осталось до важного события. Используйте
            готовые пресеты или выберите свою дату.
          </p>
        )}
      </div>

      {!isEmbedded && (
        <form className="calculatorForm" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Быстрые пресеты</label>
            <div className={styles.presetButtons}>
              {[
                {
                  key: 'newyear',
                  label: '🎆 Новый год',
                  color: 'var(--primary-500)',
                },
                {
                  key: 'christmas',
                  label: '🎄 Рождество',
                  color: 'var(--success-500)',
                },
                {
                  key: 'summer',
                  label: '☀️ Лето',
                  color: 'var(--warning-500)',
                },
                {
                  key: 'weekend',
                  label: '🎉 Выходные',
                  color: 'var(--accent-500)',
                },
              ].map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setPresetDate(preset.key)}
                  style={{
                    background: preset.color,
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    margin: '0.25rem',
                    transition: 'all var(--transition-normal)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="inputGroup">
            <label htmlFor="targetDate">Или выберите свою дату</label>
            <input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          {error && <div className="error">{error}</div>}
          {!isEmbedded && (
            <div className="inputGroup">
              <button type="submit" className="calculateBtn">
                Рассчитать дни
              </button>
            </div>
          )}
        </form>
      )}

      {result !== null && (
        <div className="result dateResult">
          <div className="resultValue">
            <span className="amount">{Math.abs(result)}</span>
            <span className="unit">{getDayWord(Math.abs(result))}</span>
            <span className="unit"> {getPresetDescription(preset)}</span>
          </div>
          <p className="recommendation">{getResultDescription(result)}</p>

          {!isEmbedded && (
            <div className={styles.embedSection}>
              <h4>Встроить на сайт</h4>
              <p>Скопируйте ссылку для встраивания на ваш сайт:</p>
              <div className={styles.embedUrl}>
                <input
                  type="text"
                  value={getEmbedUrl()}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                  }}
                />
                <button
                  type="button"
                  onClick={copyEmbedUrl}
                  style={{
                    background: 'var(--accent-500)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  📋 Копировать ссылку
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!isEmbedded && (
        <div className="inputGroup" style={{ marginTop: '2rem' }}>
          <button
            type="button"
            onClick={clearForm}
            className="calculateBtn"
            style={{ background: 'var(--gray-500)' }}
          >
            Очистить форму
          </button>
        </div>
      )}
    </div>
  );
};

export default DaysUntilCalculator;
