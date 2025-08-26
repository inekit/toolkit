import React, { useState } from 'react';
import styles from './LoanCalculator.module.scss';

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('12');
  const [interestRate, setInterestRate] = useState('');
  const [paymentType, setPaymentType] = useState('annuity');
  const [earlyRepayment, setEarlyRepayment] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateLoan = () => {
    setError('');

    if (!loanAmount || !interestRate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const amount = parseFloat(loanAmount);
    const term = parseInt(loanTerm);
    const rate = parseFloat(interestRate);
    const early = earlyRepayment ? parseFloat(earlyRepayment) : 0;

    if (isNaN(amount) || isNaN(rate)) {
      setError('Все значения должны быть числами');
      return;
    }

    if (amount <= 0 || rate <= 0 || term <= 0) {
      setError('Все значения должны быть положительными');
      return;
    }

    if (rate > 100) {
      setError('Процентная ставка слишком высокая');
      return;
    }

    if (early > amount) {
      setError('Сумма досрочного погашения не может быть больше суммы кредита');
      return;
    }

    const monthlyRate = rate / 100 / 12;
    const totalPayments = term;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;
    let paymentSchedule = [];

    if (paymentType === 'annuity') {
      // Аннуитетный платеж
      monthlyPayment =
        (amount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
      totalPayment = monthlyPayment * totalPayments;
      totalInterest = totalPayment - amount;

      // График платежей
      let remainingBalance = amount;
      for (let month = 1; month <= totalPayments; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;

        paymentSchedule.push({
          month,
          payment: monthlyPayment.toFixed(2),
          principal: principalPayment.toFixed(2),
          interest: interestPayment.toFixed(2),
          balance: remainingBalance.toFixed(2),
        });

        remainingBalance -= principalPayment;
      }
    } else {
      // Дифференцированный платеж
      const principalPayment = amount / totalPayments;
      let totalInterestSum = 0;

      for (let month = 1; month <= totalPayments; month++) {
        const remainingBalance = amount - principalPayment * (month - 1);
        const interestPayment = remainingBalance * monthlyRate;
        const totalMonthlyPayment = principalPayment + interestPayment;

        totalInterestSum += interestPayment;
        totalPayment += totalMonthlyPayment;

        paymentSchedule.push({
          month,
          payment: totalMonthlyPayment.toFixed(2),
          principal: principalPayment.toFixed(2),
          interest: interestPayment.toFixed(2),
          balance: remainingBalance.toFixed(2),
        });
      }

      totalInterest = totalInterestSum;
    }

    // Расчет с досрочным погашением
    let earlyRepaymentSavings = 0;
    let newTotalPayment = totalPayment;
    let newTotalInterest = totalInterest;

    if (early > 0) {
      const earlyRepaymentMonth = Math.ceil(term / 2); // Примерно в середине срока
      const remainingBalanceAfterEarly = amount - early;
      const remainingPayments = totalPayments - earlyRepaymentMonth;

      if (paymentType === 'annuity') {
        const newMonthlyPayment =
          (remainingBalanceAfterEarly *
            (monthlyRate * Math.pow(1 + monthlyRate, remainingPayments))) /
          (Math.pow(1 + monthlyRate, remainingPayments) - 1);
        newTotalPayment =
          monthlyPayment * earlyRepaymentMonth +
          early +
          newMonthlyPayment * remainingPayments;
        newTotalInterest = newTotalPayment - amount;
      } else {
        const newPrincipalPayment =
          remainingBalanceAfterEarly / remainingPayments;
        let newInterestSum = 0;

        for (
          let month = earlyRepaymentMonth + 1;
          month <= totalPayments;
          month++
        ) {
          const remainingBalance =
            remainingBalanceAfterEarly -
            newPrincipalPayment * (month - earlyRepaymentMonth - 1);
          const interestPayment = remainingBalance * monthlyRate;
          newInterestSum += interestPayment;
        }

        newTotalPayment =
          monthlyPayment * earlyRepaymentMonth +
          early +
          newPrincipalPayment * remainingPayments +
          newInterestSum;
        newTotalInterest = newTotalPayment - amount;
      }

      earlyRepaymentSavings = totalInterest - newTotalInterest;
    }

    // Анализ кредитной нагрузки
    const creditLoad = analyzeCreditLoad(monthlyPayment, amount, term);

    // Рекомендации
    const recommendations = getLoanRecommendations(
      amount,
      rate,
      term,
      paymentType,
      early
    );

    setResult({
      loanAmount: amount.toFixed(0),
      loanTerm: term,
      interestRate: rate.toFixed(2),
      paymentType: getPaymentTypeName(paymentType),
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      paymentSchedule,
      earlyRepayment: early.toFixed(0),
      earlyRepaymentSavings: earlyRepaymentSavings.toFixed(0),
      newTotalPayment: newTotalPayment.toFixed(0),
      newTotalInterest: newTotalInterest.toFixed(0),
      creditLoad,
      recommendations,
    });
  };

  const analyzeCreditLoad = (
    monthlyPayment: number,
    loanAmount: number,
    term: number
  ) => {
    // Рекомендуемый доход для кредита (40% от дохода на платежи)
    const recommendedIncome = (monthlyPayment * 12) / 0.4;

    // Соотношение платежа к доходу
    const paymentToIncomeRatio = (monthlyPayment * 12) / recommendedIncome;

    // Оценка кредитной нагрузки
    let loadLevel = '';
    if (paymentToIncomeRatio <= 0.3) loadLevel = 'Низкая';
    else if (paymentToIncomeRatio <= 0.4) loadLevel = 'Умеренная';
    else if (paymentToIncomeRatio <= 0.5) loadLevel = 'Высокая';
    else loadLevel = 'Критическая';

    return {
      recommendedIncome: recommendedIncome.toFixed(0),
      paymentToIncomeRatio: (paymentToIncomeRatio * 100).toFixed(1),
      loadLevel,
    };
  };

  const getLoanRecommendations = (
    amount: number,
    rate: number,
    term: number,
    paymentType: string,
    early: number
  ): string[] => {
    const recommendations = [];

    // Рекомендации по сумме кредита
    if (amount > 1000000) {
      recommendations.push(
        'Крупная сумма кредита - рассмотрите возможность увеличения срока для снижения платежей'
      );
    }

    // Рекомендации по процентной ставке
    if (rate > 20) {
      recommendations.push(
        'Высокая процентная ставка - рассмотрите рефинансирование в других банках'
      );
    } else if (rate < 10) {
      recommendations.push(
        'Низкая процентная ставка - отличные условия для кредита'
      );
    }

    // Рекомендации по сроку
    if (term > 60) {
      recommendations.push('Длинный срок кредита увеличит общую переплату');
    } else if (term < 6) {
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

    // Рекомендации по досрочному погашению
    if (early > 0) {
      recommendations.push('Досрочное погашение снизит общую переплату');
      recommendations.push(
        'Рассмотрите возможность увеличения досрочного погашения'
      );
    }

    // Общие рекомендации
    recommendations.push('Создайте резервный фонд на 2-3 месяца платежей');
    recommendations.push('Не берите дополнительные кредиты во время погашения');
    recommendations.push(
      'Рассмотрите возможность рефинансирования при снижении ставок'
    );

    return recommendations;
  };

  const clearForm = () => {
    setLoanAmount('');
    setLoanTerm('12');
    setInterestRate('');
    setPaymentType('annuity');
    setEarlyRepayment('');
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
    <div className={`${styles.calculator} loanCalculator`}>
      <div className="calculatorHeader">
        <h2>💳 Калькулятор кредитов</h2>
        <p>
          Рассчитайте ежемесячные платежи, общую стоимость и график погашения
          потребительского кредита.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateLoan();
        }}
      >
        <div className="inputGroup">
          <label>Основные параметры</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="loanAmount">Сумма кредита (₽)</label>
              <input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Например: 300000"
                step="10000"
                min="10000"
                max="10000000"
              />
            </div>
            <div>
              <label htmlFor="loanTerm">Срок кредита (месяцев)</label>
              <select
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              >
                <option value="6">6 месяцев</option>
                <option value="12">12 месяцев</option>
                <option value="18">18 месяцев</option>
                <option value="24">24 месяца</option>
                <option value="36">36 месяцев</option>
                <option value="48">48 месяцев</option>
                <option value="60">60 месяцев</option>
                <option value="84">84 месяца</option>
              </select>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Условия кредита</label>
          <div className="inputRow">
            <div>
              <label htmlFor="interestRate">
                Процентная ставка (% годовых)
              </label>
              <input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Например: 15.9"
                step="0.1"
                min="1"
                max="100"
              />
            </div>
            <div>
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
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="earlyRepayment">Досрочное погашение (₽)</label>
          <input
            id="earlyRepayment"
            type="number"
            value={earlyRepayment}
            onChange={(e) => setEarlyRepayment(e.target.value)}
            placeholder="Необязательно"
            step="10000"
            min="0"
            max="10000000"
          />
          <div className="help">
            Укажите сумму досрочного погашения для расчета экономии
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать кредит
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className={styles.loanSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Сумма кредита:</span>
              <span className={styles.value}>{result.loanAmount} ₽</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Срок кредита:</span>
              <span className={styles.value}>{result.loanTerm} месяцев</span>
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

          <div className={styles.loanDetails}>
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

          {result.earlyRepayment > 0 && (
            <div className={styles.earlyRepaymentAnalysis}>
              <h4>Анализ досрочного погашения:</h4>
              <div className={styles.earlyRepaymentGrid}>
                <div className={styles.earlyRepaymentItem}>
                  <span className={styles.label}>
                    Сумма досрочного погашения:
                  </span>
                  <span className={styles.value}>
                    {result.earlyRepayment} ₽
                  </span>
                </div>
                <div className={styles.earlyRepaymentItem}>
                  <span className={styles.label}>Экономия на процентах:</span>
                  <span className={styles.value}>
                    {result.earlyRepaymentSavings} ₽
                  </span>
                </div>
                <div className={styles.earlyRepaymentItem}>
                  <span className={styles.label}>Новая общая сумма:</span>
                  <span className={styles.value}>
                    {result.newTotalPayment} ₽
                  </span>
                </div>
                <div className={styles.earlyRepaymentItem}>
                  <span className={styles.label}>Новая переплата:</span>
                  <span className={styles.value}>
                    {result.newTotalInterest} ₽
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.creditLoadAnalysis}>
            <h4>Анализ кредитной нагрузки:</h4>
            <div className={styles.creditLoadGrid}>
              <div className={styles.creditLoadItem}>
                <span className={styles.label}>Рекомендуемый доход:</span>
                <span className={styles.value}>
                  {result.creditLoad.recommendedIncome} ₽/год
                </span>
              </div>
              <div className={styles.creditLoadItem}>
                <span className={styles.label}>Платеж к доходу:</span>
                <span className={styles.value}>
                  {result.creditLoad.paymentToIncomeRatio}%
                </span>
              </div>
              <div className={styles.creditLoadItem}>
                <span className={styles.label}>Уровень нагрузки:</span>
                <span className={styles.value}>
                  {result.creditLoad.loadLevel}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.paymentSchedule}>
            <h4>График платежей:</h4>
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
                  {result.paymentSchedule.slice(0, 12).map((payment: any) => (
                    <tr key={payment.month}>
                      <td>{payment.month}</td>
                      <td>{payment.payment}</td>
                      <td>{payment.principal}</td>
                      <td>{payment.interest}</td>
                      <td>{payment.balance}</td>
                    </tr>
                  ))}
                  {result.paymentSchedule.length > 12 && (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: 'center', fontStyle: 'italic' }}
                      >
                        ... и еще {result.paymentSchedule.length - 12} месяцев
                      </td>
                    </tr>
                  )}
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

export default LoanCalculator;
