# 🚀 Настройка Nginx + Let's Encrypt для counterplus.ru

## 📋 Требования

- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- Домен `counterplus.ru` с настроенными DNS записями
- Root доступ к серверу

## 🔧 Установка Nginx

### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### CentOS/RHEL:

```bash
sudo yum install epel-release
sudo yum install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 🔐 Установка Let's Encrypt (Certbot)

### Ubuntu/Debian:

```bash
sudo apt install certbot python3-certbot-nginx
```

### CentOS/RHEL:

```bash
sudo yum install certbot python3-certbot-nginx
```

## 📁 Структура директорий

```bash
# Создаем директории
sudo mkdir -p /var/www/counterplus.ru/html
sudo mkdir -p /var/www/letsencrypt
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled
sudo mkdir -p /etc/nginx/conf.d

# Устанавливаем права
sudo chown -R www-data:www-data /var/www/counterplus.ru
sudo chown -R www-data:www-data /var/www/letsencrypt
sudo chmod -R 755 /var/www/counterplus.ru
sudo chmod -R 755 /var/www/letsencrypt
```

## ⚙️ Настройка Nginx

### 1. Основной конфиг (базовый)

```bash
# Копируем основной конфиг
sudo cp nginx.conf /etc/nginx/nginx.conf

# Проверяем конфигурацию
sudo nginx -t

# Перезагружаем nginx
sudo systemctl reload nginx
```

### 2. Продакшен конфиг (расширенный)

```bash
# Копируем расширенный продакшен конфиг
sudo cp nginx-production.conf /etc/nginx/nginx.conf

# Проверяем конфигурацию
sudo nginx -t

# Перезагружаем nginx
sudo systemctl reload nginx
```

### 3. Конфиг для Let's Encrypt

```bash
# Копируем конфиг для Let's Encrypt
sudo cp letsencrypt.conf /etc/nginx/sites-available/letsencrypt

# Создаем символическую ссылку
sudo ln -s /etc/nginx/sites-available/letsencrypt /etc/nginx/sites-enabled/

# Проверяем и перезагружаем
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Конфиг для мониторинга

```bash
# Копируем конфиг для мониторинга
sudo cp nginx-monitoring.conf /etc/nginx/conf.d/monitoring.conf

# Проверяем и перезагружаем
sudo nginx -t
sudo systemctl reload nginx
```

## 🎯 Получение SSL сертификата

### Первоначальное получение:

```bash
sudo certbot certonly --webroot \
  -w /var/www/letsencrypt \
  -d counterplus.ru \
  -d www.counterplus.ru \
  --email admin@counterplus.ru \
  --agree-tos \
  --no-eff-email
```

### Проверка сертификата:

```bash
sudo certbot certificates
```

## 🔄 Автоматическое обновление

### 1. Установка скрипта:

```bash
# Копируем скрипт
sudo cp renew-ssl.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/renew-ssl.sh

# Редактируем email в скрипте
sudo nano /usr/local/bin/renew-ssl.sh
```

### 2. Настройка cron:

```bash
# Открываем crontab
sudo crontab -e

# Добавляем строку для ежедневного обновления в 3:00
0 3 * * * /usr/local/bin/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1
```

### 3. Тестовый запуск:

```bash
sudo /usr/local/bin/renew-ssl.sh
```

## 📊 Мониторинг и анализ

### 1. Установка скрипта мониторинга:

```bash
# Копируем скрипт мониторинга
sudo cp nginx-monitor.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/nginx-monitor.sh

# Тестовый запуск
sudo /usr/local/bin/nginx-monitor.sh
```

### 2. Настройка автоматического мониторинга:

```bash
# Открываем crontab
sudo crontab -e

# Добавляем мониторинг каждые 5 минут
*/5 * * * * /usr/local/bin/nginx-monitor.sh >> /var/log/nginx-monitor.log 2>&1
```

### 3. Ротация логов:

```bash
# Создаем конфиг для logrotate
sudo nano /etc/logrotate.d/nginx

# Добавляем содержимое:
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

## 📱 Размещение файлов

### 1. Сборка проекта:

```bash
# В директории проекта
npm run build
```

### 2. Копирование на сервер:

```bash
# Копируем собранные файлы
sudo cp -r dist/* /var/www/counterplus.ru/html/

# Устанавливаем права
sudo chown -R www-data:www-data /var/www/counterplus.ru/html
sudo chmod -R 755 /var/www/counterplus.ru/html
```

## 🧪 Тестирование

### 1. Проверка HTTP редиректа:

```bash
curl -I http://counterplus.ru
# Должен вернуть 301 редирект на HTTPS
```

### 2. Проверка HTTPS:

```bash
curl -I https://counterplus.ru
# Должен вернуть 200 OK
```

### 3. Проверка SSL:

```bash
# Установка ssl-checker
sudo apt install openssl

# Проверка сертификата
openssl s_client -connect counterplus.ru:443 -servername counterplus.ru
```

### 4. Проверка мониторинга:

```bash
# Проверка статуса nginx
curl http://localhost/nginx_status

# Запуск скрипта мониторинга
sudo /usr/local/bin/nginx-monitor.sh
```

## 🔒 Безопасность

### 1. Firewall (UFW):

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2ban:

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Логирование:

```bash
# Просмотр логов nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/security.log
sudo tail -f /var/log/nginx/performance.log

# Просмотр логов SSL обновления
sudo tail -f /var/log/ssl-renewal.log

# Просмотр логов мониторинга
sudo tail -f /var/log/nginx-monitor.log
```

## 🚨 Устранение проблем

### 1. Ошибка "SSL certificate not found":

```bash
# Проверяем путь к сертификату
sudo ls -la /etc/letsencrypt/live/counterplus.ru/

# Перезапускаем nginx
sudo systemctl restart nginx
```

### 2. Ошибка "Permission denied":

```bash
# Проверяем права на директории
sudo chown -R www-data:www-data /var/www/counterplus.ru
sudo chmod -R 755 /var/www/counterplus.ru
```

### 3. Ошибка "nginx: configuration file test failed":

```bash
# Проверяем синтаксис
sudo nginx -t

# Просматриваем ошибки
sudo nginx -T | grep -A 10 -B 10 "error"
```

### 4. Проблемы с мониторингом:

```bash
# Проверяем права на скрипты
sudo chmod +x /usr/local/bin/nginx-monitor.sh
sudo chmod +x /usr/local/bin/renew-ssl.sh

# Проверяем логи
sudo tail -f /var/log/nginx-monitor.log
```

## 📊 Мониторинг

### 1. Статус сервисов:

```bash
sudo systemctl status nginx
sudo systemctl status certbot.timer
```

### 2. Проверка SSL:

```bash
# Автоматическая проверка
sudo certbot certificates

# Ручная проверка
sudo /usr/local/bin/renew-ssl.sh
```

### 3. Логи:

```bash
# Nginx логи
sudo journalctl -u nginx -f

# SSL обновления
sudo tail -f /var/log/ssl-renewal.log

# Мониторинг
sudo tail -f /var/log/nginx-monitor.log
```

## 🎉 Готово!

После выполнения всех шагов ваш сайт `counterplus.ru` будет:

- ✅ Работать по HTTPS
- ✅ Автоматически обновлять SSL сертификаты
- ✅ Иметь защиту от DDoS атак
- ✅ Оптимизирован для производительности
- ✅ Безопасен и соответствует современным стандартам
- ✅ Мониториться в реальном времени
- ✅ Логировать все подозрительные действия

## 🔗 Полезные ссылки

- [Let's Encrypt документация](https://letsencrypt.org/docs/)
- [Nginx документация](https://nginx.org/en/docs/)
- [SSL Labs тест](https://www.ssllabs.com/ssltest/)
- [Mozilla SSL Config Generator](https://ssl-config.mozilla.org/)

## 📁 Созданные файлы

1. **`nginx.conf`** - Базовый конфиг nginx
2. **`nginx-production.conf`** - Расширенный продакшен конфиг
3. **`letsencrypt.conf`** - Конфиг для Let's Encrypt
4. **`nginx-monitoring.conf`** - Конфиг для мониторинга
5. **`renew-ssl.sh`** - Скрипт обновления SSL
6. **`nginx-monitor.sh`** - Скрипт мониторинга
7. **`NGINX_SETUP.md`** - Данная инструкция
