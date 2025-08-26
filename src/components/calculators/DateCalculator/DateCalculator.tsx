import React, { useState } from 'react';
import styles from './DateCalculator.module.scss';

const DateCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateDays = () => {
    setError('');

    if (!startDate || !endDate) {
      setError('Пожалуйста, выберите обе даты');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Пожалуйста, введите корректные даты');
      return;
    }

    // Разница в миллисекундах
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult(diffDays);
  };

  const clearForm = () => {
    setStartDate('');
    setEndDate('');
    setResult(null);
    setError('');
  };

  const getToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEndDate(tomorrow.toISOString().split('T')[0]);
  };

  const getNextWeek = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setEndDate(nextWeek.toISOString().split('T')[0]);
  };

  const getNextMonth = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setEndDate(nextMonth.toISOString().split('T')[0]);
  };

  const getDateDescription = (days: number) => {
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Завтра';
    if (days === -1) return 'Вчера';
    if (days === 7) return 'Через неделю';
    if (days === 30) return 'Через месяц';
    if (days === 365) return 'Через год';

    if (days > 0) {
      if (days < 7) return `Через ${days} ${getDayWord(days)}`;
      if (days < 30)
        return `Через ${Math.floor(days / 7)} ${getWeekWord(
          Math.floor(days / 7)
        )}`;
      if (days < 365)
        return `Через ${Math.floor(days / 30)} ${getMonthWord(
          Math.floor(days / 30)
        )}`;
      return `Через ${Math.floor(days / 365)} ${getYearWord(
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

  return (
    <div className={`${styles.calculator} dateCalculator`}>
      <div className="calculatorHeader">
        <h2>📅 Калькулятор дней между датами</h2>
        <p>
          Рассчитайте количество дней между двумя датами. Полезно для
          планирования событий, отпусков и проектов.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateDays();
        }}
      >
        <div className="dateInputs">
          <div className="inputGroup">
            <label htmlFor="startDate">Начальная дата</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <div className="help">
              <button
                type="button"
                onClick={getToday}
                style={{
                  background: 'var(--primary-100)',
                  border: '1px solid var(--primary-200)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                Сегодня
              </button>
            </div>
          </div>

          <div className="inputGroup">
            <label htmlFor="endDate">Конечная дата</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="help">
              <button
                type="button"
                onClick={getTomorrow}
                style={{
                  background: 'var(--accent-100)',
                  border: '1px solid var(--accent-200)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                Завтра
              </button>
              <button
                type="button"
                onClick={getNextWeek}
                style={{
                  background: 'var(--warning-100)',
                  border: '1px solid var(--warning-200)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                Через неделю
              </button>
              <button
                type="button"
                onClick={getNextMonth}
                style={{
                  background: 'var(--success-100)',
                  border: '1px solid var(--success-200)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                Через месяц
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать дни
          </button>
        </div>
      </form>

      {result !== null && (
        <div className="result dateResult">
          <h3>Результат расчета</h3>
          <div className="resultValue">
            <span className="amount">{Math.abs(result)}</span>
            <span className="unit">{getDayWord(Math.abs(result))}</span>
          </div>
          <p className="recommendation">
            <strong>Описание:</strong> {getDateDescription(result)}
          </p>
        </div>
      )}

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
    </div>
  );
};

export default DateCalculator;
