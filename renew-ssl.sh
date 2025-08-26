#!/bin/bash

# Скрипт для автоматического обновления Let's Encrypt сертификатов
# Разместить в /usr/local/bin/renew-ssl.sh и сделать исполняемым

DOMAIN="counterplus.ru"
EMAIL="admin@counterplus.ru"
WEBROOT="/var/www/letsencrypt"
NGINX_CONF="/etc/nginx/sites-available/counterplus.ru"
NGINX_SERVICE="nginx"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Начинаем обновление SSL сертификата для ${DOMAIN}...${NC}"

# Проверяем, существует ли certbot
if ! command -v certbot &> /dev/null; then
    echo -e "${RED}Ошибка: certbot не установлен${NC}"
    echo "Установите certbot: sudo apt install certbot python3-certbot-nginx"
    exit 1
fi

# Создаем директорию для веб-рута если её нет
if [ ! -d "$WEBROOT" ]; then
    echo -e "${YELLOW}Создаем директорию ${WEBROOT}...${NC}"
    sudo mkdir -p "$WEBROOT"
    sudo chown www-data:www-data "$WEBROOT"
fi

# Проверяем, нужно ли обновление
echo -e "${YELLOW}Проверяем статус сертификата...${NC}"
if certbot certificates | grep -q "$DOMAIN"; then
    echo -e "${GREEN}Сертификат найден, проверяем срок действия...${NC}"
    
    # Получаем дату истечения
    EXPIRY=$(certbot certificates | grep "$DOMAIN" -A 10 | grep "VALID" | awk '{print $2}')
    if [ -n "$EXPIRY" ]; then
        echo -e "${GREEN}Сертификат действителен до: ${EXPIRY}${NC}"
    fi
else
    echo -e "${YELLOW}Сертификат не найден, создаем новый...${NC}"
fi

# Обновляем сертификат
echo -e "${YELLOW}Обновляем сертификат...${NC}"
if sudo certbot renew --webroot -w "$WEBROOT" --email "$EMAIL" --agree-tos --no-eff-email --force-renewal; then
    echo -e "${GREEN}Сертификат успешно обновлен!${NC}"
    
    # Проверяем конфигурацию nginx
    echo -e "${YELLOW}Проверяем конфигурацию nginx...${NC}"
    if sudo nginx -t; then
        echo -e "${GREEN}Конфигурация nginx корректна${NC}"
        
        # Перезагружаем nginx
        echo -e "${YELLOW}Перезагружаем nginx...${NC}"
        if sudo systemctl reload nginx; then
            echo -e "${GREEN}Nginx успешно перезагружен${NC}"
        else
            echo -e "${RED}Ошибка при перезагрузке nginx${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Ошибка в конфигурации nginx${NC}"
        exit 1
    fi
else
    echo -e "${RED}Ошибка при обновлении сертификата${NC}"
    exit 1
fi

echo -e "${GREEN}Обновление SSL сертификата завершено успешно!${NC}"

# Показываем информацию о сертификате
echo -e "${YELLOW}Информация о сертификате:${NC}"
certbot certificates | grep -A 20 "$DOMAIN"
