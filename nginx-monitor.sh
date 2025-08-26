#!/bin/bash

# Скрипт для мониторинга nginx и анализа логов
# Разместить в /usr/local/bin/nginx-monitor.sh и сделать исполняемым

NGINX_LOG_DIR="/var/log/nginx"
NGINX_SERVICE="nginx"
DOMAIN="counterplus.ru"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Мониторинг Nginx для ${DOMAIN}${NC}"
echo "=================================="

# Проверка статуса nginx
echo -e "\n${YELLOW}📊 Статус сервиса Nginx:${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx работает${NC}"
    echo "Статус: $(systemctl is-active nginx)"
    echo "Время работы: $(systemctl show nginx --property=ActiveEnterTimestamp | cut -d= -f2)"
else
    echo -e "${RED}❌ Nginx не работает${NC}"
    echo "Статус: $(systemctl is-active nginx)"
fi

# Проверка конфигурации
echo -e "\n${YELLOW}⚙️ Проверка конфигурации:${NC}"
if nginx -t > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Конфигурация корректна${NC}"
else
    echo -e "${RED}❌ Ошибка в конфигурации${NC}"
    nginx -t
fi

# Статистика nginx
echo -e "\n${YELLOW}📈 Статистика Nginx:${NC}"
if curl -s http://localhost/nginx_status > /dev/null 2>&1; then
    echo "Статистика доступна по адресу: http://localhost/nginx_status"
    echo "Активные соединения: $(curl -s http://localhost/nginx_status | grep 'Active connections' | awk '{print $3}')"
    echo "Принято соединений: $(curl -s http://localhost/nginx_status | grep 'server accepts handled requests' | awk '{print $3}')"
    echo "Обработано запросов: $(curl -s http://localhost/nginx_status | grep 'server accepts handled requests' | awk '{print $4}')"
else
    echo -e "${RED}❌ Статистика недоступна${NC}"
fi

# Анализ логов
echo -e "\n${YELLOW}📋 Анализ логов:${NC}"

# Последние ошибки
if [ -f "$NGINX_LOG_DIR/error.log" ]; then
    echo -e "\n${BLUE}🚨 Последние ошибки (последние 5):${NC}"
    tail -n 5 "$NGINX_LOG_DIR/error.log" | while read line; do
        echo "  $line"
    done
else
    echo -e "${RED}❌ Файл error.log не найден${NC}"
fi

# Статистика по кодам ответов
if [ -f "$NGINX_LOG_DIR/access.log" ]; then
    echo -e "\n${BLUE}📊 Статистика по кодам ответов (последние 100 запросов):${NC}"
    tail -n 100 "$NGINX_LOG_DIR/access.log" | awk '{print $9}' | sort | uniq -c | sort -nr | while read count code; do
        case $code in
            200) echo "  $count - $code (OK)";;
            301|302) echo "  $count - $code (Redirect)";;
            404) echo "  $count - $code (Not Found)";;
            500|502|503|504) echo "  $count - $code (Server Error)";;
            *) echo "  $count - $code";;
        esac
    done
else
    echo -e "${RED}❌ Файл access.log не найден${NC}"
fi

# Топ IP адресов
if [ -f "$NGINX_LOG_DIR/access.log" ]; then
    echo -e "\n${BLUE}🌐 Топ IP адресов (последние 100 запросов):${NC}"
    tail -n 100 "$NGINX_LOG_DIR/access.log" | awk '{print $1}' | sort | uniq -c | sort -nr | head -5 | while read count ip; do
        echo "  $count запросов с IP: $ip"
    done
fi

# Медленные запросы
if [ -f "$NGINX_LOG_DIR/performance.log" ]; then
    echo -e "\n${BLUE}🐌 Медленные запросы (>1 сек):${NC}"
    tail -n 100 "$NGINX_LOG_DIR/performance.log" | awk '$8 > 1 {print $8 "s - " $3 " " $4}' | sort -nr | head -5 | while read time request; do
        echo "  ${time} - $request"
    done
fi

# Блокированные запросы
if [ -f "$NGINX_LOG_DIR/security.log" ]; then
    echo -e "\n${BLUE}🚫 Блокированные запросы (последние 10):${NC}"
    tail -n 10 "$NGINX_LOG_DIR/security.log" | while read line; do
        echo "  $line"
    done
fi

# Проверка SSL сертификата
echo -e "\n${YELLOW}🔐 Проверка SSL сертификата:${NC}"
if command -v openssl > /dev/null 2>&1; then
    CERT_INFO=$(echo | openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SSL сертификат активен${NC}"
        echo "Информация о сертификате:"
        echo "$CERT_INFO" | while read line; do
            echo "  $line"
        done
    else
        echo -e "${RED}❌ Ошибка при проверке SSL${NC}"
    fi
else
    echo -e "${RED}❌ OpenSSL не установлен${NC}"
fi

# Проверка доступности сайта
echo -e "\n${YELLOW}🌐 Проверка доступности сайта:${NC}"
if curl -s -I "https://${DOMAIN}" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Сайт доступен по HTTPS${NC}"
    RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null "https://${DOMAIN}")
    echo "Время ответа: ${RESPONSE_TIME}с"
else
    echo -e "${RED}❌ Сайт недоступен по HTTPS${NC}"
fi

# Проверка HTTP редиректа
echo -e "\n${YELLOW}🔄 Проверка HTTP редиректа:${NC}"
HTTP_RESPONSE=$(curl -s -I "http://${DOMAIN}" 2>/dev/null | head -n 1)
if echo "$HTTP_RESPONSE" | grep -q "301\|302"; then
    echo -e "${GREEN}✅ HTTP редирект работает${NC}"
    echo "Ответ: $HTTP_RESPONSE"
else
    echo -e "${RED}❌ HTTP редирект не работает${NC}"
    echo "Ответ: $HTTP_RESPONSE"
fi

# Рекомендации
echo -e "\n${YELLOW}💡 Рекомендации:${NC}"
echo "1. Настройте ротацию логов: logrotate -f /etc/logrotate.d/nginx"
echo "2. Мониторьте логи в реальном времени: tail -f $NGINX_LOG_DIR/access.log"
echo "3. Проверяйте SSL сертификат: certbot certificates"
echo "4. Настройте мониторинг через cron: */5 * * * * /usr/local/bin/nginx-monitor.sh"

echo -e "\n${GREEN}✅ Мониторинг завершен${NC}"
