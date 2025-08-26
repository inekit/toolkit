import React, { useState } from 'react';
import styles from './MortgageCalculator.module.scss';

const MortgageCalculator: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('20');
  const [interestRate, setInterestRate] = useState('');
  const [paymentType, setPaymentType] = useState('annuity');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateMortgage = () => {
    setError('');

    if (!propertyPrice || !downPayment || !interestRate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const price = parseFloat(propertyPrice);
    const down = parseFloat(downPayment);
    const term = parseInt(loanTerm);
    const rate = parseFloat(interestRate);

    if (isNaN(price) || isNaN(down) || isNaN(rate)) {
      setError('Все значения должны быть числами');
      return;
    }

    if (price <= 0 || down < 0 || rate <= 0 || term <= 0) {
      setError('Все значения должны быть положительными');
      return;
    }

    if (down >= price) {
      setError(
        'Первоначальный взнос не может быть больше или равен стоимости недвижимости'
      );
      return;
    }

    if (rate > 30) {
      setError('Процентная ставка слишком высокая');
      return;
    }

    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const totalPayments = term * 12;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (paymentType === 'annuity') {
      // Аннуитетный платеж
      monthlyPayment =
        (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
      totalPayment = monthlyPayment * totalPayments;
      totalInterest = totalPayment - loanAmount;
    } else {
      // Дифференцированный платеж
      const principalPayment = loanAmount / totalPayments;
      let totalInterestSum = 0;

      for (let i = 1; i <= totalPayments; i++) {
        const interestPayment =
          (loanAmount - principalPayment * (i - 1)) * monthlyRate;
        totalInterestSum += interestPayment;
      }

      monthlyPayment = principalPayment + loanAmount * monthlyRate;
      totalPayment = loanAmount + totalInterestSum;
      totalInterest = totalInterestSum;
    }

    // График платежей (первые 12 месяцев)
    const paymentSchedule = [];
    if (paymentType === 'annuity') {
      for (let month = 1; month <= 12; month++) {
        const remainingBalance =
          (loanAmount *
            (Math.pow(1 + monthlyRate, totalPayments) -
              Math.pow(1 + monthlyRate, month))) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1);
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;

        paymentSchedule.push({
          month,
          payment: monthlyPayment.toFixed(2),
          principal: principalPayment.toFixed(2),
          interest: interestPayment.toFixed(2),
          balance: remainingBalance.toFixed(2),
        });
      }
    } else {
      for (let month = 1; month <= 12; month++) {
        const remainingBalance =
          loanAmount - (loanAmount / totalPayments) * month;
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = loanAmount / totalPayments;
        const totalMonthlyPayment = principalPayment + interestPayment;

        paymentSchedule.push({
          month,
          payment: totalMonthlyPayment.toFixed(2),
          principal: principalPayment.toFixed(2),
          interest: interestPayment.toFixed(2),
          balance: remainingBalance.toFixed(2),
        });
      }
    }

    // Анализ платежеспособности
    const affordability = analyzeAffordability(monthlyPayment, price, down);

    setResult({
      propertyPrice: price.toFixed(0),
      downPayment: down.toFixed(0),
      loanAmount: loanAmount.toFixed(0),
      loanTerm: term,
      interestRate: rate.toFixed(2),
      paymentType: getPaymentTypeName(paymentType),
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      paymentSchedule,
      affordability,
      recommendations: getMortgageRecommendations(
        price,
        down,
        rate,
        term,
        paymentType
      ),
    });
  };

  const analyzeAffordability = (
    monthlyPayment: number,
    propertyPrice: number,
    downPayment: number
  ) => {
    // Рекомендуемый доход для ипотеки (30% от дохода на платежи)
    const recommendedIncome = (monthlyPayment * 12) / 0.3;

    // Соотношение платежа к доходу
    const paymentToIncomeRatio = (monthlyPayment * 12) / recommendedIncome;

    // Оценка доступности
    let affordability = '';
    if (paymentToIncomeRatio <= 0.25) affordability = 'Отличная';
    else if (paymentToIncomeRatio <= 0.3) affordability = 'Хорошая';
    else if (paymentToIncomeRatio <= 0.35) affordability = 'Удовлетворительная';
    else affordability = 'Плохая';

    return {
      recommendedIncome: recommendedIncome.toFixed(0),
      paymentToIncomeRatio: (paymentToIncomeRatio * 100).toFixed(1),
      affordability,
    };
  };

  const getMortgageRecommendations = (
    price: number,
    down: number,
    rate: number,
    term: number,
    paymentType: string
  ): string[] => {
    const recommendations = [];

    // Рекомендации по первоначальному взносу
    const downPaymentRatio = (down / price) * 100;
    if (downPaymentRatio < 20) {
      recommendations.push(
        'Первоначальный взнос менее 20% - потребуется страховка ипотеки'
      );
    } else if (downPaymentRatio >= 30) {
      recommendations.push(
        'Отличный первоначальный взнос - это снизит процентную ставку'
      );
    }

    // Рекомендации по процентной ставке
    if (rate > 15) {
      recommendations.push(
        'Высокая процентная ставка - рассмотрите рефинансирование в будущем'
      );
    } else if (rate < 8) {
      recommendations.push(
        'Низкая процентная ставка - отличные условия для ипотеки'
      );
    }

    // Рекомендации по сроку кредита
    if (term > 25) {
      recommendations.push('Длинный срок кредита увеличит общую переплату');
    } else if (term < 15) {
      recommendations.push(
        'Короткий срок кредита снизит переплату, но увеличит ежемесячный платеж'
      );
    }

    // Рекомендации по типу платежа
    if (paymentType === 'annuity') {
      recommendations.push(
        'Аннуитетный платеж - стабильные ежемесячные выплаты'
      );
    } else {
      recommendations.push(
        'Дифференцированный платеж - снижение платежей со временем'
      );
    }

    // Общие рекомендации
    recommendations.push(
      'Учитывайте дополнительные расходы: страховка, налоги, коммунальные услуги'
    );
    recommendations.push('Создайте резервный фонд на 3-6 месяцев платежей');
    recommendations.push(
      'Рассмотрите возможность досрочного погашения для снижения переплаты'
    );

    return recommendations;
  };

  const clearForm = () => {
    setPropertyPrice('');
    setDownPayment('');
    setLoanTerm('20');
    setInterestRate('');
    setPaymentType('annuity');
    setResult(null);
    setError('');
  };

  const getPaymentTypeName = (type: string): string => {
    switch (type) {
      case 'annuity':
        return 'Аннуитетный';
      case 'differential':
        return 'Дифференцированный';
      default:
        return 'Аннуитетный';
    }
  };

  return (
    <div className={`${styles.calculator} mortgageCalculator`}>
      <div className="calculatorHeader">
        <h2>🏠 Калькулятор ипотеки</h2>
        <p>
          Рассчитайте ежемесячные платежи, общую стоимость и график погашения
          ипотечного кредита.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateMortgage();
        }}
      >
        <div className="inputGroup">
          <label>Основные параметры</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="propertyPrice">Стоимость недвижимости (₽)</label>
              <input
                id="propertyPrice"
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder="Например: 5000000"
                step="100000"
                min="100000"
                max="100000000"
              />
            </div>
            <div>
              <label htmlFor="downPayment">Первоначальный взнос (₽)</label>
              <input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="Например: 1000000"
                step="100000"
                min="0"
                max="50000000"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Условия кредита</label>
          <div className="inputRow">
            <div>
              <label htmlFor="loanTerm">Срок кредита (лет)</label>
              <select
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              >
                <option value="5">5 лет</option>
                <option value="10">10 лет</option>
                <option value="15">15 лет</option>
                <option value="20">20 лет</option>
                <option value="25">25 лет</option>
                <option value="30">30 лет</option>
              </select>
            </div>
            <div>
              <label htmlFor="interestRate">
                Процентная ставка (% годовых)
              </label>
              <input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Например: 12.5"
                step="0.1"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="paymentType">Тип платежа</label>
          <select
            id="paymentType"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="annuity">Аннуитетный (равные платежи)</option>
            <option value="differential">
              Дифференцированный (уменьшающиеся платежи)
            </option>
          </select>
          <div className="help">
            {paymentType === 'annuity'
              ? 'Аннуитетный - равные ежемесячные платежи'
              : 'Дифференцированный - платежи уменьшаются со временем'}
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать ипотеку
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className={styles.mortgageSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Стоимость недвижимости:</span>
              <span className={styles.value}>{result.propertyPrice} ₽</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Первоначальный взнос:</span>
              <span className={styles.value}>{result.downPayment} ₽</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Сумма кредита:</span>
              <span className={styles.value}>{result.loanAmount} ₽</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Срок кредита:</span>
              <span className={styles.value}>{result.loanTerm} лет</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Процентная ставка:</span>
              <span className={styles.value}>{result.interestRate}%</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Тип платежа:</span>
              <span className={styles.value}>{result.paymentType}</span>
            </div>
          </div>

          <div className={styles.resultValue}>
            <span className={styles.amount}>{result.monthlyPayment}</span>
            <span className={styles.unit}>₽ в месяц</span>
          </div>

          <div className={styles.paymentDetails}>
            <h4>Детали кредита:</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Ежемесячный платеж:</span>
                <span className={styles.value}>{result.monthlyPayment} ₽</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Общая сумма к возврату:</span>
                <span className={styles.value}>{result.totalPayment} ₽</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Общая переплата:</span>
                <span className={styles.value}>{result.totalInterest} ₽</span>
              </div>
            </div>
          </div>

          <div className={styles.affordabilityAnalysis}>
            <h4>Анализ платежеспособности:</h4>
            <div className={styles.affordabilityGrid}>
              <div className={styles.affordabilityItem}>
                <span className={styles.label}>Рекомендуемый доход:</span>
                <span className={styles.value}>
                  {result.affordability.recommendedIncome} ₽/год
                </span>
              </div>
              <div className={styles.affordabilityItem}>
                <span className={styles.label}>Платеж к доходу:</span>
                <span className={styles.value}>
                  {result.affordability.paymentToIncomeRatio}%
                </span>
              </div>
              <div className={styles.affordabilityItem}>
                <span className={styles.label}>Оценка доступности:</span>
                <span className={styles.value}>
                  {result.affordability.affordability}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.paymentSchedule}>
            <h4>График платежей (первые 12 месяцев):</h4>
            <div className={styles.scheduleTable}>
              <table>
                <thead>
                  <tr>
                    <th>Месяц</th>
                    <th>Платеж (₽)</th>
                    <th>Основной долг (₽)</th>
                    <th>Проценты (₽)</th>
                    <th>Остаток (₽)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.paymentSchedule.map((payment: any) => (
                    <tr key={payment.month}>
                      <td>{payment.month}</td>
                      <td>{payment.payment}</td>
                      <td>{payment.principal}</td>
                      <td>{payment.interest}</td>
                      <td>{payment.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default MortgageCalculator;
