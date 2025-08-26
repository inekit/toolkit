import React, { useState } from 'react';
import styles from './FoundationCalculator.module.scss';

const FoundationCalculator: React.FC = () => {
  const [foundationType, setFoundationType] = useState('strip');
  const [buildingType, setBuildingType] = useState('house');
  const [soilType, setSoilType] = useState('clay');
  const [buildingArea, setBuildingArea] = useState('');
  const [buildingHeight, setBuildingHeight] = useState('');
  const [basement, setBasement] = useState('no');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateFoundation = () => {
    setError('');

    if (!buildingArea || !buildingHeight) {
      setError('Пожалуйста, заполните все размеры здания');
      return;
    }

    const area = parseFloat(buildingArea);
    const height = parseFloat(buildingHeight);

    if (isNaN(area) || isNaN(height) || area <= 0 || height <= 0) {
      setError('Размеры должны быть положительными числами');
      return;
    }

    if (area > 10000 || height > 100) {
      setError('Размеры слишком большие для данного калькулятора');
      return;
    }

    // Расчет нагрузок
    const buildingLoad = calculateBuildingLoad(area, height, buildingType);
    const soilBearing = getSoilBearing(soilType);
    const foundationDepth = calculateFoundationDepth(
      buildingType,
      soilType,
      basement === 'yes'
    );

    // Расчет размеров фундамента
    const foundationDimensions = calculateFoundationDimensions(
      foundationType,
      buildingLoad,
      soilBearing,
      area,
      foundationDepth
    );

    // Расчет материалов
    const materials = calculateMaterials(
      foundationType,
      foundationDimensions,
      foundationDepth
    );

    // Расчет стоимости
    const cost = calculateCost(materials, foundationType);

    setResult({
      buildingLoad: buildingLoad.toFixed(0),
      soilBearing: soilBearing.toFixed(0),
      foundationDepth: foundationDepth.toFixed(2),
      foundationDimensions,
      materials,
      cost: cost.toFixed(0),
      recommendations: getRecommendations(
        foundationType,
        soilType,
        buildingType
      ),
    });
  };

  const calculateBuildingLoad = (
    area: number,
    height: number,
    type: string
  ): number => {
    // Нагрузка в кг/м²
    let loadPerM2 = 0;

    switch (type) {
      case 'house':
        loadPerM2 = 1500;
        break;
      case 'cottage':
        loadPerM2 = 1200;
        break;
      case 'garage':
        loadPerM2 = 800;
        break;
      case 'shed':
        loadPerM2 = 600;
        break;
      case 'commercial':
        loadPerM2 = 2000;
        break;
      default:
        loadPerM2 = 1500;
    }

    // Учитываем высоту здания
    const heightMultiplier = 1 + (height - 3) * 0.1;
    return area * loadPerM2 * heightMultiplier;
  };

  const getSoilBearing = (type: string): number => {
    // Несущая способность грунта в кг/м²
    switch (type) {
      case 'rock':
        return 100000;
      case 'gravel':
        return 60000;
      case 'sand':
        return 40000;
      case 'clay':
        return 25000;
      case 'peat':
        return 10000;
      case 'waterlogged':
        return 5000;
      default:
        return 25000;
    }
  };

  const calculateFoundationDepth = (
    buildingType: string,
    soilType: string,
    hasBasement: boolean
  ): number => {
    let baseDepth = 1.5; // Минимальная глубина в метрах

    // Влияние типа здания
    switch (buildingType) {
      case 'house':
        baseDepth = 1.8;
        break;
      case 'cottage':
        baseDepth = 1.5;
        break;
      case 'garage':
        baseDepth = 1.2;
        break;
      case 'shed':
        baseDepth = 1.0;
        break;
      case 'commercial':
        baseDepth = 2.0;
        break;
    }

    // Влияние типа грунта
    switch (soilType) {
      case 'rock':
        baseDepth *= 0.8;
        break;
      case 'gravel':
        baseDepth *= 0.9;
        break;
      case 'sand':
        baseDepth *= 1.0;
        break;
      case 'clay':
        baseDepth *= 1.2;
        break;
      case 'peat':
        baseDepth *= 1.5;
        break;
      case 'waterlogged':
        baseDepth *= 2.0;
        break;
    }

    // Влияние подвала
    if (hasBasement) {
      baseDepth += 1.5;
    }

    // Учитываем промерзание грунта
    baseDepth = Math.max(baseDepth, 1.2);

    return baseDepth;
  };

  const calculateFoundationDimensions = (
    type: string,
    load: number,
    bearing: number,
    area: number,
    depth: number
  ) => {
    const requiredArea = load / bearing;

    switch (type) {
      case 'strip':
        const perimeter = Math.sqrt(area) * 4;
        const stripWidth = Math.max(requiredArea / perimeter, 0.3);
        return {
          type: 'Ленточный',
          width: stripWidth.toFixed(2),
          depth: depth.toFixed(2),
          length: perimeter.toFixed(1),
        };

      case 'slab':
        const slabThickness = Math.max((requiredArea / area) * 0.1, 0.2);
        return {
          type: 'Плитный',
          thickness: slabThickness.toFixed(2),
          area: area.toFixed(1),
        };

      case 'pile':
        const pileCount = Math.ceil(load / 50000); // 50 тонн на сваю
        const pileLength = Math.max(depth + 2, 6);
        return {
          type: 'Свайный',
          count: pileCount,
          length: pileLength.toFixed(1),
          diameter: '0.3',
        };

      case 'column':
        const columnCount = Math.ceil(area / 25); // Одна колонна на 25 м²
        const columnArea = requiredArea / columnCount;
        const columnSize = Math.sqrt(columnArea);
        return {
          type: 'Столбчатый',
          count: columnCount,
          size: columnSize.toFixed(2),
          depth: depth.toFixed(2),
        };

      default:
        return {
          type: 'Неизвестный',
          error: 'Тип фундамента не поддерживается',
        };
    }
  };

  const calculateMaterials = (type: string, dimensions: any, depth: number) => {
    const materials: any = {};

    switch (type) {
      case 'strip':
        const stripVolume =
          parseFloat(dimensions.width) *
          parseFloat(dimensions.depth) *
          parseFloat(dimensions.length);
        materials.concrete = (stripVolume * 1.1).toFixed(1); // +10% на запас
        materials.reinforcement = (stripVolume * 0.08).toFixed(1); // 8% от объема
        materials.formwork = (
          parseFloat(dimensions.length) *
          parseFloat(dimensions.depth) *
          2
        ).toFixed(1);
        break;

      case 'slab':
        const slabVolume =
          parseFloat(dimensions.area) * parseFloat(dimensions.thickness);
        materials.concrete = (slabVolume * 1.15).toFixed(1); // +15% на запас
        materials.reinforcement = (slabVolume * 0.12).toFixed(1); // 12% от объема
        materials.insulation = parseFloat(dimensions.area).toFixed(1);
        break;

      case 'pile':
        const pileVolume =
          Math.PI *
          Math.pow(0.15, 2) *
          parseFloat(dimensions.length) *
          dimensions.count;
        materials.concrete = (pileVolume * 1.2).toFixed(1); // +20% на запас
        materials.reinforcement = (pileVolume * 0.1).toFixed(1); // 10% от объема
        materials.piles = dimensions.count;
        break;

      case 'column':
        const columnVolume =
          Math.pow(parseFloat(dimensions.size), 2) *
          parseFloat(dimensions.depth) *
          dimensions.count;
        materials.concrete = (columnVolume * 1.1).toFixed(1); // +10% на запас
        materials.reinforcement = (columnVolume * 0.08).toFixed(1); // 8% от объема
        materials.formwork = (
          dimensions.count *
          parseFloat(dimensions.depth) *
          4 *
          parseFloat(dimensions.size)
        ).toFixed(1);
        break;
    }

    return materials;
  };

  const calculateCost = (materials: any, type: string): number => {
    let totalCost = 0;

    // Цены за единицу (в рублях)
    if (materials.concrete) {
      totalCost += parseFloat(materials.concrete) * 5000; // 5000 руб/м³ бетона
    }
    if (materials.reinforcement) {
      totalCost += parseFloat(materials.reinforcement) * 80000; // 80000 руб/т арматуры
    }
    if (materials.formwork) {
      totalCost += parseFloat(materials.formwork) * 300; // 300 руб/м² опалубки
    }
    if (materials.insulation) {
      totalCost += parseFloat(materials.insulation) * 800; // 800 руб/м² утеплителя
    }
    if (materials.piles) {
      totalCost += materials.piles * 15000; // 15000 руб за сваю
    }

    // Добавляем стоимость работ
    const workMultiplier = 0.6; // 60% от стоимости материалов
    totalCost += totalCost * workMultiplier;

    return totalCost;
  };

  const getRecommendations = (
    foundationType: string,
    soilType: string,
    buildingType: string
  ): string[] => {
    const recommendations = [];

    // Рекомендации по типу фундамента
    if (foundationType === 'strip') {
      recommendations.push(
        'Ленточный фундамент подходит для большинства частных домов'
      );
    } else if (foundationType === 'slab') {
      recommendations.push(
        'Плитный фундамент идеален для слабых грунтов и небольших зданий'
      );
    } else if (foundationType === 'pile') {
      recommendations.push(
        'Свайный фундамент используется на слабых и водонасыщенных грунтах'
      );
    } else if (foundationType === 'column') {
      recommendations.push(
        'Столбчатый фундамент экономичен для легких построек'
      );
    }

    // Рекомендации по грунту
    if (soilType === 'peat' || soilType === 'waterlogged') {
      recommendations.push(
        'На слабых грунтах обязательно проведите геологические изыскания'
      );
    } else if (soilType === 'rock') {
      recommendations.push(
        'На скальных грунтах можно использовать мелкозаглубленный фундамент'
      );
    }

    // Общие рекомендации
    recommendations.push(
      'Проведите геологические изыскания перед проектированием'
    );
    recommendations.push(
      'Учитывайте уровень грунтовых вод при выборе глубины заложения'
    );
    recommendations.push('Обеспечьте гидроизоляцию фундамента');
    recommendations.push('Устройте дренажную систему при необходимости');

    return recommendations;
  };

  const clearForm = () => {
    setFoundationType('strip');
    setBuildingType('house');
    setSoilType('clay');
    setBuildingArea('');
    setBuildingHeight('');
    setBasement('no');
    setResult(null);
    setError('');
  };

  const getFoundationTypeName = (type: string): string => {
    switch (type) {
      case 'strip':
        return 'Ленточный';
      case 'slab':
        return 'Плитный';
      case 'pile':
        return 'Свайный';
      case 'column':
        return 'Столбчатый';
      default:
        return 'Ленточный';
    }
  };

  const getBuildingTypeName = (type: string): string => {
    switch (type) {
      case 'house':
        return 'Жилой дом';
      case 'cottage':
        return 'Дача/Коттедж';
      case 'garage':
        return 'Гараж';
      case 'shed':
        return 'Сарай/Хозпостройка';
      case 'commercial':
        return 'Коммерческое здание';
      default:
        return 'Жилой дом';
    }
  };

  const getSoilTypeName = (type: string): string => {
    switch (type) {
      case 'rock':
        return 'Скальный грунт';
      case 'gravel':
        return 'Гравийный грунт';
      case 'sand':
        return 'Песчаный грунт';
      case 'clay':
        return 'Глинистый грунт';
      case 'peat':
        return 'Торфяной грунт';
      case 'waterlogged':
        return 'Водонасыщенный грунт';
      default:
        return 'Глинистый грунт';
    }
  };

  return (
    <div className={`${styles.calculator} foundationCalculator`}>
      <div className="calculatorHeader">
        <h2>🏗️ Калькулятор фундамента</h2>
        <p>
          Рассчитайте параметры и материалы для фундамента здания. Учитываются
          тип здания, грунт и конструктивные особенности.
        </p>
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          calculateFoundation();
        }}
      >
        <div className="inputGroup">
          <label>Основные параметры</label>
          <div className="inputGrid">
            <div>
              <label htmlFor="buildingArea">Площадь здания (м²)</label>
              <input
                id="buildingArea"
                type="number"
                value={buildingArea}
                onChange={(e) => setBuildingArea(e.target.value)}
                placeholder="Например: 150"
                step="0.1"
                min="1"
                max="10000"
              />
            </div>
            <div>
              <label htmlFor="buildingHeight">Высота здания (м)</label>
              <input
                id="buildingHeight"
                type="number"
                value={buildingHeight}
                onChange={(e) => setBuildingHeight(e.target.value)}
                placeholder="Например: 6.5"
                step="0.1"
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Тип здания и фундамента</label>
          <div className="inputRow">
            <div>
              <label htmlFor="buildingType">Тип здания</label>
              <select
                id="buildingType"
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
              >
                <option value="house">🏠 Жилой дом</option>
                <option value="cottage">🏡 Дача/Коттедж</option>
                <option value="garage">🚗 Гараж</option>
                <option value="shed">🏚️ Сарай/Хозпостройка</option>
                <option value="commercial">🏢 Коммерческое здание</option>
              </select>
              <div className="help">
                {getBuildingTypeName(buildingType)} - влияет на нагрузки
              </div>
            </div>
            <div>
              <label htmlFor="foundationType">Тип фундамента</label>
              <select
                id="foundationType"
                value={foundationType}
                onChange={(e) => setFoundationType(e.target.value)}
              >
                <option value="strip">📏 Ленточный</option>
                <option value="slab">⬜ Плитный</option>
                <option value="pile">🔩 Свайный</option>
                <option value="column">🏛️ Столбчатый</option>
              </select>
              <div className="help">
                {getFoundationTypeName(foundationType)} - выберите конструкцию
              </div>
            </div>
          </div>
        </div>

        <div className="inputGroup">
          <label>Грунтовые условия</label>
          <div className="inputRow">
            <div>
              <label htmlFor="soilType">Тип грунта</label>
              <select
                id="soilType"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                <option value="rock">🗿 Скальный грунт</option>
                <option value="gravel">🪨 Гравийный грунт</option>
                <option value="sand">🏖️ Песчаный грунт</option>
                <option value="clay">🧱 Глинистый грунт</option>
                <option value="peat">🌿 Торфяной грунт</option>
                <option value="waterlogged">💧 Водонасыщенный грунт</option>
              </select>
              <div className="help">
                {getSoilTypeName(soilType)} - влияет на несущую способность
              </div>
            </div>
            <div>
              <label htmlFor="basement">Подвал</label>
              <select
                id="basement"
                value={basement}
                onChange={(e) => setBasement(e.target.value)}
              >
                <option value="no">Нет</option>
                <option value="yes">Есть</option>
              </select>
              <div className="help">
                Наличие подвала влияет на глубину заложения
              </div>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="inputGroup">
          <button type="submit" className="calculateBtn">
            Рассчитать фундамент
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат расчета</h3>

          <div className="foundationSummary">
            <div className="summaryItem">
              <span className="label">Нагрузка от здания:</span>
              <span className="value">{result.buildingLoad} кг</span>
            </div>
            <div className="summaryItem">
              <span className="label">Несущая способность грунта:</span>
              <span className="value">{result.soilBearing} кг/м²</span>
            </div>
            <div className="summaryItem">
              <span className="label">Глубина заложения:</span>
              <span className="value">{result.foundationDepth} м</span>
            </div>
          </div>

          <div className="foundationDimensions">
            <h4>Размеры фундамента:</h4>
            <div className="dimensionsInfo">
              <p>
                <strong>Тип:</strong> {result.foundationDimensions.type}
              </p>
              {result.foundationDimensions.width && (
                <p>
                  <strong>Ширина:</strong> {result.foundationDimensions.width} м
                </p>
              )}
              {result.foundationDimensions.thickness && (
                <p>
                  <strong>Толщина:</strong>{' '}
                  {result.foundationDimensions.thickness} м
                </p>
              )}
              {result.foundationDimensions.length && (
                <p>
                  <strong>Длина:</strong> {result.foundationDimensions.length} м
                </p>
              )}
              {result.foundationDimensions.count && (
                <p>
                  <strong>Количество:</strong>{' '}
                  {result.foundationDimensions.count} шт.
                </p>
              )}
              {result.foundationDimensions.size && (
                <p>
                  <strong>Размер сечения:</strong>{' '}
                  {result.foundationDimensions.size}×
                  {result.foundationDimensions.size} м
                </p>
              )}
            </div>
          </div>

          <div className="materialsCalculation">
            <h4>Расход материалов:</h4>
            <div className="materialsGrid">
              {result.materials.concrete && (
                <div className="materialItem">
                  <span className="label">Бетон:</span>
                  <span className="value">{result.materials.concrete} м³</span>
                </div>
              )}
              {result.materials.reinforcement && (
                <div className="materialItem">
                  <span className="label">Арматура:</span>
                  <span className="value">
                    {result.materials.reinforcement} т
                  </span>
                </div>
              )}
              {result.materials.formwork && (
                <div className="materialItem">
                  <span className="label">Опалубка:</span>
                  <span className="value">{result.materials.formwork} м²</span>
                </div>
              )}
              {result.materials.insulation && (
                <div className="materialItem">
                  <span className="label">Утеплитель:</span>
                  <span className="value">
                    {result.materials.insulation} м²
                  </span>
                </div>
              )}
              {result.materials.piles && (
                <div className="materialItem">
                  <span className="label">Сваи:</span>
                  <span className="value">{result.materials.piles} шт.</span>
                </div>
              )}
            </div>
          </div>

          <div className="resultValue">
            <span className="amount">{result.cost}</span>
            <span className="unit">рублей</span>
          </div>

          <div className="recommendation">
            <strong>Рекомендации:</strong>
            <ul className="recommendationsList">
              {result.recommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <strong>Примечание:</strong> Это предварительный расчет. Для
              точного проектирования обратитесь к специалистам и проведите
              геологические изыскания на участке.
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

export default FoundationCalculator;
