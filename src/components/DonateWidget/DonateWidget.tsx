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

      {
        <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
          <div className={styles.dropdownHeader}>
            <h4>Поддержать проект</h4>
            <p>Выберите сумму для поддержки</p>
          </div>
          <div className={styles.amounts}>
            <iframe
              src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=1CCRR2I4FUB.250826&"
              width="258"
              height="36"
              frameBorder={0}
              allowTransparency={true}
              scrolling="no"
              style={{ border: 'none' }}
            />
            <iframe
              src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=1CCS04G7FE9.250826&"
              width="258"
              height="36"
              frameBorder={0}
              allowTransparency={true}
              scrolling="no"
              style={{ border: 'none' }}
            />
            <iframe
              src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=1CCS6VN4J6E.250826&"
              width="258"
              height="36"
              frameBorder={0}
              allowTransparency={true}
              scrolling="no"
              style={{ border: 'none' }}
            />
            <iframe
              src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=1CCS7DFORL8.250826&"
              width="258"
              height="36"
              frameBorder={0}
              allowTransparency={true}
              scrolling="no"
              style={{ border: 'none' }}
            />
            <button
              className={styles.customButton}
              onClick={() =>
                window.open('https://yoomoney.ru/to/4100119300590293', '_blank')
              }
            >
              Своя сумма
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default DonateWidget;
