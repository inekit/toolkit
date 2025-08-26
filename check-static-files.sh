#!/bin/bash

# Скрипт для проверки доступности статических файлов на сервере
# Разместить в /usr/local/bin/check-static-files.sh и сделать исполняемым

DOMAIN="counterplus.ru"
PROTOCOL="https"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Проверка статических файлов для ${DOMAIN}${NC}"
echo "=========================================="

# Функция для проверки файла
check_file() {
    local file_path=$1
    local expected_type=$2
    local description=$3
    
    echo -e "\n${YELLOW}📁 Проверяем: ${description}${NC}"
    echo "URL: ${PROTOCOL}://${DOMAIN}${file_path}"
    
    # Проверяем HTTP статус
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PROTOCOL}://${DOMAIN}${file_path}")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Статус: ${HTTP_STATUS} (OK)${NC}"
        
        # Проверяем Content-Type
        CONTENT_TYPE=$(curl -s -I "${PROTOCOL}://${DOMAIN}${file_path}" | grep -i "content-type" | head -1)
        if [ -n "$CONTENT_TYPE" ]; then
            echo "Content-Type: $CONTENT_TYPE"
            
            # Проверяем, соответствует ли Content-Type ожидаемому
            if echo "$CONTENT_TYPE" | grep -qi "$expected_type"; then
                echo -e "${GREEN}✅ Content-Type корректен${NC}"
            else
                echo -e "${RED}❌ Content-Type не соответствует ожидаемому${NC}"
                echo "Ожидалось: $expected_type"
            fi
        else
            echo -e "${RED}❌ Content-Type не найден${NC}"
        fi
        
        # Проверяем размер файла
        FILE_SIZE=$(curl -s -I "${PROTOCOL}://${DOMAIN}${file_path}" | grep -i "content-length" | head -1)
        if [ -n "$FILE_SIZE" ]; then
            echo "Размер: $FILE_SIZE"
        fi
        
    else
        echo -e "${RED}❌ Статус: ${HTTP_STATUS} (ОШИБКА)${NC}"
    fi
}

# Проверяем основные PWA файлы
echo -e "\n${BLUE}🚀 Проверка PWA файлов:${NC}"

check_file "/manifest.json" "application/manifest+json" "PWA Manifest"
check_file "/icon-16x16.png" "image/png" "Иконка 16x16"
check_file "/icon-32x32.png" "image/png" "Иконка 32x32"
check_file "/icon-192x192.png" "image/png" "Иконка 192x192"
check_file "/icon-512x512.png" "image/png" "Иконка 512x512"
check_file "/favicon.svg" "image/svg+xml" "SVG фавикон"

# Проверяем SEO файлы
echo -e "\n${BLUE}🔍 Проверка SEO файлов:${NC}"

check_file "/sitemap.xml" "application/xml" "Sitemap XML"
check_file "/robots.txt" "text/plain" "Robots.txt"

# Проверяем основные ресурсы
echo -e "\n${BLUE}📦 Проверка основных ресурсов:${NC}"

check_file "/bundle.js" "application/javascript" "JavaScript Bundle"
check_file "/index.html" "text/html" "Главная страница"

# Проверяем кеширование
echo -e "\n${BLUE}⏰ Проверка кеширования:${NC}"

check_caching() {
    local file_path=$1
    local description=$2
    
    echo -e "\n${YELLOW}📁 Проверяем кеширование: ${description}${NC}"
    
    CACHE_HEADERS=$(curl -s -I "${PROTOCOL}://${DOMAIN}${file_path}" | grep -i "cache-control\|expires")
    
    if [ -n "$CACHE_HEADERS" ]; then
        echo "Заголовки кеширования:"
        echo "$CACHE_HEADERS"
    else
        echo -e "${RED}❌ Заголовки кеширования не найдены${NC}"
    fi
}

check_caching "/icon-192x192.png" "Иконка PWA"
check_caching "/manifest.json" "PWA Manifest"
check_caching "/bundle.js" "JavaScript Bundle"

# Проверка безопасности
echo -e "\n${BLUE}🔒 Проверка безопасности:${NC}"

check_security() {
    local file_path=$1
    local description=$2
    
    echo -e "\n${YELLOW}📁 Проверяем безопасность: ${description}${NC}"
    
    SECURITY_HEADERS=$(curl -s -I "${PROTOCOL}://${DOMAIN}${file_path}" | grep -i "x-content-type-options\|x-frame-options\|x-xss-protection")
    
    if [ -n "$SECURITY_HEADERS" ]; then
        echo "Заголовки безопасности:"
        echo "$SECURITY_HEADERS"
    else
        echo -e "${RED}❌ Заголовки безопасности не найдены${NC}"
    fi
}

check_security "/manifest.json" "PWA Manifest"
check_security "/icon-192x192.png" "Иконка PWA"

# Итоговая сводка
echo -e "\n${BLUE}📊 Итоговая сводка:${NC}"
echo "=========================================="

echo -e "\n${YELLOW}💡 Рекомендации:${NC}"
echo "1. Если файлы не загружаются, проверьте права доступа на сервере"
echo "2. Если Content-Type неправильный, проверьте nginx конфигурацию"
echo "3. Если кеширование не работает, проверьте заголовки в nginx"
echo "4. Для PWA важно, чтобы manifest.json и иконки загружались корректно"

echo -e "\n${GREEN}✅ Проверка завершена${NC}"
