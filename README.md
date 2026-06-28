# AquaUZ — Telegram Mini App

## 🚀 Запуск за 5 шагов

---

### Шаг 1 — Установить Node.js
Скачайте и установите: https://nodejs.org (кнопка LTS)

---

### Шаг 2 — Установить зависимости
Откройте эту папку в терминале (или командной строке) и выполните:

```bash
npm install
```

---

### Шаг 3 — Проверить локально (необязательно)

```bash
npm run dev
```

Откройте http://localhost:5173 — должно работать.

---

### Шаг 4 — Залить на GitHub и задеплоить на Vercel

**4.1** Зарегистрируйтесь на https://github.com

**4.2** Создайте новый репозиторий (кнопка "New" → назовите "aqua-uz" → Create)

**4.3** Выполните в терминале (в папке проекта):
```bash
git init
git add .
git commit -m "AquaUZ Mini App"
git remote add origin https://github.com/ВАШ_НИК/aqua-uz.git
git push -u origin main
```

**4.4** Зайдите на https://vercel.com → войдите через GitHub
→ "New Project" → выберите репозиторий aqua-uz → "Deploy"

Через 1-2 минуты получите ссылку вида:
`https://aqua-uz-xxxxxxx.vercel.app`

---

### Шаг 5 — Подключить к боту в BotFather

Напишите @BotFather в Telegram:

```
/mybots
```
→ Выберите вашего бота
→ Bot Settings
→ Menu Button
→ Edit Menu Button URL → вставьте вашу Vercel ссылку
→ Edit Menu Button Text → напишите: 🐠 Открыть магазин

Готово! Откройте бота и нажмите кнопку меню 🎉

---

## Что уже встроено в приложение

- ✅ `tg.ready()` — сообщает Telegram что приложение загрузилось
- ✅ `tg.expand()` — разворачивает на весь экран автоматически
- ✅ `tg.disableVerticalSwipes()` — отключает случайное закрытие свайпом
- ✅ Telegram SDK подключён в index.html
