import React, { useState } from 'react';
import styles from './DonateWidget.module.scss';

const DonateWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const donateOptions = [
    { amount: 100, label: '100₽' },
    { amount: 300, label: '300₽' },
    { amount: 500, label: '500₽' },
    { amount: 1000, label: '1000₽' },
  ];

  const handleDonate = (amount: number) => {
    // Здесь будет интеграция с платежной системой
    console.log(`Донат на сумму: ${amount}₽`);
    setIsOpen(false);
  };

  return (
    <div className={styles.donateWidget}>
      <button
        className={styles.donateButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.heart}>❤️</span>
        Поддержать
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h4>Поддержать проект</h4>
            <p>Выберите сумму для поддержки</p>
          </div>

          <div className={styles.amounts}>
            {donateOptions.map((option) => (
              <button
                key={option.amount}
                className={styles.amountButton}
                onClick={() => handleDonate(option.amount)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className={styles.customAmount}>
            <input
              type="number"
              placeholder="Другая сумма"
              className={styles.amountInput}
            />
            <button className={styles.customButton}>Отправить</button>
          </div>

          <div className={styles.paymentMethods}>
            <p>Способы оплаты:</p>
            <div className={styles.methods}>
              <span>💳</span>
              <span>💎</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateWidget;
