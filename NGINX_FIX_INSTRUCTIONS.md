# 🔧 Исправление ошибки nginx "invalid number of map parameters"

## ❌ Проблема

Ошибка возникает из-за неправильного размещения директив в nginx конфигурации.

## ✅ Решение

### 1. Проверьте структуру конфигурации:

```bash
nginx -t
```

### 2. Основные правила размещения директив:

#### **В `http` блоке (разрешено):**

- `map`
- `limit_req_zone`
- `log_format`
- `gzip`
- Общие настройки

#### **В `server` блоке (разрешено):**

- `ssl_certificate`
- `root`
- `location`
- `add_header`

#### **В `location` блоке (разрешено):**

- `if` директивы
- `limit_req`
- `try_files`
- `expires`

### 3. Исправленная структура:

```nginx
http {
    # Rate limiting зоны
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # Блокировка ботов
    map $http_user_agent $bad_bot {
        default 0;
        ~* "masscan" 1;
        ~* "nmap" 1;
    }

    server {
        location / {
            if ($bad_bot = 1) {
                return 403;
            }
            limit_req zone=general burst=20 nodelay;
        }
    }
}
```

### 4. Частые ошибки:

#### **❌ Неправильно:**

```nginx
server {
    map $http_user_agent $bad_bot { ... }  # map в server блоке
}

location / {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;  # zone в location
}
```

#### **✅ Правильно:**

```nginx
http {
    map $http_user_agent $bad_bot { ... }  # map в http блоке
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;  # zone в http блоке
}

server {
    location / {
        limit_req zone=api burst=20 nodelay;  # limit_req в location
    }
}
```

## 🚀 Проверка и применение:

### 1. Проверка синтаксиса:

```bash
nginx -t
```

### 2. Если ошибок нет:

```bash
systemctl reload nginx
```

### 3. Если есть ошибки:

```bash
# Проверьте логи
tail -f /var/log/nginx/error.log

# Исправьте конфигурацию и повторите проверку
nginx -t
```

## 📋 Чек-лист исправления:

- [ ] `map` директива находится в `http` блоке
- [ ] `limit_req_zone` находится в `http` блоке
- [ ] `if` директивы находятся в `location` блоке
- [ ] `limit_req` находится в `location` блоке
- [ ] Все блоки правильно закрыты
- [ ] Синтаксис проверен командой `nginx -t`

---

**💡 Совет**: Используйте `nginx -t` после каждого изменения конфигурации!
