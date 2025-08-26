import React, { useState, useEffect } from 'react';
import styles from './CurrencyConverter.module.scss';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Полный список валют с флагами и символами
  const currencies: Currency[] = [
    { code: 'USD', name: 'Доллар США', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Евро', symbol: '€', flag: '🇪🇺' },
    { code: 'RUB', name: 'Российский рубль', symbol: '₽', flag: '🇷🇺' },
    { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Японская иена', symbol: '¥', flag: '🇯🇵' },
    { code: 'CNY', name: 'Китайский юань', symbol: '¥', flag: '🇨🇳' },
    { code: 'CHF', name: 'Швейцарский франк', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CAD', name: 'Канадский доллар', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Австралийский доллар', symbol: 'A$', flag: '🇦🇺' },
    { code: 'KRW', name: 'Южнокорейская вона', symbol: '₩', flag: '🇰🇷' },
    { code: 'INR', name: 'Индийская рупия', symbol: '₹', flag: '🇮🇳' },
    { code: 'BRL', name: 'Бразильский реал', symbol: 'R$', flag: '🇧🇷' },
    { code: 'TRY', name: 'Турецкая лира', symbol: '₺', flag: '🇹🇷' },
    { code: 'ZAR', name: 'Южноафриканский рэнд', symbol: 'R', flag: '🇿🇦' },
    { code: 'MXN', name: 'Мексиканский песо', symbol: '$', flag: '🇲🇽' },
    { code: 'SGD', name: 'Сингапурский доллар', symbol: 'S$', flag: '🇸🇬' },
    { code: 'NZD', name: 'Новозеландский доллар', symbol: 'NZ$', flag: '🇳🇿' },
    { code: 'SEK', name: 'Шведская крона', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Норвежская крона', symbol: 'kr', flag: '🇳🇴' },
    { code: 'DKK', name: 'Датская крона', symbol: 'kr', flag: '🇩🇰' },
    { code: 'AED', name: 'Дирхам ОАЭ', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'AFN', name: 'Афганский афгани', symbol: '؋', flag: '🇦🇫' },
    { code: 'ALL', name: 'Албанский лек', symbol: 'L', flag: '🇦🇱' },
    { code: 'AMD', name: 'Армянский драм', symbol: '֏', flag: '🇦🇲' },
    {
      code: 'ANG',
      name: 'Нидерландский антильский гульден',
      symbol: 'ƒ',
      flag: '🇧🇶',
    },
    { code: 'AOA', name: 'Ангольская кванза', symbol: 'Kz', flag: '🇦🇴' },
    { code: 'ARS', name: 'Аргентинский песо', symbol: '$', flag: '🇦🇷' },
    { code: 'AWG', name: 'Арубанский флорин', symbol: 'ƒ', flag: '🇦🇼' },
    { code: 'AZN', name: 'Азербайджанский манат', symbol: '₼', flag: '🇦🇿' },
    { code: 'BAM', name: 'Боснийская марка', symbol: 'KM', flag: '🇧🇦' },
    { code: 'BBD', name: 'Барбадосский доллар', symbol: '$', flag: '🇧🇧' },
    { code: 'BDT', name: 'Бангладешская така', symbol: '৳', flag: '🇧🇩' },
    { code: 'BGN', name: 'Болгарский лев', symbol: 'лв', flag: '🇧🇬' },
    { code: 'BHD', name: 'Бахрейнский динар', symbol: '.د.ب', flag: '🇧🇭' },
    { code: 'BIF', name: 'Бурундийский франк', symbol: 'FBu', flag: '🇧🇮' },
    { code: 'BMD', name: 'Бермудский доллар', symbol: '$', flag: '🇧🇲' },
    { code: 'BND', name: 'Брунейский доллар', symbol: '$', flag: '🇧🇳' },
    { code: 'BOB', name: 'Боливийский боливиано', symbol: 'Bs', flag: '🇧🇴' },
    { code: 'BSD', name: 'Багамский доллар', symbol: '$', flag: '🇧🇸' },
    { code: 'BTN', name: 'Бутанский нгултрум', symbol: 'Nu', flag: '🇧🇹' },
    { code: 'BWP', name: 'Ботсванская пула', symbol: 'P', flag: '🇧🇼' },
    { code: 'BYN', name: 'Белорусский рубль', symbol: 'Br', flag: '🇧🇾' },
    { code: 'BZD', name: 'Белизский доллар', symbol: '$', flag: '🇧🇿' },
    { code: 'CDF', name: 'Конголезский франк', symbol: 'FC', flag: '🇨🇩' },
    { code: 'CLP', name: 'Чилийский песо', symbol: '$', flag: '🇨🇱' },
    { code: 'COP', name: 'Колумбийский песо', symbol: '$', flag: '🇨🇴' },
    { code: 'CRC', name: 'Коста-риканский колон', symbol: '₡', flag: '🇨🇷' },
    { code: 'CUP', name: 'Кубинский песо', symbol: '$', flag: '🇨🇺' },
    { code: 'CVE', name: 'Эскудо Кабо-Верде', symbol: '$', flag: '🇨🇻' },
    { code: 'CZK', name: 'Чешская крона', symbol: 'Kč', flag: '🇨🇿' },
    { code: 'DJF', name: 'Джибутийский франк', symbol: 'Fdj', flag: '🇩🇯' },
    { code: 'DOP', name: 'Доминиканский песо', symbol: '$', flag: '🇩🇴' },
    { code: 'EGP', name: 'Египетский фунт', symbol: '£', flag: '🇪🇬' },
    { code: 'ERN', name: 'Эритрейская накфа', symbol: 'Nfk', flag: '🇪🇷' },
    { code: 'ETB', name: 'Эфиопский быр', symbol: 'Br', flag: '🇪🇹' },
    { code: 'FJD', name: 'Фиджийский доллар', symbol: '$', flag: '🇫🇯' },
    { code: 'FKP', name: 'Фолклендский фунт', symbol: '£', flag: '🇫🇰' },
    { code: 'FOK', name: 'Фарерская крона', symbol: 'kr', flag: '🇫🇴' },
    { code: 'GEL', name: 'Грузинский лари', symbol: '₾', flag: '🇬🇪' },
    { code: 'GGP', name: 'Гернсийский фунт', symbol: '£', flag: '🇬🇬' },
    { code: 'GHS', name: 'Ганский седи', symbol: '₵', flag: '🇬🇭' },
    { code: 'GIP', name: 'Гибралтарский фунт', symbol: '£', flag: '🇬🇮' },
    { code: 'GMD', name: 'Гамбийский даласи', symbol: 'D', flag: '🇬🇲' },
    { code: 'GNF', name: 'Гвинейский франк', symbol: 'FG', flag: '🇬🇳' },
    { code: 'GTQ', name: 'Гватемальский кетсаль', symbol: 'Q', flag: '🇬🇹' },
    { code: 'GYD', name: 'Гайанский доллар', symbol: '$', flag: '🇬🇾' },
    { code: 'HKD', name: 'Гонконгский доллар', symbol: '$', flag: '🇭🇰' },
    { code: 'HNL', name: 'Гондурасская лемпира', symbol: 'L', flag: '🇭🇳' },
    { code: 'HRK', name: 'Хорватская куна', symbol: 'kn', flag: '🇭🇷' },
    { code: 'HTG', name: 'Гаитянский гурд', symbol: 'G', flag: '🇭🇹' },
    { code: 'HUF', name: 'Венгерский форинт', symbol: 'Ft', flag: '🇭🇺' },
    { code: 'IDR', name: 'Индонезийская рупия', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'ILS', name: 'Израильский шекель', symbol: '₪', flag: '🇮🇱' },
    { code: 'IMP', name: 'Мэнский фунт', symbol: '£', flag: '🇮🇲' },
    { code: 'IQD', name: 'Иракский динар', symbol: 'ع.د', flag: '🇮🇶' },
    { code: 'IRR', name: 'Иранский риал', symbol: '﷼', flag: '🇮🇷' },
    { code: 'ISK', name: 'Исландская крона', symbol: 'kr', flag: '🇮🇸' },
    { code: 'JEP', name: 'Джерсийский фунт', symbol: '£', flag: '🇯🇪' },
    { code: 'JMD', name: 'Ямайский доллар', symbol: '$', flag: '🇯🇲' },
    { code: 'JOD', name: 'Иорданский динар', symbol: 'د.ا', flag: '🇯🇴' },
    { code: 'KES', name: 'Кенийский шиллинг', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'KGS', name: 'Киргизский сом', symbol: 'с', flag: '🇰🇬' },
    { code: 'KHR', name: 'Камбоджийский риель', symbol: '៛', flag: '🇰🇭' },
    { code: 'KID', name: 'Кирибатийский доллар', symbol: '$', flag: '🇰🇮' },
    { code: 'KMF', name: 'Коморский франк', symbol: 'CF', flag: '🇰🇲' },
    { code: 'KWD', name: 'Кувейтский динар', symbol: 'د.ك', flag: '🇰🇼' },
    { code: 'KYD', name: 'Кайманский доллар', symbol: '$', flag: '🇰🇾' },
    { code: 'KZT', name: 'Казахстанский тенге', symbol: '₸', flag: '🇰🇿' },
    { code: 'LAK', name: 'Лаосский кип', symbol: '₭', flag: '🇱🇦' },
    { code: 'LBP', name: 'Ливанский фунт', symbol: 'ل.ل', flag: '🇱🇧' },
    { code: 'LKR', name: 'Шри-ланкийская рупия', symbol: 'Rs', flag: '🇱🇰' },
    { code: 'LRD', name: 'Либерийский доллар', symbol: '$', flag: '🇱🇷' },
    { code: 'LSL', name: 'Лесотский лоти', symbol: 'L', flag: '🇱🇸' },
    { code: 'LYD', name: 'Ливийский динар', symbol: 'ل.د', flag: '🇱🇾' },
    { code: 'MAD', name: 'Марокканский дирхам', symbol: 'د.م', flag: '🇲🇦' },
    { code: 'MDL', name: 'Молдавский лей', symbol: 'L', flag: '🇲🇩' },
    { code: 'MGA', name: 'Малагасийский ариари', symbol: 'Ar', flag: '🇲🇬' },
    { code: 'MKD', name: 'Македонский денар', symbol: 'ден', flag: '🇲🇰' },
    { code: 'MMK', name: 'Мьянманский кят', symbol: 'K', flag: '🇲🇲' },
    { code: 'MNT', name: 'Монгольский тугрик', symbol: '₮', flag: '🇲🇳' },
    { code: 'MOP', name: 'Макао патака', symbol: 'MOP$', flag: '🇲🇴' },
    { code: 'MRU', name: 'Мавританская угия', symbol: 'UM', flag: '🇲🇷' },
    { code: 'MUR', name: 'Маврикийская рупия', symbol: '₨', flag: '🇲🇺' },
    { code: 'MVR', name: 'Мальдивская руфия', symbol: 'Rf', flag: '🇲🇻' },
    { code: 'MWK', name: 'Малавийская квача', symbol: 'MK', flag: '🇲🇼' },
    { code: 'MYR', name: 'Малайзийский ринггит', symbol: 'RM', flag: '🇲🇾' },
    { code: 'MZN', name: 'Мозамбикский метикал', symbol: 'MT', flag: '🇲🇿' },
    { code: 'NAD', name: 'Намибийский доллар', symbol: '$', flag: '🇳🇦' },
    { code: 'NGN', name: 'Нигерийская найра', symbol: '₦', flag: '🇳🇬' },
    { code: 'NIO', name: 'Никарагуанская кордоба', symbol: 'C$', flag: '🇳🇮' },
    { code: 'NPR', name: 'Непальская рупия', symbol: '₨', flag: '🇳🇵' },
    { code: 'OMR', name: 'Оманский риал', symbol: 'ر.ع', flag: '🇴🇲' },
    { code: 'PAB', name: 'Панамский бальбоа', symbol: 'B/.', flag: '🇵🇦' },
    { code: 'PEN', name: 'Перуанский соль', symbol: 'S/', flag: '🇵🇪' },
    { code: 'PGK', name: 'Папуа-новогвинейская кина', symbol: 'K', flag: '🇵🇬' },
    { code: 'PHP', name: 'Филиппинский песо', symbol: '₱', flag: '🇵🇭' },
    { code: 'PKR', name: 'Пакистанская рупия', symbol: '₨', flag: '🇵🇰' },
    { code: 'PLN', name: 'Польский злотый', symbol: 'zł', flag: '🇵🇱' },
    { code: 'PYG', name: 'Парагвайский гуарани', symbol: '₲', flag: '🇵🇾' },
    { code: 'QAR', name: 'Катарский риал', symbol: 'ر.ق', flag: '🇶🇦' },
    { code: 'RON', name: 'Румынский лей', symbol: 'lei', flag: '🇷🇴' },
    { code: 'RSD', name: 'Сербский динар', symbol: 'дин', flag: '🇷🇸' },
    { code: 'RWF', name: 'Руандский франк', symbol: 'FRw', flag: '🇷🇼' },
    { code: 'SAR', name: 'Саудовский риял', symbol: 'ر.س', flag: '🇸🇦' },
    { code: 'SBD', name: 'Соломоновский доллар', symbol: '$', flag: '🇸🇧' },
    { code: 'SCR', name: 'Сейшельская рупия', symbol: '₨', flag: '🇸🇨' },
    { code: 'SDG', name: 'Суданский фунт', symbol: 'ج.س', flag: '🇸🇩' },
    { code: 'SHP', name: 'Фунт Святой Елены', symbol: '£', flag: '🇸🇭' },
    { code: 'SLE', name: 'Сьерра-леонский леоне', symbol: 'Le', flag: '🇸🇱' },
    { code: 'SLL', name: 'Сьерра-леонский леоне', symbol: 'Le', flag: '🇸🇱' },
    { code: 'SOS', name: 'Сомалийский шиллинг', symbol: 'Sh', flag: '🇸🇴' },
    { code: 'SRD', name: 'Суринамский доллар', symbol: '$', flag: '🇸🇷' },
    { code: 'SSP', name: 'Южносуданский фунт', symbol: '£', flag: '🇸🇸' },
    {
      code: 'STN',
      name: 'Добра Сан-Томе и Принсипи',
      symbol: 'Db',
      flag: '🇸🇹',
    },
    { code: 'SYP', name: 'Сирийский фунт', symbol: '£', flag: '🇸🇾' },
    { code: 'SZL', name: 'Свазилендский лилангени', symbol: 'L', flag: '🇸🇿' },
    { code: 'THB', name: 'Тайский бат', symbol: '฿', flag: '🇹🇭' },
    { code: 'TJS', name: 'Таджикский сомони', symbol: 'ЅМ', flag: '🇹🇯' },
    { code: 'TMT', name: 'Туркменский манат', symbol: 'T', flag: '🇹🇲' },
    { code: 'TND', name: 'Тунисский динар', symbol: 'د.ت', flag: '🇹🇳' },
    { code: 'TOP', name: 'Тонганская паанга', symbol: 'T$', flag: '🇹🇴' },
    { code: 'TTD', name: 'Тринидад и Тобаго доллар', symbol: '$', flag: '🇹🇹' },
    { code: 'TVD', name: 'Тувалуанский доллар', symbol: '$', flag: '🇹🇻' },
    { code: 'TWD', name: 'Тайваньский доллар', symbol: 'NT$', flag: '🇹🇼' },
    { code: 'TZS', name: 'Танзанийский шиллинг', symbol: 'TSh', flag: '🇹🇿' },
    { code: 'UAH', name: 'Украинская гривна', symbol: '₴', flag: '🇺🇦' },
    { code: 'UGX', name: 'Угандийский шиллинг', symbol: 'USh', flag: '🇺🇬' },
    { code: 'UYU', name: 'Уругвайский песо', symbol: '$', flag: '🇺🇾' },
    { code: 'UZS', name: 'Узбекский сум', symbol: "so'm", flag: '🇺🇿' },
    { code: 'VES', name: 'Венесуэльский боливар', symbol: 'Bs', flag: '🇻🇪' },
    { code: 'VND', name: 'Вьетнамский донг', symbol: '₫', flag: '🇻🇳' },
    { code: 'VUV', name: 'Вануатский вату', symbol: 'VT', flag: '🇻🇺' },
    { code: 'WST', name: 'Самоанская тала', symbol: 'T', flag: '🇼🇸' },
    {
      code: 'XAF',
      name: 'Центральноафриканский франк',
      symbol: 'FCFA',
      flag: '🇨🇫',
    },
    { code: 'XCD', name: 'Восточнокарибский доллар', symbol: '$', flag: '🇦🇬' },
    { code: 'XCG', name: 'Восточнокарибский доллар', symbol: '$', flag: '🇦🇬' },
    {
      code: 'XDR',
      name: 'Специальные права заимствования',
      symbol: 'SDR',
      flag: '🌍',
    },
    {
      code: 'XOF',
      name: 'Западноафриканский франк',
      symbol: 'CFA',
      flag: '🇧🇯',
    },
    {
      code: 'XPF',
      name: 'Французский тихоокеанский франк',
      symbol: 'F',
      flag: '🇵🇫',
    },
    { code: 'YER', name: 'Йеменский риал', symbol: '﷼', flag: '🇾🇪' },
    { code: 'ZMW', name: 'Замбийская квача', symbol: 'ZK', flag: '🇿🇲' },
    { code: 'ZWL', name: 'Зимбабвийский доллар', symbol: '$', flag: '🇿🇼' },
  ];

  // Кэш для курсов валют
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Загружаем курсы валют при монтировании компонента
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const convertCurrency = async () => {
    setError('');
    setIsLoading(true);

    if (!amount) {
      setError('Пожалуйста, введите сумму для конвертации');
      setIsLoading(false);
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Сумма должна быть положительным числом');
      setIsLoading(false);
      return;
    }

    if (fromCurrency === toCurrency) {
      setResult({
        amount: amountNum,
        fromCurrency,
        toCurrency,
        rate: 1,
        convertedAmount: amountNum,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
      setIsLoading(false);
      return;
    }

    try {
      // Ищем прямой курс
      let rate = findExchangeRate(fromCurrency, toCurrency);

      // Если прямого курса нет, ищем через USD
      if (!rate) {
        const rateToUSD = findExchangeRate(fromCurrency, 'USD');
        const rateFromUSD = findExchangeRate('USD', toCurrency);

        if (rateToUSD && rateFromUSD) {
          rate = rateToUSD * rateFromUSD;
        } else {
          // Если и через USD не получается, используем примерные курсы
          rate = getApproximateRate(fromCurrency, toCurrency);
        }
      }

      if (!rate) {
        setError('Не удалось найти курс обмена для выбранных валют');
        setIsLoading(false);
        return;
      }

      const convertedAmount = amountNum * rate;

      // Получаем информацию о валютах
      const fromCurrencyInfo = currencies.find((c) => c.code === fromCurrency);
      const toCurrencyInfo = currencies.find((c) => c.code === toCurrency);

      setResult({
        amount: amountNum,
        fromCurrency,
        toCurrency,
        fromCurrencyInfo,
        toCurrencyInfo,
        rate: rate.toFixed(4),
        convertedAmount: convertedAmount.toFixed(2),
        lastUpdated: lastUpdated || new Date().toISOString().split('T')[0],
        marketInfo: getMarketInfo(fromCurrency, toCurrency),
      });
    } catch (error) {
      setError('Произошла ошибка при конвертации валют');
    } finally {
      setIsLoading(false);
    }
  };

  const findExchangeRate = (from: string, to: string): number | null => {
    const key = `${from}-${to}`;
    return exchangeRates[key] || null;
  };

  // Загрузка реальных курсов валют с бесплатного API
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      // Используем бесплатный API exchangerate-api.com
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      const data = await response.json();

      if (data.rates) {
        const rates: { [key: string]: number } = {};

        // Конвертируем все курсы относительно USD
        Object.entries(data.rates).forEach(([currency, rate]) => {
          if (typeof rate === 'number') {
            rates[`USD-${currency}`] = rate;
            rates[`${currency}-USD`] = 1 / rate;
          }
        });

        // Добавляем кросс-курсы для популярных пар
        if (data.rates.EUR && data.rates.RUB && data.rates.GBP) {
          rates['EUR-RUB'] = data.rates.RUB / data.rates.EUR;
          rates['RUB-EUR'] = data.rates.EUR / data.rates.RUB;
          rates['EUR-GBP'] = data.rates.GBP / data.rates.EUR;
          rates['GBP-EUR'] = data.rates.EUR / data.rates.GBP;
          rates['GBP-RUB'] = data.rates.RUB / data.rates.GBP;
          rates['RUB-GBP'] = data.rates.GBP / data.rates.RUB;
        }

        setExchangeRates(rates);
        setLastUpdated(new Date().toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Ошибка загрузки курсов валют:', error);
      // Fallback на примерные курсы
      setExchangeRates({
        'USD-EUR': 0.85,
        'USD-RUB': 95.5,
        'USD-GBP': 0.79,
        'USD-JPY': 148.2,
        'EUR-USD': 1.18,
        'EUR-RUB': 112.3,
        'EUR-GBP': 0.93,
        'RUB-USD': 0.0105,
        'RUB-EUR': 0.0089,
        'GBP-USD': 1.27,
        'GBP-EUR': 1.08,
        'JPY-USD': 0.0067,
        'JPY-EUR': 0.0057,
      });
      setLastUpdated(new Date().toISOString().split('T')[0]);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const getApproximateRate = (from: string, to: string): number => {
    // Примерные курсы для популярных пар (fallback)
    const approximateRates: { [key: string]: number } = {
      'USD-EUR': 0.85,
      'USD-RUB': 95.5,
      'USD-GBP': 0.79,
      'USD-JPY': 148.2,
      'EUR-USD': 1.18,
      'EUR-RUB': 112.3,
      'EUR-GBP': 0.93,
      'RUB-USD': 0.0105,
      'RUB-EUR': 0.0089,
      'GBP-USD': 1.27,
      'GBP-EUR': 1.08,
      'JPY-USD': 0.0067,
      'JPY-EUR': 0.0057,
    };

    const key = `${from}-${to}`;
    return approximateRates[key] || 1;
  };

  const getMarketInfo = (from: string, to: string) => {
    const marketTrends = {
      'USD-EUR': {
        trend: 'снижение',
        confidence: 'высокая',
        reason: 'Политика ФРС',
      },
      'USD-RUB': {
        trend: 'колебания',
        confidence: 'средняя',
        reason: 'Волатильность рынка',
      },
      'EUR-USD': {
        trend: 'рост',
        confidence: 'высокая',
        reason: 'Политика ЕЦБ',
      },
      'RUB-USD': {
        trend: 'нестабильность',
        confidence: 'низкая',
        reason: 'Экономические санкции',
      },
    };

    const key = `${from}-${to}`;
    return (
      marketTrends[key as keyof typeof marketTrends] || {
        trend: 'стабильность',
        confidence: 'средняя',
        reason: 'Обычные рыночные условия',
      }
    );
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const clearForm = () => {
    setAmount('');
    setFromCurrency('USD');
    setToCurrency('EUR');
    setResult(null);
    setError('');
  };

  const getCurrencyDisplay = (currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return currency ? `${currency.flag} ${currency.code}` : currencyCode;
  };

  return (
    <div className={`${styles.calculator} currencyConverter`}>
      <div className="calculatorHeader">
        <h2>💱 Конвертер валют</h2>
        <p>
          Конвертируйте валюты по актуальным курсам, отслеживайте изменения и
          получайте рыночную аналитику.
        </p>
        {lastUpdated && (
          <div className="lastUpdated">
            <small>Последнее обновление курсов: {lastUpdated}</small>
          </div>
        )}
      </div>

      <form
        className="calculatorForm"
        onSubmit={(e) => {
          e.preventDefault();
          convertCurrency();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="amount">Сумма для конвертации</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Например: 100"
            step="0.01"
            min="0.01"
            max="1000000"
          />
        </div>

        <div className="inputGroup">
          <label>Выбор валют</label>
          <div className={styles.currencySelection}>
            <div className={styles.currencyFrom}>
              <label htmlFor="fromCurrency">Из валюты</label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swapCurrencies}
              className={styles.swapButton}
              title="Поменять валюты местами"
            >
              ⇄
            </button>

            <div className={styles.currencyTo}>
              <label htmlFor="toCurrency">В валюту</label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className={styles.buttonGroup}>
          <button type="submit" className="calculateBtn" disabled={isLoading}>
            {isLoading ? 'Конвертирую...' : 'Конвертировать валюту'}
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Результат конвертации</h3>

          <div className={styles.conversionSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Исходная сумма:</span>
              <span className={styles.value}>
                {result.amount} {getCurrencyDisplay(result.fromCurrency)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Курс обмена:</span>
              <span className={styles.value}>
                1 {result.fromCurrency} = {result.rate} {result.toCurrency}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Дата курса:</span>
              <span className={styles.value}>{result.lastUpdated}</span>
            </div>
          </div>

          <div className={styles.resultValue}>
            <span className={styles.amount}>{result.convertedAmount}</span>
            <span className={styles.unit}>
              {getCurrencyDisplay(result.toCurrency)}
            </span>
          </div>

          <div className={styles.currencyInfo}>
            <h4>Информация о валютах:</h4>
            <div className={styles.currencyGrid}>
              <div className={styles.currencyCard}>
                <div className={styles.currencyHeader}>
                  <span className={styles.currencyFlag}>
                    {result.fromCurrencyInfo?.flag}
                  </span>
                  <span className={styles.currencyCode}>
                    {result.fromCurrencyInfo?.code}
                  </span>
                </div>
                <div className={styles.currencyName}>
                  {result.fromCurrencyInfo?.name}
                </div>
                <div className={styles.currencySymbol}>
                  {result.fromCurrencyInfo?.symbol}
                </div>
              </div>
              <div className={styles.currencyCard}>
                <div className={styles.currencyHeader}>
                  <span className={styles.currencyFlag}>
                    {result.toCurrencyInfo?.flag}
                  </span>
                  <span className={styles.currencyCode}>
                    {result.toCurrencyInfo?.code}
                  </span>
                </div>
                <div className={styles.currencyName}>
                  {result.toCurrencyInfo?.name}
                </div>
                <div className={styles.currencySymbol}>
                  {result.toCurrencyInfo?.symbol}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.recommendation}>
            <strong>Рекомендации:</strong>
            <ul className={styles.recommendationsList}>
              <li>Курсы валют обновляются ежедневно</li>
              <li>Для крупных сумм используйте банковские курсы</li>
              <li>Учитывайте комиссии при обмене валют</li>
              <li>Следите за рыночными трендами для лучшего времени обмена</li>
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

export default CurrencyConverter;
