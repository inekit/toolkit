import React, { useState } from 'react';
import styles from './RepairCostCalculator.module.scss';

const RepairCostCalculator: React.FC = () => {
  const [repairType, setRepairType] = useState('cosmetic');
  const [roomArea, setRoomArea] = useState('');
  const [roomType, setRoomType] = useState('bedroom');
  const [materials, setMaterials] = useState('standard');
  const [urgency, setUrgency] = useState('normal');
  const [region, setRegion] = useState('moscow');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateCost = () => {
    setError('');

    if (!roomArea) {
      setError('Пожалуйста, введите площадь помещения');
      return;
    }

    const area = parseFloat(roomArea);
    if (isNaN(area) || area <= 0 || area > 1000) {
      setError('Площадь должна быть положительным числом не более 1000 м²');
      return;
    }

    // Базовые цены за м² (в рублях)
    const basePrices = getBasePrices(repairType);
    const roomMultiplier = getRoomMultiplier(roomType);
    const materialsMultiplier = getMaterialsMultiplier(materials);
    const urgencyMultiplier = getUrgencyMultiplier(urgency);
    const regionMultiplier = getRegionMultiplier(region);

    // Расчет стоимости
    const baseCost = area * basePrices.work;
    const materialsCost = area * basePrices.materials * materialsMultiplier;
    const totalCost =
      (baseCost + materialsCost) *
      roomMultiplier *
      urgencyMultiplier *
      regionMultiplier;

    // Разбивка по работам
    const workBreakdown = calculateWorkBreakdown(
      area,
      basePrices,
      roomMultiplier,
      urgencyMultiplier,
      regionMultiplier
    );

    setResult({
      area: area.toFixed(1),
      repairType: getRepairTypeName(repairType),
      roomType: getRoomTypeName(roomType),
      baseCost: baseCost.toFixed(0),
      materialsCost: materialsCost.toFixed(0),
      totalCost: totalCost.toFixed(0),
      workBreakdown,
      duration: calculateDuration(area, repairType),
      recommendations: getRecommendations(repairType, materials, urgency),
    });
  };

  const getBasePrices = (type: string) => {
    switch (type) {
      case 'cosmetic':
        return { work: 2500, materials: 1500 };
      case 'standard':
        return { work: 4500, materials: 3000 };
      case 'premium':
        return { work: 8000, materials: 6000 };
      case 'luxury':
        return { work: 15000, materials: 12000 };
      case 'renovation':
        return { work: 12000, materials: 8000 };
      default:
        return { work: 4500, materials: 3000 };
    }
  };

  const getRoomMultiplier = (type: string): number => {
    switch (type) {
      case 'bathroom':
        return 1.3; // Ванная - сложнее
      case 'kitchen':
        return 1.2; // Кухня - сложнее
      case 'bedroom':
        return 1.0; // Спальня - стандарт
      case 'living':
        return 1.1; // Гостиная - немного сложнее
      case 'corridor':
        return 0.8; // Коридор - проще
      case 'balcony':
        return 0.7; // Балкон - проще
      default:
        return 1.0;
    }
  };

  const getMaterialsMultiplier = (type: string): number => {
    switch (type) {
      case 'economy':
        return 0.7;
      case 'standard':
        return 1.0;
      case 'premium':
        return 1.5;
      case 'luxury':
        return 2.5;
      default:
        return 1.0;
    }
  };

  const getUrgencyMultiplier = (type: string): number => {
    switch (type) {
      case 'slow':
        return 0.9;
      case 'normal':
        return 1.0;
      case 'fast':
        return 1.3;
      case 'urgent':
        return 1.8;
      default:
        return 1.0;
    }
  };

  const getRegionMultiplier = (type: string): number => {
    switch (type) {
      case 'moscow':
        return 1.5;
      case 'spb':
        return 1.4;
      case 'million':
        return 1.2;
      case 'regional':
        return 1.0;
      case 'rural':
        return 0.8;
      default:
        return 1.0;
    }
  };

  const calculateWorkBreakdown = (
    area: number,
    basePrices: any,
    roomMultiplier: number,
    urgencyMultiplier: number,
    regionMultiplier: number
  ) => {
    const multiplier = roomMultiplier * urgencyMultiplier * regionMultiplier;

    return {
      demolition: (area * 800 * multiplier).toFixed(0),
      roughWork: (area * basePrices.work * 0.4 * multiplier).toFixed(0),
      finishing: (area * basePrices.work * 0.6 * multiplier).toFixed(0),
      electrical: (area * 1200 * multiplier).toFixed(0),
      plumbing: (area * 1500 * multiplier).toFixed(0),
      painting: (area * 1000 * multiplier).toFixed(0),
      flooring: (area * 2000 * multiplier).toFixed(0),
    };
  };

  const calculateDuration = (area: number, repairType: string): string => {
    let baseDays = area * 0.5; // Базовое время

    switch (repairType) {
      case 'cosmetic':
        baseDays *= 0.5;
        break;
      case 'standard':
        baseDays *= 1.0;
        break;
      case 'premium':
        baseDays *= 1.5;
        break;
      case 'luxury':
        baseDays *= 2.5;
        break;
      case 'renovation':
        baseDays *= 2.0;
        break;
    }

    const days = Math.ceil(baseDays);
    if (days < 7) return `${days} дней`;
    if (days < 30) return `${Math.ceil(days / 7)} недель`;
    return `${Math.ceil(days / 30)} месяцев`;
  };

  const getRecommendations = (
    repairType: string,
    materials: string,
    urgency: string
  ): string[] => {
    const recommendations = [];

    if (repairType === 'cosmetic') {
      recommendations.push(
        'Косметический ремонт подходит для обновления интерьера без капитальных изменений'
      );
    } else if (repairType === 'renovation') {
      recommendations.push(
        'Капитальный ремонт требует тщательного планирования и может занять несколько месяцев'
      );
    }

    if (materials === 'economy') {
      recommendations.push(
        'Экономные материалы могут потребовать замены через 3-5 лет'
      );
    } else if (materials === 'premium') {
      recommendations.push(
        'Премиум материалы обеспечат долговечность и высокое качество'
      );
    }

    if (urgency === 'urgent') {
      recommendations.push(
        'Срочный ремонт может стоить дороже из-за необходимости работы в выходные'
      );
    }

    recommendations.push(
      'Получите несколько предложений от разных подрядчиков для сравнения цен'
    );
    recommendations.push('Учитывайте сезонность - летом цены могут быть выше');

    return recommendations;
  };

  const clearForm = () => {
    setRepairType('cosmetic');
    setRoomArea('');
    setRoomType('bedroom');
    setMaterials('standard');
    setUrgency('normal');
    setRegion('moscow');
    setResult(null);
    setError('');
  };

  const getRepairTypeName = (type: string): string => {
    switch (type) {
      case 'cosmetic':
        return 'Косметический';
      case 'standard':
        return 'Стандартный';
      case 'premium':
        return 'Премиум';
      case 'luxury':
        return 'Люкс';
      case 'renovation':
        return 'Капитальный';
      default:
        return 'Стандартный';
    }
  };

  const getRoomTypeName = (type: string): string => {
    switch (type) {
      case 'bathroom':
        return 'Ванная комната';
      case 'kitchen':
        return 'Кухня';
      case 'bedroom':
        return 'Спальня';
      case 'living':
        return 'Гостиная';
      case 'corridor':
        return 'Коридор';
      case 'balcony':
        return 'Балкон/Лоджия';
      default:
        return 'Спальня';
    }
  };

  const getMaterialsName = (type: string): string => {
    switch (type) {
      case 'economy':
        return 'Экономные';
      case 'standard':
        return 'Стандартные';
      case 'premium':
        return 'Премиум';
      case 'luxury':
        return 'Люкс';
      default:
        return 'Стандартные';
    }
  };

  const getUrgencyName = (type: string): string => {
    switch (type) {
      case 'slow':
        return 'Не спеша (скидка 10%)';
      case 'normal':
        return 'Обычные сроки';
      case 'fast':
        return 'Быстро (+30%)';
      case 'urgent':
        return 'Срочно (+80%)';
      default:
        return 'Обычные сроки';
    }
  };

  const getRegionName = (type: string): string => {
    switch (type) {
      case 'moscow':
        return 'Москва (+50%)';
      case 'spb':
        return 'Санкт-Петербург (+40%)';
      case 'million':
        return 'Город-миллионник (+20%)';
      case 'regional':
        return 'Региональный центр';
      case 'rural':
        return 'Сельская местность (-20%)';
      default:
        return 'Региональный центр';
    }
  };

  return (
    <div className={`${styles.calculator} repairCostCalculator`}>
      <div className="calculatorHeader">
        <h2>💰 Калькулятор стоимости ремонта</h2>
        <p>
          Рассчитайте примерную стоимость ремонта помещения. Учитываются тип
          ремонта, материалы, срочность и регион.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateCost();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="roomArea">Площадь помещения (м²)</label>
          <input
            id="roomArea"
            type="number"
            value={roomArea}
            onChange={(e) => setRoomArea(e.target.value)}
            placeholder="Например: 25.5"
            step="0.1"
            min="1"
            max="1000"
          />
          <div className="help">
            Введите общую площадь помещения в квадратных метрах
          </div>
        </div>

        <div className="inputGroup">
          <label>Тип ремонта и помещения</label>
          <div className="inputRow">
            <div>
              <label htmlFor="repairType">Тип ремонта</label>
              <select
                id="repairType"
                value={repairType}
                onChange={(e) => setRepairType(e.target.value)}
              >
                <option value="cosmetic">Косметический</option>
                <option value="standard">Стандартный</option>
                <option value="premium">Премиум</option>
                <option value="luxury">Люкс</option>
                <option value="renovation">Капитальный</option>
              </select>
              <div className="help">
                {getRepairTypeName(repairType)} - выберите уровень ремонта
              </div>
            </div>
            <div>
              <label htmlFor="roomType">Тип помещения</label>
              <select
                id="roomType"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="bedroom">🛏️ Спальня</option>
                <option value="living">🛋️ Гостиная</option>
                <option value="kitchen">🍳 Кухня</option>
                <option value="bathroom">🚿 Ванная</option>
                <option value="corridor">🚪 Коридор</option>
                <option value="balcony">🏠 Балкон</option>
              </select>
              <div className="help">
                {getRoomTypeName(roomType)} - влияет на сложность работ
              </div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Качество и сроки</label>
          <div className="inputRow">
            <div>
              <label htmlFor="materials">Качество материалов</label>
              <select
                id="materials"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
              >
                <option value="economy">Экономные</option>
                <option value="standard">Стандартные</option>
                <option value="premium">Премиум</option>
                <option value="luxury">Люкс</option>
              </select>
              <div className="help">
                {getMaterialsName(materials)} - влияет на долговечность
              </div>
            </div>
            <div>
              <label htmlFor="urgency">Срочность</label>
              <select
                id="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="slow">Не спеша</option>
                <option value="normal">Обычные сроки</option>
                <option value="fast">Быстро</option>
                <option value="urgent">Срочно</option>
              </select>
              <div className="help">
                {getUrgencyName(urgency)} - влияет на стоимость
              </div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="region">Регион</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="moscow">Москва</option>
            <option value="spb">Санкт-Петербург</option>
            <option value="million">Город-миллионник</option>
            <option value="regional">Региональный центр</option>
            <option value="rural">Сельская местность</option>
          </select>
          <div className="help">
            {getRegionName(region)} - влияет на стоимость работ и материалов
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать стоимость
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className={styles.costSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Площадь помещения:</span>
              <span className={styles.value}>{result.area} м²</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Тип ремонта:</span>
              <span className={styles.value}>{result.repairType}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Тип помещения:</span>
              <span className={styles.value}>{result.roomType}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Примерная длительность:</span>
              <span className={styles.value}>{result.duration}</span>
            </div>
          </div>

          <div className={styles.resultValue}>
            <span className={styles.amount}>{result.totalCost}</span>
            <span className={styles.unit}>рублей</span>
          </div>

          <div className={styles.costBreakdown}>
            <h4>Детализация затрат:</h4>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Работы:</span>
                <span className={styles.value}>{result.baseCost} ₽</span>
              </div>
              <div className={styles.breakdownItem}>
                <span className="label">Материалы:</span>
                <span className="value">{result.materialsCost} ₽</span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Демонтаж:</span>
                <span className={styles.value}>
                  {result.workBreakdown.demolition} ₽
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Черновые работы:</span>
                <span className={styles.value}>
                  {result.workBreakdown.roughWork} ₽
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Отделка:</span>
                <span className={styles.value}>
                  {result.workBreakdown.finishing} ₽
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Электрика:</span>
                <span className={styles.value}>
                  {result.workBreakdown.electrical} ₽
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Сантехника:</span>
                <span className={styles.value}>
                  {result.workBreakdown.plumbing} ₽
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Покраска:</span>
                <span className={styles.value}>
                  {result.workBreakdown.painting} ₽
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Полы:</span>
                <span className={styles.value}>
                  {result.workBreakdown.flooring} ₽
                </span>
              </div>
            </div>
          </div>

          <div className={styles.recommendation}>
            <strong>Рекомендации:</strong>
            <ul className={styles.recommendationsList}>
              {result.recommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <strong>Примечание:</strong> Это предварительная оценка.
              Фактическая стоимость может отличаться в зависимости от конкретных
              условий, сложности работ и выбранного подрядчика.
            </p>
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

export default RepairCostCalculator;
