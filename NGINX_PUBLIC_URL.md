# 🔧 Настройка PUBLIC_URL для counterplus.ru

## 📋 **Проблема с %PUBLIC_URL%:**

В React приложениях `%PUBLIC_URL%` - это placeholder, который должен заменяться Webpack'ом во время сборки. В вашем проекте это настроено через webpack конфигурацию.

## ⚙️ **Как это работает:**

### **1. Webpack конфигурация:**

```javascript
// webpack.config.js
const isProduction = process.env.NODE_ENV === 'production';
const PUBLIC_URL =
  process.env.PUBLIC_URL || (isProduction ? 'https://counterplus.ru' : '/');

module.exports = {
  output: {
    publicPath: PUBLIC_URL, // Путь для загрузки ресурсов
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: {
        PUBLIC_URL: PUBLIC_URL, // Передается в HTML
        DOMAIN: 'counterplus.ru', // Домен сайта
        APP_NAME: 'Счетчик+', // Название приложения
        APP_DESCRIPTION: '...', // Описание
      },
    }),
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL), // Доступно в коде
    }),
  ],
};
```

### **2. HTML шаблон:**

```html
<!-- public/index.html -->
<link rel="icon" href="<%= PUBLIC_URL %>/favicon.svg" />
<meta property="og:url" content="https://<%= DOMAIN %>/" />
<title><%= APP_NAME %> - Калькуляторы и конвертеры</title>
```

### **3. Доступ в коде:**

```typescript
// В любом компоненте
const publicUrl = process.env.PUBLIC_URL;
const domain = process.env.DOMAIN;
```

## 🚀 **Сборка для продакшена:**

### **Автоматическая сборка:**

```bash
# Сборка с правильными переменными
npm run build:prod

# Или через скрипт деплоя
npm run deploy
```

### **Ручная сборка:**

```bash
# Устанавливаем переменные окружения
export NODE_ENV=production
export PUBLIC_URL=https://counterplus.ru

# Собираем проект
npm run build
```

### **Сборка для разных окружений:**

```bash
# Продакшен
npm run build:prod

# Стейджинг
npm run build:staging

# Разработка
npm run build
```

## 📁 **Структура файлов:**

```
project/
├── webpack.config.js          # Конфигурация webpack
├── public/
│   └── index.html            # HTML шаблон с переменными
├── src/
│   └── ...                   # Исходный код
├── build-production.sh        # Скрипт сборки
├── package.json              # Скрипты npm
└── dist/                     # Собранный проект
```

## 🔍 **Проверка сборки:**

### **1. Проверка index.html:**

```bash
# Должно содержать правильные URL
grep "https://counterplus.ru" dist/index.html
```

### **2. Проверка ресурсов:**

```bash
# Все ссылки должны быть абсолютными
grep "href=" dist/index.html
grep "src=" dist/index.html
```

### **3. Проверка bundle.js:**

```bash
# Переменные окружения должны быть заменены
grep "counterplus.ru" dist/bundle.js
```

## 🚨 **Возможные проблемы:**

### **1. %PUBLIC_URL% не заменяется:**

- Проверьте webpack конфигурацию
- Убедитесь, что используется правильный template engine
- Проверьте переменные окружения

### **2. Ресурсы не загружаются:**

- Проверьте `publicPath` в webpack
- Убедитесь, что `base href` правильный
- Проверьте nginx конфигурацию

### **3. Ошибки в консоли браузера:**

- Проверьте Network tab в DevTools
- Убедитесь, что все пути абсолютные
- Проверьте CORS настройки

## 📊 **Мониторинг:**

### **Логи nginx:**

```bash
# Просмотр ошибок
sudo tail -f /var/log/nginx/error.log

# Просмотр доступа
sudo tail -f /var/log/nginx/access.log
```

### **Проверка сайта:**

```bash
# HTTP редирект
curl -I http://counterplus.ru

# HTTPS доступность
curl -I https://counterplus.ru

# SSL сертификат
openssl s_client -connect counterplus.ru:443
```

## 🎯 **Итоговая настройка:**

### **Для разработки:**

```bash
npm start
# PUBLIC_URL = "/"
# Домен = localhost:3000
```

### **Для продакшена:**

```bash
npm run build:prod
# PUBLIC_URL = "https://counterplus.ru"
# Домен = counterplus.ru
```

### **Для деплоя:**

```bash
npm run deploy
# Создает архив counterplus.ru-production.tar.gz
# Готов к загрузке на сервер
```

## 💡 **Рекомендации:**

1. **Всегда используйте `npm run build:prod`** для продакшена
2. **Проверяйте собранные файлы** перед деплоем
3. **Мониторьте логи nginx** после деплоя
4. **Используйте скрипт `build-production.sh`** для автоматизации
5. **Тестируйте на staging** перед продакшеном

Теперь ваш проект правильно настроен для работы с доменом `counterplus.ru`! 🎉
