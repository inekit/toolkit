import React, { useState } from 'react';
import styles from './InvestmentCalculator.module.scss';

const InvestmentCalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('10');
  const [inflationRate, setInflationRate] = useState('3');
  const [taxRate, setTaxRate] = useState('13');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateInvestment = () => {
    setError('');

    if (!initialInvestment || !monthlyContribution || !annualReturn) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const initial = parseFloat(initialInvestment);
    const monthly = parseFloat(monthlyContribution);
    const returnRate = parseFloat(annualReturn);
    const period = parseInt(investmentPeriod);
    const inflation = parseFloat(inflationRate);
    const tax = parseFloat(taxRate);

    if (isNaN(initial) || isNaN(monthly) || isNaN(returnRate)) {
      setError('Все значения должны быть числами');
      return;
    }

    if (initial < 0 || monthly < 0 || returnRate < -100 || returnRate > 100) {
      setError('Некорректные значения');
      return;
    }

    if (period <= 0 || period > 50) {
      setError('Период инвестирования должен быть от 1 до 50 лет');
      return;
    }

    // Расчет без учета налогов и инфляции
    const monthlyReturn = returnRate / 100 / 12;
    const totalMonths = period * 12;

    let totalInvestment = initial;
    let totalContributions = initial;

    // Расчет с ежемесячными взносами
    for (let month = 1; month <= totalMonths; month++) {
      totalInvestment = totalInvestment * (1 + monthlyReturn) + monthly;
      totalContributions += monthly;
    }

    // Расчет с учетом инфляции
    const inflationMultiplier = Math.pow(1 - inflation / 100, period);
    const realValue = totalInvestment * inflationMultiplier;

    // Расчет с учетом налогов
    const gains = totalInvestment - totalContributions;
    const taxAmount = gains * (tax / 100);
    const afterTaxValue = totalInvestment - taxAmount;

    // Годовой рост
    const yearlyGrowth = [];
    let currentValue = initial;
    let currentContributions = initial;

    for (let year = 1; year <= period; year++) {
      for (let month = 1; month <= 12; month++) {
        currentValue = currentValue * (1 + monthlyReturn) + monthly;
        currentContributions += monthly;
      }

      yearlyGrowth.push({
        year,
        value: currentValue.toFixed(0),
        contributions: currentContributions.toFixed(0),
        gains: (currentValue - currentContributions).toFixed(0),
        growth: ((currentValue / currentContributions - 1) * 100).toFixed(1),
      });
    }

    // Анализ рисков
    const riskAnalysis = analyzeRisk(returnRate, period, inflation);

    // Рекомендации
    const recommendations = getInvestmentRecommendations(
      initial,
      monthly,
      returnRate,
      period,
      inflation,
      tax
    );

    setResult({
      initialInvestment: initial.toFixed(0),
      monthlyContribution: monthly.toFixed(0),
      annualReturn: returnRate.toFixed(2),
      investmentPeriod: period,
      inflationRate: inflation.toFixed(1),
      taxRate: tax.toFixed(1),
      totalInvestment: totalInvestment.toFixed(0),
      totalContributions: totalContributions.toFixed(0),
      totalGains: (totalInvestment - totalContributions).toFixed(0),
      realValue: realValue.toFixed(0),
      afterTaxValue: afterTaxValue.toFixed(0),
      taxAmount: taxAmount.toFixed(0),
      yearlyGrowth,
      riskAnalysis,
      recommendations,
    });
  };

  const analyzeRisk = (
    returnRate: number,
    period: number,
    inflation: number
  ) => {
    let riskLevel = '';
    let riskScore = 0;

    // Оценка риска по доходности
    if (returnRate < 0) riskScore += 30;
    else if (returnRate < 5) riskScore += 20;
    else if (returnRate < 10) riskScore += 10;
    else if (returnRate > 20) riskScore += 15;

    // Оценка риска по периоду
    if (period < 5) riskScore += 20;
    else if (period > 30) riskScore += 10;

    // Оценка риска по инфляции
    if (inflation > 10) riskScore += 25;
    else if (inflation > 5) riskScore += 15;

    // Определение уровня риска
    if (riskScore <= 20) riskLevel = 'Низкий';
    else if (riskScore <= 40) riskLevel = 'Умеренный';
    else if (riskScore <= 60) riskLevel = 'Высокий';
    else riskLevel = 'Очень высокий';

    return {
      riskLevel,
      riskScore,
      factors: getRiskFactors(returnRate, period, inflation),
    };
  };

  const getRiskFactors = (
    returnRate: number,
    period: number,
    inflation: number
  ): string[] => {
    const factors = [];

    if (returnRate < 0) factors.push('Отрицательная доходность');
    if (returnRate > 20) factors.push('Высокая доходность (высокий риск)');
    if (period < 5) factors.push('Короткий период инвестирования');
    if (inflation > 10) factors.push('Высокая инфляция');
    if (returnRate < inflation) factors.push('Доходность ниже инфляции');

    if (factors.length === 0) factors.push('Сбалансированные параметры');

    return factors;
  };

  const getInvestmentRecommendations = (
    initial: number,
    monthly: number,
    returnRate: number,
    period: number,
    inflation: number,
    tax: number
  ): string[] => {
    const recommendations = [];

    // Рекомендации по начальным инвестициям
    if (initial < 10000) {
      recommendations.push(
        'Рассмотрите увеличение начальных инвестиций для лучшего эффекта сложного процента'
      );
    }

    // Рекомендации по ежемесячным взносам
    if (monthly < 5000) {
      recommendations.push(
        'Увеличьте ежемесячные взносы для ускорения накопления'
      );
    }

    // Рекомендации по доходности
    if (returnRate < inflation) {
      recommendations.push(
        'Доходность ниже инфляции - рассмотрите более доходные инструменты'
      );
    } else if (returnRate > 20) {
      recommendations.push(
        'Высокая доходность сопряжена с высоким риском - диверсифицируйте портфель'
      );
    }

    // Рекомендации по периоду
    if (period < 10) {
      recommendations.push(
        'Короткий период - сосредоточьтесь на менее рискованных инструментах'
      );
    } else if (period > 20) {
      recommendations.push(
        'Длинный период позволяет принимать большие риски для большей доходности'
      );
    }

    // Рекомендации по налогам
    if (tax > 15) {
      recommendations.push(
        'Рассмотрите налоговые льготы (ИИС, пенсионные программы)'
      );
    }

    // Общие рекомендации
    recommendations.push(
      'Диверсифицируйте портфель по различным классам активов'
    );
    recommendations.push('Регулярно пересматривайте стратегию инвестирования');
    recommendations.push(
      'Учитывайте комиссии и налоги при расчете реальной доходности'
    );

    return recommendations;
  };

  const clearForm = () => {
    setInitialInvestment('');
    setMonthlyContribution('');
    setAnnualReturn('');
    setInvestmentPeriod('10');
    setInflationRate('3');
    setTaxRate('13');
    setResult(null);
    setError('');
  };

  return (
    <div className={`${styles.calculator} investmentCalculator`}>
      <div className="calculatorHeader">
        <h2>📈 Калькулятор инвестиций</h2>
        <p>
          Рассчитайте будущую стоимость инвестиций с учетом сложного процента,
          инфляции и налогов.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateInvestment();
        }}
      >
        <div className="inputGroup">
          <label>Основные параметры</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="initialInvestment">
                Начальные инвестиции (₽)
              </label>
              <input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="Например: 100000"
                step="10000"
                min="0"
                max="10000000"
              />
            </div>
            <div>
              <label htmlFor="monthlyContribution">
                Ежемесячные взносы (₽)
              </label>
              <input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="Например: 10000"
                step="1000"
                min="0"
                max="1000000"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Условия инвестирования</label>
          <div className="inputRow">
            <div>
              <label htmlFor="annualReturn">Годовая доходность (%)</label>
              <input
                id="annualReturn"
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                placeholder="Например: 12.5"
                step="0.1"
                min="-50"
                max="100"
              />
            </div>
            <div>
              <label htmlFor="investmentPeriod">
                Период инвестирования (лет)
              </label>
              <select
                id="investmentPeriod"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
              >
                <option value="1">1 год</option>
                <option value="3">3 года</option>
                <option value="5">5 лет</option>
                <option value="10">10 лет</option>
                <option value="15">15 лет</option>
                <option value="20">20 лет</option>
                <option value="25">25 лет</option>
                <option value="30">30 лет</option>
              </select>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Дополнительные параметры</label>
          <div className="inputRow">
            <div>
              <label htmlFor="inflationRate">Инфляция (% в год)</label>
              <input
                id="inflationRate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="Например: 3.0"
                step="0.1"
                min="0"
                max="50"
              />
            </div>
            <div>
              <label htmlFor="taxRate">Налог на доходы (%)</label>
              <input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="Например: 13"
                step="1"
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать инвестиции
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className={styles.investmentSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Начальные инвестиции:</span>
              <span className={styles.value}>{result.initialInvestment} ₽</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ежемесячные взносы:</span>
              <span className={styles.value}>
                {result.monthlyContribution} ₽
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Годовая доходность:</span>
              <span className={styles.value}>{result.annualReturn}%</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Период инвестирования:</span>
              <span className={styles.value}>
                {result.investmentPeriod} лет
              </span>
            </div>
          </div>

          <div className={styles.resultValue}>
            <span className={styles.amount}>{result.totalInvestment}</span>
            <span className={styles.unit}>
              ₽ через {result.investmentPeriod} лет
            </span>
          </div>

          <div className={styles.investmentDetails}>
            <h4>Детали инвестиций:</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Общая сумма инвестиций:</span>
                <span className={styles.value}>
                  {result.totalContributions} ₽
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Общий доход:</span>
                <span className={styles.value}>{result.totalGains} ₽</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>
                  Реальная стоимость (с учетом инфляции):
                </span>
                <span className={styles.value}>{result.realValue} ₽</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>
                  Стоимость после уплаты налогов:
                </span>
                <span className={styles.value}>{result.afterTaxValue} ₽</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Сумма налогов:</span>
                <span className={styles.value}>{result.taxAmount} ₽</span>
              </div>
            </div>
          </div>

          <div className={styles.yearlyGrowth}>
            <h4>Годовой рост инвестиций:</h4>
            <div className={styles.growthTable}>
              <table>
                <thead>
                  <tr>
                    <th>Год</th>
                    <th>Стоимость (₽)</th>
                    <th>Взносы (₽)</th>
                    <th>Доход (₽)</th>
                    <th>Рост (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyGrowth.map((year: any) => (
                    <tr key={year.year}>
                      <td>{year.year}</td>
                      <td>{year.value}</td>
                      <td>{year.contributions}</td>
                      <td>{year.gains}</td>
                      <td>{year.growth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.riskAnalysis}>
            <h4>Анализ рисков:</h4>
            <div className={styles.riskGrid}>
              <div className={styles.riskItem}>
                <span className={styles.label}>Уровень риска:</span>
                <span className={styles.value}>
                  {result.riskAnalysis.riskLevel}
                </span>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.label}>Оценка риска:</span>
                <span className={styles.value}>
                  {result.riskAnalysis.riskScore}/100
                </span>
              </div>
            </div>
            <div className={styles.riskFactors}>
              <strong>Факторы риска:</strong>
              <ul>
                {result.riskAnalysis.factors.map(
                  (factor: string, index: number) => (
                    <li key={index}>{factor}</li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className={styles.recommendation}>
            <strong>Рекомендации:</strong>
            <ul className={styles.recommendationsList}>
              {result.recommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
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

export default InvestmentCalculator;
