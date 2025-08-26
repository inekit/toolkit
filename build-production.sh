#!/bin/bash

# Скрипт для сборки проекта в продакшен режиме
# Разместить в корне проекта и сделать исполняемым

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Сборка проекта для продакшена${NC}"
echo "=================================="

# Проверяем, что мы в корне проекта
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ошибка: package.json не найден${NC}"
    echo "Запустите скрипт из корневой директории проекта"
    exit 1
fi

# Устанавливаем переменные окружения для продакшена
export NODE_ENV=production
export PUBLIC_URL=https://counterplus.ru

echo -e "${YELLOW}📋 Переменные окружения:${NC}"
echo "NODE_ENV: $NODE_ENV"
echo "PUBLIC_URL: $PUBLIC_URL"

# Очищаем предыдущую сборку
echo -e "\n${YELLOW}🧹 Очистка предыдущей сборки...${NC}"
if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}✅ Директория dist очищена${NC}"
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}📦 Установка зависимостей...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка при установке зависимостей${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Зависимости установлены${NC}"
fi

# Собираем проект
echo -e "\n${YELLOW}🔨 Сборка проекта...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при сборке проекта${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Проект собран успешно${NC}"

# Проверяем результат сборки
echo -e "\n${YELLOW}🔍 Проверка результата сборки...${NC}"
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ index.html создан${NC}"
    
    # Проверяем, что PUBLIC_URL правильно заменен
    if grep -q "https://counterplus.ru" dist/index.html; then
        echo -e "${GREEN}✅ PUBLIC_URL правильно заменен на https://counterplus.ru${NC}"
    else
        echo -e "${RED}❌ PUBLIC_URL не заменен правильно${NC}"
        echo "Содержимое index.html:"
        head -20 dist/index.html
    fi
else
    echo -e "${RED}❌ index.html не найден${NC}"
    exit 1
fi

if [ -f "dist/bundle.js" ]; then
    echo -e "${GREEN}✅ bundle.js создан${NC}"
    echo "Размер: $(du -h dist/bundle.js | cut -f1)"
else
    echo -e "${RED}❌ bundle.js не найден${NC}"
    exit 1
fi

# Показываем структуру dist
echo -e "\n${YELLOW}📁 Структура собранного проекта:${NC}"
ls -la dist/

# Создаем архив для деплоя
echo -e "\n${YELLOW}📦 Создание архива для деплоя...${NC}"
tar -czf counterplus.ru-production.tar.gz -C dist .
echo -e "${GREEN}✅ Архив создан: counterplus.ru-production.tar.gz${NC}"
echo "Размер: $(du -h counterplus.ru-production.tar.gz | cut -f1)"

# Инструкции по деплою
echo -e "\n${YELLOW}📋 Инструкции по деплою:${NC}"
echo "1. Скопируйте архив на сервер:"
echo "   scp counterplus.ru-production.tar.gz user@server:/tmp/"
echo ""
echo "2. На сервере распакуйте архив:"
echo "   cd /var/www/counterplus.ru/html"
echo "   tar -xzf /tmp/counterplus.ru-production.tar.gz"
echo ""
echo "3. Установите права:"
echo "   sudo chown -R www-data:www-data /var/www/counterplus.ru/html"
echo "   sudo chmod -R 755 /var/www/counterplus.ru/html"
echo ""
echo "4. Перезагрузите nginx:"
echo "   sudo nginx -t && sudo systemctl reload nginx"

echo -e "\n${GREEN}✅ Сборка завершена успешно!${NC}"
echo "Проект готов к деплою на https://counterplus.ru"
