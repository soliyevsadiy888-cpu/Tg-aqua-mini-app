import React, { useState, useMemo, useRef, useEffect } from "react";

/* ============================================================
   AquaUZ — прототип
   Палитра: глубокий океан #08131F, бирюза #00C9B1, янтарь #F0A93C
   Шрифты (через систему): жирный display + лёгкий текст
   Сигнатурный элемент: "карта совместимости" — живой бейдж рыбы
   меняющий цвет в зависимости от того что уже лежит в корзине
   ============================================================ */

const REGIONS = [
  "Ташкент", "Самарканд", "Бухара", "Андижан", "Фергана", "Наманган",
  "Нукус", "Навои", "Джизак", "Сурхандарья", "Сырдарья", "Кашкадарья",
];

// Тарифы доставки по регионам (в сум)
const DELIVERY_RATES = {
  "Ташкент":      { price: 25000, time: "2–4 часа",     courier: "Азиз Р.",   phone: "+998 90 123 45 67", rating: 4.9, trips: 312 },
  "Самарканд":    { price: 80000, time: "1–2 дня",      courier: "Бобур Х.",  phone: "+998 91 234 56 78", rating: 4.8, trips: 201 },
  "Бухара":       { price: 95000, time: "1–2 дня",      courier: "Санжар К.", phone: "+998 93 345 67 89", rating: 4.7, trips: 178 },
  "Андижан":      { price: 85000, time: "1–2 дня",      courier: "Фарид М.",  phone: "+998 94 456 78 90", rating: 4.8, trips: 143 },
  "Фергана":      { price: 85000, time: "1–2 дня",      courier: "Улугбек Н.", phone: "+998 90 567 89 01", rating: 5.0, trips: 89 },
  "Наманган":     { price: 85000, time: "1–2 дня",      courier: "Жасур А.",  phone: "+998 91 678 90 12", rating: 4.9, trips: 112 },
  "Нукус":        { price: 150000, time: "2–3 дня",     courier: "Рустам О.", phone: "+998 93 789 01 23", rating: 4.6, trips: 67 },
  "Навои":        { price: 100000, time: "1–2 дня",     courier: "Дилшод Т.", phone: "+998 94 890 12 34", rating: 4.9, trips: 95 },
  "Джизак":       { price: 70000, time: "сегодня–завтра", courier: "Камол Ю.", phone: "+998 90 901 23 45", rating: 4.8, trips: 134 },
  "Сурхандарья":  { price: 130000, time: "2–3 дня",    courier: "Акбар С.",  phone: "+998 91 012 34 56", rating: 4.7, trips: 78 },
  "Сырдарья":     { price: 65000, time: "сегодня–завтра", courier: "Нодир Б.", phone: "+998 93 123 45 67", rating: 4.9, trips: 156 },
  "Кашкадарья":   { price: 110000, time: "2–3 дня",    courier: "Шухрат Р.", phone: "+998 94 234 56 78", rating: 4.8, trips: 102 },
};

// Живые статусы заказа
const ORDER_STATUSES = [
  { key: "accepted",  label: "Принят",      icon: "✅", desc: "Продавец получил заказ" },
  { key: "packed",    label: "Собирается",  icon: "📦", desc: "Упаковываем рыб в термопакет" },
  { key: "courier",   label: "У курьера",   icon: "🏍️", desc: "Курьер забрал заказ" },
  { key: "way",       label: "В пути",      icon: "🚚", desc: "Едет к вам" },
  { key: "delivered", label: "Доставлен",   icon: "🎉", desc: "Заказ получен" },
];

// Параметры совместимости (упрощённая модель для демо)
const FISH_DB = [
  {
    id: "guppy",
    type: "fish",
    name: "Гуппи «Огненный хвост»",
    latin: "Poecilia reticulata",
    price: 25000,
    rating: 4.9,
    reviews: 48,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: ["betta"],
    img: "🐠",
    color: "#F0A93C",
    badges: ["🌱 Легко", "🏠 Местная"],
    about: "Вырастает до 4 см — помещается на ладони. Живёт 3–5 лет при хорошем уходе. Мирная, дружит почти со всеми соседями.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Уже привыкла к местной воде — легко приживётся в вашем аквариуме.",
    pro: "pH 6.8–7.8 · dGH 8–12 · NH₃ 0 мг/л · мин. объём 40 л",
    minVolume: 40,
    goal: ["beauty", "pets", "breeding"],
    difficulty: "easy",
  },
  {
    id: "neon",
    type: "fish",
    name: "Неон «Голубая искра»",
    latin: "Paracheirodon innesi",
    price: 8000,
    rating: 4.8,
    reviews: 112,
    temp: [20, 26],
    temper: "peaceful",
    size: "small",
    origin: "import",
    avoid: ["betta"],
    img: "🐟",
    color: "#00C9B1",
    badges: ["🌱 Легко", "✈️ Привозная"],
    about: "Стайная рыбка, держать от 6 штук — иначе будет нервничать в одиночестве. Размер 3 см, живёт 4–6 лет.",
    origin_story: "🌏 Привезена из лучшего питомника Азии. Прошла 2 недели карантина — здоровая и готова к новому дому.",
    pro: "pH 5.5–7.5 · dGH 5–10 · NH₃ 0 мг/л · мин. объём 60 л (стайно)",
    minVolume: 60,
    goal: ["beauty", "pets"],
    difficulty: "easy",
  },
  {
    id: "betta",
    type: "fish",
    name: "Петушок «Королевский бархат»",
    latin: "Betta splendens",
    price: 45000,
    rating: 5.0,
    reviews: 31,
    temp: [24, 29],
    temper: "aggressive",
    size: "medium",
    origin: "local",
    avoid: ["guppy", "neon"],
    img: "👑",
    color: "#F0A93C",
    badges: ["👑 Для опытных", "❤️ Узнаёт хозяина"],
    about: "Гордая одиночная рыба — не любит соседей похожих на себя по форме хвоста. Живёт 2–4 года. Узнаёт хозяина и реагирует на палец у стекла.",
    origin_story: "🏠 Выращен у нас в Ташкенте, отдельно в своём сосуде — петушки не выносят тесноты с раннего возраста.",
    pro: "pH 6.0–7.5 · dGH 5–15 · NH₃ 0 мг/л · мин. объём 20 л (один)",
    minVolume: 20,
    goal: ["beauty", "pets"],
    difficulty: "medium",
  },
  {
    id: "ancistrus",
    type: "fish",
    name: "Анциструс «Чистильщик»",
    latin: "Ancistrus sp.",
    price: 20000,
    rating: 4.7,
    reviews: 19,
    temp: [22, 27],
    temper: "peaceful",
    size: "medium",
    origin: "local",
    avoid: [],
    img: "🐡",
    color: "#00C9B1",
    badges: ["🤝 Мирная", "🏠 Местная"],
    about: "Ваш помощник по чистоте — ест водоросли со стёкол. Размер до 12 см, живёт 8–10 лет — самая долгоживущая рыба в магазине.",
    origin_story: "🏠 Выращен у нас в Ташкенте. Привык к местной воде, адаптация — почти мгновенная.",
    pro: "pH 6.5–7.5 · dGH 6–14 · NH₃ 0 мг/л · мин. объём 80 л",
    minVolume: 80,
    goal: ["beauty", "pets"],
    difficulty: "easy",
  },
  {
    id: "molly",
    type: "fish",
    name: "Молли «Чёрный бархат»",
    latin: "Poecilia sphenops",
    price: 18000,
    rating: 4.6,
    reviews: 27,
    temp: [24, 28],
    temper: "peaceful",
    size: "small",
    origin: "import",
    avoid: [],
    img: "🐟",
    color: "#F0A93C",
    badges: ["🌱 Легко", "✈️ Привозная"],
    about: "Спокойная и неприхотливая, отлично смотрится с гуппи и неонами. Размер до 7 см, живёт 3–5 лет.",
    origin_story: "🌏 Привезена из питомника Таиланда. Прошла карантин 14 дней.",
    pro: "pH 7.0–8.5 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 60 л",
    minVolume: 60,
    goal: ["beauty", "pets", "breeding"],
    difficulty: "easy",
  },
  {
    id: "discus",
    type: "fish",
    name: "Дискус «Королевский»",
    latin: "Symphysodon sp.",
    price: 180000,
    rating: 5.0,
    reviews: 8,
    temp: [28, 30],
    temper: "peaceful",
    size: "large",
    origin: "import",
    avoid: [],
    img: "👑",
    color: "#00C9B1",
    badges: ["👑 Для опытных", "🔴 Редкая", "✈️ Привозная"],
    about: "Венец аквариумистики — крупная, благородная, требует тёплой воды. Размер до 20 см, живёт 10–15 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла усиленный 21-дневный карантин.",
    pro: "pH 6.0–7.0 · dGH 3–8 · NH₃ 0 мг/л · мин. объём 200 л",
    minVolume: 200,
    goal: ["beauty"],
    difficulty: "hard",
  },
  {
    id: "angelfish",
    type: "fish",
    name: "Скалярия «Серебряный парус»",
    latin: "Pterophyllum scalare",
    price: 55000,
    rating: 4.8,
    reviews: 22,
    temp: [24, 28],
    temper: "semi",
    size: "large",
    origin: "import",
    avoid: ["neon", "guppy"],
    img: "🦈",
    color: "#00C9B1",
    badges: ["👑 Для опытных", "🤝 Полумирная"],
    about: "Изящная и величественная — «королева аквариума». Может попробовать съесть мелких рыб типа неонов. Размер до 15 см, живёт 8–10 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла карантин 14 дней.",
    pro: "pH 6.5–7.5 · dGH 4–14 · NH₃ 0 мг/л · мин. объём 100 л",
    minVolume: 100,
    goal: ["beauty"],
    difficulty: "medium",
  },
  {
    id: "danio",
    type: "fish",
    name: "Данио «Зебра»",
    latin: "Danio rerio",
    price: 7000,
    rating: 4.7,
    reviews: 64,
    temp: [18, 26],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: [],
    img: "🐟",
    color: "#F0A93C",
    badges: ["🌱 Легко", "🏠 Местная", "🧒 Для детей"],
    about: "Очень активная и выносливая — отлично переносит перепады температуры, идеальна для первого аквариума. Размер 4 см, живёт 3–5 лет.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Одна из самых неприхотливых рыб в магазине.",
    pro: "pH 6.5–7.5 · dGH 5–12 · NH₃ 0 мг/л · мин. объём 40 л (стайно)",
    minVolume: 40,
    goal: ["beauty", "pets", "kids"],
    difficulty: "easy",
  },
  {
    id: "goldfish",
    type: "fish",
    name: "Золотая рыбка «Комета»",
    latin: "Carassius auratus",
    price: 22000,
    rating: 4.6,
    reviews: 41,
    temp: [16, 24],
    temper: "peaceful",
    size: "large",
    origin: "local",
    avoid: [],
    img: "🐠",
    color: "#F0A93C",
    badges: ["🌱 Легко", "🏠 Местная", "🧒 Для детей"],
    about: "Классика жанра — узнаёт хозяина, может жить и в холодной воде. Размер до 18 см, живёт 10–15 лет при хорошем уходе.",
    origin_story: "🏠 Выращена у нас в Ташкенте, легко приживается в любой воде региона.",
    pro: "pH 6.5–8.0 · dGH 8–18 · NH₃ 0 мг/л · мин. объём 80 л",
    minVolume: 80,
    goal: ["pets", "kids", "beauty"],
    difficulty: "easy",
  },
  {
    id: "clownloach",
    type: "fish",
    name: "Боция «Клоун»",
    latin: "Chromobotia macracanthus",
    price: 38000,
    rating: 4.9,
    reviews: 14,
    temp: [25, 29],
    temper: "peaceful",
    size: "medium",
    origin: "import",
    avoid: [],
    img: "🐡",
    color: "#00C9B1",
    badges: ["🤝 Мирная", "✈️ Привозная", "🔴 Редкая"],
    about: "Яркая полосатая рыба со своим характером — может «трещать» клешнями, когда радуется еде. Размер до 15 см, живёт 15–20 лет.",
    origin_story: "🌏 Привезена из питомника Индонезии. Прошла усиленный карантин 21 день.",
    pro: "pH 6.0–7.5 · dGH 5–12 · NH₃ 0 мг/л · мин. объём 150 л (стайно)",
    minVolume: 150,
    goal: ["beauty"],
    difficulty: "medium",
  },
  {
    id: "parrotcichlid",
    type: "fish",
    name: "Цихлида «Попугай»",
    latin: "Cichlasoma sp. (hybrid)",
    price: 65000,
    rating: 4.5,
    reviews: 17,
    temp: [25, 29],
    temper: "aggressive",
    size: "large",
    origin: "import",
    avoid: ["neon", "guppy", "danio", "molly"],
    img: "👑",
    color: "#F0A93C",
    badges: ["👑 Для опытных", "⚔️ Территориальная"],
    about: "Яркая, запоминающаяся форма тела, но территориальна — лучше держать без мелких соседей. Размер до 20 см, живёт 10–12 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла карантин 18 дней.",
    pro: "pH 6.5–7.5 · dGH 8–15 · NH₃ 0 мг/л · мин. объём 150 л",
    minVolume: 150,
    goal: ["beauty"],
    difficulty: "hard",
  },
];

// Оборудование, корм и растения — товары без AI-совместимости рыб,
// но с собственными значками и категориями
const EQUIPMENT_DB = [
  {
    id: "filter-internal",
    type: "equipment",
    name: "Фильтр внутренний «Поток-100»",
    price: 65000,
    rating: 4.7,
    reviews: 38,
    img: "⚙️",
    color: "#00C9B1",
    badges: ["🌱 Для новичков"],
    about: "Для аквариумов до 100 л. Тихая работа, лёгкая чистка губки раз в 2 недели.",
    pro: "Производительность 400 л/ч · 3 Вт · губчатый + угольный картридж",
  },
  {
    id: "filter-external",
    type: "equipment",
    name: "Фильтр внешний «Поток-300 Pro»",
    price: 220000,
    rating: 4.9,
    reviews: 12,
    img: "⚙️",
    color: "#F0A93C",
    badges: ["👑 Для больших аквариумов"],
    about: "Для аквариумов от 150 до 350 л. Многоступенчатая очистка, тихий мотор.",
    pro: "Производительность 1200 л/ч · 12 Вт · 4 ступени фильтрации",
  },
  {
    id: "heater",
    type: "equipment",
    name: "Обогреватель с термостатом",
    price: 65000,
    rating: 4.8,
    reviews: 51,
    img: "🌡️",
    color: "#00C9B1",
    badges: ["🌱 Для новичков"],
    about: "Автоматически держит заданную температуру — не нужно проверять каждый день.",
    pro: "100 Вт · диапазон 18–34°C · для 50–150 л",
  },
  {
    id: "compressor",
    type: "equipment",
    name: "Компрессор воздушный «Бриз-2»",
    price: 35000,
    rating: 4.6,
    reviews: 29,
    img: "💨",
    color: "#F0A93C",
    badges: ["🌱 Для новичков"],
    about: "Насыщает воду кислородом — важно для аквариумов с большим количеством рыб.",
    pro: "2 Вт · 2 выхода · для 50–200 л",
  },
  {
    id: "lamp-led",
    type: "equipment",
    name: "LED-светильник «Аквалюкс»",
    price: 95000,
    rating: 4.8,
    reviews: 17,
    img: "💡",
    color: "#00C9B1",
    badges: ["🌿 Для растений"],
    about: "Полный спектр — рыбы выглядят ярче, растения растут быстрее.",
    pro: "12 Вт · 6500K · крепление на борт аквариума",
  },
  {
    id: "substrate",
    type: "equipment",
    name: "Грунт питательный «Чёрная земля»",
    price: 28000,
    rating: 4.7,
    reviews: 22,
    img: "🪨",
    color: "#F0A93C",
    badges: ["🌿 Для растений"],
    about: "Питательная основа для живых растений — корни укореняются быстрее.",
    pro: "3 кг · фракция 1–3 мм · обогащён микроэлементами",
  },
];

const FOOD_DB = [
  {
    id: "food-flakes",
    type: "food",
    name: "Корм хлопья «Универсал»",
    price: 18000,
    rating: 4.8,
    reviews: 67,
    img: "🍽️",
    color: "#00C9B1",
    badges: ["🌱 Для всех мирных рыб"],
    about: "Сбалансированный корм для гуппи, неонов, данио и других мелких рыб.",
    pro: "100 г · протеин 32% · не мутит воду",
  },
  {
    id: "food-color",
    type: "food",
    name: "Корм «Цветной бустер»",
    price: 24000,
    rating: 4.7,
    reviews: 31,
    img: "🍽️",
    color: "#F0A93C",
    badges: ["✨ Усиление окраса"],
    about: "Натуральные каротиноиды — окрас рыб становится ярче через 2–3 недели.",
    pro: "80 г · с астаксантином · гранулы 1 мм",
  },
  {
    id: "food-pellets-bottom",
    type: "food",
    name: "Корм донный «Сомик»",
    price: 16000,
    rating: 4.6,
    reviews: 19,
    img: "🍽️",
    color: "#00C9B1",
    badges: ["🐡 Для донных рыб"],
    about: "Тонущие таблетки — специально для анциструсов, сомов и боций.",
    pro: "100 г · медленно растворяется · 36% протеин",
  },
  {
    id: "food-live-frozen",
    type: "food",
    name: "Мотыль замороженный",
    price: 12000,
    rating: 4.9,
    reviews: 44,
    img: "🧊",
    color: "#F0A93C",
    badges: ["👑 Для крупных и хищных"],
    about: "Высокобелковый живой корм — особенно любят цихлиды и дискусы.",
    pro: "100 г · упаковано порционно · хранить в морозилке",
  },
];

const PLANTS_DB = [
  {
    id: "plant-anubias",
    type: "plant",
    name: "Анубиас Нана",
    price: 22000,
    rating: 4.9,
    reviews: 26,
    img: "🌿",
    color: "#00C9B1",
    badges: ["🌱 Неприхотливое", "🏠 Местное"],
    about: "Растёт очень медленно — не нужно часто подрезать. Можно крепить на коряге или камне.",
    pro: "Свет: слабый-средний · CO₂: не обязателен · высота 5–15 см",
  },
  {
    id: "plant-vallisneria",
    type: "plant",
    name: "Валлиснерия спиральная",
    price: 9000,
    rating: 4.7,
    reviews: 33,
    img: "🌱",
    color: "#F0A93C",
    badges: ["🌱 Неприхотливое", "🏠 Местное"],
    about: "Быстро размножается усами — хорошо насыщает воду кислородом днём.",
    pro: "Свет: средний · CO₂: не обязателен · высота 20–60 см",
  },
  {
    id: "plant-cryptocoryne",
    type: "plant",
    name: "Криптокорина Вендта",
    price: 18000,
    rating: 4.8,
    reviews: 15,
    img: "🍃",
    color: "#00C9B1",
    badges: ["🌱 Неприхотливое"],
    about: "Создаёт естественный «лесной» вид на переднем плане аквариума.",
    pro: "Свет: слабый-средний · CO₂: не обязателен · высота 10–20 см",
  },
  {
    id: "plant-moss",
    type: "plant",
    name: "Яванский мох (порция)",
    price: 14000,
    rating: 4.9,
    reviews: 21,
    img: "🌿",
    color: "#F0A93C",
    badges: ["🌱 Неприхотливое", "🐣 Для мальков"],
    about: "Укрытие для мальков и креветок, можно крепить на декор и коряги.",
    pro: "Свет: слабый · CO₂: не обязателен · покрывает до 10×10 см",
  },
];

const ALL_PRODUCTS = [...FISH_DB, ...EQUIPMENT_DB, ...FOOD_DB, ...PLANTS_DB];

const TYPE_TABS = [
  { id: "fish", icon: "🐠", label: "Рыбы" },
  { id: "equipment", icon: "⚙️", label: "Оборудование" },
  { id: "food", icon: "🍽️", label: "Корм" },
  { id: "plant", icon: "🌿", label: "Растения" },
];

const CATEGORIES = [
  { id: "all", label: "Все" },
  { id: "peaceful", label: "Мирные" },
  { id: "aggressive", label: "Хищники" },
  { id: "kids", label: "Для детей" },
  { id: "local", label: "Местные" },
  { id: "import", label: "Привозные" },
];

function formatSum(n) {
  return n.toLocaleString("ru-RU") + " сум";
}

function checkCompatibility(fish, cartItems) {
  if (fish.type !== "fish") return { level: "ok", reason: null }; // совместимость считаем только для рыб
  const fishOnlyCart = cartItems.filter((i) => i.type === "fish");
  if (fishOnlyCart.length === 0) return { level: "ok", reason: null };
  for (const item of fishOnlyCart) {
    if (fish.avoid.includes(item.id) || item.avoid.includes(fish.id)) {
      return { level: "bad", reason: `Не уживается с «${item.name.split(" ")[0]}» — разный темперамент` };
    }
    const overlap =
      Math.max(fish.temp[0], item.temp[0]) <= Math.min(fish.temp[1], item.temp[1]);
    if (!overlap) {
      return { level: "warn", reason: `Разная температура воды с «${item.name.split(" ")[0]}»` };
    }
  }
  return { level: "ok", reason: null };
}

/* ---------- Доверие: остаток в наличии + текстовые отзывы ----------
   Детерминированная "псевдо-БД" остатков и отзывов на основе id товара,
   чтобы не переписывать вручную все 126 позиций FISH_DB. */
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function getStock(fish) {
  const h = hashStr(fish.id);
  // Редкие/дорогие/премиум товары — меньше остатков, обычные — больше
  const base = fish.price > 100000 ? 4 : fish.price > 40000 ? 9 : 16;
  const stock = 1 + (h % base);
  return stock;
}

const REVIEW_NAMES = [
  ["Дилноза", "Ташкент"], ["Жасур", "Самарканд"], ["Малика", "Фергана"],
  ["Бахтиёр", "Бухара"], ["Севара", "Андижан"], ["Отабек", "Наманган"],
  ["Гулноза", "Ташкент"], ["Шерзод", "Джизак"], ["Камила", "Навои"],
  ["Тимур", "Ташкент"], ["Зарина", "Нукус"], ["Фаррух", "Сырдарья"],
];

const REVIEW_TEMPLATES_FISH = [
  (f) => `Привезли живую и активную, упаковка с кислородом — доехала отлично. ${f.name.split(" ")[0]} прижилась за пару дней.`,
  (f) => `Боялась заказывать рыбу онлайн, но всё прошло гладко. Курьер аккуратно передал пакет, рыбка здорова.`,
  (f) => `Брал по совету продавца-консультанта в чате — подошла идеально под мой объём аквариума. Рекомендую.`,
  (f) => `Уже вторая покупка в AquaUZ. Качество стабильное, рыбы крепкие, без признаков болезней.`,
  (f) => `Чуть переживал по температуре в дороге летом, но термопакет справился — вода была тёплая, рыба бодрая.`,
];

const REVIEW_TEMPLATES_GOODS = [
  (f) => `Работает именно так, как описано. Установка простая, инструкция понятная.`,
  (f) => `Цена ниже, чем в обычных зоомагазинах, а качество не хуже. Буду заказывать ещё.`,
  (f) => `Доставили быстро, упаковка целая. Пользуюсь уже месяц — никаких проблем.`,
];

function getReviewsList(fish) {
  const h = hashStr(fish.id);
  const templates = fish.type === "fish" ? REVIEW_TEMPLATES_FISH : REVIEW_TEMPLATES_GOODS;
  const count = Math.min(fish.reviews || 3, 3) || 3;
  const list = [];
  for (let i = 0; i < count; i++) {
    const nameIdx = (h + i * 7) % REVIEW_NAMES.length;
    const tplIdx = (h + i * 13) % templates.length;
    const ratingPool = [5, 5, 4, 5];
    const rating = ratingPool[(h + i * 3) % ratingPool.length];
    const [name, city] = REVIEW_NAMES[nameIdx];
    list.push({
      name, city, rating,
      text: templates[tplIdx](fish),
    });
  }
  return list;
}

/* ---------- Bubbles background ---------- */
function Bubbles({ count = 14 }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 10,
      })),
    [count]
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {bubbles.map((b) => (
        <span
          key={b.id}
          style={{
            position: "absolute",
            left: `${b.left}%`,
            bottom: "-20px",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "rgba(0,201,177,0.18)",
            border: "1px solid rgba(0,201,177,0.35)",
            animation: `floatUp ${b.duration}s linear ${b.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- Toast ---------- */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 84,
        left: "50%",
        transform: "translateX(-50%)",
        background: toast.type === "bad" ? "#3A1414" : "#0F2A26",
        border: `1px solid ${toast.type === "bad" ? "#FF6B6B" : "#00C9B1"}`,
        color: "#E8F4F8",
        padding: "10px 16px",
        borderRadius: 12,
        fontSize: 14,
        zIndex: 200,
        maxWidth: "88%",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        animation: "toastIn 0.25s ease-out",
      }}
    >
      {toast.text}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   🏠 ЛЕНДИНГ — главная страница AquaUZ
   ============================================================ */
function Landing({ onEnter }) {
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const features = [
    { icon: "🐠", title: "300+ видов рыб", desc: "Гуппи, неоны, дискусы, скалярии — местные и привозные из лучших питомников Азии" },
    { icon: "🚚", title: "Доставка сегодня", desc: "По Ташкенту за 2–4 часа. В регионы — 1–3 дня. Курьеры с термопакетами" },
    { icon: "✅", title: "Гарантия 48 часов", desc: "Если рыба не прижилась — вернём деньги или заменим. Без вопросов" },
    { icon: "🩺", title: "AI-доктор рыб", desc: "Опишите симптомы — AI поставит диагноз и подберёт лечение прямо в приложении" },
    { icon: "🔬", title: "Карта совместимости", desc: "Умная система покажет, уживутся ли рыбы в одном аквариуме перед покупкой" },
    { icon: "📔", title: "Дневник аквариума", desc: "Ведите записи ухода, получайте напоминания о смене воды и чистке фильтра" },
  ];

  const testimonials = [
    { name: "Анвар Т.", city: "Ташкент", text: "Заказал дискусов — привезли живых и здоровых за 3 часа. Упаковка на высоте!", stars: 5 },
    { name: "Малика Р.", city: "Самарканд", text: "AI-конфигуратор подобрал идеальный набор для моего 120-литрового аквариума. Всё совместимо!", stars: 5 },
    { name: "Ботир С.", city: "Андижан", text: "Петушок «Королевский бархат» — просто красавец. Уже узнаёт меня у стекла 🐠", stars: 5 },
  ];

  const stats = [
    { value: "2 400+", label: "довольных покупателей" },
    { value: "300+", label: "видов рыб" },
    { value: "12", label: "регионов Узбекистана" },
    { value: "48 ч", label: "гарантия здоровья" },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "#08131F",
        color: "#E8F4F8",
        overflowY: "auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ---- Sticky nav ---- */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(8,19,31,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1C3A4A" : "1px solid transparent",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🐠</span>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: "#00C9B1" }}>AquaUZ</span>
        </div>
        <button
          onClick={onEnter}
          style={{
            background: "#00C9B1", color: "#08131F", border: "none",
            borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(0,201,177,0.3)",
          }}
        >
          Открыть магазин →
        </button>
      </nav>

      {/* ---- HERO ---- */}
      <div style={{ position: "relative", overflow: "hidden", padding: "60px 24px 70px", textAlign: "center" }}>
        <Bubbles count={20} />

        {/* глубоководное свечение */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, #00C9B122 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            background: "#00C9B122", border: "1px solid #00C9B144",
            borderRadius: 999, padding: "5px 14px",
            fontSize: 12, fontWeight: 700, color: "#00C9B1",
            letterSpacing: 1, textTransform: "uppercase",
            marginBottom: 22,
          }}>
            🇺🇿 Доставка по всему Узбекистану
          </div>

          <h1 style={{
            fontSize: 38, fontWeight: 900, lineHeight: 1.15,
            letterSpacing: "-0.03em", margin: "0 0 16px",
            fontFamily: "Georgia, serif",
          }}>
            Живые рыбы —<br />
            <span style={{
              background: "linear-gradient(90deg, #00C9B1, #4DE8D5)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              прямо к вашей двери
            </span>
          </h1>

          <p style={{
            fontSize: 15.5, color: "#9FC4CC", lineHeight: 1.65,
            maxWidth: 320, margin: "0 auto 32px",
          }}>
            Первый онлайн-магазин аквариумных рыб в Узбекистане.
            Местные и привозные рыбы, корм и оборудование — с доставкой сегодня.
          </p>

          <button
            onClick={onEnter}
            style={{
              background: "linear-gradient(135deg, #00C9B1, #00A896)",
              color: "#08131F", border: "none",
              borderRadius: 14, padding: "15px 40px",
              fontSize: 16, fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,201,177,0.4)",
              letterSpacing: "-0.01em",
              display: "block", margin: "0 auto 14px",
            }}
          >
            🐠 Выбрать рыбу
          </button>
          <div style={{ fontSize: 12, color: "#6C8E96" }}>Бесплатно · Без регистрации</div>
        </div>
      </div>

      {/* ---- РЫБЫ-превью (живая витрина) ---- */}
      <div style={{ padding: "0 16px 48px", overflow: "hidden" }}>
        <div style={{
          display: "flex", gap: 10, overflowX: "auto",
          paddingBottom: 8, scrollbarWidth: "none",
        }}>
          {[
            { name: "Гуппи «Огненный хвост»", price: "25 000 сум", img: "🐠", color: "#F0A93C", badge: "🏠 Местная" },
            { name: "Неон «Голубая искра»",    price: "8 000 сум",  img: "🐟", color: "#00C9B1", badge: "⭐ Хит продаж" },
            { name: "Петушок «Бархат»",        price: "45 000 сум", img: "👑", color: "#F0A93C", badge: "❤️ Узнаёт хозяина" },
            { name: "Дискус «Королевский»",    price: "180 000 сум",img: "👑", color: "#00C9B1", badge: "🔴 Редкая" },
            { name: "Скалярия «Парус»",        price: "55 000 сум", img: "🦈", color: "#00C9B1", badge: "✈️ Привозная" },
            { name: "Данио «Зебра»",           price: "7 000 сум",  img: "🐟", color: "#F0A93C", badge: "🧒 Для детей" },
          ].map((fish, i) => (
            <div
              key={i}
              onClick={onEnter}
              style={{
                flex: "0 0 130px",
                background: "#0E2030",
                border: "1px solid #1C3A4A",
                borderRadius: 16, padding: "14px 10px 12px",
                cursor: "pointer", textAlign: "center",
              }}
            >
              <div style={{
                fontSize: 40, marginBottom: 8,
                background: `radial-gradient(circle, ${fish.color}22, transparent 70%)`,
                borderRadius: 12, padding: "10px 0",
              }}>{fish.img}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{fish.name}</div>
              <div style={{ fontSize: 10, background: "#102433", color: "#9FC4CC", borderRadius: 6, padding: "2px 6px", marginBottom: 6 }}>{fish.badge}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#F0A93C" }}>от {fish.price}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#6C8E96", textAlign: "center", marginTop: 10 }}>← прокрутите, чтобы увидеть больше</div>
      </div>

      {/* ---- STATS ---- */}
      <div style={{
        margin: "0 16px 48px",
        background: "#0E2030",
        border: "1px solid #1C3A4A",
        borderRadius: 20, padding: "24px 16px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#00C9B1", letterSpacing: "-0.03em" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6C8E96", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ---- ФИЧИ ---- */}
      <div style={{ padding: "0 16px 48px" }}>
        <div style={{ fontSize: 11, color: "#00C9B1", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Возможности</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          Всё что нужно<br />аквариумисту
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "#0E2030", border: "1px solid #1C3A4A",
              borderRadius: 16, padding: "16px",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <div style={{
                width: 44, height: 44, flexShrink: 0,
                background: "#102433", border: "1px solid #1C3A4A",
                borderRadius: 12, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12.5, color: "#6C8E96", lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- КАК ЭТО РАБОТАЕТ ---- */}
      <div style={{ padding: "0 16px 48px" }}>
        <div style={{ fontSize: 11, color: "#00C9B1", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Процесс</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          Рыба дома<br />за 4 шага
        </h2>
        {[
          { step: "01", title: "Выберите город",        desc: "Укажите регион — покажем актуальные цены доставки и время" },
          { step: "02", title: "Подберите рыб",         desc: "AI проверит совместимость. Можно добавить корм и оборудование" },
          { step: "03", title: "Оформите заказ",        desc: "Укажите адрес и время — курьер свяжется с вами перед выездом" },
          { step: "04", title: "Получите живых рыб",    desc: "Термопакет, инструкция по запуску в аквариум — всё включено" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              background: "#00C9B122", border: "1px solid #00C9B144",
              borderRadius: 10, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#00C9B1",
            }}>{s.step}</div>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "#6C8E96", lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- ОТЗЫВЫ ---- */}
      <div style={{ padding: "0 16px 48px" }}>
        <div style={{ fontSize: 11, color: "#00C9B1", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Отзывы</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          Что говорят<br />покупатели
        </h2>
        {testimonials.map((t, i) => (
          <div key={i} style={{
            background: "#0E2030", border: "1px solid #1C3A4A",
            borderRadius: 16, padding: "16px", marginBottom: 12,
          }}>
            <div style={{ fontSize: 15, marginBottom: 8, letterSpacing: 2 }}>{"⭐".repeat(t.stars)}</div>
            <div style={{ fontSize: 13.5, color: "#C9DEE2", lineHeight: 1.6, marginBottom: 12 }}>
              «{t.text}»
            </div>
            <div style={{ fontSize: 12, color: "#6C8E96" }}>
              <strong style={{ color: "#9FC4CC" }}>{t.name}</strong> · {t.city}
            </div>
          </div>
        ))}
      </div>

      {/* ---- WOW — делает приложение незабываемым ---- */}
      <div style={{ padding: "0 16px 48px" }}>
        <div style={{ fontSize: 11, color: "#F0A93C", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>WOW</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          Делает приложение<br />незабываемым
        </h2>
        {[
          {
            tag: "WOW",
            icon: "🗺️",
            title: "Визуализация аквариума",
            desc: "Схема аквариума с кружками рыб из корзины. Красные стрелки — конфликты, зелёные — дружба.",
            metric: "📸 Главная фича для соцсетей",
            color: "#F0A93C",
          },
          {
            tag: "WOW",
            icon: "⚖️",
            title: "Сравнение рыб",
            desc: "Кнопка «Сравнить» на карточке → таблица рядом: температура, размер, сложность, цена.",
            metric: "🎯 Помогает выбрать между похожими",
            color: "#F0A93C",
          },
          {
            tag: "WOW",
            icon: "📸",
            title: "«Посмотреть в моём аквариуме»",
            desc: "Кнопка на карточке рыбы — камера + анимация рыбки поверх видео. Демо без реального AR.",
            metric: "🔥 Вирусный контент",
            color: "#F0A93C",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: "#0E2030",
              border: "1px solid #1C3A4A",
              borderRadius: 18, padding: "18px",
              marginBottom: 12, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${card.color}, transparent)`,
              borderRadius: "18px 18px 0 0",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                background: card.color + "22", border: `1px solid ${card.color}44`,
                borderRadius: 12, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 20,
              }}>{card.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "inline-block",
                  background: card.color + "22", border: `1px solid ${card.color}44`,
                  borderRadius: 999, padding: "2px 10px",
                  fontSize: 10, fontWeight: 700, color: card.color,
                  letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6,
                }}>{card.tag}</div>
                <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 5, lineHeight: 1.35 }}>{card.title}</div>
                <div style={{ fontSize: 12.5, color: "#8BABB5", lineHeight: 1.6, marginBottom: 10 }}>{card.desc}</div>
                <div style={{
                  fontSize: 12, color: card.color,
                  background: card.color + "11",
                  borderRadius: 8, padding: "5px 10px", fontWeight: 600,
                }}>{card.metric}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- UX — убрать трение ---- */}
      <div style={{ padding: "0 16px 48px" }}>
        <div style={{ fontSize: 11, color: "#9FC4CC", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>UX</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          Убрать трение<br />на каждом шаге
        </h2>
        {[
          { icon: "🔍", title: "Поиск с автодополнением", desc: "Выпадающий список с эмодзи и ценой при вводе — включая латинские названия.", metric: "⏱ −5 секунд на поиск" },
          { icon: "💬", title: "Чат-поддержка", desc: "Плавающая кнопка → AI отвечает на вопросы. «Как держать дискуса?» «Когда привезут?»", metric: "🛒 Меньше брошенных корзин" },
          { icon: "🪣", title: "Фильтр по объёму аквариума", desc: "Слайдер «мой аквариум — 60 л». Каталог показывает только рыб, которые туда влезут.", metric: "✅ Меньше ошибок при покупке" },
          { icon: "↕️", title: "Сортировка каталога", desc: "По цене, рейтингу, новинкам, популярности. Сейчас порядок фиксированный.", metric: "🎯 Быстрее находят нужное" },
          { icon: "📋", title: "«Пока везут» — инструкция", desc: "После заказа показываем что подготовить: температура воды, карантин, первое кормление.", metric: "🐠 Меньше гибели рыб → меньше возвратов" },
          { icon: "💰", title: "Фильтр по цене", desc: "Слайдер min-max. Клиент с бюджетом 50 000 сум видит только подходящее.", metric: "⚡ Быстрее решение о покупке" },
        ].map((card, i) => (
          <div key={i} style={{
            background: "#0E2030", border: "1px solid #1C3A4A",
            borderRadius: 16, padding: "14px", marginBottom: 10,
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <div style={{
              width: 38, height: 38, flexShrink: 0,
              background: "#102433", border: "1px solid #1C3A4A",
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>{card.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-block", background: "#9FC4CC22", border: "1px solid #9FC4CC33", borderRadius: 999, padding: "1px 8px", fontSize: 9, fontWeight: 700, color: "#9FC4CC", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 }}>UX</div>
              <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 4, lineHeight: 1.3 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: "#8BABB5", lineHeight: 1.55, marginBottom: 8 }}>{card.desc}</div>
              <div style={{ fontSize: 11.5, color: "#9FC4CC", background: "#9FC4CC11", borderRadius: 7, padding: "4px 9px", fontWeight: 600 }}>{card.metric}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- ДОВЕРИЕ — критично для живого товара ---- */}
      <div style={{ padding: "0 16px 48px" }}>
        <div style={{ fontSize: 11, color: "#00C9B1", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Доверие</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          Критично для<br />живого товара
        </h2>
        {[
          {
            tag: "Доверие",
            title: "Отзывы на карточке рыбы",
            desc: "Рейтинг уже есть, но нет текстов. Нужны 3–5 отзывов с именем и городом.",
            metric: "⭐ +20% к конверсии в корзину",
            color: "#00C9B1",
            icon: "💬",
            action: "Оставить отзыв",
          },
          {
            tag: "Доверие",
            title: "Страница «Как мы работаем»",
            desc: "Карантин, упаковка с кислородом, термопакет, видеофиксация — с фото и иллюстрациями.",
            metric: "🛡️ Снимает страх первой покупки",
            color: "#00C9B1",
            icon: "📦",
            action: "Посмотреть процесс",
          },
          {
            tag: "Доверие",
            title: "Остаток в наличии",
            desc: "«Осталось 3 шт» создаёт срочность и честность. «Под заказ» управляет ожиданиями.",
            metric: "😌 Меньше разочарований",
            color: "#00C9B1",
            icon: "🔢",
            action: "Смотреть в каталоге",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: "#0E2030",
              border: "1px solid #1C3A4A",
              borderRadius: 18,
              padding: "18px",
              marginBottom: 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* фоновый акцент */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${card.color}, transparent)`,
              borderRadius: "18px 18px 0 0",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                background: card.color + "22",
                border: `1px solid ${card.color}44`,
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>{card.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "inline-block",
                  background: card.color + "22", border: `1px solid ${card.color}44`,
                  borderRadius: 999, padding: "2px 10px",
                  fontSize: 10, fontWeight: 700, color: card.color,
                  letterSpacing: 0.5, textTransform: "uppercase",
                  marginBottom: 6,
                }}>{card.tag}</div>
                <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 5, lineHeight: 1.35 }}>{card.title}</div>
                <div style={{ fontSize: 12.5, color: "#8BABB5", lineHeight: 1.6, marginBottom: 10 }}>{card.desc}</div>
                <div style={{
                  fontSize: 12, color: card.color,
                  background: card.color + "11",
                  borderRadius: 8, padding: "5px 10px",
                  fontWeight: 600,
                }}>{card.metric}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- CTA финальный ---- */}
      <div style={{
        margin: "0 16px 0",
        background: "linear-gradient(135deg, #0E2A26, #091A14)",
        border: "1px solid #00C9B133",
        borderRadius: 24, padding: "36px 24px",
        textAlign: "center", marginBottom: 40,
        position: "relative", overflow: "hidden",
      }}>
        <Bubbles count={8} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐠</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>
            Готовы выбрать<br />своих рыб?
          </h2>
          <p style={{ fontSize: 13.5, color: "#9FC4CC", margin: "0 0 24px", lineHeight: 1.6 }}>
            AI подберёт совместимых жителей,<br />курьер привезёт сегодня.
          </p>
          <button
            onClick={onEnter}
            style={{
              background: "linear-gradient(135deg, #00C9B1, #00A896)",
              color: "#08131F", border: "none",
              borderRadius: 14, padding: "15px 40px",
              fontSize: 16, fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,201,177,0.4)",
              display: "block", margin: "0 auto 12px",
            }}
          >
            Открыть магазин →
          </button>
          <div style={{ fontSize: 11.5, color: "#6C8E96" }}>Бесплатно · 300+ видов рыб · Доставка сегодня</div>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <div style={{ padding: "24px 20px 32px", borderTop: "1px solid #1C3A4A", textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#00C9B1", marginBottom: 6 }}>🐠 AquaUZ</div>
        <div style={{ fontSize: 12, color: "#6C8E96", lineHeight: 1.7 }}>
          Первый онлайн-магазин аквариумных рыб Узбекистана<br />
          Работаем ежедневно с 08:00 до 22:00<br />
          📍 Ташкент и 11 регионов
        </div>
      </div>
    </div>
  );
}

/* ---------- Welcome screen ---------- */
function Welcome({ onNext }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0E2235 0%, #08131F 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        color: "#E8F4F8",
      }}
    >
      <Bubbles count={16} />
      <div style={{ fontSize: 56, marginBottom: 8, animation: "swim 3s ease-in-out infinite" }}>🐠</div>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          margin: "8px 0 6px",
          fontFamily: "Georgia, serif",
        }}
      >
        AquaUZ
      </h1>
      <p style={{ fontSize: 15, color: "#9FC4CC", maxWidth: 280, lineHeight: 1.5, marginBottom: 28 }}>
        Живые рыбы. Честные цены.<br />Доставка сегодня.
      </p>

      <div style={{ display: "flex", gap: 18, marginBottom: 36 }}>
        {[
          ["✅", "Гарантия", "48 часов"],
          ["🚚", "Доставка", "по городу"],
          ["🐠", "300+", "видов рыб"],
        ].map(([icon, t, s]) => (
          <div key={t} style={{ width: 84 }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{t}</div>
            <div style={{ fontSize: 11, color: "#6C8E96" }}>{s}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        style={{
          background: "#00C9B1",
          color: "#08131F",
          border: "none",
          borderRadius: 14,
          padding: "14px 36px",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,201,177,0.35)",
        }}
      >
        Выбрать рыбу →
      </button>

      <style>{`
        @keyframes swim {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(8px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}

/* ---------- City picker ---------- */
function CityPicker({ onSelect }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08131F",
        color: "#E8F4F8",
        padding: "48px 20px 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Вы из какого города?</h2>
        <p style={{ fontSize: 13, color: "#6C8E96", marginTop: 6 }}>
          Покажем рыб с быстрой и дешёвой доставкой именно у вас
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => onSelect(r)}
            style={{
              background: "#102433",
              border: "1px solid #1C3A4A",
              color: "#E8F4F8",
              borderRadius: 12,
              padding: "14px 10px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   WOW-ФИЧА 1: Визуализация аквариума
   Схема с кружками рыб, красные стрелки — конфликты, зелёные — дружба
   ============================================================ */
function AquariumVisualizer({ cart, allFish }) {
  const [open, setOpen] = useState(false);
  const fishInCart = useMemo(() => {
    const seen = {};
    return cart.filter(f => f.type === "fish").filter(f => {
      if (seen[f.id]) return false;
      seen[f.id] = true;
      return true;
    });
  }, [cart]);

  if (fishInCart.length < 2) return null;

  // Compute all pairs
  const pairs = [];
  for (let i = 0; i < fishInCart.length; i++) {
    for (let j = i + 1; j < fishInCart.length; j++) {
      const a = fishInCart[i], b = fishInCart[j];
      const compat = checkCompatibility(a, [b]);
      pairs.push({ a, b, level: compat.level, reason: compat.reason });
    }
  }

  const badCount = pairs.filter(p => p.level === "bad").length;
  const warnCount = pairs.filter(p => p.level === "warn").length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          marginBottom: 12,
          display: "flex", alignItems: "center", gap: 10,
          background: badCount > 0 ? "linear-gradient(90deg, #2A1010, #102433)"
            : warnCount > 0 ? "linear-gradient(90deg, #1E1A08, #102433)"
            : "linear-gradient(90deg, #071C14, #102433)",
          border: `1px solid ${badCount > 0 ? "#FF6B6B" : warnCount > 0 ? "#F0A93C" : "#00C9B1"}`,
          borderRadius: 14, padding: "11px 14px",
          color: "#E8F4F8", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22 }}>🗺️</span>
        <span style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            Карта аквариума · {fishInCart.length} вид{fishInCart.length > 1 ? "а" : ""}
          </div>
          <div style={{ fontSize: 11, color: badCount > 0 ? "#FF6B6B" : warnCount > 0 ? "#F0A93C" : "#00C9B1", marginTop: 1 }}>
            {badCount > 0 ? `⚠️ ${badCount} конфликт${badCount > 1 ? "а" : ""}` : warnCount > 0 ? `🟡 ${warnCount} предупреждение` : "✅ Все совместимы — отличный аквариум!"}
          </div>
        </span>
        <span style={{ color: "#6C8E96", fontSize: 16 }}>→</span>
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(5,10,16,0.85)",
          zIndex: 160, display: "flex", alignItems: "flex-end",
        }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#0B1B28", width: "100%", maxHeight: "80vh",
            borderRadius: "20px 20px 0 0", padding: "20px 18px 32px",
            overflowY: "auto", color: "#E8F4F8",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>🗺️ Карта совместимости</div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            {/* Аквариум-схема */}
            <div style={{
              background: "linear-gradient(180deg, #051828 0%, #071E2A 100%)",
              border: "2px solid #1C3A4A", borderRadius: 16,
              padding: 20, marginBottom: 20, position: "relative",
              minHeight: 160,
            }}>
              {/* Пузырики */}
              {[20,45,70].map(l => (
                <div key={l} style={{
                  position: "absolute", bottom: 10, left: `${l}%`,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "rgba(0,201,177,0.2)", border: "1px solid rgba(0,201,177,0.4)",
                  animation: "floatUp 4s linear infinite",
                  animationDelay: `${l/40}s`,
                }} />
              ))}
              {/* Рыбы в ряд */}
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative", zIndex: 1 }}>
                {fishInCart.map((fish, idx) => {
                  const hasConflict = pairs.some(p => (p.a.id === fish.id || p.b.id === fish.id) && p.level === "bad");
                  const hasWarn = !hasConflict && pairs.some(p => (p.a.id === fish.id || p.b.id === fish.id) && p.level === "warn");
                  return (
                    <div key={fish.id} style={{ textAlign: "center" }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: `radial-gradient(circle, ${fish.color}33, ${fish.color}11)`,
                        border: `2px solid ${hasConflict ? "#FF6B6B" : hasWarn ? "#F0A93C" : "#00C9B1"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 28, margin: "0 auto 4px",
                        boxShadow: `0 0 12px ${hasConflict ? "#FF6B6B44" : hasWarn ? "#F0A93C44" : "#00C9B144"}`,
                      }}>{fish.img}</div>
                      <div style={{ fontSize: 9, color: "#9FC4CC", maxWidth: 60, lineHeight: 1.2 }}>
                        {fish.name.split(" ")[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Пары */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6C8E96", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Совместимость пар
            </div>
            {pairs.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: p.level === "bad" ? "#1A0A0A" : p.level === "warn" ? "#1A1500" : "#071C14",
                border: `1px solid ${p.level === "bad" ? "#FF6B6B33" : p.level === "warn" ? "#F0A93C33" : "#00C9B133"}`,
                borderRadius: 10, padding: "10px 12px", marginBottom: 8,
              }}>
                <span style={{ fontSize: 20 }}>{p.a.img}</span>
                <span style={{ fontSize: 14, color: p.level === "bad" ? "#FF6B6B" : p.level === "warn" ? "#F0A93C" : "#00C9B1" }}>
                  {p.level === "bad" ? "✗" : p.level === "warn" ? "〜" : "✓"}
                </span>
                <span style={{ fontSize: 20 }}>{p.b.img}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {p.a.name.split(" ")[0]} + {p.b.name.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 1 }}>
                    {p.level === "bad" ? p.reason : p.level === "warn" ? p.reason : "Отлично уживутся вместе"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   WOW-ФИЧА 2: Сравнение рыб — модальное окно таблицы
   ============================================================ */
function CompareModal({ fishA, fishB, onClose }) {
  if (!fishA || !fishB) return null;
  const rows = [
    { label: "Цена", a: formatSum(fishA.price), b: formatSum(fishB.price) },
    { label: "Рейтинг", a: `⭐ ${fishA.rating}`, b: `⭐ ${fishB.rating}` },
    { label: "Размер", a: fishA.size === "small" ? "Мелкая" : fishA.size === "medium" ? "Средняя" : "Крупная",
                       b: fishB.size === "small" ? "Мелкая" : fishB.size === "medium" ? "Средняя" : "Крупная" },
    { label: "Темперамент", a: fishA.temper === "peaceful" ? "Мирная" : fishA.temper === "aggressive" ? "Хищная" : "Полумирная",
                            b: fishB.temper === "peaceful" ? "Мирная" : fishB.temper === "aggressive" ? "Хищная" : "Полумирная" },
    { label: "Температура", a: `${fishA.temp[0]}–${fishA.temp[1]}°C`, b: `${fishB.temp[0]}–${fishB.temp[1]}°C` },
    { label: "Мин. объём", a: `${fishA.minVolume} л`, b: `${fishB.minVolume} л` },
    { label: "Сложность", a: fishA.difficulty === "easy" ? "🌱 Легко" : fishA.difficulty === "medium" ? "🟡 Средне" : "🔴 Сложно",
                          b: fishB.difficulty === "easy" ? "🌱 Легко" : fishB.difficulty === "medium" ? "🟡 Средне" : "🔴 Сложно" },
    { label: "Происхождение", a: fishA.origin === "local" ? "🏠 Местная" : "✈️ Привозная",
                              b: fishB.origin === "local" ? "🏠 Местная" : "✈️ Привозная" },
  ];
  const compat = checkCompatibility(fishA, [fishB]);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5,10,16,0.85)",
      zIndex: 170, display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0B1B28", width: "100%", maxHeight: "88vh",
        borderRadius: "20px 20px 0 0", overflowY: "auto",
        color: "#E8F4F8",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>⚖️ Сравнение рыб</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {/* Fish heads */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0, padding: "14px 18px 0" }}>
          <div />
          {[fishA, fishB].map(fish => (
            <div key={fish.id} style={{ textAlign: "center", padding: "0 4px" }}>
              <div style={{ fontSize: 36 }}>{fish.img}</div>
              <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginTop: 4, color: "#E8F4F8" }}>{fish.name}</div>
            </div>
          ))}
        </div>
        {/* Compat banner */}
        <div style={{
          margin: "12px 18px",
          background: compat.level === "bad" ? "#2A1414" : compat.level === "warn" ? "#1E1800" : "#071C14",
          border: `1px solid ${compat.level === "bad" ? "#FF6B6B" : compat.level === "warn" ? "#F0A93C" : "#00C9B1"}`,
          borderRadius: 10, padding: "8px 12px", fontSize: 12, textAlign: "center",
          color: compat.level === "bad" ? "#FF6B6B" : compat.level === "warn" ? "#F0A93C" : "#00C9B1",
          fontWeight: 600,
        }}>
          {compat.level === "bad" ? `⚠️ ${compat.reason}` : compat.level === "warn" ? `🟡 ${compat.reason}` : "✅ Отлично уживутся вместе в одном аквариуме"}
        </div>
        {/* Table */}
        <div style={{ padding: "0 18px 32px" }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "auto 1fr 1fr",
              gap: 0, borderBottom: "1px solid #1C3A4A",
              padding: "10px 0",
            }}>
              <div style={{ fontSize: 11, color: "#6C8E96", width: 90, paddingRight: 8 }}>{r.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, textAlign: "center", color: "#C9DEE2" }}>{r.a}</div>
              <div style={{ fontSize: 12, fontWeight: 600, textAlign: "center", color: "#C9DEE2" }}>{r.b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WOW-ФИЧА 3: «Посмотреть в моём аквариуме» — псевдо-AR
   Камера (серый фон) + анимированная рыбка поверх
   ============================================================ */
function ARPreview({ fish, onClose }) {
  const [phase, setPhase] = useState("scanning"); // scanning | live
  useEffect(() => {
    const t = setTimeout(() => setPhase("live"), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 180,
      background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      color: "#E8F4F8", fontFamily: "system-ui, sans-serif",
    }}>
      {/* Simulated camera feed */}
      <div style={{
        position: "absolute", inset: 0,
        background: phase === "scanning"
          ? "linear-gradient(135deg, #0a1a0a 0%, #051010 100%)"
          : "linear-gradient(180deg, #0d2010 0%, #061408 40%, #081c10 100%)",
        transition: "background 0.8s",
      }}>
        {/* Scan lines */}
        {phase === "scanning" && (
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,201,177,0.04) 3px, rgba(0,201,177,0.04) 4px)",
            animation: "scanMove 2s linear infinite",
          }} />
        )}
        {/* Corner brackets */}
        {[
          { top: 40, left: 40 }, { top: 40, right: 40 },
          { bottom: 40, left: 40 }, { bottom: 40, right: 40 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 28, height: 28,
            borderTop: i < 2 ? "2px solid #00C9B1" : "none",
            borderBottom: i >= 2 ? "2px solid #00C9B1" : "none",
            borderLeft: i % 2 === 0 ? "2px solid #00C9B1" : "none",
            borderRight: i % 2 === 1 ? "2px solid #00C9B1" : "none",
          }} />
        ))}
        {/* Animated fish */}
        {phase === "live" && (
          <div style={{
            position: "absolute",
            top: "38%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 110,
            filter: "drop-shadow(0 0 20px " + fish.color + "88)",
            animation: "arSwim 3s ease-in-out infinite",
          }}>{fish.img}</div>
        )}
        {/* Water ripple */}
        {phase === "live" && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
            background: "linear-gradient(180deg, transparent, rgba(0,60,40,0.5))",
          }} />
        )}
      </div>

      {/* Overlay UI */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", padding: "0 20px", boxSizing: "border-box" }}>
        {/* Top bar */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0,
          padding: "16px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#00C9B1" }}>
            {phase === "scanning" ? "🔍 Сканирование аквариума..." : "✅ Рыба в вашем аквариуме"}
          </div>
          <button onClick={onClose} style={{
            background: "rgba(0,0,0,0.5)", border: "1px solid #1C3A4A",
            borderRadius: 999, width: 32, height: 32,
            color: "#E8F4F8", fontSize: 16, cursor: "pointer",
          }}>✕</button>
        </div>

        {/* Bottom info */}
        {phase === "live" && (
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(0deg, rgba(8,19,31,0.95), transparent)",
            padding: "32px 20px 28px",
          }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{fish.name}</div>
            <div style={{ fontSize: 12, color: "#9FC4CC", marginBottom: 14 }}>{fish.about.slice(0, 80)}...</div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(14,32,48,0.9)", border: "1px solid #1C3A4A",
              borderRadius: 14, padding: "10px 14px",
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#F0A93C" }}>{formatSum(fish.price)}</span>
              <button onClick={onClose} style={{
                background: "#00C9B1", color: "#08131F",
                border: "none", borderRadius: 10, padding: "8px 18px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>Хочу такую →</button>
            </div>
            <div style={{ fontSize: 10, color: "#6C8E96", textAlign: "center", marginTop: 10 }}>
              📸 Демо-режим · Реальный AR будет в следующем обновлении
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes arSwim {
          0%, 100% { transform: translate(-50%, -50%) scaleX(1) translateX(0); }
          30% { transform: translate(-50%, -50%) scaleX(1) translateX(18px) translateY(-6px); }
          60% { transform: translate(-50%, -50%) scaleX(-1) translateX(8px); }
          80% { transform: translate(-50%, -50%) scaleX(-1) translateX(-12px) translateY(4px); }
        }
        @keyframes scanMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Fish card (grid) ---------- */
function FishCard({ fish, compat, inCart, onOpen, onAdd, onCompare }) {
  const ringColor =
    compat.level === "bad" ? "#FF6B6B" : compat.level === "warn" ? "#F0A93C" : "#1C3A4A";
  const stock = useMemo(() => getStock(fish), [fish.id]);
  const lowStock = stock <= 4;
  return (
    <div
      onClick={() => onOpen(fish)}
      style={{
        background: "#0E2030",
        border: `1px solid ${ringColor}`,
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          aspectRatio: "1/1",
          background: `radial-gradient(circle at 50% 35%, ${fish.color}22, #050B12 75%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
          position: "relative",
        }}
      >
        {fish.img}
        {compat.level !== "ok" && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: compat.level === "bad" ? "#FF6B6B" : "#F0A93C",
              color: "#08131F",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 8,
              padding: "3px 6px",
            }}
          >
            ⚠️
          </div>
        )}
        {inCart > 0 && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "#00C9B1",
              color: "#08131F",
              fontSize: 11,
              fontWeight: 800,
              borderRadius: 8,
              padding: "3px 7px",
            }}
          >
            ×{inCart}
          </div>
        )}
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
          {fish.badges.map((b) => (
            <span
              key={b}
              style={{
                fontSize: 10,
                background: "#102433",
                color: "#9FC4CC",
                borderRadius: 6,
                padding: "2px 6px",
              }}
            >
              {b}
            </span>
          ))}
        </div>
        {lowStock && (
          <div style={{
            display: "inline-block", fontSize: 10.5, fontWeight: 700,
            color: "#F0A93C", background: "#2A1F0E", border: "1px solid #F0A93C44",
            borderRadius: 6, padding: "2px 7px", marginBottom: 6,
          }}>
            🔥 Осталось {stock} шт
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 700, color: "#E8F4F8", lineHeight: 1.25 }}>
          {fish.name}
        </div>
        <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 2 }}>
          ⭐ {fish.rating} ({fish.reviews})
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 800, color: "#F0A93C" }}>
            {formatSum(fish.price)}
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            {fish.type === "fish" && onCompare && (
              <button
                onClick={(e) => { e.stopPropagation(); onCompare(fish); }}
                style={{
                  background: "#102433", color: "#9FC4CC",
                  border: "1px solid #1C3A4A", borderRadius: 10,
                  padding: "6px 8px", fontSize: 12, cursor: "pointer",
                }}
                title="Сравнить"
              >⚖️</button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(fish);
              }}
              style={{
                background: compat.level === "bad" ? "#1C3A4A" : "#00C9B1",
                color: compat.level === "bad" ? "#6C8E96" : "#08131F",
                border: "none",
                borderRadius: 10,
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + {fish.type === "fish" ? "🐠" : "🛒"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Fish detail sheet ---------- */
function FishDetail({ fish, compat, onClose, onAdd, onCompare }) {
  const [tab, setTab] = useState("about");
  const [arOpen, setArOpen] = useState(false);
  if (!fish) return null;
  const stock = getStock(fish);
  const lowStock = stock <= 4;
  const reviewsList = getReviewsList(fish);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,10,16,0.7)",
        zIndex: 150,
        display: "flex",
        alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0B1B28",
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: "20px 20px 0 0",
          color: "#E8F4F8",
          animation: "sheetUp 0.25s ease-out",
        }}
      >
        <div
          style={{
            aspectRatio: "16/10",
            background: `radial-gradient(circle at 50% 35%, ${fish.color}22, #050B12 80%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 90,
            position: "relative",
          }}
        >
          {fish.img}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.4)",
              border: "none",
              color: "#E8F4F8",
              borderRadius: 999,
              width: 32,
              height: 32,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "16px 18px 0" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
            {fish.badges.map((b) => (
              <span
                key={b}
                style={{
                  fontSize: 11,
                  background: "#102433",
                  color: "#9FC4CC",
                  borderRadius: 6,
                  padding: "3px 7px",
                }}
              >
                {b}
              </span>
            ))}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 2px" }}>{fish.name}</h2>
          {fish.latin && <div style={{ fontSize: 12, color: "#6C8E96", fontStyle: "italic" }}>{fish.latin}</div>}
          <div style={{ fontSize: 13, color: "#9FC4CC", marginTop: 4 }}>
            ⭐ {fish.rating} ({fish.reviews} отзывов)
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {lowStock && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#F0A93C",
                background: "#2A1F0E", border: "1px solid #F0A93C44",
                borderRadius: 7, padding: "3px 8px",
              }}>
                🔥 Осталось {stock} шт
              </span>
            )}
            {fish.type === "fish" && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#00C9B1",
                background: "#0F2A26", border: "1px solid #00C9B144",
                borderRadius: 7, padding: "3px 8px",
              }}>
                🛡️ Гарантия здоровья 48 ч
              </span>
            )}
          </div>

          {fish.type === "fish" && compat.level !== "ok" && (
            <div
              style={{
                marginTop: 12,
                background: compat.level === "bad" ? "#2A1414" : "#2A2210",
                border: `1px solid ${compat.level === "bad" ? "#FF6B6B" : "#F0A93C"}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
              }}
            >
              {compat.level === "bad" ? "⚠️ " : "🟡 "}
              {compat.reason}
            </div>
          )}
          {fish.type === "fish" && compat.level === "ok" && (
            <div
              style={{
                marginTop: 12,
                background: "#0F2A26",
                border: "1px solid #00C9B1",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
              }}
            >
              ✅ Совместима с вашей корзиной
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginTop: 16, borderBottom: "1px solid #1C3A4A" }}>
            {(fish.type === "fish"
              ? [["about", "О рыбке"], ["origin", "Откуда"], ["reviews", "Отзывы"], ["pro", "Для профи"]]
              : [["about", "Описание"], ["reviews", "Отзывы"], ["pro", "Характеристики"]]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  background: "none",
                  border: "none",
                  color: tab === id ? "#00C9B1" : "#6C8E96",
                  fontWeight: tab === id ? 700 : 500,
                  fontSize: 13,
                  padding: "8px 4px",
                  borderBottom: tab === id ? "2px solid #00C9B1" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: "14px 0 20px", fontSize: 14, lineHeight: 1.6, color: "#C9DEE2" }}>
            {tab === "about" && fish.about}
            {tab === "origin" && fish.origin_story}
            {tab === "pro" && <span style={{ fontFamily: "monospace", fontSize: 13 }}>{fish.pro}</span>}
            {tab === "reviews" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {reviewsList.map((r, i) => (
                  <div key={i} style={{
                    background: "#0E2030", border: "1px solid #1C3A4A",
                    borderRadius: 12, padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#E8F4F8" }}>{r.name} · {r.city}</span>
                      <span style={{ fontSize: 12, color: "#F0A93C" }}>{"⭐".repeat(r.rating)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#9FC4CC", lineHeight: 1.55 }}>{r.text}</div>
                  </div>
                ))}
                <div style={{ fontSize: 11.5, color: "#6C8E96", textAlign: "center", marginTop: 2 }}>
                  Показаны последние {reviewsList.length} из {fish.reviews} отзывов
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#0B1B28",
            borderTop: "1px solid #1C3A4A",
            padding: "12px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {fish.type === "fish" && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setArOpen(true)}
                style={{
                  flex: 1,
                  background: "#102433", color: "#9FC4CC",
                  border: "1px solid #1C3A4A", borderRadius: 12,
                  padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >📸 В моём аквариуме</button>
              {onCompare && (
                <button
                  onClick={() => onCompare(fish)}
                  style={{
                    background: "#102433", color: "#9FC4CC",
                    border: "1px solid #1C3A4A", borderRadius: 12,
                    padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >⚖️ Сравнить</button>
              )}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#F0A93C" }}>
              {formatSum(fish.price)}
            </span>
            <button
              onClick={() => onAdd(fish)}
              style={{
                flex: 1,
                background: compat.level === "bad" ? "#1C3A4A" : "#00C9B1",
                color: compat.level === "bad" ? "#6C8E96" : "#08131F",
                border: "none",
                borderRadius: 12,
                padding: "12px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {fish.type === "fish" ? "🐠 Добавить в аквариум" : "🛒 Добавить в корзину"}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes sheetUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      {arOpen && <ARPreview fish={fish} onClose={() => setArOpen(false)} />}
    </div>
  );
}

/* ---------- Cart drawer ---------- */
function CartDrawer({ open, onClose, cart, onRemove, region, onCheckout }) {
  const subtotal = cart.reduce((s, f) => s + f.price, 0);
  const deliveryInfo = DELIVERY_RATES[region] || { price: 35000, time: "сегодня" };
  const delivery = cart.length === 0 ? 0 : deliveryInfo.price;
  const hasIssue = useMemo(() => {
    for (let i = 0; i < cart.length; i++) {
      for (let j = i + 1; j < cart.length; j++) {
        const c = checkCompatibility(cart[i], [cart[j]]);
        if (c.level === "bad") return true;
      }
    }
    return false;
  }, [cart]);

  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.6)", zIndex: 140 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "86%",
          maxWidth: 360,
          background: "#0B1B28",
          color: "#E8F4F8",
          padding: 18,
          overflowY: "auto",
          animation: "slideIn 0.2s ease-out",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>🐠 Ваш аквариум</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>

        {cart.length === 0 && (
          <p style={{ color: "#6C8E96", fontSize: 14, textAlign: "center", marginTop: 40 }}>
            Корзина пуста — выберите первую рыбку 🐠
          </p>
        )}

        {hasIssue && (
          <div
            style={{
              background: "#2A1414",
              border: "1px solid #FF6B6B",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            ⚠️ В корзине есть несовместимые соседи — посмотрите ниже
          </div>
        )}

        {cart.map((f, idx) => (
          <div
            key={f.id + idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid #15293A",
            }}
          >
            <div style={{ fontSize: 26 }}>{f.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: "#F0A93C" }}>{formatSum(f.price)}</div>
            </div>
            <button
              onClick={() => onRemove(idx)}
              style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 16, cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        ))}

        {cart.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #1C3A4A" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9FC4CC", marginBottom: 6 }}>
              <span>Товары</span><span>{formatSum(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9FC4CC", marginBottom: 2 }}>
              <span>🚚 Доставка · {region}</span><span>{formatSum(delivery)}</span>
            </div>
            <div style={{ fontSize: 11, color: "#6C8E96", marginBottom: 6 }}>
              ⏱ Ориентировочно: {deliveryInfo.time}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, marginTop: 10 }}>
              <span>Итого</span><span style={{ color: "#F0A93C" }}>{formatSum(subtotal + delivery)}</span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: "100%",
                marginTop: 14,
                background: "#00C9B1",
                color: "#08131F",
                border: "none",
                borderRadius: 12,
                padding: "13px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Заказать всё сразу →
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0.6; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ============================================================
   UX: «Пока везут» — инструкция по подготовке аквариума
   ============================================================ */
function PostOrderScreen({ cart, onClose }) {
  const fishItems = cart.filter(f => f.type === "fish");
  const maxTemp = fishItems.length > 0 ? Math.max(...fishItems.map(f => f.temp[1])) : 26;
  const minTemp = fishItems.length > 0 ? Math.min(...fishItems.map(f => f.temp[0])) : 22;
  const steps = [
    {
      icon: "🌡️",
      title: "Настройте температуру воды",
      desc: `Установите обогреватель на ${Math.round((maxTemp + minTemp) / 2)}°C — оптимум для ваших рыб (диапазон ${minTemp}–${maxTemp}°C).`,
      time: "Сейчас",
    },
    {
      icon: "💧",
      title: "Отстойте воду 24 часа",
      desc: "Налейте воду и дайте хлору испариться. Или используйте кондиционер «Антихлор» — он нейтрализует хлор за 5 минут.",
      time: "Сейчас",
    },
    {
      icon: "⚙️",
      title: "Запустите фильтр и компрессор",
      desc: "Дайте оборудованию поработать минимум 1–2 часа до прибытия рыб. Полезные бактерии начнут заселяться.",
      time: "За 2 часа",
    },
    {
      icon: "🛍️",
      title: "Приём пакета с рыбой",
      desc: "Не вскрывайте пакет сразу! Положите его на поверхность воды на 15–20 минут — рыба привыкнет к температуре.",
      time: "При получении",
    },
    {
      icon: "🐠",
      title: "Аккуратно выпустите рыб",
      desc: "Наклоните пакет и дайте рыбам самим выплыть. Воду из пакета в аквариум не добавляйте — там может быть стресс-гормон.",
      time: "При получении",
    },
    {
      icon: "🌑",
      title: "Первые 2 часа — темнота",
      desc: "Приглушите свет и не тревожьте рыб. Они осваивают новый дом. Кормить только через 24 часа.",
      time: "После запуска",
    },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#08131F",
      color: "#E8F4F8", zIndex: 200, overflowY: "auto",
      fontFamily: "system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #071C14, #08131F)",
        borderBottom: "1px solid #1C3A4A",
        padding: "20px 18px 16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "#00C9B1", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              ✅ Заказ оформлен
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Пока везут рыб —<br />подготовьте аквариум
            </h2>
            <div style={{ fontSize: 13, color: "#6C8E96" }}>
              {fishItems.length > 0 ? `${fishItems.length} вид${fishItems.length > 1 ? "а" : ""} · оптимальная t° ${minTemp}–${maxTemp}°C` : "Следуйте инструкции"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {/* Fish pills */}
        {fishItems.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {fishItems.map(f => (
              <div key={f.id} style={{
                background: "#102433", border: "1px solid #1C3A4A",
                borderRadius: 999, padding: "4px 10px",
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 12,
              }}>
                <span>{f.img}</span>
                <span style={{ color: "#9FC4CC" }}>{f.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Steps */}
      <div style={{ padding: "20px 18px 40px" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#0D2030", border: "1px solid #1C3A4A",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>{s.icon}</div>
              {i < steps.length - 1 && (
                <div style={{ width: 1, flex: 1, background: "#1C3A4A", margin: "6px 0", minHeight: 16 }} />
              )}
            </div>
            <div style={{ paddingTop: 6, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.title}</div>
                <span style={{
                  fontSize: 10, background: "#102433", color: "#6C8E96",
                  borderRadius: 6, padding: "2px 7px", whiteSpace: "nowrap",
                }}>{s.time}</span>
              </div>
              <div style={{ fontSize: 13, color: "#8BABB5", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}

        <div style={{
          background: "linear-gradient(135deg, #071C14, #0D2030)",
          border: "1px solid #00C9B133",
          borderRadius: 16, padding: "16px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Рыбы готовы — Удачи!</div>
          <div style={{ fontSize: 12, color: "#6C8E96" }}>Гарантия 48 часов. Если что-то пошло не так — напишите нам</div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", marginTop: 16,
            background: "#00C9B1", color: "#08131F",
            border: "none", borderRadius: 14, padding: "14px",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}
        >← Вернуться в каталог</button>
      </div>
    </div>
  );
}

/* ============================================================
   UX: AI Чат-поддержка — плавающая кнопка + чат
   ============================================================ */
function AIChatWidget({ cart }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Привет! 🐠 Я AI-помощник AquaUZ. Спрашивайте про рыб, уход, совместимость или доставку." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    const cartSummary = cart.filter(f => f.type === "fish").map(f => f.name).join(", ") || "пока пусто";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `Ты AI-помощник интернет-магазина аквариумных рыб AquaUZ (Узбекистан). Отвечай коротко, дружелюбно, на русском языке. Используй эмодзи умеренно. В корзине покупателя сейчас: ${cartSummary}. Помогай с выбором рыб, уходом, совместимостью, вопросами о доставке.`,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Упс, что-то пошло не так. Попробуйте ещё раз.";
      setMessages(m => [...m, { role: "bot", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "bot", text: "Нет соединения. Попробуйте позже." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed", bottom: 80, right: 16, zIndex: 95,
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #00C9B1, #00A896)",
            border: "none", fontSize: 22, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,201,177,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "chatPulse 2.5s ease-in-out infinite",
          }}
        >💬</button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 70, right: 0, left: 0,
          zIndex: 130, display: "flex", flexDirection: "column",
          background: "#0B1B28", borderTop: "1px solid #1C3A4A",
          height: "60vh",
        }}>
          {/* Chat header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderBottom: "1px solid #1C3A4A",
            background: "#0D2030",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#00C9B122", border: "1px solid #00C9B144",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🐠</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>AI-помощник AquaUZ</div>
              <div style={{ fontSize: 11, color: "#00C9B1" }}>● Онлайн</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Quick prompts */}
            {messages.length === 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                {["Как держать дискуса?", "Когда привезут?", "Какой фильтр нужен?", "Гарантия на рыб?"].map(q => (
                  <button key={q} onClick={() => { setInput(q); }} style={{
                    background: "#102433", border: "1px solid #1C3A4A",
                    borderRadius: 999, padding: "5px 10px",
                    color: "#9FC4CC", fontSize: 11, cursor: "pointer",
                  }}>{q}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%",
                  background: m.role === "user" ? "#00C9B1" : "#102433",
                  color: m.role === "user" ? "#08131F" : "#E8F4F8",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding: "9px 12px",
                  fontSize: 13, lineHeight: 1.55,
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{
                  background: "#102433", borderRadius: "14px 14px 14px 4px",
                  padding: "10px 14px", fontSize: 18, color: "#6C8E96",
                  animation: "typing 1s infinite",
                }}>···</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px", borderTop: "1px solid #1C3A4A",
            display: "flex", gap: 8, background: "#0D2030",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Задайте вопрос..."
              style={{
                flex: 1, background: "#102433", border: "1px solid #1C3A4A",
                borderRadius: 10, padding: "9px 12px",
                color: "#E8F4F8", fontSize: 13, outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() ? "#00C9B1" : "#102433",
                color: input.trim() ? "#08131F" : "#6C8E96",
                border: "none", borderRadius: 10, padding: "9px 14px",
                fontSize: 15, cursor: input.trim() ? "pointer" : "default",
                fontWeight: 700,
              }}
            >→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,201,177,0.5); }
          50% { box-shadow: 0 4px 28px rgba(0,201,177,0.8); transform: scale(1.05); }
        }
        @keyframes typing {
          0%, 100% { opacity: 0.3; } 50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* ---------- Catalog screen ---------- */
function Catalog({ region, cart, setCart, onChangeRegion, onOpenConfigurator, onOpenProfile, onOpenDoctor, onOrderPlaced, hideHeader, externalCartOpen, onExternalCartClose, quizFilter, onClearQuizFilter }) {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [productType, setProductType] = useState("fish");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("popular"); // popular | price_asc | price_desc | rating | new
  const [tankVolume, setTankVolume] = useState(0); // 0 = не фильтровать
  const [priceMax, setPriceMax] = useState(0); // 0 = не фильтровать
  const [showFilters, setShowFilters] = useState(false);
  const [openFish, setOpenFish] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [postOrderCart, setPostOrderCart] = useState(null); // для экрана «Пока везут»
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [compareFish, setCompareFish] = useState(null);
  const [compareTarget, setCompareTarget] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (externalCartOpen) { setCartOpen(true); onExternalCartClose && onExternalCartClose(); }
  }, [externalCartOpen]);

  // Suggestions for autocomplete
  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return ALL_PRODUCTS.filter(f =>
      f.type === productType && (
        f.name.toLowerCase().includes(q) ||
        (f.latin && f.latin.toLowerCase().includes(q)) ||
        (f.badges && f.badges.some(b => b.toLowerCase().includes(q)))
      )
    ).slice(0, 5);
  }, [search, productType]);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter((f) => {
      if (f.type !== productType) return false;
      if (search && !f.name.toLowerCase().includes(search.toLowerCase()) &&
          !(f.latin && f.latin.toLowerCase().includes(search.toLowerCase()))) return false;
      if (productType !== "fish") return true;
      if (quizFilter && !search && cat === "all") {
        const fitsVolume = quizFilter.maxVolume == null || f.minVolume <= quizFilter.maxVolume;
        const fitsDiff = !quizFilter.difficulties || quizFilter.difficulties.includes(f.difficulty);
        const fitsGoal = !quizFilter.goals || quizFilter.goals.some(g => f.goal.includes(g));
        if (!fitsVolume || !fitsDiff || !fitsGoal) return false;
      }
      // Фильтр по объёму аквариума
      if (tankVolume > 0 && f.minVolume && f.minVolume > tankVolume) return false;
      // Фильтр по цене
      if (priceMax > 0 && f.price > priceMax) return false;
      if (cat === "all") return true;
      if (cat === "peaceful") return f.temper === "peaceful";
      if (cat === "aggressive") return f.temper === "aggressive";
      if (cat === "kids") return f.goal && f.goal.includes("kids");
      if (cat === "local") return f.origin === "local";
      if (cat === "import") return f.origin === "import";
      return true;
    });
    // Сортировка
    list = [...list].sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popular") return b.reviews - a.reviews;
      return 0;
    });
    return list;
  }, [search, cat, productType, quizFilter, sort, tankVolume, priceMax]);

  function showToast(text, type = "ok") {
    setToast({ text, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  function addToCart(fish) {
    const compat = checkCompatibility(fish, cart);
    if (compat.level === "bad") {
      showToast(`⚠️ ${fish.name.split(" ")[0]} несовместим с тем что в корзине`, "bad");
      return;
    }
    setCart((c) => [...c, fish]);
    showToast(`✅ ${fish.name.split(" ")[0]} добавлена в корзину`, "ok");
  }

  function removeFromCart(idx) {
    setCart((c) => c.filter((_, i) => i !== idx));
  }

  const countById = useMemo(() => {
    const m = {};
    cart.forEach((f) => (m[f.id] = (m[f.id] || 0) + 1));
    return m;
  }, [cart]);

  return (
    <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", paddingBottom: 70 }}>
      {/* header */}
      {!hideHeader && (
      <div style={{ padding: "16px 16px 10px", position: "sticky", top: 0, background: "#08131Fcc", backdropFilter: "blur(8px)", zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button
            onClick={onChangeRegion}
            style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 13, cursor: "pointer" }}
          >
            📍 {region} ▾
          </button>
          <button
            onClick={() => setCartOpen(true)}
            style={{
              position: "relative",
              background: "#102433",
              border: "1px solid #1C3A4A",
              borderRadius: 10,
              padding: "6px 10px",
              color: "#E8F4F8",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            🛒
            {cart.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#00C9B1",
                  color: "#08131F",
                  fontSize: 10,
                  fontWeight: 800,
                  borderRadius: 999,
                  padding: "1px 5px",
                }}
              >
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {TYPE_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setProductType(t.id);
                setCat("all");
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: productType === t.id ? "#0F2A26" : "#102433",
                border: `1px solid ${productType === t.id ? "#00C9B1" : "#1C3A4A"}`,
                borderRadius: 12,
                padding: "8px 4px",
                color: productType === t.id ? "#00C9B1" : "#9FC4CC",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder={`🔍 Найти по названию или латыни...`}
            style={{
              width: "100%",
              background: "#102433",
              border: "1px solid " + (searchFocused ? "#00C9B1" : "#1C3A4A"),
              borderRadius: 12,
              padding: "10px 14px",
              color: "#E8F4F8",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
          />
          {/* Autocomplete dropdown */}
          {searchFocused && suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 80,
              background: "#0D2030", border: "1px solid #1C3A4A",
              borderRadius: "0 0 12px 12px", overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              marginTop: 2,
            }}>
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onMouseDown={() => { setSearch(s.name); setSearchFocused(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", cursor: "pointer",
                    borderBottom: "1px solid #1C3A4A",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#102433"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 22 }}>{s.img}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                    {s.latin && <div style={{ fontSize: 11, color: "#6C8E96", fontStyle: "italic" }}>{s.latin}</div>}
                  </div>
                  <span style={{ fontSize: 12, color: "#F0A93C", fontWeight: 700 }}>{formatSum(s.price)}</span>
                </div>
              ))}
            </div>
          )}
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#6C8E96", fontSize: 16, cursor: "pointer",
              }}
            >✕</button>
          )}
        </div>

        {/* Sort + Filter row */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center" }}>
          <div style={{ overflowX: "auto", display: "flex", gap: 6, flex: 1, paddingBottom: 2 }}>
            {[
              { id: "popular", label: "🔥 Популярные" },
              { id: "rating", label: "⭐ Рейтинг" },
              { id: "price_asc", label: "💰 Дешевле" },
              { id: "price_desc", label: "💎 Дороже" },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                style={{
                  whiteSpace: "nowrap",
                  background: sort === s.id ? "#00C9B122" : "#102433",
                  color: sort === s.id ? "#00C9B1" : "#9FC4CC",
                  border: "1px solid " + (sort === s.id ? "#00C9B1" : "#1C3A4A"),
                  borderRadius: 999, padding: "5px 12px",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}
              >{s.label}</button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            style={{
              background: (tankVolume > 0 || priceMax > 0) ? "#00C9B122" : "#102433",
              border: "1px solid " + ((tankVolume > 0 || priceMax > 0) ? "#00C9B1" : "#1C3A4A"),
              borderRadius: 10, padding: "6px 10px",
              color: (tankVolume > 0 || priceMax > 0) ? "#00C9B1" : "#9FC4CC",
              fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0,
            }}
          >⚙️ {(tankVolume > 0 || priceMax > 0) ? "•" : ""}</button>
        </div>

        {/* Expandable filters panel */}
        {showFilters && productType === "fish" && (
          <div style={{
            background: "#0D2030", border: "1px solid #1C3A4A",
            borderRadius: 14, padding: "14px", marginTop: 8,
          }}>
            {/* Объём аквариума */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9FC4CC" }}>🪣 Объём аквариума</span>
                <span style={{ fontSize: 12, color: "#00C9B1", fontWeight: 700 }}>
                  {tankVolume === 0 ? "Любой" : `до ${tankVolume} л`}
                </span>
              </div>
              <input
                type="range" min="0" max="300" step="20" value={tankVolume}
                onChange={e => setTankVolume(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#00C9B1" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6C8E96", marginTop: 2 }}>
                <span>Любой</span>
                {[40,80,150,300].map(v => <span key={v}>{v}л</span>)}
              </div>
            </div>
            {/* Цена */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9FC4CC" }}>💰 Максимум цена</span>
                <span style={{ fontSize: 12, color: "#F0A93C", fontWeight: 700 }}>
                  {priceMax === 0 ? "Любая" : formatSum(priceMax)}
                </span>
              </div>
              <input
                type="range" min="0" max="200000" step="5000" value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#F0A93C" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6C8E96", marginTop: 2 }}>
                <span>Любая</span>
                {[25000,50000,100000,200000].map(v => <span key={v}>{v/1000}к</span>)}
              </div>
            </div>
            {(tankVolume > 0 || priceMax > 0) && (
              <button
                onClick={() => { setTankVolume(0); setPriceMax(0); }}
                style={{
                  marginTop: 10, background: "none", border: "1px solid #1C3A4A",
                  borderRadius: 8, padding: "5px 12px", color: "#6C8E96",
                  fontSize: 11, cursor: "pointer", width: "100%",
                }}
              >Сбросить фильтры</button>
            )}
          </div>
        )}
        {productType === "fish" && (
          <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 2 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                style={{
                  whiteSpace: "nowrap",
                  background: cat === c.id ? "#00C9B1" : "#102433",
                  color: cat === c.id ? "#08131F" : "#9FC4CC",
                  border: "1px solid " + (cat === c.id ? "#00C9B1" : "#1C3A4A"),
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {productType === "fish" && (
          <button
            onClick={onOpenConfigurator}
            style={{
              width: "100%",
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textAlign: "left",
              background: "linear-gradient(90deg, #0F2A26, #102433)",
              border: "1px solid #00C9B1",
              borderRadius: 14,
              padding: "12px 14px",
              color: "#E8F4F8",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 22 }}>🤖</span>
            <span style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Не знаете с чего начать?</div>
              <div style={{ fontSize: 11.5, color: "#9FC4CC" }}>AI подберёт рыб под ваш аквариум за 2 минуты</div>
            </span>
            <span style={{ color: "#00C9B1", fontSize: 18 }}>→</span>
          </button>
        )}
      </div>
      )}

      {/* Баннер активного квиз-фильтра */}
      {quizFilter && productType === "fish" && !search && cat === "all" && (
        <div style={{
          margin: "0 16px 4px",
          background: "linear-gradient(135deg, #071C14, #071828)",
          border: "1px solid #00C9B133",
          borderRadius: 14, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#00C9B1" }}>Каталог подобран по вашему квизу</div>
            <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 1 }}>
              {filtered.length} рыб подходят под ваш аквариум и опыт
            </div>
          </div>
          <button
            onClick={() => { onClearQuizFilter && onClearQuizFilter(); }}
            style={{ background: "none", border: "1px solid #1C3A4A", borderRadius: 8, padding: "4px 10px", color: "#6C8E96", fontSize: 11, cursor: "pointer" }}
          >
            Сбросить
          </button>
        </div>
      )}

      {/* Визуализация аквариума — появляется когда 2+ рыбы в корзине */}
      {productType === "fish" && (
        <div style={{ padding: "0 16px" }}>
          <AquariumVisualizer cart={cart} allFish={FISH_DB} />
        </div>
      )}

      {/* Баннер режима сравнения */}
      {compareFish && (
        <div style={{
          margin: "0 16px 4px",
          background: "linear-gradient(90deg, #1A0E28, #102433)",
          border: "1px solid #F0A93C55",
          borderRadius: 14, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>{compareFish.img}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0A93C" }}>⚖️ Режим сравнения</div>
            <div style={{ fontSize: 11, color: "#9FC4CC", marginTop: 1 }}>
              Выберите вторую рыбу для сравнения с «{compareFish.name.split(" ")[0]}»
            </div>
          </div>
          <button onClick={() => setCompareFish(null)} style={{ background: "none", border: "1px solid #1C3A4A", borderRadius: 8, padding: "4px 10px", color: "#6C8E96", fontSize: 11, cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* grid */}
      <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map((f) => (
          <FishCard
            key={f.id}
            fish={f}
            compat={checkCompatibility(f, cart)}
            inCart={countById[f.id] || 0}
            onOpen={(fish) => {
              if (compareFish && fish.type === "fish" && fish.id !== compareFish.id) {
                setCompareTarget({ a: compareFish, b: fish });
                setCompareFish(null);
              } else {
                setOpenFish(fish);
              }
            }}
            onAdd={addToCart}
            onCompare={(fish) => {
              if (!compareFish) {
                setCompareFish(fish);
                showToast(`⚖️ Теперь выберите вторую рыбу для сравнения`, "ok");
              } else if (fish.id !== compareFish.id) {
                setCompareTarget({ a: compareFish, b: fish });
                setCompareFish(null);
              }
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#6C8E96", marginTop: 30 }}>
            Ничего не найдено — попробуйте другой запрос
          </p>
        )}
      </div>

      {/* bottom nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#0B1B28",
          borderTop: "1px solid #1C3A4A",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0 14px",
          zIndex: 90,
        }}
      >
        {[
          ["🏠", "Главная", null],
          ["🐠", "Каталог", null],
          ["🩺", "Доктор", onOpenDoctor],
          ["🤖", "AI Подбор", onOpenConfigurator],
          ["👤", "Я", onOpenProfile],
        ].map(([icon, label, action], i) => (
          <button
            key={label}
            onClick={action || undefined}
            style={{
              textAlign: "center",
              color: i === 1 ? "#00C9B1" : "#6C8E96",
              fontSize: 11,
              background: "none",
              border: "none",
              cursor: action ? "pointer" : "default",
            }}
          >
            <div style={{ fontSize: 18 }}>{icon}</div>
            {label}
          </button>
        ))}
      </div>

      <FishDetail
        fish={openFish}
        compat={openFish ? checkCompatibility(openFish, cart) : { level: "ok" }}
        onClose={() => setOpenFish(null)}
        onAdd={(f) => {
          addToCart(f);
          setOpenFish(null);
        }}
        onCompare={(fish) => {
          setOpenFish(null);
          if (compareFish && fish.id !== compareFish.id) {
            setCompareTarget({ a: compareFish, b: fish });
            setCompareFish(null);
          } else {
            setCompareFish(fish);
            showToast(`⚖️ Теперь выберите вторую рыбу для сравнения`, "ok");
          }
        }}
      />
      {compareTarget && (
        <CompareModal
          fishA={compareTarget.a}
          fishB={compareTarget.b}
          onClose={() => setCompareTarget(null)}
        />
      )}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        region={region}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      {checkoutOpen && (
        <Checkout
          region={region}
          cart={cart}
          setCart={setCart}
          onClose={() => setCheckoutOpen(false)}
          onChangeRegion={() => { setCheckoutOpen(false); onChangeRegion(); }}
          onDone={(order) => {
            setCheckoutOpen(false);
            setPostOrderCart([...cart]);
            setCart([]);
            onOrderPlaced(order);
          }}
        />
      )}
      {postOrderCart && (
        <PostOrderScreen
          cart={postOrderCart}
          onClose={() => setPostOrderCart(null)}
        />
      )}
      <AIChatWidget cart={cart} />
      <Toast toast={toast} />
    </div>
  );
}

/* ============================================================
   Checkout v2 — адрес + оплата
   Новое: SMS-верификация телефона · промокод · inline-валидация
   полей · редактирование корзины (qty) · карта (Leaflet/OSM) ·
   сохранённые адреса · анимированный прогресс · экран загрузки
   ============================================================ */
const TIME_SLOTS = [
  { id: "morning", label: "Утро",  sub: "9:00–12:00",  icon: "🌅", closeHour: 9  },
  { id: "day",     label: "День",  sub: "12:00–17:00", icon: "☀️", closeHour: 12 },
  { id: "evening", label: "Вечер", sub: "17:00–21:00", icon: "🌙", closeHour: 17 },
];
const PAY_METHODS = [
  { id: "cash",  label: "Наличными курьеру", sub: "При получении заказа",      icon: "💵" },
  { id: "click", label: "Click",             sub: "Быстрая оплата по QR-коду", icon: "🟦" },
  { id: "payme", label: "Payme",             sub: "Карта Uzcard или Humo",     icon: "🟢" },
];
const CHECKOUT_PROMOS = { "AQUA10": 10, "FISH20": 20, "NEWFISH": 15 };
const SAVED_ADDRESSES = [
  "ул. Навои 12, кв. 34, Ташкент",
  "пр. Мустакиллик 88, офис 5",
];
const UPSELL = [
  { id: "food-flakes", name: "Корм «Универсал»",       price: 18000, img: "🍽️", reason: "Подходит для рыб в вашем заказе" },
  { id: "heater",      name: "Обогреватель с термост.", price: 65000, img: "🌡️", reason: "Рекомендуется для гуппи и неонов" },
  { id: "plant-moss",  name: "Яванский мох",            price: 14000, img: "🌿", reason: "Укрытие для мальков" },
];
const REGION_COORDS = {
  "Ташкент":     [41.2995, 69.2401],
  "Самарканд":   [39.6542, 66.9597],
  "Бухара":      [39.7681, 64.4556],
  "Андижан":     [40.7821, 72.3442],
  "Фергана":     [40.3864, 71.7864],
  "Наманган":    [41.0011, 71.6726],
  "Нукус":       [42.4619, 59.6166],
  "Навои":       [40.0842, 65.3791],
  "Джизак":      [40.1158, 67.8422],
  "Сурхандарья": [37.9401, 67.5701],
  "Сырдарья":    [40.8393, 68.6637],
  "Кашкадарья":  [38.8521, 65.7908],
};

function CkLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
    textTransform: "uppercase", color: "#6C8E96", marginBottom: 8 }}>{children}</div>;
}
function CkField({ label, children }) {
  return <div style={{ marginBottom: 18 }}>{label && <CkLabel>{label}</CkLabel>}{children}</div>;
}

/* ── группировка flat-корзины в qty-вид и обратно ───────── */
function groupCart(cart) {
  const map = new Map();
  cart.forEach((item) => {
    if (map.has(item.id)) map.get(item.id).qty += 1;
    else map.set(item.id, { ...item, qty: 1 });
  });
  return Array.from(map.values());
}

/* ── Карта выбора адреса (OpenStreetMap через Leaflet) ───── */
function MapPicker({ region, onAddressSelect }) {
  const mapRef = useRef(null);
  const leafRef = useRef(null);
  const markerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [mapAddr, setMapAddr] = useState("");
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (window.L) { setLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || leafRef.current) return;
    const coords = REGION_COORDS[region] || [41.2995, 69.2401];
    const map = window.L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView(coords, 13);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OSM",
    }).addTo(map);

    const icon = window.L.divIcon({
      className: "",
      html: `<div style="width:32px;height:40px;display:flex;flex-direction:column;align-items:center">
        <div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#00C9B1;transform:rotate(-45deg);border:3px solid #08131F;box-shadow:0 2px 8px rgba(0,201,177,0.6)"></div>
        <div style="width:4px;height:12px;background:#00C9B1;margin-top:-2px;border-radius:0 0 4px 4px"></div>
      </div>`,
      iconSize: [32, 40], iconAnchor: [16, 40],
    });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = window.L.marker([lat, lng], { icon }).addTo(map);
      setPicking(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ru`)
        .then((r) => r.json())
        .then((d) => {
          const a = d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          const p = d.address || {};
          const short = [p.road || p.pedestrian || p.footway, p.house_number, p.city || p.town || p.village]
            .filter(Boolean).join(", ") || a;
          setMapAddr(short);
          onAddressSelect(short);
          setPicking(false);
        })
        .catch(() => {
          const fb = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setMapAddr(fb); onAddressSelect(fb); setPicking(false);
        });
    });

    leafRef.current = map;
    return () => { map.remove(); leafRef.current = null; };
  }, [loaded]);

  useEffect(() => {
    if (!leafRef.current) return;
    const coords = REGION_COORDS[region] || [41.2995, 69.2401];
    leafRef.current.flyTo(coords, 13, { duration: 1.2 });
    if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
    setMapAddr("");
    onAddressSelect("");
  }, [region]);

  return (
    <div style={{ marginBottom: 18 }}>
      <CkLabel>Нажмите на карту, чтобы отметить адрес</CkLabel>
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden",
        border: `1px solid ${mapAddr ? "#00C9B166" : "#1C3A4A"}`, height: 220 }}>
        {!loaded && (
          <div style={{ position: "absolute", inset: 0, background: "#102433",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#6C8E96", fontSize: 13 }}>🗺️ Загрузка карты…</div>
        )}
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {loaded && !mapAddr && !picking && (
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
            background: "rgba(8,19,31,0.85)", border: "1px solid #1C3A4A",
            borderRadius: 10, padding: "7px 14px", fontSize: 12, color: "#9FC4CC",
            pointerEvents: "none", whiteSpace: "nowrap", backdropFilter: "blur(4px)" }}>
            📍 Нажмите на карту чтобы поставить пин
          </div>
        )}
        {picking && (
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
            background: "rgba(8,19,31,0.85)", border: "1px solid #00C9B144",
            borderRadius: 10, padding: "7px 14px", fontSize: 12, color: "#00C9B1",
            pointerEvents: "none", backdropFilter: "blur(4px)" }}>
            ⌛ Определяем адрес…
          </div>
        )}
      </div>
      {mapAddr && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10,
          background: "#071C14", border: "1px solid #00C9B144",
          borderRadius: 10, padding: "10px 12px" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
          <div style={{ flex: 1, fontSize: 13, color: "#E8F4F8", lineHeight: 1.5 }}>{mapAddr}</div>
          <button onClick={() => {
            setMapAddr(""); onAddressSelect("");
            if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
          }} style={{ background: "none", border: "none", color: "#6C8E96",
            fontSize: 16, cursor: "pointer", flexShrink: 0, padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      )}
    </div>
  );
}

/* ── Таймер закрытия слота доставки ──────────────────────── */
function SlotTimer({ slotId }) {
  const slot = TIME_SLOTS.find((s) => s.id === slotId);
  const [secs, setSecs] = useState(null);

  useEffect(() => {
    const now = new Date();
    const close = new Date();
    close.setHours(slot.closeHour + 3, 0, 0, 0); // демо: всегда +3ч
    const diff = Math.max(0, Math.floor((close - now) / 1000));
    setSecs(diff);
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [slotId]);

  if (secs === null) return null;
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  const urgent = secs < 1800;
  const veryUrgent = secs < 600;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10,
      background: veryUrgent ? "#3A0E0E" : urgent ? "#2A1A08" : "#071C14",
      border: `1px solid ${veryUrgent ? "#FF6B6B" : urgent ? "#F0A93C" : "#00C9B1"}44`,
      borderRadius: 12, padding: "10px 14px" }}>
      <span style={{ fontSize: 18, animation: urgent ? "pulse 1s ease-in-out infinite" : "none" }}>⏳</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: veryUrgent ? "#FF6B6B" : urgent ? "#F0A93C" : "#00C9B1",
          fontWeight: 700, marginBottom: 2 }}>
          {veryUrgent ? "⚠️ Слот почти закрыт!" : urgent ? "Торопитесь!" : `Слот «${slot.label}» открыт`}
        </div>
        <div style={{ fontSize: 13, color: "#E8F4F8", fontWeight: 800, letterSpacing: "0.05em", fontFamily: "monospace" }}>
          {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#6C8E96", textAlign: "right", lineHeight: 1.4 }}>
        до закрытия<br />записи
      </div>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }`}</style>
    </div>
  );
}

/* ── Анимированный прогресс шагов ────────────────────────── */
function CheckoutSteps({ current }) {
  const labels = ["Адрес", "Оплата", "Готово"];
  const pct = current === 1 ? 18 : current === 2 ? 55 : 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {labels.map((l, i) => (
          <span key={l} style={{ fontSize: 11, fontWeight: i + 1 === current ? 700 : 400,
            color: i + 1 < current ? "#00C9B1" : i + 1 === current ? "#E8F4F8" : "#6C8E96" }}>
            {i + 1 < current ? "✓ " : ""}{l}
          </span>
        ))}
      </div>
      <div style={{ height: 4, background: "#1C3A4A", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#00C9B1",
          borderRadius: 2, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ textAlign: "right", fontSize: 10, color: "#00C9B1", marginTop: 4 }}>{pct}%</div>
    </div>
  );
}

/* ── Редактируемый состав корзины ────────────────────────── */
function CheckoutCartSummary({ groupedCart, onQtyChange, onRemove, subtotal, discount, delivery, total, deliveryInfo, collapsed }) {
  const [open, setOpen] = useState(!collapsed);
  const totalQty = groupedCart.reduce((a, i) => a + i.qty, 0);
  return (
    <div style={{ background: "#0B1B28", border: "1px solid #1C3A4A", borderRadius: 16, marginBottom: 22, overflow: "hidden" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ width: "100%", display: "flex",
        justifyContent: "space-between", alignItems: "center", background: "none",
        border: "none", padding: "14px 16px", cursor: "pointer", color: "#E8F4F8" }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>🛒 Состав · {totalQty} шт.</span>
        <span style={{ fontSize: 13, color: "#F0A93C", fontWeight: 800 }}>{formatSum(total)}</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px" }}>
          {groupedCart.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10,
              paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #1C3A4A" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.img}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#E8F4F8",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <button onClick={() => onQtyChange(item.id, -1)}
                    style={{ background: "#102433", border: "1px solid #1C3A4A", borderRadius: 6,
                      width: 22, height: 22, color: "#9FC4CC", fontSize: 14, cursor: "pointer", lineHeight: 1, padding: 0 }}>−</button>
                  <span style={{ fontSize: 12, color: "#E8F4F8", minWidth: 14, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onQtyChange(item.id, 1)}
                    style={{ background: "#102433", border: "1px solid #1C3A4A", borderRadius: 6,
                      width: 22, height: 22, color: "#00C9B1", fontSize: 14, cursor: "pointer", lineHeight: 1, padding: 0 }}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#9FC4CC" }}>{formatSum(item.price * item.qty)}</span>
                <button onClick={() => onRemove(item.id)}
                  style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 11, cursor: "pointer", padding: 0 }}>удалить</button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6C8E96", marginBottom: 4 }}>
            <span>Товары</span><span>{formatSum(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4ADE80", marginBottom: 4 }}>
              <span>Скидка по промокоду</span><span>−{formatSum(discount)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6C8E96", marginBottom: 2 }}>
            <span>🚚 Доставка · {deliveryInfo.time}</span><span>{formatSum(delivery)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15,
            fontWeight: 800, marginTop: 10, paddingTop: 10, borderTop: "1px solid #1C3A4A" }}>
            <span style={{ color: "#E8F4F8" }}>Итого</span>
            <span style={{ color: "#F0A93C" }}>{formatSum(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── QR-код для Click/Payme (демо) ────────────────────────── */
function QRMock({ pay, total }) {
  if (pay === "cash") return null;
  const label = pay === "click" ? "Click" : "Payme";
  const color = pay === "click" ? "#1A73E8" : "#00C853";
  const bgColor = pay === "click" ? "#1A73E822" : "#00C85322";
  const cells = useMemo(() => {
    const grid = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const corner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
      const inner = (r >= 1 && r <= 2 && c >= 1 && c <= 2) || (r >= 1 && r <= 2 && c >= 6 && c <= 7) || (r >= 6 && r <= 7 && c >= 1 && c <= 2);
      const filled = corner || (!inner && Math.random() > 0.45);
      grid.push({ r, c, filled, corner, inner });
    }
    return grid;
  }, [pay]);
  return (
    <div style={{ background: "#102433", border: `1px solid ${color}33`,
      borderRadius: 16, padding: 16, marginBottom: 18, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60,
        background: bgColor, borderRadius: "0 16px 0 60px", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <div style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          QR-код · {label} · без перехода в приложение
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ background: "#fff", padding: 10, borderRadius: 12, flexShrink: 0,
          boxShadow: `0 4px 16px ${color}44` }}>
          <svg width={90} height={90} viewBox="0 0 9 9">
            {cells.map(({ r, c, filled, corner, inner }) => (
              <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1}
                fill={corner || inner ? "#111" : filled ? "#111" : "transparent"} />
            ))}
            {[[0, 0], [0, 6], [6, 0]].map(([r, c]) => (
              <g key={`${r}${c}`}>
                <rect x={c} y={r} width={3} height={3} fill="none" stroke="#111" strokeWidth={0.3} />
                <rect x={c + 0.8} y={r + 0.8} width={1.4} height={1.4} fill="#111" />
              </g>
            ))}
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#E8F4F8", marginBottom: 6 }}>
            Наведите камеру
          </div>
          <div style={{ fontSize: 12, color: "#9FC4CC", marginBottom: 10, lineHeight: 1.5 }}>
            Откроется {label} — подтвердите оплату одной кнопкой
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color }}>
            {formatSum(total)}
          </div>
          <div style={{ fontSize: 10, color: "#6C8E96", marginTop: 3 }}>
            🔒 Безопасный платёж
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Блок гарантий перед оплатой ─────────────────────────── */
function CheckoutGuarantees() {
  const items = [
    { icon: "🐠", title: "Гарантия 48 часов", desc: "Рыбы застрахованы — вернём деньги или заменим если погибнут", accent: "#00C9B1" },
    { icon: "🎥", title: "Видеофиксация",    desc: "Курьер снимет передачу заказа — доказательство здоровья рыб", accent: "#00C9B1" },
    { icon: "🔄", title: "Возврат 24 ч",     desc: "Не понравилось — вернём деньги без вопросов", accent: "#F0A93C" },
    { icon: "🔒", title: "Безопасная оплата", desc: "Данные карты не сохраняются — шифрование PCI DSS", accent: "#F0A93C" },
  ];
  return (
    <div style={{ background: "linear-gradient(135deg, #071C14, #071828)", border: "1px solid #00C9B133",
      borderRadius: 16, padding: "16px", marginBottom: 20,
      boxShadow: "0 4px 20px rgba(0,201,177,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#00C9B122",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✅</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#00C9B1", letterSpacing: "0.04em" }}>
          Покупаете с защитой AquaUZ
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {items.map(({ icon, title, desc, accent }) => (
          <div key={title} style={{ background: "#0B1B28", border: `1px solid ${accent}22`,
            borderRadius: 12, padding: "12px 10px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#E8F4F8", marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 10.5, color: "#6C8E96", lineHeight: 1.4 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Карточка курьера ─────────────────────────────────────── */
function CourierCard({ info }) {
  const initials = info.courier.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const ratingNum = info.rating || 4.8;
  const fullStars = Math.floor(ratingNum);
  const hasHalf = ratingNum - fullStars >= 0.5;
  return (
    <div style={{ background: "#0B1B28", border: "1px solid #1C3A4A", borderRadius: 16,
      padding: "16px", marginBottom: 16, overflow: "hidden", position: "relative" }}>
      {/* subtle glow */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: "radial-gradient(circle, #00C9B108, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ fontSize: 11, fontWeight: 700, color: "#6C8E96", marginBottom: 12,
        textTransform: "uppercase", letterSpacing: "0.07em" }}>Ваш курьер</div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Avatar with photo simulation */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #00C9B1, #F0A93C)",
            padding: 2 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%",
              background: "#102433",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#00C9B1" }}>
              {initials}
            </div>
          </div>
          {/* online dot */}
          <div style={{ position: "absolute", bottom: 2, right: 2,
            width: 12, height: 12, borderRadius: "50%",
            background: "#4ADE80", border: "2px solid #0B1B28" }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E8F4F8" }}>{info.courier}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <div style={{ display: "flex", gap: 1 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ fontSize: 13, color: i < fullStars ? "#F0A93C" : i === fullStars && hasHalf ? "#F0A93C88" : "#1C3A4A" }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F0A93C" }}>{ratingNum}</span>
            {info.trips != null && <span style={{ fontSize: 11, color: "#6C8E96" }}>· {info.trips} поездок</span>}
          </div>
          <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 3 }}>{info.phone}</div>
        </div>
      </div>

      {/* Trust badges */}
      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        {["🐠 Везёт живых рыб", "🎥 Снимет видео", "⏱ " + info.time].map((badge) => (
          <span key={badge} style={{ fontSize: 10.5, background: "#102433",
            border: "1px solid #1C3A4A", borderRadius: 999, padding: "3px 8px", color: "#9FC4CC" }}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Апсейл корма/оборудования ───────────────────────────── */
function UpsellBlock({ groupedCart, onAddUpsell }) {
  const cartIds = groupedCart.map((i) => i.id);
  const suggestions = UPSELL.filter((u) => !cartIds.includes(u.id));
  if (!suggestions.length) return null;
  return (
    <div style={{ background: "linear-gradient(135deg, #2A1E00, #1A1200)", border: "1px solid #F0A93C33",
      borderRadius: 16, padding: "14px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>🛒</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#F0A93C" }}>Не забудьте</div>
          <div style={{ fontSize: 11, color: "#9FC4CC", marginTop: 1 }}>Подобрано под рыб в вашем заказе</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {suggestions.slice(0, 2).map((u) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12,
            background: "#0B1B28", border: "1px solid #F0A93C22",
            borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{u.img}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#E8F4F8" }}>{u.name}</div>
              <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 1 }}>{u.reason}</div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#F0A93C", marginBottom: 5 }}>{formatSum(u.price)}</div>
              <button onClick={() => onAddUpsell(u)}
                style={{ background: "#F0A93C22", border: "1px solid #F0A93C",
                  borderRadius: 8, padding: "5px 12px", color: "#F0A93C",
                  fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                + Добавить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Анимированные рыбки на экране подтверждения ─────────── */
function FishRain({ items }) {
  const fishes = useMemo(() => items.flatMap((it) =>
    Array.from({ length: Math.min(it.qty || 1, 3) }, (_, i) => ({
      key: `${it.id}-${i}`, img: it.img,
      x: 5 + Math.random() * 90, delay: Math.random() * 2.5, dur: 2 + Math.random() * 1.5,
      size: 22 + Math.random() * 16,
    }))
  ), []);
  const confetti = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    key: i, x: Math.random() * 100, delay: Math.random() * 2,
    dur: 1.8 + Math.random() * 1.2,
    color: ["#00C9B1","#F0A93C","#4ADE80","#60A5FA","#F472B6"][i % 5],
    size: 5 + Math.random() * 5,
  })), []);

  return (
    <div style={{ position: "relative", height: 120, overflow: "hidden", marginBottom: 16 }}>
      <style>{`
        @keyframes fishSwim {
          0%  { transform:translateY(0) scale(1);   opacity:0; }
          15% { opacity:1; }
          85% { opacity:1; }
          100%{ transform:translateY(-120px) scale(0.5); opacity:0; }
        }
        @keyframes confettiFall {
          0%  { transform:translateY(-10px) rotate(0deg); opacity:0; }
          10% { opacity:1; }
          90% { opacity:0.8; }
          100%{ transform:translateY(120px) rotate(360deg); opacity:0; }
        }
      `}</style>
      {confetti.map((c) => (
        <div key={c.key} style={{
          position: "absolute", bottom: 0, left: `${c.x}%`,
          width: c.size, height: c.size * 0.4,
          background: c.color, borderRadius: 2,
          animation: `confettiFall ${c.dur}s ease-in ${c.delay}s both`,
        }} />
      ))}
      {fishes.map((f) => (
        <span key={f.key} style={{
          position: "absolute", bottom: 0, left: `${f.x}%`,
          fontSize: f.size, lineHeight: 1,
          animation: `fishSwim ${f.dur}s ease-in ${f.delay}s both`,
        }}>{f.img}</span>
      ))}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
        height: 32, background: "linear-gradient(transparent, #08131F)" }} />
    </div>
  );
}

/* ── Экран загрузки при оформлении заказа ────────────────── */
function CheckoutLoadingScreen({ onDone }) {
  const [dot, setDot] = useState(0);
  const msgs = ["Отправляем заказ…", "Назначаем курьера…", "Подтверждаем…"];
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 3), 900);
    const done = setTimeout(onDone, 2400);
    return () => { clearInterval(t); clearTimeout(done); };
  }, []);
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 20, animation: "ckSpin 2s linear infinite" }}>🐠</div>
      <style>{`@keyframes ckSpin{ 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
      <div style={{ fontSize: 16, color: "#E8F4F8", fontWeight: 700, marginBottom: 8 }}>
        {msgs[dot]}
      </div>
      <div style={{ width: 180, height: 4, background: "#1C3A4A", borderRadius: 2,
        margin: "16px auto 0", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#00C9B1", borderRadius: 2,
          animation: "ckFill 2.4s linear forwards" }} />
        <style>{`@keyframes ckFill{ from{width:0%} to{width:100%} }`}</style>
      </div>
    </div>
  );
}

/* ── STEP 1: адрес + телефон/SMS ─────────────────────────── */
function StepAddress({ region, onChangeRegion, address, setAddress, comment, setComment,
  slot, setSlot, phone, setPhone, deliveryInfo, onNext }) {

  const [smsInput, setSmsInput] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [smsError, setSmsError] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);
  const [touched, setTouched] = useState({});
  const [addrMode, setAddrMode] = useState("map"); // "map" | "manual"

  const phoneClean = phone.replace(/\D/g, "");
  const phoneOk = phoneClean.length >= 9;
  const addrOk = address.trim().length >= 5;
  const canNext = addrOk && phoneOk && smsVerified;

  function sendSMS() {
    if (!phoneOk) return;
    setSmsSent(true);
    setSmsError("");
  }
  function verifySMS() {
    if (smsInput === "1234") {
      setSmsVerified(true); setSmsError("");
    } else {
      setSmsError("Неверный код. Попробуйте ещё раз.");
    }
  }

  return (
    <div>
      {/* Сохранённые адреса */}
      <CkField label="Сохранённые адреса">
        <button onClick={() => setSavedOpen((v) => !v)} style={{ width: "100%", textAlign: "left",
          background: "#102433", border: "1px solid #1C3A4A", borderRadius: 12,
          padding: "10px 14px", color: "#9FC4CC", fontSize: 13, cursor: "pointer",
          display: "flex", justifyContent: "space-between" }}>
          <span>📋 Выбрать из сохранённых</span>
          <span>{savedOpen ? "▲" : "▼"}</span>
        </button>
        {savedOpen && (
          <div style={{ marginTop: 4, background: "#0B1B28", border: "1px solid #1C3A4A",
            borderRadius: 12, overflow: "hidden" }}>
            {SAVED_ADDRESSES.map((a) => (
              <button key={a} onClick={() => { setAddress(a); setAddrMode("manual"); setSavedOpen(false); setTouched((t) => ({ ...t, address: true })); }}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none",
                  borderBottom: "1px solid #1C3A4A", padding: "10px 14px",
                  fontSize: 13, color: "#E8F4F8", cursor: "pointer" }}>
                📍 {a}
              </button>
            ))}
          </div>
        )}
      </CkField>

      {/* Регион */}
      <CkField label="Регион доставки">
        <button onClick={onChangeRegion} style={{ width: "100%", textAlign: "left",
          background: "#102433", border: "1px solid #1C3A4A",
          borderRadius: 12, padding: "11px 14px", color: "#E8F4F8", fontSize: 14, cursor: "pointer",
          display: "flex", justifyContent: "space-between" }}>
          <span>📍 {region}</span>
          <span style={{ color: "#6C8E96" }}>изменить</span>
        </button>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "#6C8E96" }}>🚚 {formatSum(deliveryInfo.price)}</span>
          <span style={{ fontSize: 12, color: "#6C8E96" }}>⏱ {deliveryInfo.time}</span>
        </div>
      </CkField>

      {/* Адрес — карта или вручную */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <CkLabel>Адрес доставки</CkLabel>
          <div style={{ display: "flex", background: "#102433", border: "1px solid #1C3A4A",
            borderRadius: 8, overflow: "hidden", fontSize: 11 }}>
            {["map", "manual"].map((m) => (
              <button key={m} onClick={() => setAddrMode(m)}
                style={{ padding: "4px 10px", border: "none", cursor: "pointer",
                  background: addrMode === m ? "#0F2A26" : "transparent",
                  color: addrMode === m ? "#00C9B1" : "#6C8E96", fontWeight: addrMode === m ? 700 : 400 }}>
                {m === "map" ? "🗺️ Карта" : "✏️ Вручную"}
              </button>
            ))}
          </div>
        </div>

        {addrMode === "map" ? (
          <MapPicker region={region} onAddressSelect={(a) => { setAddress(a); setTouched((t) => ({ ...t, address: true })); }} />
        ) : (
          <>
            <input value={address} onChange={(e) => setAddress(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, address: true }))}
              placeholder="Улица, дом, квартира"
              style={{ width: "100%", background: "#102433", outline: "none", boxSizing: "border-box",
                border: `1px solid ${touched.address && !addrOk ? "#FF6B6B" : addrOk ? "#00C9B166" : "#1C3A4A"}`,
                borderRadius: 12, padding: "11px 14px", color: "#E8F4F8", fontSize: 14 }} />
            {touched.address && !addrOk && (
              <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 5 }}>Введите полный адрес (мин. 5 символов)</div>
            )}
          </>
        )}
      </div>

      {/* Комментарий */}
      <CkField label="Комментарий курьеру (необязательно)">
        <input value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="Напр.: домофон не работает, звоните"
          style={{ width: "100%", background: "#102433", border: "1px solid #1C3A4A",
            borderRadius: 12, padding: "11px 14px", color: "#E8F4F8", fontSize: 14,
            outline: "none", boxSizing: "border-box" }} />
      </CkField>

      {/* Телефон + SMS */}
      <CkField label="Номер телефона">
        <div style={{ display: "flex", gap: 8 }}>
          <input value={phone}
            onChange={(e) => { setPhone(e.target.value); setSmsVerified(false); setSmsSent(false); setSmsInput(""); }}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            placeholder="+998 90 000 00 00"
            style={{ flex: 1, background: "#102433", outline: "none", boxSizing: "border-box",
              border: `1px solid ${touched.phone && !phoneOk ? "#FF6B6B" : smsVerified ? "#4ADE80" : "#1C3A4A"}`,
              borderRadius: 12, padding: "11px 14px", color: "#E8F4F8", fontSize: 14 }} />
          <button onClick={sendSMS} disabled={!phoneOk || smsSent}
            style={{ flexShrink: 0, background: phoneOk && !smsSent ? "#0F2A26" : "#102433",
              border: `1px solid ${phoneOk && !smsSent ? "#00C9B1" : "#1C3A4A"}`,
              borderRadius: 12, padding: "11px 14px", color: phoneOk && !smsSent ? "#00C9B1" : "#6C8E96",
              fontSize: 13, fontWeight: 700, cursor: phoneOk && !smsSent ? "pointer" : "default" }}>
            {smsSent ? "Отправлен" : "Код"}
          </button>
        </div>
        {touched.phone && !phoneOk && (
          <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 5 }}>Введите номер телефона</div>
        )}
        {smsSent && !smsVerified && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: "#9FC4CC", marginBottom: 6 }}>
              Введите код из SMS (демо: <strong style={{ color: "#00C9B1" }}>1234</strong>)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={smsInput} onChange={(e) => setSmsInput(e.target.value)}
                maxLength={4} placeholder="_ _ _ _"
                style={{ flex: 1, background: "#102433", border: `1px solid ${smsError ? "#FF6B6B" : "#1C3A4A"}`,
                  borderRadius: 12, padding: "11px 14px", color: "#E8F4F8", fontSize: 18,
                  fontWeight: 800, letterSpacing: "0.3em", outline: "none", textAlign: "center" }} />
              <button onClick={verifySMS}
                style={{ flexShrink: 0, background: "#0F2A26", border: "1px solid #00C9B1",
                  borderRadius: 12, padding: "11px 16px", color: "#00C9B1", fontSize: 13,
                  fontWeight: 700, cursor: "pointer" }}>✓</button>
            </div>
            {smsError && <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 5 }}>{smsError}</div>}
          </div>
        )}
        {smsVerified && (
          <div style={{ fontSize: 12, color: "#4ADE80", marginTop: 6 }}>✓ Номер подтверждён</div>
        )}
      </CkField>

      {/* Время доставки */}
      <CkField label="Время доставки">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {TIME_SLOTS.map((s) => (
            <button key={s.id} onClick={() => setSlot(s.id)}
              style={{ background: slot === s.id ? "#0F2A26" : "#102433",
                border: `1px solid ${slot === s.id ? "#00C9B1" : "#1C3A4A"}`,
                borderRadius: 12, padding: "12px 8px", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: slot === s.id ? "#00C9B1" : "#E8F4F8" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#6C8E96", marginTop: 2 }}>{s.sub}</div>
            </button>
          ))}
        </div>
        <SlotTimer slotId={slot} />
      </CkField>

      {/* Уведомление о живых рыбах */}
      <div style={{ background: "#071C14", border: "1px solid #00C9B133",
        borderRadius: 12, padding: "12px 14px", fontSize: 12.5, color: "#9FC4CC",
        marginBottom: 22, lineHeight: 1.6 }}>
        🐠 Живые рыбы — везём в термопакете с кислородом. Курьер снимет видео при передаче.
      </div>

      <button disabled={!canNext} onClick={onNext}
        style={{ width: "100%", background: canNext ? "#00C9B1" : "#102433",
          color: canNext ? "#08131F" : "#6C8E96", border: "none", borderRadius: 14, padding: "14px",
          fontSize: 15, fontWeight: 800, cursor: canNext ? "pointer" : "default",
          boxShadow: canNext ? "0 4px 20px #00C9B144" : "none", transition: "all 0.2s" }}>
        {!smsVerified ? "Подтвердите телефон" : "Далее: способ оплаты →"}
      </button>
    </div>
  );
}

/* ── STEP 2: оплата ───────────────────────────────────────── */
function StepPayment({ pay, setPay, promo, setPromo, promoDiscount, setPromoDiscount,
  groupedCart, onAddUpsell, onBack, onNext, subtotal, discount, delivery, total, deliveryInfo, region }) {
  const [promoInput, setPromoInput] = useState(promo);
  const [promoErr, setPromoErr] = useState("");

  function applyPromo() {
    const key = promoInput.trim().toUpperCase();
    if (CHECKOUT_PROMOS[key]) {
      setPromo(key); setPromoDiscount(CHECKOUT_PROMOS[key]); setPromoErr("");
    } else {
      setPromoDiscount(0); setPromoErr("Промокод не найден");
    }
  }

  return (
    <div>
      <UpsellBlock groupedCart={groupedCart} onAddUpsell={onAddUpsell} />

      {/* Промокод */}
      <CkField label="Промокод">
        <div style={{ display: "flex", gap: 8 }}>
          <input value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoErr(""); }}
            placeholder="Напр.: AQUA10"
            style={{ flex: 1, background: "#102433",
              border: `1px solid ${promoErr ? "#FF6B6B" : promoDiscount > 0 ? "#4ADE80" : "#1C3A4A"}`,
              borderRadius: 12, padding: "11px 14px", color: "#E8F4F8", fontSize: 14,
              outline: "none", textTransform: "uppercase" }} />
          <button onClick={applyPromo}
            style={{ flexShrink: 0, background: "#0F2A26", border: "1px solid #00C9B1",
              borderRadius: 12, padding: "11px 16px", color: "#00C9B1",
              fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Применить
          </button>
        </div>
        {promoErr && <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 5 }}>{promoErr}</div>}
        {promoDiscount > 0 && <div style={{ fontSize: 12, color: "#4ADE80", marginTop: 5 }}>✓ Скидка {promoDiscount}% применена!</div>}
        <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 6 }}>Доступные коды: AQUA10 · FISH20 · NEWFISH</div>
      </CkField>

      {/* Способы оплаты */}
      <CkField label="Способ оплаты">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PAY_METHODS.map((m) => (
            <button key={m.id} onClick={() => setPay(m.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                background: pay === m.id ? "#0F2A26" : "#102433",
                border: `2px solid ${pay === m.id ? "#00C9B1" : "#1C3A4A"}`,
                borderRadius: 14, padding: "13px 14px", cursor: "pointer", transition: "all 0.15s" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: pay === m.id ? "#00C9B1" : "#E8F4F8" }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 2 }}>{m.sub}</div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${pay === m.id ? "#00C9B1" : "#1C3A4A"}`,
                background: pay === m.id ? "#00C9B1" : "none" }} />
            </button>
          ))}
        </div>
      </CkField>

      <QRMock pay={pay} total={total} />
      <CourierCard info={deliveryInfo} />
      <CheckoutGuarantees />

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6C8E96", marginBottom: 6 }}>
          <span>Товары</span><span>{formatSum(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4ADE80", marginBottom: 6 }}>
            <span>Скидка {promoDiscount}%</span><span>−{formatSum(discount)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6C8E96", marginBottom: 2 }}>
          <span>🚚 Доставка · {region}</span><span>{formatSum(delivery)}</span>
        </div>
        <div style={{ fontSize: 11, color: "#6C8E96", marginBottom: 10 }}>⏱ {deliveryInfo.time}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 800,
          paddingTop: 12, borderTop: "1px solid #1C3A4A" }}>
          <span style={{ color: "#E8F4F8" }}>К оплате</span>
          <span style={{ color: "#F0A93C" }}>{formatSum(total)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack}
          style={{ flex: "0 0 auto", background: "#102433", color: "#9FC4CC",
            border: "1px solid #1C3A4A", borderRadius: 14, padding: "13px 18px",
            fontSize: 14, cursor: "pointer" }}>← Назад</button>
        <button onClick={onNext}
          style={{ flex: 1, background: "#00C9B1", color: "#08131F", border: "none", borderRadius: 14,
            padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 4px 20px #00C9B144" }}>
          Подтвердить · {formatSum(total)}
        </button>
      </div>
    </div>
  );
}

/* ── STEP 3: подтверждение ───────────────────────────────── */
function StepDone({ orderId, address, slot, pay, groupedCart, deliveryInfo, region, onDone }) {
  const slotObj = TIME_SLOTS.find((s) => s.id === slot);
  const slotLabel = slotObj ? `${slotObj.label} · ${slotObj.sub}` : "";
  const payLabel = PAY_METHODS.find((m) => m.id === pay)?.label;
  return (
    <div style={{ textAlign: "center" }}>
      <FishRain items={groupedCart} />

      <div style={{ width: 80, height: 80, borderRadius: "50%",
        background: "#00C9B122", border: "2px solid #00C9B144",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36, margin: "0 auto 16px",
        boxShadow: "0 0 32px #00C9B133" }}>🎉</div>

      <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px",
        color: "#E8F4F8", fontFamily: "Georgia,serif" }}>Заказ принят!</h2>
      <p style={{ fontSize: 13, color: "#9FC4CC", marginBottom: 24, lineHeight: 1.6 }}>
        Заказ #{orderId} · {deliveryInfo.time}<br />
        Уведомим в Telegram при каждом изменении статуса
      </p>

      <div style={{ background: "#0B1B28", border: "1px solid #1C3A4A",
        borderRadius: 16, padding: "16px", marginBottom: 16, textAlign: "left" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6C8E96", marginBottom: 14,
          letterSpacing: "0.06em", textTransform: "uppercase" }}>Статус доставки</div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ORDER_STATUSES.map((s, i) => (
            <div key={s.key} style={{ textAlign: "center", flex: 1, position: "relative" }}>
              {i < ORDER_STATUSES.length - 1 && (
                <div style={{ position: "absolute", top: 13, left: "60%", right: "-40%",
                  height: 2, background: i === 0 ? "#00C9B1" : "#1C3A4A", zIndex: 0 }} />
              )}
              <div style={{ position: "relative", zIndex: 1, width: 28, height: 28,
                borderRadius: "50%", margin: "0 auto 6px",
                background: i === 0 ? "#00C9B1" : "#102433",
                border: `2px solid ${i === 0 ? "#00C9B1" : "#1C3A4A"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, boxShadow: i === 0 ? "0 0 12px #00C9B166" : "none" }}>
                {i === 0 ? "✓" : s.icon}
              </div>
              <div style={{ fontSize: 9, color: i === 0 ? "#00C9B1" : "#6C8E96", fontWeight: i === 0 ? 700 : 400 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#0B1B28", border: "1px solid #1C3A4A",
        borderRadius: 16, padding: "14px 16px", marginBottom: 16, textAlign: "left" }}>
        <CourierCard info={deliveryInfo} />
        {[
          ["📍", "Адрес", address || "уточняется"],
          ["🕐", "Время", slotLabel],
          ["💳", "Оплата", payLabel],
        ].map(([icon, key, val]) => (
          <div key={key} style={{ display: "flex", gap: 10, alignItems: "baseline",
            paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #1C3A4A" }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 10, color: "#6C8E96", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{key}</div>
              <div style={{ fontSize: 13, color: "#E8F4F8" }}>{val}</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: "#9FC4CC", lineHeight: 1.5 }}>
          🔔 Мы свяжемся с вами для подтверждения
        </div>
      </div>

      <button onClick={onDone}
        style={{ width: "100%", background: "#00C9B1", color: "#08131F", border: "none",
          borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer",
          boxShadow: "0 4px 20px #00C9B144", marginBottom: 10 }}>
        Готово
      </button>
    </div>
  );
}

/* ── Главный компонент Checkout (модалка) ────────────────── */
function Checkout({ region, cart, setCart, onClose, onDone, onChangeRegion }) {
  const [step, setStep] = useState(1); // 1 адрес, 2 оплата, 3 готово
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [slot, setSlot] = useState("day");
  const [phone, setPhone] = useState("");
  const [pay, setPay] = useState("cash");
  const [promo, setPromo] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  const orderId = useMemo(() => Math.floor(1000 + Math.random() * 9000), []);
  const deliveryInfo = DELIVERY_RATES[region] || { price: 35000, time: "сегодня", courier: "Курьер", phone: "", rating: 4.8, trips: 0 };

  const groupedCart = useMemo(() => groupCart(cart), [cart]);
  const subtotal = cart.reduce((s, f) => s + f.price, 0);
  const delivery = cart.length === 0 ? 0 : deliveryInfo.price;
  const discount = Math.round(subtotal * promoDiscount / 100);
  const total = subtotal - discount + delivery;

  function handleQtyChange(id, delta) {
    setCart((c) => {
      if (delta > 0) {
        const proto = c.find((x) => x.id === id);
        return proto ? [...c, { ...proto }] : c;
      } else {
        const idx = c.findIndex((x) => x.id === id);
        if (idx === -1) return c;
        const copy = [...c];
        copy.splice(idx, 1);
        return copy;
      }
    });
  }
  function handleRemove(id) {
    setCart((c) => c.filter((x) => x.id !== id));
  }
  function handleAddUpsell(u) {
    setCart((c) => [...c, { ...u }]);
  }

  function goToConfirm() {
    setLoading(true);
  }
  function handleDone() {
    const order = {
      id: orderId,
      date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
      items: cart,
      total,
      address,
      slot: TIME_SLOTS.find((s) => s.id === slot)?.label
        ? `${TIME_SLOTS.find((s) => s.id === slot).label} · ${TIME_SLOTS.find((s) => s.id === slot).sub}`
        : slot,
      pay,
      region,
      deliveryInfo,
      status: "accepted",
    };
    onDone(order);
  }

  const stepLabel = step === 1 ? "Адрес и время" : step === 2 ? "Способ оплаты" : "Заказ оформлен";

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.7)", zIndex: 180,
        display: "flex", alignItems: "flex-end" }}
      onClick={step !== 3 && !loading ? onClose : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#08131F", width: "100%", maxHeight: "92vh", overflowY: "auto",
          borderRadius: "20px 20px 0 0", color: "#E8F4F8", animation: "sheetUp 0.25s ease-out" }}
      >
        {/* Заголовок */}
        <div style={{ position: "sticky", top: 0, zIndex: 10,
          background: "rgba(8,19,31,0.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1C3A4A", padding: "14px 18px",
          display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => { if (step === 2) setStep(1); }}
            style={{ background: "none", border: "none",
              color: step === 2 ? "#9FC4CC" : "transparent",
              fontSize: 18, cursor: step === 2 ? "pointer" : "default", padding: 0, lineHeight: 1 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#6C8E96", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.06em" }}>{stepLabel}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#E8F4F8" }}>🐠 AquaUZ · Оформление</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 999,
            background: "#00C9B122", color: "#00C9B1", border: "1px solid #00C9B144" }}>#{orderId}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 18, cursor: "pointer", padding: 0 }}>✕</button>
        </div>

        {/* Тело */}
        <div style={{ padding: "24px 18px 36px" }}>
          {step < 3 && !loading && <CheckoutSteps current={step} />}

          {step < 3 && !loading && (
            <CheckoutCartSummary
              groupedCart={groupedCart} onQtyChange={handleQtyChange} onRemove={handleRemove}
              subtotal={subtotal} discount={discount}
              delivery={delivery} total={total}
              deliveryInfo={deliveryInfo} collapsed={step === 2} />
          )}

          {loading && <CheckoutLoadingScreen onDone={() => { setLoading(false); setStep(3); }} />}

          {!loading && step === 1 && (
            <StepAddress
              region={region} onChangeRegion={onChangeRegion}
              address={address} setAddress={setAddress}
              comment={comment} setComment={setComment}
              slot={slot} setSlot={setSlot}
              phone={phone} setPhone={setPhone}
              deliveryInfo={deliveryInfo}
              onNext={() => setStep(2)} />
          )}

          {!loading && step === 2 && (
            <StepPayment
              pay={pay} setPay={setPay}
              promo={promo} setPromo={setPromo}
              promoDiscount={promoDiscount} setPromoDiscount={setPromoDiscount}
              groupedCart={groupedCart} onAddUpsell={handleAddUpsell}
              onBack={() => setStep(1)} onNext={goToConfirm}
              subtotal={subtotal} discount={discount}
              delivery={delivery} total={total}
              deliveryInfo={deliveryInfo} region={region} />
          )}

          {!loading && step === 3 && (
            <StepDone
              orderId={orderId} address={address}
              slot={slot} pay={pay} groupedCart={groupedCart}
              deliveryInfo={deliveryInfo} region={region}
              onDone={handleDone} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- DeliveryTracker (экран отслеживания для клиента) ---------- */
function DeliveryTracker({ order, onBack, onSimulate }) {
  const currentIdx = ORDER_STATUSES.findIndex((s) => s.key === order.status);
  const info = order.deliveryInfo || DELIVERY_RATES[order.region] || { price: 35000, time: "сегодня", courier: "Курьер", phone: "" };
  const payLabel = PAY_METHODS.find((m) => m.id === order.pay)?.label || "";

  return (
    <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", paddingBottom: 30 }}>
      <div style={{ padding: "16px 16px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 14, marginBottom: 14, cursor: "pointer" }}>
          ← Назад
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Заказ #{order.id}</h2>
          <span style={{ fontSize: 12, color: "#6C8E96" }}>{order.date}</span>
        </div>
        <div style={{ fontSize: 13, color: "#9FC4CC", marginBottom: 20 }}>
          📍 {order.region} · ⏱ {info.time}
        </div>

        {/* Live status track */}
        <div style={{
          background: "#0E2030",
          border: "1px solid #1C3A4A",
          borderRadius: 16,
          padding: "18px 16px",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9FC4CC", marginBottom: 16 }}>
            Статус доставки
          </div>

          {ORDER_STATUSES.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={s.key} style={{ display: "flex", gap: 12, marginBottom: i < ORDER_STATUSES.length - 1 ? 0 : 0 }}>
                {/* connector line + dot */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? "#00C9B1" : active ? "#0F2A26" : "#102433",
                    border: `2px solid ${done ? "#00C9B1" : active ? "#00C9B1" : "#1C3A4A"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, flexShrink: 0,
                    boxShadow: active ? "0 0 12px rgba(0,201,177,0.45)" : "none",
                  }}>
                    {done ? "✓" : s.icon}
                  </div>
                  {i < ORDER_STATUSES.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 20, background: done ? "#00C9B1" : "#1C3A4A", margin: "2px 0" }} />
                  )}
                </div>
                {/* text */}
                <div style={{ paddingBottom: i < ORDER_STATUSES.length - 1 ? 16 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: done || active ? "#E8F4F8" : "#6C8E96" }}>
                    {s.label}
                  </div>
                  {active && (
                    <div style={{ fontSize: 12, color: "#9FC4CC", marginTop: 2 }}>{s.desc}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Courier card */}
        {(currentIdx >= 2) && order.status !== "delivered" && (
          <div style={{
            background: "#0E2030",
            border: "1px solid #1C3A4A",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "#102433", border: "1px solid #1C3A4A",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>
              🏍️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Ваш курьер</div>
              <div style={{ fontSize: 13, color: "#9FC4CC", marginTop: 1 }}>{info.courier}</div>
              <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 2 }}>⚠️ Везёт живых рыб — аккуратно!</div>
            </div>
            <a href={`tel:${info.phone}`} style={{
              background: "#00C9B1",
              color: "#08131F",
              border: "none",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              cursor: "pointer",
            }}>
              📞 Позвонить
            </a>
          </div>
        )}

        {/* Order summary */}
        <div style={{
          background: "#0E2030",
          border: "1px solid #1C3A4A",
          borderRadius: 16,
          padding: "16px",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9FC4CC", marginBottom: 12 }}>Состав заказа</div>
          {(order.items || []).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < (order.items.length - 1) ? "1px solid #15293A" : "none" }}>
              <span style={{ fontSize: 22 }}>{item.img}</span>
              <span style={{ flex: 1, fontSize: 13 }}>{item.name}</span>
              <span style={{ fontSize: 12, color: "#F0A93C" }}>{formatSum(item.price)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9FC4CC", marginTop: 10, paddingTop: 10, borderTop: "1px solid #15293A" }}>
            <span>🚚 Доставка</span><span>{formatSum(info.price)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, marginTop: 6 }}>
            <span>Итого</span><span style={{ color: "#F0A93C" }}>{formatSum(order.total)}</span>
          </div>
          <div style={{ fontSize: 12, color: "#6C8E96", marginTop: 8 }}>
            💳 {payLabel} · 📍 {order.address}
          </div>
        </div>

        {/* 48h guarantee */}
        {order.status === "delivered" && (
          <div style={{
            background: "#0F2A26",
            border: "1px solid #00C9B1",
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 16,
            fontSize: 13,
            color: "#9FC4CC",
            lineHeight: 1.6,
          }}>
            ✅ Заказ доставлен! Если в течение 48 часов с рыбой что-то не так — напишите нам, заменим бесплатно. Сделайте фото как доказательство.
          </div>
        )}

        {/* Demo buttons to simulate status progression */}
        {order.status !== "delivered" && (
          <div style={{
            background: "#102433",
            border: "1px dashed #1C3A4A",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 12,
            color: "#6C8E96",
            marginBottom: 12,
            textAlign: "center",
          }}>
            <div style={{ marginBottom: 8 }}>🎛 Демо: симуляция статуса доставки</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => onSimulate(s.key)}
                  style={{
                    background: order.status === s.key ? "#00C9B1" : "#1C3A4A",
                    color: order.status === s.key ? "#08131F" : "#9FC4CC",
                    border: "none",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- CourierView (интерфейс курьера) ---------- */
const DEMO_DELIVERIES = [
  {
    id: 1042,
    client: "Алишер К.",
    address: "ул. Навои 45, кв 12",
    phone: "+998 90 123 45 67",
    region: "Ташкент",
    items: [{ name: "Гуппи ×5 + Неоны ×10", img: "🐠" }],
    total: 195000,
    pay: "cash",
    slot: "День · 12:00–17:00",
    status: "courier",
    hasLivefish: true,
  },
  {
    id: 1039,
    client: "Малика Р.",
    address: "ул. Амира Темура 78, кв 3",
    phone: "+998 91 234 56 78",
    region: "Ташкент",
    items: [{ name: "Фильтр «Поток-100» + Корм", img: "⚙️" }],
    total: 83000,
    pay: "payme",
    slot: "Вечер · 17:00–21:00",
    status: "packed",
    hasLivefish: false,
  },
  {
    id: 1035,
    client: "Жасур Т.",
    address: "пр. Мустакиллик 22, офис 5",
    phone: "+998 93 345 67 89",
    region: "Ташкент",
    items: [{ name: "Дискус «Королевский» ×1", img: "👑" }],
    total: 205000,
    pay: "click",
    slot: "Утро · 9:00–12:00",
    status: "delivered",
    hasLivefish: true,
  },
];

function CourierView({ onBack }) {
  const [deliveries, setDeliveries] = useState(DEMO_DELIVERIES);
  const [selectedId, setSelectedId] = useState(null);
  const [earningsTab, setEarningsTab] = useState(false);

  const selected = deliveries.find((d) => d.id === selectedId);

  function advance(id) {
    setDeliveries((prev) => prev.map((d) => {
      if (d.id !== id) return d;
      const idx = ORDER_STATUSES.findIndex((s) => s.key === d.status);
      const next = ORDER_STATUSES[idx + 1];
      return next ? { ...d, status: next.key } : d;
    }));
  }

  const activeCount = deliveries.filter((d) => d.status !== "delivered").length;
  const doneCount = deliveries.filter((d) => d.status === "delivered").length;
  const earnings = deliveries.filter((d) => d.status === "delivered").length * 15000;

  if (earningsTab) {
    return (
      <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", padding: "16px" }}>
        <button onClick={() => setEarningsTab(false)} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 14, marginBottom: 18, cursor: "pointer" }}>
          ← Назад к доставкам
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 20px" }}>💰 Мой заработок</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            ["Сегодня", `${formatSum(earnings)}`],
            ["Доставок", `${doneCount} из ${deliveries.length}`],
            ["Рейтинг", "⭐ 4.9"],
            ["На маршруте", `${activeCount} шт`],
          ].map(([label, value]) => (
            <div key={label} style={{ background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 14, padding: "14px" }}>
              <div style={{ fontSize: 11, color: "#6C8E96", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#00C9B1" }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 14, padding: "14px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9FC4CC", marginBottom: 12 }}>История сегодня</div>
          {deliveries.filter((d) => d.status === "delivered").map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #15293A", fontSize: 13 }}>
              <span>#{d.id} — {d.client}</span>
              <span style={{ color: "#00C9B1" }}>+15 000 сум</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selected) {
    const statusIdx = ORDER_STATUSES.findIndex((s) => s.key === selected.status);
    const nextStatus = ORDER_STATUSES[statusIdx + 1];
    const payLabel = PAY_METHODS.find((m) => m.id === selected.pay)?.label || "";
    return (
      <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", padding: "16px 16px 30px" }}>
        <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 14, marginBottom: 14, cursor: "pointer" }}>
          ← К списку
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Заказ #{selected.id}</h2>
          <span style={{ fontSize: 12, color: "#6C8E96" }}>{selected.slot}</span>
        </div>

        {selected.hasLivefish && (
          <div style={{ background: "#2A1414", border: "1px solid #FF6B6B", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#FF8F8F", marginBottom: 14 }}>
            🐠 ЖИВЫЕ РЫБЫ — везти аккуратно! Не класть горизонтально. Термопакет не открывать.
          </div>
        )}

        <div style={{ background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 14, padding: "14px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Клиент</div>
          <div style={{ fontSize: 14, color: "#C9DEE2", marginBottom: 4 }}>{selected.client}</div>
          <div style={{ fontSize: 13, color: "#9FC4CC", marginBottom: 10 }}>📍 {selected.address}</div>
          <a href={`tel:${selected.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#00C9B1", color: "#08131F", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            📞 Позвонить клиенту
          </a>
        </div>

        <div style={{ background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 14, padding: "14px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Товары</div>
          {selected.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}>
              <span style={{ fontSize: 20 }}>{item.img}</span>
              <span>{item.name}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #15293A", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#9FC4CC" }}>Итого клиенту:</span>
            <span style={{ color: "#F0A93C", fontWeight: 700 }}>{formatSum(selected.total)}</span>
          </div>
          <div style={{ fontSize: 12, color: "#6C8E96", marginTop: 4 }}>💳 {payLabel}</div>
        </div>

        {/* Current status */}
        <div style={{ background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 14, padding: "14px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9FC4CC", marginBottom: 8 }}>Статус</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
            {ORDER_STATUSES.map((s, i) => (
              <div key={s.key} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 18, opacity: i <= statusIdx ? 1 : 0.25 }}>{s.icon}</div>
                <div style={{ fontSize: 9, color: i === statusIdx ? "#00C9B1" : i < statusIdx ? "#9FC4CC" : "#6C8E96", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {nextStatus && (
          <button
            onClick={() => { advance(selected.id); setSelectedId(null); }}
            style={{
              width: "100%",
              background: "#00C9B1",
              color: "#08131F",
              border: "none",
              borderRadius: 12,
              padding: "15px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {nextStatus.icon} {nextStatus.label === "Доставлен" ? "✅ ДОСТАВЛЕНО" : `→ ${nextStatus.label.toUpperCase()}`}
          </button>
        )}
        {!nextStatus && (
          <div style={{ textAlign: "center", color: "#00C9B1", fontWeight: 700, fontSize: 15 }}>
            ✅ Доставлено — отличная работа!
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", paddingBottom: 20 }}>
      <div style={{ padding: "16px 16px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 14, marginBottom: 10, cursor: "pointer" }}>
          ← Назад
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>🏍️ Мои доставки</h2>
          <button onClick={() => setEarningsTab(true)} style={{ background: "#102433", border: "1px solid #1C3A4A", borderRadius: 10, padding: "7px 12px", color: "#00C9B1", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            💰 {formatSum(earnings)}
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 12, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#F0A93C" }}>{activeCount}</div>
            <div style={{ fontSize: 11, color: "#6C8E96" }}>активных</div>
          </div>
          <div style={{ flex: 1, background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 12, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#00C9B1" }}>{doneCount}</div>
            <div style={{ fontSize: 11, color: "#6C8E96" }}>доставлено</div>
          </div>
        </div>

        {deliveries.map((d) => {
          const statusInfo = ORDER_STATUSES.find((s) => s.key === d.status);
          const isDone = d.status === "delivered";
          return (
            <div
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              style={{
                background: isDone ? "#0A1C14" : "#0E2030",
                border: `1px solid ${isDone ? "#1C3A2A" : d.hasLivefish ? "#F0A93C44" : "#1C3A4A"}`,
                borderRadius: 14,
                padding: "14px",
                marginBottom: 10,
                cursor: "pointer",
                opacity: isDone ? 0.7 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>#{d.id} — {d.client}</span>
                  {d.hasLivefish && <span style={{ marginLeft: 8, fontSize: 11, color: "#F0A93C", background: "#2A1800", padding: "2px 6px", borderRadius: 6 }}>🐠 Живые рыбы</span>}
                </div>
                <span style={{ fontSize: 12, color: statusInfo?.key === "delivered" ? "#00C9B1" : "#9FC4CC" }}>
                  {statusInfo?.icon} {statusInfo?.label}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#6C8E96" }}>📍 {d.address}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9FC4CC", marginTop: 4 }}>
                <span>{d.slot}</span>
                <span style={{ color: "#F0A93C" }}>{formatSum(d.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- AI Configurator (4 вопроса) ---------- */
const GOAL_OPTIONS = [
  { id: "beauty", icon: "🎨", label: "Для красоты", hint: "Эффектный, яркий аквариум" },
  { id: "breeding", icon: "🐣", label: "Для размножения", hint: "Разводить и наблюдать потомство" },
  { id: "pets", icon: "❤️", label: "Как питомцы", hint: "Узнают хозяина, привязанность" },
  { id: "kids", icon: "🧒", label: "Для детей", hint: "Просто, безопасно, неприхотливо" },
];

const EXPERIENCE_OPTIONS = [
  { id: "easy", label: "Новичок", hint: "Первый аквариум" },
  { id: "medium", label: "Есть опыт", hint: "Уже держал рыб" },
  { id: "hard", label: "Профи", hint: "Готов к сложным видам" },
];

function buildAiPlan({ volume, goal, experience, budget }) {
  // фильтр по объёму и сложности
  let pool = FISH_DB.filter((f) => f.minVolume <= volume);
  if (experience === "easy") pool = pool.filter((f) => f.difficulty !== "hard");
  if (experience !== "hard") pool = pool.filter((f) => f.difficulty !== "hard" || experience === "hard");

  // фильтр по цели — если ничего не подошло, ослабляем фильтр
  let byGoal = pool.filter((f) => f.goal.includes(goal));
  if (byGoal.length === 0) byGoal = pool;

  // убираем несовместимые пары — простая greedy-сборка
  const picked = [];
  for (const f of byGoal.sort((a, b) => a.price - b.price)) {
    const conflict = picked.some(
      (p) => f.avoid.includes(p.id) || p.avoid.includes(f.id)
    );
    if (!conflict) picked.push(f);
    if (picked.length >= 3) break;
  }

  // подгон под бюджет — считаем стайные количества (мелкие виды по 6 шт для красоты)
  const withQty = picked.map((f) => {
    const qty = f.size === "small" ? 6 : 1;
    return { ...f, qty };
  });

  let total = withQty.reduce((s, f) => s + f.price * f.qty, 0);
  // если перебор бюджета — урезаем количество мелких рыб
  while (total > budget && withQty.some((f) => f.qty > 2)) {
    const big = withQty.find((f) => f.qty > 2);
    big.qty -= 1;
    total = withQty.reduce((s, f) => s + f.price * f.qty, 0);
  }

  const equipment = [
    { name: `Аквариум ${volume} л`, price: Math.round(volume * 900) },
    { name: "Фильтр + компрессор", price: 85000 },
    { name: "Обогреватель с термостатом", price: 65000 },
    { name: "Грунт + декор", price: 40000 },
  ];
  const equipTotal = equipment.reduce((s, e) => s + e.price, 0);

  return { fish: withQty, fishTotal: total, equipment, equipTotal, grandTotal: total + equipTotal };
}

function AiConfigurator({ onClose, onApply }) {
  const [step, setStep] = useState(1);
  const [volume, setVolume] = useState(100);
  const [goal, setGoal] = useState(null);
  const [experience, setExperience] = useState(null);
  const [budget, setBudget] = useState(500000);
  const [plan, setPlan] = useState(null);
  const [generating, setGenerating] = useState(false);

  function goNext() {
    if (step === 3) {
      setGenerating(true);
      setStep(4);
      setTimeout(() => {
        setPlan(buildAiPlan({ volume, goal, experience, budget }));
        setGenerating(false);
      }, 900);
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#08131F",
        zIndex: 170,
        overflowY: "auto",
        color: "#E8F4F8",
      }}
    >
      <div style={{ padding: "16px 18px 40px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#9FC4CC" }}>🤖 AI-конфигуратор</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>

        {step <= 3 && (
          <div style={{ display: "flex", gap: 6, margin: "10px 0 24px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: n <= step ? "#00C9B1" : "#1C3A4A" }} />
            ))}
          </div>
        )}

        {/* Step 1 — объём */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Какой у вас объём?</h2>
            <p style={{ fontSize: 13, color: "#6C8E96", marginBottom: 24 }}>
              Или сколько литров планируете — точность не важна
            </p>
            <div style={{ textAlign: "center", fontSize: 40, fontWeight: 800, color: "#00C9B1", marginBottom: 6 }}>
              {volume} л
            </div>
            <input
              type="range"
              min={20}
              max={350}
              step={10}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: "100%", marginBottom: 8, accentColor: "#00C9B1" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6C8E96", marginBottom: 30 }}>
              <span>20 л — нано</span><span>350+ л — большой</span>
            </div>
            <button onClick={goNext} style={primaryBtn}>Далее →</button>
          </>
        )}

        {/* Step 2 — цель */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Для чего аквариум?</h2>
            <p style={{ fontSize: 13, color: "#6C8E96", marginBottom: 20 }}>Это определит каких рыб предложим</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    textAlign: "left",
                    background: goal === g.id ? "#0F2A26" : "#102433",
                    border: `1px solid ${goal === g.id ? "#00C9B1" : "#1C3A4A"}`,
                    borderRadius: 14,
                    padding: "14px",
                    color: "#E8F4F8",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{g.icon}</span>
                  <span>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{g.label}</div>
                    <div style={{ fontSize: 12, color: "#6C8E96" }}>{g.hint}</div>
                  </span>
                </button>
              ))}
            </div>
            <button onClick={goNext} disabled={!goal} style={goal ? primaryBtn : disabledBtn}>Далее →</button>
          </>
        )}

        {/* Step 3 — опыт + бюджет */}
        {step === 3 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Опыт и бюджет</h2>
            <p style={{ fontSize: 13, color: "#6C8E96", marginBottom: 18 }}>Чтобы не предложить слишком сложных рыб</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {EXPERIENCE_OPTIONS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setExperience(e.id)}
                  style={{
                    flex: 1,
                    background: experience === e.id ? "#0F2A26" : "#102433",
                    border: `1px solid ${experience === e.id ? "#00C9B1" : "#1C3A4A"}`,
                    borderRadius: 12,
                    padding: "12px 6px",
                    color: "#E8F4F8",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {e.label}
                  <div style={{ fontSize: 10.5, color: "#6C8E96", fontWeight: 400, marginTop: 2 }}>{e.hint}</div>
                </button>
              ))}
            </div>

            <label style={{ fontSize: 12, color: "#9FC4CC", display: "block", marginBottom: 6 }}>
              Бюджет на старт (рыбы + оборудование)
            </label>
            <div style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#F0A93C", marginBottom: 6 }}>
              {formatSum(budget)}
            </div>
            <input
              type="range"
              min={150000}
              max={3000000}
              step={50000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ width: "100%", marginBottom: 8, accentColor: "#F0A93C" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6C8E96", marginBottom: 30 }}>
              <span>150 000</span><span>3 000 000+</span>
            </div>

            <button onClick={goNext} disabled={!experience} style={experience ? primaryBtn : disabledBtn}>
              🤖 Сгенерировать план
            </button>
          </>
        )}

        {/* Step 4 — результат */}
        {step === 4 && (
          <>
            {generating && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9FC4CC", fontSize: 14 }}>
                🤖 AI подбирает рыб под {volume} л и {formatSum(budget)}…
              </div>
            )}
            {plan && !generating && (
              <>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px" }}>🎉 Ваш план готов</h2>
                <p style={{ fontSize: 13, color: "#6C8E96", marginBottom: 18 }}>
                  Аквариум {volume} л · {GOAL_OPTIONS.find((g) => g.id === goal)?.label}
                </p>

                <div style={{ fontSize: 13, fontWeight: 700, color: "#9FC4CC", marginBottom: 8 }}>🐠 Рыбы</div>
                {plan.fish.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#0E2030",
                      border: "1px solid #1C3A4A",
                      borderRadius: 12,
                      padding: "10px 12px",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{f.img}</span>
                    <span style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{f.name} {f.qty > 1 ? `×${f.qty}` : ""}</div>
                      <div style={{ fontSize: 11.5, color: "#6C8E96" }}>{formatSum(f.price)} / шт</div>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#F0A93C" }}>{formatSum(f.price * f.qty)}</span>
                  </div>
                ))}
                {plan.fish.length === 0 && (
                  <div style={{ fontSize: 13, color: "#6C8E96", marginBottom: 12 }}>
                    Под такой объём пока нет подходящих видов — попробуйте увеличить литраж.
                  </div>
                )}

                <div style={{ fontSize: 13, fontWeight: 700, color: "#9FC4CC", margin: "16px 0 8px" }}>🛠 Оборудование</div>
                {plan.equipment.map((e) => (
                  <div key={e.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#C9DEE2", padding: "5px 2px" }}>
                    <span>{e.name}</span><span>{formatSum(e.price)}</span>
                  </div>
                ))}

                <div style={{ borderTop: "1px solid #1C3A4A", marginTop: 14, paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9FC4CC", marginBottom: 4 }}>
                    <span>Рыбы</span><span>{formatSum(plan.fishTotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9FC4CC", marginBottom: 8 }}>
                    <span>Оборудование</span><span>{formatSum(plan.equipTotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 800 }}>
                    <span>Итого старт</span><span style={{ color: "#F0A93C" }}>{formatSum(plan.grandTotal)}</span>
                  </div>
                </div>

                <div
                  style={{
                    background: "#0F2A26",
                    border: "1px solid #1C3A4A",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 12.5,
                    color: "#9FC4CC",
                    margin: "14px 0",
                  }}
                >
                  ✅ Все рыбы в плане проверены AI на совместимость друг с другом
                </div>

                <button onClick={() => onApply(plan.fish)} style={primaryBtn}>
                  🐠 Добавить рыб в корзину
                </button>
                <button onClick={() => setStep(1)} style={{ ...ghostBtn, marginTop: 8 }}>
                  Пересоздать план
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const primaryBtn = {
  width: "100%",
  background: "#00C9B1",
  color: "#08131F",
  border: "none",
  borderRadius: 12,
  padding: "13px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};
const disabledBtn = { ...primaryBtn, background: "#1C3A4A", color: "#6C8E96", cursor: "default" };
const ghostBtn = {
  width: "100%",
  background: "none",
  color: "#9FC4CC",
  border: "1px solid #1C3A4A",
  borderRadius: 12,
  padding: "12px",
  fontSize: 14,
  cursor: "pointer",
};

/* ---------- Client Profile (мои аквариумы, заказы, избранное) ---------- */
const SEED_TANKS = [
  {
    id: "t1",
    name: "Гостиная",
    volume: 120,
    fishList: [
      { name: "Гуппи", qty: 5, img: "🐠" },
      { name: "Неон", qty: 12, img: "🐟" },
      { name: "Анциструс", qty: 2, img: "🐡" },
    ],
    lastWaterChange: 5,
  },
  {
    id: "t2",
    name: "Спальня — нано",
    volume: 40,
    fishList: [{ name: "Петушок", qty: 1, img: "👑" }],
    lastWaterChange: 1,
  },
];

const SEED_ORDERS = [
  {
    id: 4821,
    date: "24 июня",
    items: [
      { name: "Гуппи «Огненный хвост»", img: "🐠", qty: 3, type: "fish" },
      { name: "Корм хлопья «Универсал»", img: "🍽️", qty: 1, type: "food" },
    ],
    total: 93000,
    status: "Доставлен",
  },
  {
    id: 4790,
    date: "10 июня",
    items: [{ name: "Фильтр внутренний «Поток-100»", img: "⚙️", qty: 1, type: "equipment" }],
    total: 65000,
    status: "Доставлен",
  },
];

function WaterReminder({ days }) {
  const urgent = days >= 7;
  return (
    <div
      style={{
        marginTop: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: urgent ? "#2A1414" : "#0F2A26",
        border: `1px solid ${urgent ? "#FF6B6B" : "#1C3A4A"}`,
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
      }}
    >
      <span style={{ color: urgent ? "#FF8F8F" : "#9FC4CC" }}>
        {urgent ? "⚠️ Пора менять воду! " : "💧 "}Последняя смена воды: {days} {days === 1 ? "день" : "дней"} назад
      </span>
      {urgent && (
        <span style={{ color: "#FF6B6B", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>
          Напомнить
        </span>
      )}
    </div>
  );
}

function Profile({ onBack, onOpenCatalog, orders = [], userTanks = [], setUserTanks, onTrackOrder, onOpenDoctor, onOpenDiary, onOpenSeller, onOpenCourier, onOpenClub, onOpenAdmin }) {
  const [tab, setTab] = useState("tanks"); // tanks | orders | favorites
  const [newTankModal, setNewTankModal] = useState(false);
  const [tankName, setTankName] = useState("");
  const [tankVolume, setTankVolume] = useState(100);

  function createNewTank() {
    if (!tankName.trim()) return;
    const newTank = {
      id: "tank_" + Math.random().toString(36).substr(2, 9),
      name: tankName,
      volume: tankVolume,
      fishList: [],
      lastWaterChange: 0,
    };
    setUserTanks((prev) => [...prev, newTank]);
    setNewTankModal(false);
    setTankName("");
    setTankVolume(100);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", paddingBottom: 30 }}>
      <div style={{ padding: "16px 16px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 14, marginBottom: 14, cursor: "pointer" }}>
          ← Назад в каталог
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#102433",
              border: "1px solid #1C3A4A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            👤
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Алишер К.</div>
            <div style={{ fontSize: 12, color: "#6C8E96" }}>📍 Ташкент · с нами 3 месяца</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {[
            ["tanks", "🐠 Мои аквариумы"],
            ["orders", "📦 Заказы"],
            ["favorites", "❤️ Избранное"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                background: tab === id ? "#00C9B1" : "#102433",
                color: tab === id ? "#08131F" : "#9FC4CC",
                border: `1px solid ${tab === id ? "#00C9B1" : "#1C3A4A"}`,
                borderRadius: 10,
                padding: "9px 4px",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {tab === "tanks" && (
          <>
            {userTanks.length === 0 && (
              <div style={{ textAlign: "center", color: "#6C8E96", fontSize: 13, margin: "30px 0" }}>
                Пока нет ни одного аквариума — оформите первый заказ с рыбами,
                и мы предложим завести аквариум автоматически.
              </div>
            )}
            {userTanks.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#0E2030",
                  border: "1px solid #1C3A4A",
                  borderRadius: 14,
                  padding: "14px",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>🐠 Аквариум «{t.name}»</div>
                  <div style={{ fontSize: 12, color: "#6C8E96" }}>{t.volume} л</div>
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 4 }}>
                  {t.fishList.map((f) => (
                    <span key={f.name} style={{ fontSize: 12.5, color: "#C9DEE2" }}>
                      {f.img} {f.name} ×{f.qty}
                    </span>
                  ))}
                </div>
                <WaterReminder days={t.lastWaterChange} />
              </div>
            ))}

            <button
              onClick={() => setNewTankModal(true)}
              style={{
                width: "100%",
                border: "1px dashed #1C3A4A",
                background: "none",
                color: "#6C8E96",
                borderRadius: 14,
                padding: "16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              + Завести новый аквариум
            </button>
          </>
        )}

        {tab === "orders" && (
          <>
            {orders.length === 0 && (
              <div style={{ textAlign: "center", color: "#6C8E96", fontSize: 13, margin: "30px 0" }}>
                Пока нет заказов — самое время добавить первую рыбку 🐠
              </div>
            )}
            {orders.map((o) => {
              const fishItems = o.items.filter((it) => it.type === "fish");
              const statusInfo = ORDER_STATUSES.find((s) => s.key === o.status) || { label: o.status || "Принят", icon: "✅" };
              const isActive = o.status && o.status !== "delivered";
              return (
                <div
                  key={o.id}
                  style={{
                    background: "#0E2030",
                    border: `1px solid ${isActive ? "#00C9B144" : "#1C3A4A"}`,
                    borderRadius: 14,
                    padding: "14px",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Заказ №{o.id}</span>
                    <span style={{ fontSize: 12, color: "#6C8E96" }}>{o.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    {o.items.map((it, idx) => (
                      <span key={(it.id || it.name) + idx} style={{ fontSize: 22 }} title={it.name}>{it.img}</span>
                    ))}
                    <span style={{ fontSize: 12, color: "#9FC4CC", alignSelf: "center" }}>
                      {o.items.length} {o.items.length === 1 ? "товар" : "товара"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: o.status === "delivered" ? "#00C9B1" : "#F0A93C",
                        background: o.status === "delivered" ? "#0F2A26" : "#2A2210",
                        borderRadius: 999,
                        padding: "3px 10px",
                      }}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#F0A93C" }}>{formatSum(o.total)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {onTrackOrder && (
                      <button
                        onClick={() => onTrackOrder(o)}
                        style={{
                          flex: 1,
                          background: isActive ? "#00C9B1" : "#102433",
                          border: `1px solid ${isActive ? "#00C9B1" : "#1C3A4A"}`,
                          color: isActive ? "#08131F" : "#9FC4CC",
                          borderRadius: 10,
                          padding: "8px",
                          fontSize: 12.5,
                          fontWeight: isActive ? 700 : 500,
                          cursor: "pointer",
                        }}
                      >
                        {isActive ? "🚚 Отслеживать" : "📦 Детали заказа"}
                      </button>
                    )}
                    <button
                      onClick={() => onRepeatOrder(o)}
                      style={{
                        flex: 1,
                        background: "#102433",
                        border: "1px solid #1C3A4A",
                        color: "#9FC4CC",
                        borderRadius: 10,
                        padding: "8px",
                        fontSize: 12.5,
                        cursor: "pointer",
                      }}
                    >
                      Повторить заказ
                    </button>
                    {fishItems.length > 0 && (
                      <button
                        onClick={() => onCreateTankFromOrder(o)}
                        style={{
                          flex: 1,
                          background: "#0F2A26",
                          border: "1px solid #00C9B1",
                          color: "#00C9B1",
                          borderRadius: 10,
                          padding: "8px",
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        🐠 Завести аквариум
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === "favorites" && (
          <div style={{ textAlign: "center", color: "#6C8E96", fontSize: 13, marginTop: 40 }}>
            ❤️ Пока нет избранного — отмечайте рыб сердечком в каталоге
          </div>
        )}

        {/* ---- Сервисы ---- */}
        <div style={{ marginTop: 28, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#6C8E96", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Сервисы</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🩺", label: "AI-доктор рыб", sub: "Диагноз по симптомам", action: onOpenDoctor, accent: "#00C9B1" },
              { icon: "📔", label: "Дневник аквариума", sub: "Уход и напоминания", action: onOpenDiary, accent: "#9FC4CC" },
              { icon: "🏪", label: "Кабинет продавца", sub: "Продавайте рыб", action: onOpenSeller, accent: "#F0A93C" },
              { icon: "🏍️", label: "Кабинет курьера", sub: "Доставляйте заказы", action: onOpenCourier, accent: "#9FC4CC" },
              { icon: "👥", label: "Клуб аквариумистов", sub: "Общение и советы", action: onOpenClub, accent: "#9FC4CC" },
              { icon: "🔧", label: "Admin-панель", sub: "Управление системой", action: onOpenAdmin, accent: "#F0A93C" },
            ].map(s => (
              <button
                key={s.label}
                onClick={s.action}
                style={{
                  background: "#0E2030",
                  border: `1px solid #1C3A4A`,
                  borderRadius: 14,
                  padding: "14px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#E8F4F8",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: s.accent, lineHeight: 1.3 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 2 }}>{s.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {newTankModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5,10,16,0.7)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setNewTankModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0B1B28",
              borderRadius: 16,
              padding: "24px 18px",
              maxWidth: 320,
              width: "100%",
              color: "#E8F4F8",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>Новый аквариум</h3>
            <input
              value={tankName}
              onChange={(e) => setTankName(e.target.value)}
              placeholder="Название (например, Гостиная)"
              style={{
                width: "100%",
                background: "#102433",
                border: "1px solid #1C3A4A",
                borderRadius: 10,
                padding: "10px 12px",
                color: "#E8F4F8",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 12,
              }}
            />
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#9FC4CC", display: "block", marginBottom: 6 }}>
                Объём: {tankVolume} л
              </label>
              <input
                type="range"
                min={20}
                max={350}
                step={10}
                value={tankVolume}
                onChange={(e) => setTankVolume(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setNewTankModal(false)}
                style={{
                  flex: 1,
                  background: "#102433",
                  border: "1px solid #1C3A4A",
                  color: "#9FC4CC",
                  borderRadius: 10,
                  padding: "10px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>
              <button
                onClick={createNewTank}
                disabled={!tankName.trim()}
                style={{
                  flex: 1,
                  background: tankName.trim() ? "#00C9B1" : "#1C3A4A",
                  border: "none",
                  color: tankName.trim() ? "#08131F" : "#6C8E96",
                  borderRadius: 10,
                  padding: "10px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: tankName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   🏪 КАБИНЕТ ПРОДАВЦА — полноценный модуль
   ============================================================ */

// Демо-данные продавца
const SELLER_INITIAL_PRODUCTS = [
  { id: "sp1", name: "Гуппи «Огненный хвост»", emoji: "🐠", tone: "#F0A93C", price: 25000, qty: 12, active: true, views: 48, orders: 7, category: "fish" },
  { id: "sp2", name: "Неон «Голубая искра»", emoji: "🐟", tone: "#00C9B1", price: 8000, qty: 30, active: true, views: 112, orders: 18, category: "fish" },
  { id: "sp3", name: "Анциструс «Чистильщик»", emoji: "🐡", tone: "#00C9B1", price: 20000, qty: 5, active: true, views: 19, orders: 3, category: "fish" },
  { id: "sp4", name: "Корм хлопья «Универсал»", emoji: "🍽️", tone: "#6C8E96", price: 18000, qty: 20, active: false, views: 8, orders: 1, category: "food" },
];

const SELLER_INITIAL_ORDERS = [
  { id: 4201, date: "27 июня", buyer: "Анвар Т.", region: "Ташкент", items: ["Гуппи ×3", "Неон ×6"], total: 123000, status: "new", address: "ул. Амира Темура, 15, кв. 7" },
  { id: 4198, date: "26 июня", buyer: "Малика Р.", region: "Ташкент", items: ["Анциструс ×1"], total: 45000, status: "packed", address: "ул. Навои, 38" },
  { id: 4187, date: "25 июня", buyer: "Ботир С.", region: "Самарканд", items: ["Неон ×10", "Корм ×1"], total: 178000, status: "delivered", address: "ул. Регистан, 5" },
  { id: 4174, date: "23 июня", buyer: "Зарина К.", region: "Андижан", items: ["Гуппи ×2"], total: 95000, status: "delivered", address: "ул. Бабура, 12" },
];

const ORDER_STATUS_FLOW = [
  { key: "new",       label: "Новый",       icon: "🔔", color: "#F0A93C" },
  { key: "packed",    label: "Собирается",  icon: "📦", color: "#00C9B1" },
  { key: "courier",   label: "У курьера",   icon: "🏍️", color: "#9FC4CC" },
  { key: "delivered", label: "Доставлен",   icon: "✅", color: "#51CF66" },
  { key: "cancelled", label: "Отменён",     icon: "❌", color: "#FF6B6B" },
];

const S = {
  bg: "#08131F", card: "#0E2030", border: "#1C3A4A",
  teal: "#00C9B1", amber: "#F0A93C", text: "#E8F4F8",
  muted: "#6C8E96", soft: "#9FC4CC", red: "#FF6B6B",
  success: "#51CF66", successBg: "#0F2A26",
};

function fmtS(n) { return n.toLocaleString("ru-RU") + " сум"; }

/* ---- Мини-карточка товара в списке ---- */
function SellerProductRow({ product, onToggle, onEdit }) {
  return (
    <div style={{ background: S.card, border: `1px solid ${product.active ? S.border : "#0D1E2C"}`, borderRadius: 14, padding: "12px 14px", marginBottom: 10, opacity: product.active ? 1 : 0.6 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `radial-gradient(circle, ${product.tone}22, #050B12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
          {product.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
          <div style={{ fontSize: 12, color: S.amber, fontWeight: 700 }}>{fmtS(product.price)}</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
            👁 {product.views} · 🛒 {product.orders} · 📦 {product.qty} шт
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <button onClick={() => onToggle(product.id)} style={{
            background: product.active ? S.teal : "#1C3A4A",
            border: "none", borderRadius: 999,
            padding: "4px 10px", fontSize: 11, fontWeight: 700,
            color: product.active ? "#08131F" : S.muted, cursor: "pointer",
          }}>
            {product.active ? "● Активен" : "○ Скрыт"}
          </button>
          <button onClick={() => onEdit(product)} style={{
            background: "none", border: `1px solid ${S.border}`, borderRadius: 8,
            padding: "4px 10px", fontSize: 11, color: S.soft, cursor: "pointer",
          }}>✏️ Ред.</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Строка заказа ---- */
function SellerOrderRow({ order, onChangeStatus }) {
  const st = ORDER_STATUS_FLOW.find(s => s.key === order.status) || ORDER_STATUS_FLOW[0];
  const [open, setOpen] = useState(false);
  const nextStatuses = ORDER_STATUS_FLOW.filter(s => s.key !== order.status && s.key !== "cancelled");
  return (
    <div style={{ background: S.card, border: `1px solid ${order.status === "new" ? S.amber + "66" : S.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "12px 14px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Заказ #{order.id}</div>
            <div style={{ fontSize: 12, color: S.muted }}>{order.date} · {order.buyer} · {order.region}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: st.color, fontWeight: 700, marginBottom: 2 }}>{st.icon} {st.label}</div>
            <div style={{ fontSize: 13, color: S.amber, fontWeight: 800 }}>{fmtS(order.total)}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: S.soft, marginTop: 6 }}>{order.items.join(", ")}</div>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${S.border}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 12, color: S.muted, marginBottom: 10 }}>📍 {order.address}</div>
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <>
              <div style={{ fontSize: 12, color: S.soft, marginBottom: 8, fontWeight: 600 }}>Сменить статус:</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {nextStatuses.map(ns => (
                  <button key={ns.key} onClick={() => { onChangeStatus(order.id, ns.key); setOpen(false); }} style={{
                    background: "#102433", border: `1px solid ${ns.color}66`,
                    borderRadius: 8, padding: "6px 12px", fontSize: 12,
                    color: ns.color, cursor: "pointer", fontWeight: 600,
                  }}>
                    {ns.icon} {ns.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---- Добавить товар (многошаговый) ---- */
function SellerAddFlow({ onBack, onPublish }) {
  const [step, setStep] = useState(1); // 1=фото, 2=детали, 3=готово
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(null);
  const [chosenPhoto, setChosenPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("fish");

  const PHOTO_DB = {
    "гуппи": [
      { id: "g1", emoji: "🐠", tone: "#F0A93C", label: "Огненный хвост, профиль" },
      { id: "g2", emoji: "🐠", tone: "#E8744A", label: "Пара, крупный план" },
      { id: "g3", emoji: "🐠", tone: "#F2C14E", label: "Стайка, общий вид" },
    ],
    "неон": [
      { id: "n1", emoji: "🐟", tone: "#00C9B1", label: "Голубая искра, профиль" },
      { id: "n2", emoji: "🐟", tone: "#19A6D8", label: "Стайка неонов" },
      { id: "n3", emoji: "🐟", tone: "#0FB9A8", label: "Крупный план" },
    ],
    "петушок": [
      { id: "b1", emoji: "👑", tone: "#9B4DCA", label: "Синий вуаль, развёрнут" },
      { id: "b2", emoji: "👑", tone: "#C13584", label: "Красный, боковой вид" },
    ],
    "данио": [
      { id: "d1", emoji: "🐟", tone: "#F0A93C", label: "Зебра, профиль" },
      { id: "d2", emoji: "🐟", tone: "#D4A017", label: "Стайка данио" },
    ],
    "анциструс": [
      { id: "a1", emoji: "🐡", tone: "#00C9B1", label: "Присосался к стеклу" },
      { id: "a2", emoji: "🐡", tone: "#2A7F6F", label: "На коряге" },
    ],
  };

  function runSearch() {
    const key = Object.keys(PHOTO_DB).find(k => query.toLowerCase().includes(k));
    setLoading(true); setChosenPhoto(null);
    setTimeout(() => { setSearched(key ? PHOTO_DB[key] : []); setLoading(false); }, 700);
  }

  async function generateDesc() {
    if (!name.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Напиши краткое продающее описание товара для зоомагазина AquaUZ (Узбекистан). Товар: "${name}". Категория: ${category}. 2-3 предложения на русском языке. Только текст описания, без заголовков и markdown.` }],
        }),
      });
      const json = await res.json();
      setDesc(json.content?.[0]?.text?.trim() || "");
    } catch (e) { /* ignore */ }
    finally { setAiLoading(false); }
  }

  const photo = chosenPhoto && searched?.find(p => p.id === chosenPhoto);

  if (step === 3) return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Товар опубликован!</div>
      <div style={{ fontSize: 13, color: S.muted, marginBottom: 24, lineHeight: 1.5 }}>
        «{name}» появится в каталоге через несколько минут после проверки модератором.
      </div>
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "16px", marginBottom: 24, textAlign: "left" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: `radial-gradient(circle, ${photo?.tone || "#F0A93C"}22, #050B12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
            {photo?.emoji || "🐠"}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 13, color: S.amber, fontWeight: 700 }}>{price ? fmtS(parseInt(price)) : "—"}</div>
            <div style={{ fontSize: 12, color: S.muted }}>Кол-во: {qty} шт · {category}</div>
          </div>
        </div>
        {desc && <div style={{ fontSize: 12.5, color: S.soft, marginTop: 12, lineHeight: 1.5 }}>{desc}</div>}
      </div>
      <button onClick={() => onPublish({ id: `sp${Date.now()}`, name, emoji: photo?.emoji || "🐠", tone: photo?.tone || "#F0A93C", price: parseInt(price) || 0, qty: parseInt(qty) || 0, active: true, views: 0, orders: 0, category, desc })}
        style={{ width: "100%", background: S.teal, color: "#08131F", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
        ✅ Готово
      </button>
    </div>
  );

  return (
    <div style={{ padding: "0 0 32px" }}>
      {/* Step bar */}
      <div style={{ display: "flex", gap: 6, padding: "14px 16px 0" }}>
        {["Фото", "Детали", "Готово"].map((label, i) => {
          const n = i + 1; const done = step > n; const active = step === n;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", flex: n < 3 ? "1" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? S.teal : active ? S.teal + "33" : "#102433", border: `1.5px solid ${done || active ? S.teal : S.border}`, color: done ? "#08131F" : active ? S.teal : S.muted, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? "✓" : n}
                </div>
                <span style={{ fontSize: 11, color: active ? S.text : S.muted, fontWeight: active ? 700 : 400 }}>{label}</span>
              </div>
              {n < 3 && <div style={{ flex: 1, height: 1, background: done ? S.teal : S.border, margin: "0 6px" }} />}
            </div>
          );
        })}
      </div>

      {/* STEP 1 — фото */}
      {step === 1 && (
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Найдите фото товара</div>
          <div style={{ fontSize: 12.5, color: S.muted, marginBottom: 14 }}>Напишите название — AI подберёт варианты из базы</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && query.trim() && runSearch()}
              placeholder="Например: гуппи, неон..."
              style={{ flex: 1, background: "#102433", border: `1px solid ${S.border}`, borderRadius: 12, padding: "11px 14px", color: S.text, fontSize: 14, outline: "none" }} />
            <button onClick={runSearch} disabled={!query.trim()} style={{ background: query.trim() ? S.teal : "#1C3A4A", color: query.trim() ? "#08131F" : S.muted, border: "none", borderRadius: 12, padding: "0 16px", fontSize: 13, fontWeight: 700, cursor: query.trim() ? "pointer" : "default" }}>
              🤖 Найти
            </button>
          </div>

          {loading && <div style={{ textAlign: "center", color: S.muted, fontSize: 13, padding: "20px 0" }}>🤖 Ищу в базе…</div>}

          {searched && searched.length > 0 && (
            <>
              <div style={{ fontSize: 12.5, color: S.soft, marginBottom: 10 }}>Найдено {searched.length} варианта — выберите:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                {searched.map(p => (
                  <div key={p.id} onClick={() => setChosenPhoto(p.id)} style={{ background: "#0B1A27", border: `2px solid ${chosenPhoto === p.id ? S.teal : S.border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                    <div style={{ aspectRatio: "1/1", background: `radial-gradient(circle at 50% 35%, ${p.tone}33, #050B12 75%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{p.emoji}</div>
                    <div style={{ padding: "5px 8px", fontSize: 10.5, color: S.soft }}>{p.label}</div>
                    {chosenPhoto === p.id && (
                      <div style={{ position: "absolute", top: 6, right: 6, background: S.teal, color: "#08131F", borderRadius: 999, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {searched && searched.length === 0 && (
            <div style={{ border: `1px dashed ${S.border}`, borderRadius: 12, padding: "18px", textAlign: "center", color: S.muted, fontSize: 13, marginBottom: 14 }}>
              В базе нет фото для «{query}».<br />
              <span style={{ color: S.teal, fontWeight: 600 }}>📷 Загрузить своё фото</span>
            </div>
          )}
          <div onClick={() => { setChosenPhoto("own"); setSearched([]); }} style={{ border: `2px dashed ${chosenPhoto === "own" ? S.teal : S.border}`, borderRadius: 12, padding: "12px", textAlign: "center", fontSize: 13, color: chosenPhoto === "own" ? S.teal : S.muted, cursor: "pointer", marginBottom: 14 }}>
            📷 Загрузить своё фото
          </div>
          <button disabled={!chosenPhoto} onClick={() => { setName(query); setStep(2); }} style={{ width: "100%", background: chosenPhoto ? S.teal : "#1C3A4A", color: chosenPhoto ? "#08131F" : S.muted, border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: chosenPhoto ? "pointer" : "default" }}>
            Далее: описание →
          </button>
        </div>
      )}

      {/* STEP 2 — детали */}
      {step === 2 && (
        <div style={{ padding: "16px 16px 0" }}>
          {/* превью фото */}
          {photo && (
            <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "12px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: `radial-gradient(circle, ${photo.tone}33, #050B12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{photo.emoji}</div>
              <div>
                <div style={{ fontSize: 12, color: S.muted }}>Выбранное фото</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{photo.label}</div>
              </div>
              <button onClick={() => setStep(1)} style={{ marginLeft: "auto", background: "none", border: `1px solid ${S.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: S.soft, cursor: "pointer" }}>← Фото</button>
            </div>
          )}

          {/* Название */}
          <label style={{ fontSize: 12, color: S.soft, display: "block", marginBottom: 5 }}>Название товара *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Гуппи «Огненный хвост»"
            style={{ width: "100%", background: "#102433", border: `1px solid ${S.border}`, borderRadius: 12, padding: "11px 14px", color: S.text, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14 }} />

          {/* Категория */}
          <label style={{ fontSize: 12, color: S.soft, display: "block", marginBottom: 5 }}>Категория</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[["fish","🐠 Рыбы"],["food","🍽️ Корм"],["equipment","⚙️ Оборудование"],["plant","🌿 Растения"]].map(([k, l]) => (
              <button key={k} onClick={() => setCategory(k)} style={{ flex: 1, background: category === k ? S.teal + "22" : "#102433", border: `1px solid ${category === k ? S.teal : S.border}`, borderRadius: 10, padding: "8px 4px", fontSize: 11, color: category === k ? S.teal : S.soft, fontWeight: category === k ? 700 : 400, cursor: "pointer" }}>{l}</button>
            ))}
          </div>

          {/* Цена */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: S.soft, display: "block", marginBottom: 5 }}>Цена (сум) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="25000"
                style={{ width: "100%", background: "#102433", border: `1px solid ${S.border}`, borderRadius: 12, padding: "11px 14px", color: S.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: S.soft, display: "block", marginBottom: 5 }}>Количество *</label>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="10"
                style={{ width: "100%", background: "#102433", border: `1px solid ${S.border}`, borderRadius: 12, padding: "11px 14px", color: S.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Описание + AI */}
          <label style={{ fontSize: 12, color: S.soft, display: "block", marginBottom: 5 }}>Описание</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Расскажите о товаре..." rows={4}
            style={{ width: "100%", background: "#102433", border: `1px solid ${S.border}`, borderRadius: 12, padding: "11px 14px", color: S.text, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 8 }} />
          <button onClick={generateDesc} disabled={!name.trim() || aiLoading} style={{
            width: "100%", background: name.trim() && !aiLoading ? "#0F2A26" : "#102433",
            border: `1px solid ${name.trim() ? S.teal : S.border}`, borderRadius: 10,
            padding: "10px", fontSize: 13, color: name.trim() ? S.teal : S.muted,
            fontWeight: 600, cursor: name.trim() && !aiLoading ? "pointer" : "default", marginBottom: 16,
          }}>
            {aiLoading ? "🤖 Генерирую описание…" : "🤖 Сгенерировать описание через AI"}
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(1)} style={{ flex: "0 0 auto", background: "#102433", color: S.soft, border: `1px solid ${S.border}`, borderRadius: 12, padding: "13px 16px", fontSize: 14, cursor: "pointer" }}>← Назад</button>
            <button disabled={!name.trim() || !price || !qty} onClick={() => setStep(3)} style={{
              flex: 1, background: name.trim() && price && qty ? S.teal : "#1C3A4A",
              color: name.trim() && price && qty ? "#08131F" : S.muted,
              border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700,
              cursor: name.trim() && price && qty ? "pointer" : "default",
            }}>
              Опубликовать →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Главный кабинет продавца ---- */
function SellerCabinet({ onBack }) {
  const [tab, setTab] = useState("dashboard"); // dashboard | products | orders | add
  const [products, setProducts] = useState(SELLER_INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(SELLER_INITIAL_ORDERS);
  const [editProduct, setEditProduct] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  const newOrders = orders.filter(o => o.status === "new").length;
  const revenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const activeProducts = products.filter(p => p.active).length;

  function toggleProduct(id) {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }
  function changeOrderStatus(id, status) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  }
  function saveEditPrice() {
    setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, price: parseInt(editPrice) || p.price } : p));
    setEditProduct(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.text, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: S.card, borderBottom: `1px solid ${S.border}`, padding: "14px 16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: S.soft, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 8, display: "block" }}>← Назад в каталог</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: S.amber, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 2 }}>AquaUZ</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>🏪 Кабинет продавца</div>
          </div>
          {newOrders > 0 && (
            <div style={{ background: S.amber, color: "#08131F", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 800 }}>
              🔔 {newOrders} новых
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${S.border}`, background: S.card }}>
        {[["dashboard","📊","Сводка"],["products","📦","Товары"],["orders","🛒","Заказы"],["add","➕","Добавить"]].map(([id, icon, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "12px 4px", background: "none", border: "none",
            borderBottom: `2px solid ${tab === id ? S.teal : "transparent"}`,
            color: tab === id ? S.teal : S.muted,
            fontSize: 11, fontWeight: tab === id ? 700 : 400, cursor: "pointer",
          }}>
            <div style={{ fontSize: 16 }}>{icon}</div>
            {label}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={{ padding: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              ["💰", "Выручка", fmtS(revenue), S.amber],
              ["🔔", "Новых заказов", newOrders, S.amber],
              ["📦", "Активных товаров", activeProducts, S.teal],
              ["🛒", "Всего заказов", orders.length, S.teal],
            ].map(([icon, label, value, color]) => (
              <div key={label} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 11, color: S.muted, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Быстрые новые заказы */}
          {newOrders > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.amber, marginBottom: 10 }}>🔔 Требуют обработки:</div>
              {orders.filter(o => o.status === "new").map(o => (
                <SellerOrderRow key={o.id} order={o} onChangeStatus={changeOrderStatus} />
              ))}
            </>
          )}

          {/* Топ товаров */}
          <div style={{ fontSize: 13, fontWeight: 700, color: S.soft, marginBottom: 10, marginTop: 6 }}>🏆 Топ товаров по заказам:</div>
          {[...products].sort((a, b) => b.orders - a.orders).slice(0, 3).map((p, i) => (
            <div key={p.id} style={{ display: "flex", gap: 10, alignItems: "center", background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ fontSize: 20, color: [S.amber, S.soft, S.muted][i], fontWeight: 800, width: 20, textAlign: "center" }}>{["🥇","🥈","🥉"][i]}</div>
              <div style={{ fontSize: 20 }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: S.muted }}>🛒 {p.orders} заказов · {fmtS(p.price)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {tab === "products" && (
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Мои товары ({products.length})</div>
            <button onClick={() => setTab("add")} style={{ background: S.teal, color: "#08131F", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Добавить</button>
          </div>
          {products.map(p => (
            <SellerProductRow key={p.id} product={p} onToggle={toggleProduct} onEdit={p => { setEditProduct(p); setEditPrice(String(p.price)); }} />
          ))}
        </div>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <div style={{ padding: "16px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Все заказы ({orders.length})</div>
          {/* фильтр статусов */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
            {[{key:"all",label:"Все",color:S.soft},...ORDER_STATUS_FLOW].map(st => (
              <button key={st.key} style={{ whiteSpace: "nowrap", background: "#102433", border: `1px solid ${S.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: st.color || S.soft, cursor: "pointer" }}>
                {st.icon} {st.label}
              </button>
            ))}
          </div>
          {orders.map(o => (
            <SellerOrderRow key={o.id} order={o} onChangeStatus={changeOrderStatus} />
          ))}
        </div>
      )}

      {/* ADD PRODUCT */}
      {tab === "add" && (
        <SellerAddFlow
          onBack={() => setTab("products")}
          onPublish={newProduct => {
            setProducts(ps => [...ps, newProduct]);
            setTab("products");
          }}
        />
      )}

      {/* Модалка редактирования цены */}
      {editProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.8)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={() => setEditProduct(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0B1B28", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px 20px 32px" }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>✏️ Редактировать товар</div>
            <div style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>{editProduct.name}</div>
            <label style={{ fontSize: 12, color: S.soft, display: "block", marginBottom: 6 }}>Новая цена (сум)</label>
            <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} autoFocus
              style={{ width: "100%", background: "#102433", border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px 14px", color: S.text, fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditProduct(null)} style={{ flex: 1, background: "#102433", color: S.soft, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", fontSize: 14, cursor: "pointer" }}>Отмена</button>
              <button onClick={saveEditPrice} style={{ flex: 2, background: S.teal, color: "#08131F", border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   🩺 AI ДОКТОР РЫБ — встроенный модуль
   ============================================================ */

const MEDS_DOCTOR = [
  { id: "ich",       name: "Anti-Ich «Аквасейф»",      price: 18000, treats: ["ихтиофтириоз","белые точки","ich"],                    img: "💊", stock: true },
  { id: "fungus",    name: "Антигриб «МикоСтоп»",       price: 22000, treats: ["грибок","ватный налёт","columnaris"],                  img: "🧪", stock: true },
  { id: "bacteria",  name: "Антибактерин «БактоКлир»",  price: 28000, treats: ["бактериоз","язвы","плавниковая гниль","dropsy"],       img: "💉", stock: true },
  { id: "parasites", name: "Антипаразит «ПараКлир»",    price: 24000, treats: ["бархатная болезнь","якорный червь","trichodina","велвет"], img: "🔬", stock: true },
  { id: "salt",      name: "Аквариумная соль (500г)",   price: 9000,  treats: ["стресс","профилактика","раны"],                        img: "🧂", stock: true },
  { id: "vitamin",   name: "Витаминный комплекс «АкваВит»", price: 15000, treats: ["вялость","потеря окраса","плохой аппетит"],        img: "✨", stock: true },
];

const SYMPTOMS_DOCTOR = [
  { id: "white_dots", label: "Белые точки на теле",       icon: "⚪" },
  { id: "velvet",     label: "Золотистый налёт",           icon: "✨" },
  { id: "fins",       label: "Рваные или гнилые плавники", icon: "🪭" },
  { id: "cotton",     label: "Ватный налёт или пятна",     icon: "☁️" },
  { id: "ulcers",     label: "Язвы или раны на теле",      icon: "🔴" },
  { id: "bloat",      label: "Вздутие живота",             icon: "🫧" },
  { id: "behavior",   label: "Чешется о декор",            icon: "🔄" },
  { id: "appetite",   label: "Не ест, вялая",              icon: "😴" },
  { id: "surface",    label: "Часто всплывает за воздухом",icon: "⬆️" },
  { id: "color",      label: "Потеряла яркость окраса",    icon: "🎨" },
];

const FISH_OPTIONS_DOCTOR = [
  "Гуппи","Неоны","Петушок","Анциструс","Молли",
  "Скалярия","Дискус","Данио","Золотая рыбка","Цихлида","Другая",
];

const Pd = {
  bg:"#08131F",card:"#0E2030",border:"#1C3A4A",teal:"#00C9B1",
  amber:"#F0A93C",text:"#E8F4F8",muted:"#6C8E96",soft:"#9FC4CC",
  danger:"#FF6B6B",dangerBg:"#2A1414",successBg:"#0F2A26",red:"#FF6B6B",
};

function BubblesDoc() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {[...Array(8)].map((_,i)=>(
        <span key={i} style={{
          position:"absolute",left:`${10+i*12}%`,bottom:-10,
          width:4+(i%3)*4,height:4+(i%3)*4,borderRadius:"50%",
          background:"rgba(0,201,177,0.12)",border:"1px solid rgba(0,201,177,0.25)",
          animation:`bubbleUpDoc ${10+i*2}s linear ${i*1.5}s infinite`,
        }}/>
      ))}
      <style>{`
        @keyframes bubbleUpDoc{0%{transform:translateY(0);opacity:0}10%{opacity:1}100%{transform:translateY(-100vh);opacity:0}}
        @keyframes pulseDoc{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes slideUpDoc{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
    </div>
  );
}

function DBtn({ children, onClick, disabled, variant="primary", style: s }) {
  const base={width:"100%",border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:700,cursor:disabled?"default":"pointer",transition:"opacity 0.15s"};
  const styles={
    primary:{background:disabled?Pd.border:Pd.teal,color:disabled?Pd.muted:"#08131F"},
    ghost:{background:"none",border:`1px solid ${Pd.border}`,color:Pd.soft,fontSize:14,padding:"11px"},
    danger:{background:Pd.dangerBg,border:`1px solid ${Pd.red}66`,color:Pd.red},
  };
  return <button onClick={disabled?null:onClick} style={{...base,...styles[variant],...s}}>{children}</button>;
}

function DocStepFish({ onNext }) {
  const [fish,setFish]=useState("");
  const [custom,setCustom]=useState("");
  return (
    <div style={{animation:"slideUpDoc 0.3s ease"}}>
      <div style={{fontSize:13,color:Pd.soft,marginBottom:16,lineHeight:1.6}}>
        AI проанализирует симптомы и подберёт лекарство из нашего каталога.
      </div>
      <div style={{fontSize:13,fontWeight:700,color:Pd.soft,marginBottom:10}}>Какая рыба заболела?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {FISH_OPTIONS_DOCTOR.map(f=>(
          <button key={f} onClick={()=>setFish(f)} style={{
            background:fish===f?Pd.teal+"22":"#102433",
            border:`1px solid ${fish===f?Pd.teal:Pd.border}`,
            borderRadius:10,padding:"10px 8px",
            color:fish===f?Pd.teal:Pd.soft,
            fontSize:13,fontWeight:fish===f?700:400,cursor:"pointer",textAlign:"left",
          }}>{f}</button>
        ))}
      </div>
      {fish==="Другая"&&(
        <input autoFocus value={custom} onChange={e=>setCustom(e.target.value)}
          placeholder="Напишите название рыбы"
          style={{width:"100%",background:"#102433",border:`1px solid ${Pd.border}`,borderRadius:10,
            padding:"10px 12px",color:Pd.text,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:16}}/>
      )}
      <DBtn disabled={!fish||(fish==="Другая"&&!custom.trim())} onClick={()=>onNext(fish==="Другая"?custom:fish)}>
        Далее →
      </DBtn>
    </div>
  );
}

function DocStepSymptoms({ fishName, onNext, onBack }) {
  const [selected,setSelected]=useState([]);
  const [photoData,setPhotoData]=useState(null);
  const [photoName,setPhotoName]=useState("");
  const [extra,setExtra]=useState("");
  const fileRef=useRef();

  function toggle(id){setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);}
  function handleFile(e){
    const file=e.target.files?.[0];if(!file)return;
    setPhotoName(file.name);
    const reader=new FileReader();
    reader.onload=ev=>setPhotoData(ev.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  }
  const canNext=selected.length>0||photoData;
  return (
    <div style={{animation:"slideUpDoc 0.3s ease"}}>
      <div style={{background:Pd.card,border:`1px solid ${Pd.border}`,borderRadius:12,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:20}}>🐠</span>
        <div>
          <div style={{fontSize:13,fontWeight:700}}>{fishName}</div>
          <button onClick={onBack} style={{background:"none",border:"none",color:Pd.muted,fontSize:11,cursor:"pointer",padding:0}}>← изменить</button>
        </div>
      </div>
      <div style={{fontSize:13,fontWeight:700,color:Pd.soft,marginBottom:10}}>Отметьте симптомы:</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {SYMPTOMS_DOCTOR.map(s=>{
          const on=selected.includes(s.id);
          return(
            <button key={s.id} onClick={()=>toggle(s.id)} style={{
              background:on?"#0F2A26":"#102433",border:`1px solid ${on?Pd.teal:Pd.border}`,
              borderRadius:10,padding:"9px 10px",color:on?Pd.teal:Pd.soft,
              fontSize:12,fontWeight:on?700:400,cursor:"pointer",textAlign:"left",
              display:"flex",gap:6,alignItems:"center",
            }}>
              <span style={{fontSize:15}}>{s.icon}</span>
              <span style={{lineHeight:1.3}}>{s.label}</span>
            </button>
          );
        })}
      </div>
      <div onClick={()=>fileRef.current.click()} style={{
        border:`1.5px dashed ${photoData?Pd.teal:Pd.border}`,borderRadius:12,padding:"16px",
        textAlign:"center",cursor:"pointer",background:photoData?Pd.teal+"0D":"transparent",
        marginBottom:14,transition:"border-color 0.2s",
      }}>
        {photoData?(
          <div><div style={{fontSize:22,marginBottom:4}}>📸</div>
            <div style={{fontSize:12.5,color:Pd.teal,fontWeight:600}}>{photoName}</div>
            <div style={{fontSize:11,color:Pd.muted,marginTop:2}}>Фото загружено — AI проанализирует</div>
          </div>
        ):(
          <div><div style={{fontSize:24,marginBottom:4}}>📷</div>
            <div style={{fontSize:13,color:Pd.soft,fontWeight:600}}>Загрузить фото рыбы</div>
            <div style={{fontSize:11.5,color:Pd.muted,marginTop:2}}>AI поставит диагноз точнее</div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
      <textarea value={extra} onChange={e=>setExtra(e.target.value)}
        placeholder="Дополнительно: как давно заметили, что изменилось в поведении..."
        rows={3} style={{width:"100%",background:"#102433",border:`1px solid ${Pd.border}`,
          borderRadius:10,padding:"10px 12px",color:Pd.text,fontSize:13,outline:"none",
          resize:"none",boxSizing:"border-box",marginBottom:16}}/>
      <DBtn disabled={!canNext} onClick={()=>onNext({symptoms:selected,photoData,extra})}>
        🤖 Поставить диагноз
      </DBtn>
    </div>
  );
}

function DocStepDiagnosis({ fishName, data, onBack, onReset }) {
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [addedToCart,setAddedToCart]=useState([]);
  const ran=useRef(false);

  const symptomLabels=data.symptoms.map(id=>SYMPTOMS_DOCTOR.find(s=>s.id===id)?.label).filter(Boolean);

  async function diagnose(){
    setLoading(true);setError(null);
    const systemPrompt=`Ты — опытный ветеринар по аквариумным рыбам для магазина AquaUZ (Узбекистан).
Анализируй симптомы и ставь диагноз. Отвечай ТОЛЬКО в JSON, без markdown, без пояснений вне JSON.
Формат: {"disease":"Название болезни на русском","severity":"mild"|"moderate"|"severe","confidence":75,"description":"2-3 предложения","cause":"Основная причина","treatment":["шаг 1","шаг 2","шаг 3"],"meds":["ich"|"fungus"|"bacteria"|"parasites"|"salt"|"vitamin"],"urgency":"Немедленно"|"В течение суток"|"Можно подождать до 3 дней","prevention":"1-2 предложения","prognosis":"Хороший"|"Осторожный"|"Серьёзный"}
Доступные лекарства: ich, fungus, bacteria, parasites, salt, vitamin. Если не уверен — confidence<60, предложи salt+vitamin.`;
    const userMsg=[`Рыба: ${fishName}`,symptomLabels.length?`Симптомы: ${symptomLabels.join(", ")}`:"",data.extra?`Дополнительно: ${data.extra}`:"",].filter(Boolean).join("\n");
    try{
      const messages=data.photoData
        ?[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:data.photoData}},{type:"text",text:userMsg}]}]
        :[{role:"user",content:userMsg}];
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,system:systemPrompt,messages}),
      });
      const json=await res.json();
      const raw=json.content?.map(b=>b.text||"").join("").trim();
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch(e){setError("Не удалось получить диагноз. Проверьте соединение и попробуйте снова.");}
    finally{setLoading(false);}
  }

  useEffect(()=>{if(!ran.current){ran.current=true;diagnose();}},[]);

  const sevColor={mild:"#51CF66",moderate:Pd.amber,severe:Pd.danger};
  const sevLabel={mild:"Лёгкая",moderate:"Средняя",severe:"Тяжёлая"};
  const progColor={"Хороший":"#51CF66","Осторожный":Pd.amber,"Серьёзный":Pd.danger};

  if(loading) return(
    <div style={{textAlign:"center",padding:"50px 0",animation:"slideUpDoc 0.3s ease"}}>
      <div style={{fontSize:40,marginBottom:16,animation:"pulseDoc 1.5s infinite"}}>🔬</div>
      <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>AI анализирует симптомы…</div>
      <div style={{fontSize:13,color:Pd.muted,lineHeight:1.6}}>Проверяем базу болезней,<br/>подбираем лечение из каталога</div>
    </div>
  );
  if(error) return(
    <div style={{animation:"slideUpDoc 0.3s ease"}}>
      <div style={{background:Pd.dangerBg,border:`1px solid ${Pd.danger}66`,borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>⚠️</div>
        <div style={{fontSize:13,color:Pd.red}}>{error}</div>
      </div>
      <DBtn onClick={diagnose}>Попробовать снова</DBtn>
      <DBtn variant="ghost" onClick={onBack} style={{marginTop:8}}>← Назад</DBtn>
    </div>
  );
  if(!result) return null;
  const recommendedMeds=(result.meds||[]).map(id=>MEDS_DOCTOR.find(m=>m.id===id)).filter(Boolean);
  return(
    <div style={{animation:"slideUpDoc 0.3s ease"}}>
      <div style={{background:Pd.card,border:`1px solid ${sevColor[result.severity]}44`,borderRadius:16,padding:"16px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div>
            <div style={{fontSize:11,color:Pd.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>Диагноз AI</div>
            <div style={{fontSize:18,fontWeight:800}}>{result.disease}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{background:sevColor[result.severity]+"22",border:`1px solid ${sevColor[result.severity]}44`,color:sevColor[result.severity],borderRadius:999,fontSize:11.5,fontWeight:700,padding:"3px 10px",marginBottom:4}}>
              {sevLabel[result.severity]}
            </div>
            <div style={{fontSize:11,color:Pd.muted}}>уверенность {result.confidence}%</div>
          </div>
        </div>
        <div style={{fontSize:13,color:Pd.text,lineHeight:1.6,marginBottom:10}}>{result.description}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{background:"#102433",border:`1px solid ${Pd.border}`,borderRadius:8,padding:"6px 10px",fontSize:12}}>
            🕐 <span style={{color:result.urgency==="Немедленно"?Pd.danger:Pd.amber}}>{result.urgency}</span>
          </div>
          <div style={{background:"#102433",border:`1px solid ${Pd.border}`,borderRadius:8,padding:"6px 10px",fontSize:12}}>
            📊 Прогноз: <span style={{color:progColor[result.prognosis]||Pd.soft}}>{result.prognosis}</span>
          </div>
        </div>
      </div>
      <div style={{background:"#2A1F0A",border:`1px solid ${Pd.amber}33`,borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:13,color:Pd.amber,lineHeight:1.5}}>
        💡 <strong>Причина:</strong> {result.cause}
      </div>
      <div style={{fontSize:13,fontWeight:700,color:Pd.soft,marginBottom:8}}>🩺 Схема лечения:</div>
      <div style={{background:Pd.card,border:`1px solid ${Pd.border}`,borderRadius:14,padding:"14px",marginBottom:14}}>
        {(result.treatment||[]).map((step,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",paddingBottom:i<result.treatment.length-1?10:0,marginBottom:i<result.treatment.length-1?10:0,borderBottom:i<result.treatment.length-1?`1px solid ${Pd.border}`:"none"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:Pd.teal+"22",border:`1px solid ${Pd.teal}44`,color:Pd.teal,fontSize:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
            <div style={{fontSize:13,color:Pd.text,lineHeight:1.5,paddingTop:2}}>{step}</div>
          </div>
        ))}
      </div>
      {recommendedMeds.length>0&&(
        <>
          <div style={{fontSize:13,fontWeight:700,color:Pd.soft,marginBottom:8}}>💊 Лекарства из нашего магазина:</div>
          {recommendedMeds.map(med=>{
            const inCart=addedToCart.includes(med.id);
            return(
              <div key={med.id} style={{background:Pd.card,border:`1px solid ${inCart?Pd.teal+"66":Pd.border}`,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,transition:"border-color 0.2s"}}>
                <span style={{fontSize:24,width:44,height:44,borderRadius:12,background:"#102433",border:`1px solid ${Pd.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{med.img}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13.5,fontWeight:700}}>{med.name}</div>
                  <div style={{fontSize:13,color:Pd.amber,fontWeight:700}}>{med.price.toLocaleString("ru-RU")} сум</div>
                </div>
                <button onClick={()=>setAddedToCart(p=>inCart?p.filter(x=>x!==med.id):[...p,med.id])} style={{background:inCart?Pd.teal:"transparent",border:`1px solid ${inCart?Pd.teal:Pd.border}`,borderRadius:10,padding:"7px 12px",color:inCart?"#08131F":Pd.soft,fontSize:12.5,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                  {inCart?"✓ В корзине":"+ В корзину"}
                </button>
              </div>
            );
          })}
          {addedToCart.length>0&&(
            <div style={{background:Pd.successBg,border:`1px solid ${Pd.teal}44`,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,color:Pd.teal,textAlign:"center"}}>
              ✅ {addedToCart.length} {addedToCart.length===1?"лекарство":"лекарства"} добавлено
            </div>
          )}
        </>
      )}
      <div style={{background:Pd.successBg,border:`1px solid ${Pd.teal}22`,borderRadius:12,padding:"12px 14px",marginBottom:20,fontSize:13,color:Pd.soft,lineHeight:1.5}}>
        🛡 <strong style={{color:Pd.teal}}>Профилактика:</strong> {result.prevention}
      </div>
      {result.confidence<65&&(
        <div style={{background:Pd.dangerBg,border:`1px solid ${Pd.danger}44`,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12.5,color:"#FF8F8F",lineHeight:1.5}}>
          ⚠️ Уверенность AI ниже 65% — рекомендуем проконсультироваться с нашим специалистом в чате.
        </div>
      )}
      <DBtn variant="ghost" onClick={onReset}>🔄 Новая диагностика</DBtn>
    </div>
  );
}

function FishDoctorScreen({ onBack }) {
  const [step,setStep]=useState(1);
  const [fishName,setFishName]=useState("");
  const [diagData,setDiagData]=useState(null);
  const stepLabels=["Рыба","Симптомы","Диагноз"];
  function reset(){setStep(1);setFishName("");setDiagData(null);}
  return(
    <div style={{minHeight:"100vh",background:Pd.bg,color:Pd.text,paddingBottom:40}}>
      <div style={{background:Pd.card,borderBottom:`1px solid ${Pd.border}`,padding:"16px 16px 14px",position:"relative",overflow:"hidden"}}>
        <BubblesDoc/>
        <div style={{position:"relative",zIndex:1}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:Pd.soft,fontSize:13,cursor:"pointer",marginBottom:8,padding:0}}>← Назад в каталог</button>
          <div style={{fontSize:11,color:Pd.teal,fontWeight:700,letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>AquaUZ</div>
          <div style={{fontSize:21,fontWeight:900,letterSpacing:-0.5,marginBottom:2}}>🩺 AI Доктор рыб</div>
          <div style={{fontSize:12.5,color:Pd.muted}}>Опишите симптомы — AI поставит диагноз и подберёт лечение</div>
        </div>
      </div>
      <div style={{padding:"14px 16px 0",display:"flex",gap:6,alignItems:"center"}}>
        {stepLabels.map((label,i)=>{
          const n=i+1;const done=step>n;const active=step===n;
          return(
            <div key={n} style={{display:"flex",alignItems:"center",flex:n<3?"1":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:done?Pd.teal:active?Pd.teal+"33":"#102433",border:`1.5px solid ${done||active?Pd.teal:Pd.border}`,color:done?"#08131F":active?Pd.teal:Pd.muted,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {done?"✓":n}
                </div>
                <span style={{fontSize:11.5,color:active?Pd.text:Pd.muted,fontWeight:active?700:400}}>{label}</span>
              </div>
              {n<3&&<div style={{flex:1,height:1,background:done?Pd.teal:Pd.border,margin:"0 6px",transition:"background 0.3s"}}/>}
            </div>
          );
        })}
      </div>
      <div style={{padding:"16px 16px 0"}}>
        {step===1&&<DocStepFish onNext={name=>{setFishName(name);setStep(2);}}/>}
        {step===2&&<DocStepSymptoms fishName={fishName} onNext={data=>{setDiagData(data);setStep(3);}} onBack={()=>setStep(1)}/>}
        {step===3&&diagData&&<DocStepDiagnosis fishName={fishName} data={diagData} onBack={()=>setStep(2)} onReset={reset}/>}
      </div>
      <div style={{padding:"20px 16px 0",fontSize:11.5,color:Pd.muted,textAlign:"center",lineHeight:1.6}}>
        AI-диагностика не заменяет специалиста. При тяжёлых симптомах — напишите нам в чат.
      </div>
    </div>
  );
}

/* ============================================================
   📔 ДНЕВНИК АКВАРИУМА — интегрированный модуль
   ============================================================ */

const Dp = {
  bg: "#08131F", card: "#0E2030", border: "#1C3A4A",
  teal: "#00C9B1", amber: "#F0A93C", text: "#E8F4F8",
  muted: "#6C8E96", soft: "#9FC4CC", danger: "#FF6B6B",
  dangerBg: "#2A1414", successBg: "#0F2A26",
};

const DIARY_SEED_TANKS = [
  {
    id: "dt1", name: "Гостиная", volume: 120, emoji: "🌿",
    fish: [
      { id: "guppy", name: "Гуппи «Огненный хвост»", qty: 5, img: "🐠", temp: [22,28], lifespan: "3–5 лет", addedDate: "15 мая" },
      { id: "neon",  name: "Неон «Голубая искра»",   qty: 12, img: "🐟", temp: [20,26], lifespan: "4–6 лет", addedDate: "15 мая" },
      { id: "ancistrus", name: "Анциструс «Чистильщик»", qty: 2, img: "🐡", temp: [22,27], lifespan: "8–10 лет", addedDate: "20 мая" },
    ],
    logs: [
      { id: "l1", date: "23 июня", type: "water", note: "Смена 30% воды, добавил кондиционер", temp: 25 },
      { id: "l2", date: "16 июня", type: "water", note: "Плановая смена воды 30%", temp: 26 },
      { id: "l3", date: "10 июня", type: "clean", note: "Почистил стёкла и фильтр", temp: 25 },
      { id: "l4", date: "2 июня",  type: "feed",  note: "Начал давать корм «Цветной бустер»", temp: 25 },
    ],
    waterChangeEvery: 7, lastWaterChange: 5,
    filterCleanEvery: 30, lastFilterClean: 10,
    feedingSchedule: "2 раза в день",
    notes: "Неоны держатся у нижнего слоя — возможно стресс от света.",
    temperature: 25, ph: 7.2, no3: 30, nh4: 0.0,
    treatment: { name: "JBL Ektol crystal", day: 3, totalDays: 7 },
    tasks: [
      { id: "feed_morning", icon: "🍽️", label: "Покормить рыб утром", sub: "Ежедневно", done: true },
      { id: "water_change", icon: "💧", label: "Подменить 20% воды", sub: "Просрочено на 1 день", done: false, overdue: true },
      { id: "clean_glass",  icon: "🧽", label: "Почистить стекло",    sub: "Раз в неделю", done: false },
      { id: "check_filter", icon: "🔧", label: "Проверить фильтр",    sub: "Раз в 2 недели", done: false },
    ],
  },
  {
    id: "dt2", name: "Спальня — нано", volume: 40, emoji: "👑",
    fish: [
      { id: "betta", name: "Петушок «Королевский бархат»", qty: 1, img: "👑", temp: [24,29], lifespan: "2–4 года", addedDate: "1 июня" },
    ],
    logs: [
      { id: "l5", date: "24 июня", type: "water", note: "Смена 20% воды", temp: 27 },
      { id: "l6", date: "17 июня", type: "water", note: "Смена 20% воды. Петушок активен.", temp: 27 },
    ],
    waterChangeEvery: 7, lastWaterChange: 1,
    filterCleanEvery: 30, lastFilterClean: 20,
    feedingSchedule: "1 раз в день",
    notes: "Петушок реагирует на палец у стекла — узнаёт меня.",
    temperature: 27, ph: 7.0, no3: 10, nh4: 0.0,
    treatment: null,
    tasks: [
      { id: "feed_morning", icon: "🍽️", label: "Покормить петушка", sub: "Ежедневно", done: true },
      { id: "water_change", icon: "💧", label: "Подменить 20% воды", sub: "Раз в неделю", done: false },
    ],
  },
];

const DIARY_LOG_TYPES = [
  { id: "water",  icon: "💧", label: "Смена воды",  color: "#00C9B1" },
  { id: "clean",  icon: "🧹", label: "Чистка",       color: "#F0A93C" },
  { id: "feed",   icon: "🍽️", label: "Кормление",   color: "#51CF66" },
  { id: "health", icon: "🩺", label: "Здоровье",     color: "#F86B6B" },
  { id: "note",   icon: "📝", label: "Заметка",      color: "#9FC4CC" },
];

function diaryUrgency(daysAgo, interval) {
  const pct = daysAgo / interval;
  if (pct >= 1.0) return "overdue";
  if (pct >= 0.75) return "soon";
  return "ok";
}

function UrgencyBar({ daysAgo, interval, label }) {
  const pct = Math.min(daysAgo / interval, 1);
  const urg = diaryUrgency(daysAgo, interval);
  const color = urg === "overdue" ? Dp.danger : urg === "soon" ? Dp.amber : Dp.teal;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: Dp.soft, marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color: urg !== "ok" ? color : Dp.muted }}>
          {urg === "overdue" ? "⚠️ Просрочено!" : urg === "soon" ? "Скоро!" : `${interval - daysAgo} дн. осталось`}
        </span>
      </div>
      <div style={{ height: 5, background: Dp.border, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: color, borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function DPill({ text, color }) {
  return (
    <span style={{ fontSize: 11, background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 999, padding: "2px 9px", fontWeight: 600, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
}

/* ---- Чек-лист "Задачи на сегодня" + параметры воды (как в карточке аквариума) ---- */
function DiaryParamsGrid({ tank }) {
  const params = [
    { label: "pH", value: tank.ph, color: Dp.teal },
    { label: "Темп.", value: `${tank.temperature}°C`, color: Dp.amber },
    { label: "NO₃", value: tank.no3 ?? "—", color: tank.no3 > 40 ? Dp.danger : Dp.soft },
    { label: "NH₄", value: (tank.nh4 ?? 0).toFixed(1), color: (tank.nh4 ?? 0) > 0 ? Dp.danger : "#51CF66" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      {params.map((p, i) => (
        <div key={i} style={{ flex: 1, background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 12, padding: "9px 4px", textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: p.color }}>{p.value}</div>
          <div style={{ fontSize: 10, color: Dp.muted, marginTop: 1 }}>{p.label}</div>
        </div>
      ))}
    </div>
  );
}

function DiaryTaskList({ tank, onUpdate }) {
  function toggleTask(taskId) {
    const updatedTasks = tank.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
    onUpdate({ ...tank, tasks: updatedTasks });
  }
  if (!tank.tasks || tank.tasks.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: Dp.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
        Задачи на сегодня
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {tank.tasks.map(t => (
          <div key={t.id} onClick={() => toggleTask(t.id)} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: Dp.card, border: `1px solid ${t.overdue && !t.done ? Dp.amber + "66" : Dp.border}`,
            borderRadius: 12, padding: "10px 12px", cursor: "pointer",
          }}>
            <div style={{
              width: 22, height: 22, flexShrink: 0, borderRadius: 6,
              border: `1.5px solid ${t.done ? "#51CF66" : Dp.border}`,
              background: t.done ? "#51CF66" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: "#08131F", fontWeight: 900,
            }}>
              {t.done ? "✓" : ""}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13.5, fontWeight: 600,
                color: t.done ? Dp.muted : Dp.text,
                textDecoration: t.done ? "line-through" : "none",
              }}>
                {t.icon} {t.label}
              </div>
              <div style={{ fontSize: 11, color: t.overdue && !t.done ? Dp.amber : Dp.muted, marginTop: 1 }}>
                {t.overdue && !t.done ? "⚠️ " : ""}{t.sub}
              </div>
            </div>
          </div>
        ))}
        {tank.treatment && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#2A2210", border: `1px solid ${Dp.amber}66`,
            borderRadius: 12, padding: "10px 12px",
          }}>
            <div style={{ fontSize: 18 }}>💊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: Dp.amber }}>
                Курс лечения — день {tank.treatment.day}/{tank.treatment.totalDays}
              </div>
              <div style={{ fontSize: 11, color: Dp.soft, marginTop: 1 }}>
                Добавить {tank.treatment.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DiaryTankCard({ tank, onClick }) {
  const waterUrg = diaryUrgency(tank.lastWaterChange, tank.waterChangeEvery);
  const filterUrg = diaryUrgency(tank.lastFilterClean, tank.filterCleanEvery);
  const hasAlert = waterUrg !== "ok" || filterUrg !== "ok";
  const tasksDone = tank.tasks ? tank.tasks.filter(t => t.done).length : 0;
  const tasksTotal = tank.tasks ? tank.tasks.length : 0;
  return (
    <div onClick={onClick} style={{ background: Dp.card, border: `1px solid ${hasAlert ? Dp.amber + "66" : Dp.border}`, borderRadius: 16, padding: 16, marginBottom: 12, cursor: "pointer", position: "relative" }}>
      {hasAlert && (
        <div style={{ position: "absolute", top: 12, right: 12, background: Dp.amber, color: "#08131F", borderRadius: 999, fontSize: 10, fontWeight: 800, padding: "2px 8px" }}>
          Нужен уход
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#102433", border: `1px solid ${Dp.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
          {tank.emoji}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{tank.name}</div>
          <div style={{ fontSize: 12, color: Dp.muted }}>{tank.volume} л · {tank.fish.length} вида · {tank.fish.reduce((s,f)=>s+f.qty,0)} рыб</div>
        </div>
      </div>
      {tasksTotal > 0 && (
        <div style={{ fontSize: 11.5, color: tasksDone === tasksTotal ? "#51CF66" : Dp.soft, marginBottom: 10 }}>
          ✅ Задачи на сегодня: {tasksDone} из {tasksTotal}
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {tank.fish.map(f => <DPill key={f.id} text={`${f.img} ${f.name.split(" ")[0]} ×${f.qty}`} color={Dp.soft} />)}
      </div>
      <UrgencyBar daysAgo={tank.lastWaterChange} interval={tank.waterChangeEvery} label={`💧 Смена воды (каждые ${tank.waterChangeEvery} дн.)`} />
      <UrgencyBar daysAgo={tank.lastFilterClean} interval={tank.filterCleanEvery} label={`🧹 Чистка фильтра (каждые ${tank.filterCleanEvery} дн.)`} />
      <div style={{ fontSize: 12, color: Dp.muted, marginTop: 4 }}>🌡 {tank.temperature}°C · pH {tank.ph} · Кормление: {tank.feedingSchedule}</div>
    </div>
  );
}

function DiaryTankDetail({ tank, onBack, onUpdate }) {
  const [tab, setTab] = useState("diary");
  const [addingLog, setAddingLog] = useState(false);
  const [logType, setLogType] = useState("water");
  const [logNote, setLogNote] = useState("");
  const [logTemp, setLogTemp] = useState(tank.temperature);

  function addLog() {
    if (!logNote.trim()) return;
    const newLog = { id: "l" + Date.now(), date: "Сейчас", type: logType, note: logNote, temp: logTemp };
    onUpdate({
      ...tank, logs: [newLog, ...tank.logs],
      lastWaterChange: logType === "water" ? 0 : tank.lastWaterChange,
      lastFilterClean: logType === "clean" ? 0 : tank.lastFilterClean,
      temperature: logTemp,
    });
    setLogNote(""); setAddingLog(false);
  }

  const TABS = [
    { id: "diary", label: "📔 Дневник" },
    { id: "fish",  label: "🐠 Рыбы" },
    { id: "params", label: "🌡 Параметры" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: Dp.bg, color: Dp.text, paddingBottom: 30 }}>
      <div style={{ background: Dp.card, borderBottom: `1px solid ${Dp.border}`, padding: "14px 16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: Dp.soft, fontSize: 14, cursor: "pointer", marginBottom: 10 }}>← К аквариумам</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{tank.emoji}</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{tank.name}</div>
            <div style={{ fontSize: 12, color: Dp.muted }}>{tank.volume} л · {tank.fish.reduce((s,f)=>s+f.qty,0)} рыб · 🌡 {tank.temperature}°C</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "12px 16px 0" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: tab === t.id ? Dp.teal : "#102433", color: tab === t.id ? "#08131F" : Dp.soft, border: `1px solid ${tab === t.id ? Dp.teal : Dp.border}`, borderRadius: 10, padding: "8px 4px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        {/* DIARY TAB */}
        {tab === "diary" && (
          <>
            <DiaryParamsGrid tank={tank} />
            <DiaryTaskList tank={tank} onUpdate={onUpdate} />
            <UrgencyBar daysAgo={tank.lastWaterChange} interval={tank.waterChangeEvery} label={`💧 Смена воды (каждые ${tank.waterChangeEvery} дн.)`} />
            <UrgencyBar daysAgo={tank.lastFilterClean} interval={tank.filterCleanEvery} label={`🧹 Чистка фильтра (каждые ${tank.filterCleanEvery} дн.)`} />

            {addingLog ? (
              <div style={{ background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Новая запись</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {DIARY_LOG_TYPES.map(lt => (
                    <button key={lt.id} onClick={() => setLogType(lt.id)} style={{ background: logType === lt.id ? lt.color + "33" : "#102433", border: `1px solid ${logType === lt.id ? lt.color : Dp.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: logType === lt.id ? lt.color : Dp.muted, cursor: "pointer" }}>
                      {lt.icon} {lt.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={logNote} onChange={e => setLogNote(e.target.value)}
                  placeholder="Что сделали или заметили?"
                  style={{ width: "100%", background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 10, padding: "10px 12px", color: Dp.text, fontSize: 13, outline: "none", boxSizing: "border-box", minHeight: 70, resize: "none", marginBottom: 10 }}
                />
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: Dp.soft, marginBottom: 4 }}>🌡 Температура: <strong style={{ color: Dp.amber }}>{logTemp}°C</strong></div>
                  <input type="range" min={16} max={32} step={0.5} value={logTemp} onChange={e => setLogTemp(Number(e.target.value))} style={{ width: "100%", accentColor: Dp.amber }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setAddingLog(false)} style={{ flex: 1, background: "#102433", border: `1px solid ${Dp.border}`, color: Dp.soft, borderRadius: 10, padding: 10, fontSize: 13, cursor: "pointer" }}>Отмена</button>
                  <button onClick={addLog} disabled={!logNote.trim()} style={{ flex: 2, background: logNote.trim() ? Dp.teal : Dp.border, border: "none", color: logNote.trim() ? "#08131F" : Dp.muted, borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, cursor: logNote.trim() ? "pointer" : "default" }}>Сохранить</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingLog(true)} style={{ width: "100%", background: Dp.teal, border: "none", color: "#08131F", borderRadius: 12, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
                + Добавить запись
              </button>
            )}

            {tank.notes && (
              <div style={{ background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: Dp.soft, lineHeight: 1.5 }}>
                📝 {tank.notes}
              </div>
            )}

            {tank.logs.map(log => {
              const lt = DIARY_LOG_TYPES.find(t => t.id === log.type) || DIARY_LOG_TYPES[4];
              return (
                <div key={log.id} style={{ background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, background: lt.color + "22", color: lt.color, border: `1px solid ${lt.color}44`, borderRadius: 999, padding: "2px 8px", fontWeight: 600 }}>{lt.icon} {lt.label}</span>
                    <span style={{ fontSize: 11.5, color: Dp.muted }}>{log.date} · {log.temp}°C</span>
                  </div>
                  <div style={{ fontSize: 13, color: Dp.text, lineHeight: 1.5 }}>{log.note}</div>
                </div>
              );
            })}
          </>
        )}

        {/* FISH TAB */}
        {tab === "fish" && (
          <>
            {tank.fish.map(f => (
              <div key={f.id} style={{ background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 14, padding: "14px", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{f.img}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: Dp.muted }}>{f.qty} шт · добавлены {f.addedDate}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12, color: Dp.soft }}>
                  <span>🌡 {f.temp[0]}–{f.temp[1]}°C</span>
                  <span>⏳ Живёт {f.lifespan}</span>
                </div>
              </div>
            ))}
            {tank.fish.length === 0 && (
              <div style={{ textAlign: "center", color: Dp.muted, fontSize: 13, marginTop: 30 }}>
                Рыб ещё нет — добавьте рыб в аквариум из каталога
              </div>
            )}
          </>
        )}

        {/* PARAMS TAB */}
        {tab === "params" && (
          <div style={{ background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 14, padding: 16 }}>
            {[
              { label: "Объём аквариума", value: `${tank.volume} л` },
              { label: "Температура", value: `${tank.temperature}°C` },
              { label: "pH воды", value: String(tank.ph) },
              { label: "Кормление", value: tank.feedingSchedule },
              { label: "Смена воды каждые", value: `${tank.waterChangeEvery} дн.` },
              { label: "Чистка фильтра каждые", value: `${tank.filterCleanEvery} дн.` },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 5 ? `1px solid ${Dp.border}` : "none" }}>
                <span style={{ fontSize: 13, color: Dp.muted }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: Dp.text }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DiaryAddTankModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [volume, setVolume] = useState(100);
  const [emoji, setEmoji] = useState("🌿");
  const EMOJIS = ["🌿","🏔️","🪸","🌊","🐚","🌴","👑","✨"];

  function submit() {
    if (!name.trim()) return;
    onAdd({ id: "tank_" + Date.now(), name: name.trim(), volume, emoji, fish: [], logs: [], waterChangeEvery: 7, lastWaterChange: 0, filterCleanEvery: 30, lastFilterClean: 0, feedingSchedule: "2 раза в день", notes: "", temperature: 25, ph: 7.0 });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.75)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0B1B28", borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 420, color: Dp.text }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 18 }}>Новый аквариум</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{ width: 38, height: 38, borderRadius: 10, background: emoji === e ? Dp.teal + "33" : "#102433", border: `1px solid ${emoji === e ? Dp.teal : Dp.border}`, fontSize: 18, cursor: "pointer" }}>{e}</button>
          ))}
        </div>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Название (Гостиная, Кабинет...)" style={{ width: "100%", background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 10, padding: "11px 12px", color: Dp.text, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14 }} />
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12.5, color: Dp.soft, marginBottom: 6 }}>Объём: <strong style={{ color: Dp.amber }}>{volume} л</strong></div>
          <input type="range" min={20} max={500} step={10} value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: "100%", accentColor: Dp.amber }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: Dp.muted }}><span>20 л (нано)</span><span>500 л (XL)</span></div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#102433", border: `1px solid ${Dp.border}`, color: Dp.soft, borderRadius: 12, padding: 12, fontSize: 14, cursor: "pointer" }}>Отмена</button>
          <button onClick={submit} disabled={!name.trim()} style={{ flex: 2, background: name.trim() ? Dp.teal : Dp.border, border: "none", color: name.trim() ? "#08131F" : Dp.muted, borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700, cursor: name.trim() ? "pointer" : "default" }}>Создать</button>
        </div>
      </div>
    </div>
  );
}

function DiaryScreen({ onBack }) {
  const [tanks, setTanks] = useState(DIARY_SEED_TANKS);
  const [selectedTank, setSelectedTank] = useState(null);
  const [addModal, setAddModal] = useState(false);

  function updateTank(updated) {
    setTanks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTank(updated);
  }
  function addTank(tank) {
    setTanks(prev => [...prev, tank]);
    setAddModal(false);
    setSelectedTank(tank);
  }

  if (selectedTank) {
    return <DiaryTankDetail tank={selectedTank} onBack={() => setSelectedTank(null)} onUpdate={updateTank} />;
  }

  const totalLogs = tanks.reduce((s, t) => s + t.logs.length, 0);
  const totalFish = tanks.reduce((s, t) => s + t.fish.reduce((ss, f) => ss + f.qty, 0), 0);
  const waterChanges = tanks.reduce((s, t) => s + t.logs.filter(l => l.type === "water").length, 0);

  return (
    <>
      <div style={{ minHeight: "100vh", background: Dp.bg, color: Dp.text, paddingBottom: 30 }}>
        <div style={{ background: Dp.card, borderBottom: `1px solid ${Dp.border}`, padding: "16px 16px 14px", position: "relative", overflow: "hidden" }}>
          <Bubbles count={10} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", color: Dp.soft, fontSize: 13, cursor: "pointer", marginBottom: 8, padding: 0 }}>← Назад в каталог</button>
            <div style={{ fontSize: 11, color: Dp.teal, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>AquaUZ</div>
            <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: -0.5, marginBottom: 2 }}>📔 Дневник аквариума</div>
            <div style={{ fontSize: 12.5, color: Dp.muted }}>Ведите записи по уходу, следите за здоровьем рыб</div>
          </div>
        </div>

        <div style={{ padding: "12px 16px 0" }}>
          {/* Stats row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { icon: "💧", label: "Смен воды", value: waterChanges, color: Dp.teal },
              { icon: "📔", label: "Записей",   value: totalLogs,    color: Dp.amber },
              { icon: "🐠", label: "Всего рыб", value: totalFish,    color: Dp.soft },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{stat.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 10.5, color: Dp.muted }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {tanks.map(tank => (
            <DiaryTankCard key={tank.id} tank={tank} onClick={() => setSelectedTank(tank)} />
          ))}

          <button onClick={() => setAddModal(true)} style={{ width: "100%", border: `1px dashed ${Dp.border}`, background: "none", color: Dp.muted, borderRadius: 16, padding: 18, fontSize: 14, cursor: "pointer" }}>
            + Добавить аквариум
          </button>
        </div>
      </div>
      {addModal && <DiaryAddTankModal onClose={() => setAddModal(false)} onAdd={addTank} />}
    </>
  );
}

/* ============================================================
   👥 КЛУБ — сообщество AquaUZ (форум, обмен, конкурсы, города)
   ============================================================ */
const CLUB_TABS = [
  { id: "forum",   label: "Форум",   icon: "💬" },
  { id: "exchange", label: "Обмен",  icon: "🔄" },
  { id: "contest", label: "Конкурс", icon: "🏆" },
  { id: "cities",  label: "Города",  icon: "📍" },
];

const CLUB_POSTS = [
  {
    id: "p1", tab: "forum", author: "Aziz_Breeder", time: "2 часа назад", avatar: "🧑‍🦱",
    tag: { label: "Вопрос", color: "#00C9B1" },
    title: "Почему скалярия отказывается от корма уже 3 дня?",
    text: "Рыба активная, плавает нормально, но корм не ест вообще. Параметры воды в норме: pH 7.0, температура 27°C…",
    likes: 14, comments: 7, views: 203,
  },
  {
    id: "p2", tab: "contest", author: "AquaUZ Official", time: "вчера", avatar: "👑",
    tag: { label: "Конкурс", color: "#F0A93C" },
    title: "🏆 Конкурс «Лучший аквариум июня» — 500 000 UZS призовой фонд!",
    text: "Публикуйте фото своего аквариума с хэштегом #AquaUZ_June. Голосование до 30 июня. Победитель получает сертификат на оборудование…",
    likes: 89, comments: 43, views: null, cta: "Участвовать",
  },
  {
    id: "p3", tab: "exchange", author: "PlantLover_Samarkand", time: "3 часа назад", avatar: "🌿",
    tag: { label: "Обмен", color: "#51CF66" },
    title: "Меняю яванский мох на криптокорину или анубиас",
    text: "Много разросшегося явана, готов отдать пучок за любое теневыносливое растение. Самарканд, могу встретиться лично.",
    likes: 6, comments: 9, views: 88,
  },
  {
    id: "p4", tab: "forum", author: "Malika_T", time: "5 часов назад", avatar: "👩",
    tag: { label: "Совет", color: "#00C9B1" },
    title: "Какой обогреватель посоветуете для 60 л с дискусами?",
    text: "Сейчас стоит обогреватель на 50W, температура скачет на 2-3 градуса в холодную ночь. Может, взять мощнее с терморегулятором?",
    likes: 5, comments: 11, views: 130,
  },
  {
    id: "p5", tab: "cities", author: "Тимур (Ташкент)", time: "1 день назад", avatar: "📍",
    tag: { label: "Города", color: "#9FC4CC" },
    title: "Встреча аквариумистов Ташкента — 5 июля, парк Дружбы народов",
    text: "Собираемся обменяться рыбой и растениями, обсудить локальные особенности воды. Кто в Ташкенте — пишите в комментарии!",
    likes: 22, comments: 18, views: 310,
  },
  {
    id: "p6", tab: "exchange", author: "Rustam_Nukus", time: "2 дня назад", avatar: "🐠",
    tag: { label: "Обмен", color: "#51CF66" },
    title: "Отдам мальков гуппи бесплатно — самовывоз, Нукус",
    text: "Развелось слишком много, отдаю по 10-15 штук в добрые руки. Пишите в личку, заберите быстро — а то некуда сажать новых.",
    likes: 9, comments: 4, views: 71,
  },
];

function ClubPostCard({ post }) {
  return (
    <div style={{ background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: "#102433", border: `1px solid ${Dp.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          {post.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{post.author}</div>
          <div style={{ fontSize: 11, color: Dp.muted }}>{post.time}</div>
        </div>
        <DPill text={post.tag.label} color={post.tag.color} />
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 6, lineHeight: 1.35 }}>{post.title}</div>
      <div style={{ fontSize: 13, color: Dp.soft, lineHeight: 1.55, marginBottom: 12 }}>{post.text}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: Dp.muted }}>
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments} ответов</span>
        {post.views != null && <span>👁 {post.views}</span>}
        {post.cta && (
          <button style={{ marginLeft: "auto", background: "#2A1E00", border: "1px solid #F0A93C", color: "#F0A93C", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {post.cta}
          </button>
        )}
      </div>
    </div>
  );
}

function ClubScreen({ onBack }) {
  const [tab, setTab] = useState("forum");
  const [search, setSearch] = useState("");

  const filtered = CLUB_POSTS.filter(p => {
    if (p.tab !== tab) return false;
    if (search.trim() && !(p.title + p.text).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: Dp.bg, color: Dp.text, paddingBottom: 30 }}>
      <div style={{ background: Dp.card, borderBottom: `1px solid ${Dp.border}`, padding: "16px 16px 14px", position: "relative", overflow: "hidden" }}>
        <Bubbles count={10} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: Dp.soft, fontSize: 13, cursor: "pointer", marginBottom: 8, padding: 0 }}>← Назад в каталог</button>
          <div style={{ fontSize: 11, color: Dp.teal, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>AquaUZ</div>
          <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: -0.5, marginBottom: 10 }}>👥 Клуб</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Поиск в сообществе…"
            style={{ width: "100%", background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 12, padding: "10px 14px", color: Dp.text, fontSize: 13.5, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "14px 16px 0", overflowX: "auto" }}>
        {CLUB_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: tab === t.id ? "#0F2A26" : Dp.card,
              border: `1px solid ${tab === t.id ? Dp.teal : Dp.border}`,
              borderRadius: 12, padding: "9px 16px", cursor: "pointer",
              color: tab === t.id ? Dp.teal : Dp.soft,
            }}
          >
            <span style={{ fontSize: 17 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {filtered.length > 0 ? (
          filtered.map(post => <ClubPostCard key={post.id} post={post} />)
        ) : (
          <div style={{ textAlign: "center", color: Dp.muted, fontSize: 13, marginTop: 30 }}>
            Пока нет постов в этой категории — будьте первым!
          </div>
        )}
        <button style={{ width: "100%", border: `1px dashed ${Dp.border}`, background: "none", color: Dp.muted, borderRadius: 16, padding: 16, fontSize: 14, cursor: "pointer", marginBottom: 10 }}>
          + Создать пост
        </button>
      </div>
    </div>
  );
}

/* ---- Компактная лендинг-шапка для главной страницы ---- */
function HomeHero({ region, onChangeRegion, onOpenProfile, onOpenDoctor, onOpenDiary, onOpenSeller, onOpenCourier, onOpenClub, cart, onOpenCart }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse 100% 80% at 50% 0%, #0E2A36 0%, #08131F 80%)", paddingBottom: 0 }}>
      <Bubbles count={12} />

      {/* Топ-бар */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐠</span>
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.03em", color: "#00C9B1" }}>AquaUZ</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onOpenProfile} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 20, cursor: "pointer", padding: 0 }}>👤</button>
          <button onClick={onOpenCart} style={{ position: "relative", background: "#102433", border: "1px solid #1C3A4A", borderRadius: 10, padding: "6px 10px", color: "#E8F4F8", fontSize: 14, cursor: "pointer" }}>
            🛒
            {cart.length > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, background: "#00C9B1", color: "#08131F", fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "1px 5px" }}>{cart.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Hero текст */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px 16px 0", textAlign: "center" }}>
        <button onClick={onChangeRegion} style={{ background: "#00C9B122", border: "1px solid #00C9B144", borderRadius: 999, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: "#00C9B1", cursor: "pointer", marginBottom: 14 }}>
          📍 {region} ▾
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 8px", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
          Живые рыбы —<br />
          <span style={{ background: "linear-gradient(90deg,#00C9B1,#4DE8D5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>прямо к вам домой</span>
        </h1>
        <p style={{ fontSize: 13, color: "#9FC4CC", margin: "0 0 18px", lineHeight: 1.6 }}>300+ видов · Доставка сегодня · Гарантия 48 ч</p>

        {/* Продающие метки */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { icon: "✅", label: "Гарантия 48 ч", bg: "#0F2A26", border: "#00C9B144", color: "#00C9B1" },
            { icon: "🚚", label: "Доставка сегодня", bg: "#0B1B28", border: "#1C3A4A", color: "#9FC4CC" },
            { icon: "🐠", label: "300+ видов", bg: "#0B1B28", border: "#1C3A4A", color: "#9FC4CC" },
          ].map(b => (
            <div key={b.label} style={{ background: b.bg, border: `1px solid ${b.border}`, borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 700, color: b.color }}>
              {b.icon} {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Мини-статы */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 0, borderTop: "1px solid #1C3A4A", borderBottom: "1px solid #1C3A4A" }}>
        {[
          { val: "2 400+", lbl: "покупателей" },
          { val: "300+", lbl: "видов рыб" },
          { val: "48 ч", lbl: "гарантия" },
          { val: "12", lbl: "регионов" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRight: i < 3 ? "1px solid #1C3A4A" : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#00C9B1" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#6C8E96" }}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   🎯 ОНБОРДИНГ-КВИЗ
   3 шага: объём аквариума → опыт → цель
   Результат: персональный стартовый набор рыб + фильтр каталога
   ============================================================ */

const QUIZ_VOLUME_OPTIONS = [
  { id: "nano",   label: "Нано",     sub: "до 40 л",   icon: "🫙", min: 0,   max: 40  },
  { id: "small",  label: "Маленький",sub: "40–80 л",   icon: "🪣", min: 40,  max: 80  },
  { id: "medium", label: "Средний",  sub: "80–150 л",  icon: "🐟", min: 80,  max: 150 },
  { id: "large",  label: "Большой",  sub: "150–300 л", icon: "🌊", min: 150, max: 300 },
  { id: "xl",     label: "Огромный", sub: "300+ л",    icon: "🌍", min: 300, max: 9999},
];

const QUIZ_EXPERIENCE_OPTIONS = [
  { id: "zero",   label: "Первый раз",   sub: "Никогда не держал рыб",        icon: "🐣", difficulty: ["easy"] },
  { id: "some",   label: "Немного есть", sub: "Держал, но давно",             icon: "🌱", difficulty: ["easy","medium"] },
  { id: "medium", label: "Опытный",      sub: "Аквариум уже есть",            icon: "🎓", difficulty: ["easy","medium","hard"] },
  { id: "expert", label: "Профи",        sub: "Несколько аквариумов",         icon: "👑", difficulty: ["easy","medium","hard"] },
];

const QUIZ_GOAL_OPTIONS = [
  { id: "beauty",   label: "Красота",     sub: "Яркие, эффектные рыбы",        icon: "✨", goals: ["beauty"] },
  { id: "pets",     label: "Питомец",     sub: "Умная, узнаёт хозяина",        icon: "❤️", goals: ["pets"] },
  { id: "kids",     label: "Для детей",   sub: "Неприхотливая и безопасная",   icon: "🧒", goals: ["kids","pets"] },
  { id: "breeding", label: "Разведение",  sub: "Хочу получать потомство",      icon: "🐣", goals: ["breeding","beauty"] },
  { id: "design",   label: "Дизайн",      sub: "Аквариум как арт-объект",      icon: "🎨", goals: ["beauty"] },
];

/* Алгоритм подбора рыб по ответам квиза */
function getQuizRecommendations({ volume, experience, goal }) {
  const volOpt = QUIZ_VOLUME_OPTIONS.find(v => v.id === volume);
  const expOpt = QUIZ_EXPERIENCE_OPTIONS.find(e => e.id === experience);
  const goalOpt = QUIZ_GOAL_OPTIONS.find(g => g.id === goal);
  if (!volOpt || !expOpt || !goalOpt) return [];

  return FISH_DB
    .filter(f => {
      const fitsVolume = f.minVolume <= volOpt.max;
      const fitsDifficulty = expOpt.difficulty.includes(f.difficulty);
      const fitsGoal = goalOpt.goals.some(g => f.goal.includes(g));
      return fitsVolume && fitsDifficulty && fitsGoal;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
}

/* Компонент одного шага квиза */
function QuizStep({ stepNum, totalSteps, title, subtitle, options, selected, onSelect }) {
  return (
    <div style={{ animation: "qFadeIn 0.3s ease-out" }}>
      <style>{`
        @keyframes qFadeIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes qPop { 0%{transform:scale(1)} 40%{transform:scale(0.96)} 100%{transform:scale(1)} }
      `}</style>

      {/* Прогресс */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#6C8E96", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Шаг {stepNum} из {totalSteps}
          </span>
          <span style={{ fontSize: 11, color: "#00C9B1", fontWeight: 700 }}>
            {Math.round((stepNum / totalSteps) * 100)}%
          </span>
        </div>
        <div style={{ height: 3, background: "#1C3A4A", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: `${(stepNum / totalSteps) * 100}%`,
            background: "linear-gradient(90deg, #00C9B1, #4DE8D5)",
            transition: "width 0.5s ease"
          }} />
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.02em", fontFamily: "Georgia, serif", lineHeight: 1.25 }}>
        {title}
      </h2>
      <p style={{ fontSize: 13, color: "#6C8E96", margin: "0 0 24px", lineHeight: 1.5 }}>{subtitle}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map(opt => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              style={{
                display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                background: isSelected ? "#0F2A26" : "#102433",
                border: `2px solid ${isSelected ? "#00C9B1" : "#1C3A4A"}`,
                borderRadius: 16, padding: "14px 16px", cursor: "pointer",
                transition: "all 0.15s",
                animation: isSelected ? "qPop 0.2s ease" : "none",
                boxShadow: isSelected ? "0 0 0 3px #00C9B122" : "none",
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: isSelected ? "#00C9B122" : "#0B1B28",
                border: `1px solid ${isSelected ? "#00C9B144" : "#1C3A4A"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, transition: "all 0.15s",
              }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? "#00C9B1" : "#E8F4F8", marginBottom: 2 }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 12, color: "#6C8E96", lineHeight: 1.4 }}>{opt.sub}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${isSelected ? "#00C9B1" : "#1C3A4A"}`,
                background: isSelected ? "#00C9B1" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "#08131F", transition: "all 0.15s",
              }}>
                {isSelected ? "✓" : ""}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Экран результата квиза */
function QuizResult({ answers, onAddToCart, onGoToCatalog }) {
  const recs = getQuizRecommendations(answers);
  const volLabel = QUIZ_VOLUME_OPTIONS.find(v => v.id === answers.volume)?.label || "";
  const expLabel = QUIZ_EXPERIENCE_OPTIONS.find(e => e.id === answers.experience)?.label || "";
  const goalLabel = QUIZ_GOAL_OPTIONS.find(g => g.id === answers.goal)?.label || "";

  const [added, setAdded] = useState({});

  function handleAdd(fish) {
    setAdded(prev => ({ ...prev, [fish.id]: true }));
    onAddToCart(fish);
  }

  return (
    <div style={{ animation: "qFadeIn 0.4s ease-out" }}>
      <style>{`@keyframes qFadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Заголовок результата */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "#00C9B122", border: "2px solid #00C9B144",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 16px",
          boxShadow: "0 0 28px #00C9B133",
          animation: "qFadeIn 0.5s ease-out 0.1s both",
        }}>🎯</div>

        <h2 style={{ fontSize: 21, fontWeight: 900, margin: "0 0 8px", fontFamily: "Georgia, serif", lineHeight: 1.3 }}>
          Ваш стартовый набор готов
        </h2>

        {/* Теги ответов */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: volLabel, icon: "🪣" },
            { label: expLabel, icon: "🎓" },
            { label: goalLabel, icon: "🎯" },
          ].map(tag => (
            <span key={tag.label} style={{
              fontSize: 11, fontWeight: 600,
              background: "#00C9B122", border: "1px solid #00C9B144",
              color: "#00C9B1", borderRadius: 999, padding: "3px 10px",
            }}>
              {tag.icon} {tag.label}
            </span>
          ))}
        </div>
      </div>

      {recs.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6C8E96", padding: "32px 0", fontSize: 14 }}>
          Нет рыб для таких параметров — попробуйте другие ответы
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "#9FC4CC", marginBottom: 16, lineHeight: 1.6 }}>
            Специально для вас — {recs.length} рыб, которые подойдут под ваш аквариум, опыт и цель:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {recs.map((fish, i) => (
              <div
                key={fish.id}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "#0E2030", border: "1px solid #1C3A4A",
                  borderRadius: 16, padding: "14px 14px",
                  animation: `qFadeIn 0.4s ease-out ${0.05 * i + 0.15}s both`,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                  background: `radial-gradient(circle, ${fish.color}22, #050B12 70%)`,
                  border: "1px solid #1C3A4A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30,
                }}>
                  {fish.img}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#E8F4F8", marginBottom: 2, lineHeight: 1.3 }}>
                    {fish.name}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                    {fish.badges.slice(0, 2).map(b => (
                      <span key={b} style={{ fontSize: 10, background: "#102433", color: "#9FC4CC", borderRadius: 6, padding: "2px 6px" }}>{b}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#6C8E96" }}>
                    ⭐ {fish.rating} · мин. {fish.minVolume} л
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#F0A93C", marginBottom: 6 }}>
                    {(fish.price / 1000).toFixed(0)}K
                  </div>
                  <button
                    onClick={() => handleAdd(fish)}
                    style={{
                      background: added[fish.id] ? "#071C14" : "#00C9B1",
                      color: added[fish.id] ? "#00C9B1" : "#08131F",
                      border: added[fish.id] ? "1px solid #00C9B1" : "none",
                      borderRadius: 10, padding: "6px 12px",
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {added[fish.id] ? "✓ В корзине" : "+ В корзину"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <button
        onClick={onGoToCatalog}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #00C9B1, #00A896)",
          color: "#08131F", border: "none", borderRadius: 14,
          padding: "15px", fontSize: 15, fontWeight: 800,
          cursor: "pointer", boxShadow: "0 6px 24px #00C9B144",
          marginBottom: 12,
        }}
      >
        Перейти в каталог →
      </button>
      <p style={{ textAlign: "center", fontSize: 12, color: "#6C8E96", margin: 0 }}>
        Каталог уже отфильтрован под ваши параметры
      </p>
    </div>
  );
}

/* Главный компонент квиза */
function OnboardingQuiz({ onDone }) {
  const [step, setStep] = useState(1); // 1 | 2 | 3 | "result"
  const [answers, setAnswers] = useState({ volume: null, experience: null, goal: null });
  const [pendingCart, setPendingCart] = useState([]);

  const STEPS = [
    {
      key: "volume",
      title: "Какой у вас аквариум?",
      subtitle: "Подберём рыб, которые точно не будут тесниться",
      options: QUIZ_VOLUME_OPTIONS,
    },
    {
      key: "experience",
      title: "Какой у вас опыт?",
      subtitle: "Выберем рыб под ваш уровень — без лишнего стресса",
      options: QUIZ_EXPERIENCE_OPTIONS,
    },
    {
      key: "goal",
      title: "Что хотите от аквариума?",
      subtitle: "Определим характер и назначение рыб",
      options: QUIZ_GOAL_OPTIONS,
    },
  ];

  const currentStep = STEPS[step - 1];
  const currentAnswer = currentStep ? answers[currentStep.key] : null;
  const canNext = currentAnswer !== null;

  function handleSelect(id) {
    setAnswers(prev => ({ ...prev, [currentStep.key]: id }));
  }

  function handleNext() {
    if (step < 3) setStep(s => s + 1);
    else setStep("result");
  }

  function handleBack() {
    if (step === "result") setStep(3);
    else if (step > 1) setStep(s => s - 1);
  }

  function handleGoToCatalog() {
    // Передаём ответы квиза как фильтр + рыб из корзины
    const volOpt = QUIZ_VOLUME_OPTIONS.find(v => v.id === answers.volume);
    const expOpt = QUIZ_EXPERIENCE_OPTIONS.find(e => e.id === answers.experience);
    const goalOpt = QUIZ_GOAL_OPTIONS.find(g => g.id === answers.goal);
    onDone({
      quizAnswers: answers,
      cartItems: pendingCart,
      quizFilter: { maxVolume: volOpt?.max, difficulties: expOpt?.difficulty, goals: goalOpt?.goals },
    });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #0E2235 0%, #08131F 70%)",
      color: "#E8F4F8",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Шапка */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid #1C3A4A",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐠</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#00C9B1", letterSpacing: "-0.03em" }}>AquaUZ</span>
        </div>
        <button
          onClick={handleGoToCatalog}
          style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 12, cursor: "pointer" }}
        >
          Пропустить →
        </button>
      </div>

      {/* Контент */}
      <div style={{ flex: 1, padding: "28px 20px 24px", overflowY: "auto", maxWidth: 480, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {step !== "result" ? (
          <QuizStep
            key={step}
            stepNum={step}
            totalSteps={3}
            title={currentStep.title}
            subtitle={currentStep.subtitle}
            options={currentStep.options}
            selected={currentAnswer}
            onSelect={handleSelect}
          />
        ) : (
          <QuizResult
            answers={answers}
            onAddToCart={(fish) => setPendingCart(prev => [...prev, fish])}
            onGoToCatalog={handleGoToCatalog}
          />
        )}
      </div>

      {/* Нижняя навигация — только на шагах 1-3 */}
      {step !== "result" && (
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid #1C3A4A",
          background: "#08131F",
          display: "flex", gap: 10,
        }}>
          {step > 1 && (
            <button
              onClick={handleBack}
              style={{
                flex: "0 0 auto", background: "#102433", color: "#9FC4CC",
                border: "1px solid #1C3A4A", borderRadius: 14, padding: "13px 18px",
                fontSize: 14, cursor: "pointer",
              }}
            >
              ← Назад
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext}
            style={{
              flex: 1,
              background: canNext ? "linear-gradient(135deg, #00C9B1, #00A896)" : "#102433",
              color: canNext ? "#08131F" : "#6C8E96",
              border: "none", borderRadius: 14, padding: "14px",
              fontSize: 15, fontWeight: 800, cursor: canNext ? "pointer" : "default",
              boxShadow: canNext ? "0 6px 24px #00C9B144" : "none",
              transition: "all 0.2s",
            }}
          >
            {step < 3 ? "Далее →" : "Посмотреть подборку 🎯"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   🔐 ГЛОБАЛЬНАЯ СИСТЕМА АККАУНТОВ (логин / пароль)
   Курьеры и продавцы входят через логин + пароль.
   Admin видит все аккаунты, сбрасывает пароли.
   ============================================================ */

// Генератор временного пароля
function genTempPass() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Начальные аккаунты
const INIT_ACCOUNTS = [
  // Курьеры
  { id: "c_aziz",   role: "courier", name: "Азиз Р.",    phone: "+998 90 100 11 22", region: "Ташкент",   login: "aziz_courier",   password: "AZ1234", active: true,  lastLogin: "28.06 · 09:14", tempPass: null },
  { id: "c_bobur",  role: "courier", name: "Бобур Х.",   phone: "+998 91 200 22 33", region: "Самарканд", login: "bobur_samark",   password: "BB5678", active: true,  lastLogin: "27.06 · 18:40", tempPass: null },
  { id: "c_farid",  role: "courier", name: "Фарид М.",   phone: "+998 93 300 33 44", region: "Андижан",   login: "farid_andijan",  password: "FR9012", active: true,  lastLogin: "26.06 · 12:05", tempPass: null },
  { id: "c_sanjar", role: "courier", name: "Санжар К.",  phone: "+998 94 400 44 55", region: "Бухара",    login: "sanjar_buxoro",  password: "SJ3456", active: false, lastLogin: "20.06 · 08:00", tempPass: null },
  { id: "c_jasur",  role: "courier", name: "Жасур Н.",   phone: "+998 90 500 55 66", region: "Наманган",  login: "jasur_namangan", password: "JN7890", active: true,  lastLogin: "28.06 · 11:30", tempPass: null },
  // Продавцы
  { id: "s_ali",    role: "seller",  name: "Али Маркет", phone: "+998 71 100 10 10", region: "Ташкент",   login: "ali_aqua",       password: "AL1122", active: true,  lastLogin: "28.06 · 14:02", tempPass: null },
  { id: "s_mira",   role: "seller",  name: "Мира Fish",  phone: "+998 90 200 20 20", region: "Самарканд", login: "mira_fish",      password: "MF3344", active: true,  lastLogin: "27.06 · 16:18", tempPass: null },
  { id: "s_tech",   role: "seller",  name: "AquaTech",   phone: "+998 93 300 30 30", region: "Ташкент",   login: "aquatech_uz",    password: "AT5566", active: false, lastLogin: "15.06 · 09:00", tempPass: null },
];

// ── Экран входа для курьера/продавца ─────────────────────────
function LoginScreen({ role, onBack, onLogin, accounts }) {
  const [login,    setLogin]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const roleLabel = role === "courier" ? "Курьер" : "Продавец";
  const roleIcon  = role === "courier" ? "🏍️" : "🏪";
  const C = { bg: "#08131F", card: "#0E2030", border: "#1C3A4A", teal: "#00C9B1", amber: "#F0A93C", text: "#E8F4F8", muted: "#6C8E96", soft: "#9FC4CC", red: "#FF6B6B" };

  function handleLogin() {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const acc = accounts.find(a =>
        a.role === role &&
        a.login === login.trim().toLowerCase() &&
        (a.password === password || (a.tempPass && a.tempPass === password))
      );
      if (!acc) {
        setError("Неверный логин или пароль");
        setLoading(false);
        return;
      }
      if (!acc.active) {
        setError("Аккаунт заблокирован. Обратитесь к администратору.");
        setLoading(false);
        return;
      }
      // если вошёл через tempPass — нужно сменить пароль
      const needChange = acc.tempPass && acc.tempPass === password;
      onLogin(acc, needChange);
      setLoading(false);
    }, 700);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Шапка */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.soft, fontSize: 13, cursor: "pointer", padding: 0 }}>← Назад</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px" }}>
        {/* Логотип */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{roleIcon}</div>
          <div style={{ fontSize: 9, color: C.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>AquaUZ</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Вход · {roleLabel}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Введите логин и пароль от вашего аккаунта</div>
        </div>

        {/* Форма */}
        <div style={{ maxWidth: 360, width: "100%", margin: "0 auto" }}>
          {/* Логин */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.soft, marginBottom: 5, fontWeight: 600 }}>Логин</div>
            <input
              value={login}
              onChange={e => { setLogin(e.target.value); setError(""); }}
              placeholder={role === "courier" ? "aziz_courier" : "ali_aqua"}
              autoCapitalize="none"
              style={{ width: "100%", background: "#102433", border: `1px solid ${error ? C.red : C.border}`, borderRadius: 14, padding: "13px 16px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Пароль */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 12, color: C.soft, marginBottom: 5, fontWeight: 600 }}>Пароль</div>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && login && password && handleLogin()}
                placeholder="••••••"
                style={{ width: "100%", background: "#102433", border: `1px solid ${error ? C.red : C.border}`, borderRadius: 14, padding: "13px 48px 13px 16px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
              <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Ошибка */}
          {error && <div style={{ fontSize: 12, color: C.red, marginBottom: 12, marginTop: 4 }}>⚠️ {error}</div>}

          {/* Подсказка забыл пароль */}
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 20, marginTop: 8 }}>
            Забыли пароль? Обратитесь к администратору по номеру{" "}
            <span style={{ color: C.teal, fontWeight: 700 }}>+998 71 200 01 01</span> — он сбросит пароль.
          </div>

          {/* Кнопка */}
          <button
            onClick={handleLogin}
            disabled={!login.trim() || !password || loading}
            style={{
              width: "100%",
              background: login && password ? `linear-gradient(135deg, ${C.teal}, #00A896)` : "#1C3A4A",
              color: login && password ? "#08131F" : C.muted,
              border: "none", borderRadius: 14, padding: "15px",
              fontSize: 16, fontWeight: 800, cursor: login && password ? "pointer" : "default",
              boxShadow: login && password ? `0 6px 24px ${C.teal}44` : "none",
            }}
          >
            {loading ? "⏳ Проверяем..." : `Войти как ${roleLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Экран смены пароля (после сброса) ────────────────────────
function ChangePasswordScreen({ account, onDone }) {
  const [newPass,    setNewPass]    = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const C = { bg: "#08131F", card: "#0E2030", border: "#1C3A4A", teal: "#00C9B1", amber: "#F0A93C", text: "#E8F4F8", muted: "#6C8E96", soft: "#9FC4CC", red: "#FF6B6B" };

  function handleSave() {
    if (newPass.length < 4) { setError("Минимум 4 символа"); return; }
    if (newPass !== confirm) { setError("Пароли не совпадают"); return; }
    onDone(newPass);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 42, marginBottom: 8 }}>🔑</div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Установите новый пароль</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Ваш пароль был сброшен администратором. Установите новый пароль для входа.</div>
      </div>

      <div style={{ maxWidth: 360, width: "100%", margin: "0 auto" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: C.soft, marginBottom: 5 }}>Новый пароль</div>
          <div style={{ position: "relative" }}>
            <input type={showPass ? "text" : "password"} value={newPass} onChange={e => { setNewPass(e.target.value); setError(""); }}
              placeholder="Минимум 4 символа"
              style={{ width: "100%", background: "#102433", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 44px 12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 15 }}>{showPass ? "🙈" : "👁"}</button>
          </div>
        </div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: C.soft, marginBottom: 5 }}>Повторите пароль</div>
          <input type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(""); }}
            placeholder="••••••"
            style={{ width: "100%", background: "#102433", border: `1px solid ${error ? C.red : C.border}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        {error && <div style={{ fontSize: 12, color: C.red, marginBottom: 10 }}>⚠️ {error}</div>}
        <button onClick={handleSave} disabled={!newPass || !confirm}
          style={{ width: "100%", marginTop: 16, background: newPass && confirm ? C.teal : "#1C3A4A", color: newPass && confirm ? "#08131F" : C.muted, border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: newPass && confirm ? "pointer" : "default" }}>
          ✅ Сохранить новый пароль
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   🔧 ADMIN PANEL — полноценная панель управления AquaUZ
   Все данные живые: редактирование, удаление, смена статусов,
   промокоды, тарифы, настройки, курьеры, товары, клиенты
   ============================================================ */

// ── Начальные данные ──────────────────────────────────────────
const ADMIN_INIT_ORDERS = [
  { id: 4821, buyer: "Анвар Т.", phone: "+998 90 111 22 33", region: "Ташкент", address: "ул. Амира Темура, 15, кв. 7", total: 93000,  status: "way",       items: [{ name: "Гуппи ×3", price: 75000 }, { name: "Корм «Универсал»", price: 18000 }], time: "14:32", date: "28.06", courier: "Азиз Р.",   note: "" },
  { id: 4820, buyer: "Малика Р.", phone: "+998 91 222 33 44", region: "Самарканд", address: "ул. Регистан, 7", total: 280000, status: "packed",    items: [{ name: "Дискус ×1", price: 180000 }, { name: "Фильтр Pro", price: 100000 }], time: "14:10", date: "28.06", courier: "Бобур Х.",  note: "Позвонить за час" },
  { id: 4819, buyer: "Ботир С.",  phone: "+998 93 333 44 55", region: "Ташкент",   address: "пр. Мустакиллик, 22", total: 45000,  status: "accepted",  items: [{ name: "Молли ×5", price: 45000 }], time: "13:54", date: "28.06", courier: "",          note: "" },
  { id: 4818, buyer: "Гулноза Х.", phone: "+998 94 444 55 66", region: "Андижан",  address: "ул. Бабура, 12", total: 165000, status: "delivered",  items: [{ name: "Скалярия ×2", price: 110000 }, { name: "Корм «Цвет»", price: 24000 }, { name: "Анубиас Нана", price: 22000 }], time: "10:20", date: "27.06", courier: "Фарид М.", note: "" },
  { id: 4817, buyer: "Шерзод А.", phone: "+998 90 555 66 77",  region: "Бухара",   address: "ул. Накшбанд, 3", total: 220000, status: "courier",    items: [{ name: "Фильтр «Поток-300 Pro»", price: 220000 }], time: "11:45", date: "27.06", courier: "Санжар К.", note: "" },
  { id: 4816, buyer: "Зарина К.", phone: "+998 91 666 77 88",  region: "Наманган", address: "ул. Навои, 55", total: 56000,  status: "cancelled",  items: [{ name: "Петушок ×1", price: 45000 }, { name: "Корм «Сомик»", price: 16000 }], time: "09:00", date: "27.06", courier: "", note: "Клиент отменил" },
  { id: 4815, buyer: "Тимур Б.",  phone: "+998 93 777 88 99",  region: "Ташкент",  address: "ул. Чилонзор, 8", total: 385000, status: "delivered",  items: [{ name: "Дискус ×2", price: 360000 }, { name: "Мотыль", price: 12000 }], time: "16:00", date: "26.06", courier: "Азиз Р.", note: "" },
];

const ADMIN_INIT_PRODUCTS = [
  { id: "guppy",       name: "Гуппи «Огненный хвост»", emoji: "🐠", cat: "fish",      price: 25000,  stock: 8,  active: true,  views: 48,  orders: 47, minPrice: 15000 },
  { id: "neon",        name: "Неон «Голубая искра»",    emoji: "🐟", cat: "fish",      price: 8000,   stock: 2,  active: true,  views: 112, orders: 112, minPrice: 5000 },
  { id: "betta",       name: "Петушок «Королевский»",   emoji: "👑", cat: "fish",      price: 45000,  stock: 5,  active: true,  views: 89,  orders: 31, minPrice: 30000 },
  { id: "discus",      name: "Дискус «Королевский»",    emoji: "👑", cat: "fish",      price: 180000, stock: 1,  active: true,  views: 34,  orders: 8,  minPrice: 150000 },
  { id: "danio",       name: "Данио «Зебра»",           emoji: "🐟", cat: "fish",      price: 7000,   stock: 24, active: true,  views: 67,  orders: 64, minPrice: 4000 },
  { id: "angelfish",   name: "Скалярия «Серебряный»",   emoji: "🦈", cat: "fish",      price: 55000,  stock: 3,  active: true,  views: 22,  orders: 22, minPrice: 40000 },
  { id: "filter-ext",  name: "Фильтр «Поток-300 Pro»",  emoji: "⚙️", cat: "equipment", price: 220000, stock: 4,  active: true,  views: 12,  orders: 12, minPrice: 180000 },
  { id: "food-flakes", name: "Корм хлопья «Универсал»", emoji: "🍽️", cat: "food",      price: 18000,  stock: 20, active: true,  views: 67,  orders: 67, minPrice: 12000 },
  { id: "plant-anub",  name: "Анубиас Нана",            emoji: "🌿", cat: "plant",     price: 22000,  stock: 7,  active: true,  views: 26,  orders: 26, minPrice: 15000 },
  { id: "molly",       name: "Молли «Чёрный бархат»",   emoji: "🐟", cat: "fish",      price: 18000,  stock: 0,  active: false, views: 27,  orders: 27, minPrice: 12000 },
];

const ADMIN_INIT_COURIERS = Object.entries(DELIVERY_RATES).map(([city, d]) => ({
  id: city, name: d.courier, phone: d.phone, region: city,
  rating: d.rating, trips: d.trips, online: [true, true, false, true, true, true, false, true, true, false, true, false][Object.keys(DELIVERY_RATES).indexOf(city)] ?? true,
  rate: d.price, blocked: false,
}));

const ADMIN_INIT_PROMOS = [
  { code: "AQUA10",  discount: 10, uses: 24, maxUses: 100, active: true,  expires: "31.07.2025" },
  { code: "FISH20",  discount: 20, uses: 8,  maxUses: 50,  active: true,  expires: "15.07.2025" },
  { code: "NEWFISH", discount: 15, uses: 41, maxUses: 200, active: true,  expires: "31.12.2025" },
  { code: "SUMMER30",discount: 30, uses: 3,  maxUses: 30,  active: false, expires: "30.06.2025" },
];

const ADMIN_INIT_SETTINGS = {
  storeOpen: true,
  smsNotify: true,
  aiDoctor: true,
  courierSignup: false,
  autoAssignCourier: true,
  minOrderFree: 0,
  cashPayment: true,
  clickPayment: true,
  paymePayment: true,
  guaranteeHours: 48,
  supportPhone: "+998 71 200 01 01",
  supportHours: "08:00 – 22:00",
};

const ADMIN_SC = {
  accepted:  { label: "Принят",     color: "#9FC4CC", bg: "#1C3A4A" },
  packed:    { label: "Собирается", color: "#F0A93C", bg: "#2A2210" },
  courier:   { label: "У курьера",  color: "#00C9B1", bg: "#0F2A26" },
  way:       { label: "В пути",     color: "#4DE8D5", bg: "#0A2520" },
  delivered: { label: "Доставлен",  color: "#51CF66", bg: "#0A2010" },
  cancelled: { label: "Отменён",    color: "#FF6B6B", bg: "#2A1414" },
};
const NEXT_STATUS = { accepted: "packed", packed: "courier", courier: "way", way: "delivered" };
const A = { bg: "#08131F", card: "#0E2030", border: "#1C3A4A", teal: "#00C9B1", amber: "#F0A93C", text: "#E8F4F8", muted: "#6C8E96", soft: "#9FC4CC", red: "#FF6B6B", green: "#51CF66" };

// ── Вспомогательный Toggle ────────────────────────────────────
function AdminToggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 999, background: value ? A.teal : "#1C3A4A", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#E8F4F8", transition: "left 0.2s" }} />
    </div>
  );
}

// ── Маленький бейдж статуса ───────────────────────────────────
function StatusBadge({ status }) {
  const s = ADMIN_SC[status] || ADMIN_SC.accepted;
  return <span style={{ fontSize: 11, background: s.bg, color: s.color, borderRadius: 999, padding: "2px 9px", fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>;
}

// ── Inline input ──────────────────────────────────────────────
function AInp({ value, onChange, type = "text", placeholder = "" }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ background: "#102433", border: `1px solid ${A.border}`, borderRadius: 10, padding: "9px 12px", color: A.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" }} />
  );
}

// ── Главный компонент ─────────────────────────────────────────
function AdminPanel({ onBack }) {
  const [tab, setTab] = useState("dashboard");

  // живые данные
  const [orders,   setOrders]   = useState(ADMIN_INIT_ORDERS);
  const [products, setProducts] = useState(ADMIN_INIT_PRODUCTS);
  const [couriers, setCouriers] = useState(ADMIN_INIT_COURIERS);
  const [promos,   setPromos]   = useState(ADMIN_INIT_PROMOS);
  const [settings, setSettings] = useState(ADMIN_INIT_SETTINGS);
  const [accounts, setAccounts] = useState(INIT_ACCOUNTS);

  // UI state
  const [orderFilter,   setOrderFilter]   = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [openOrderId,   setOpenOrderId]   = useState(null);
  const [editProduct,   setEditProduct]   = useState(null); // {id} редактируемый
  const [newPromoModal, setNewPromoModal] = useState(false);
  const [newPromoCode,  setNewPromoCode]  = useState("");
  const [newPromoDisc,  setNewPromoDisc]  = useState("10");
  const [newPromoMax,   setNewPromoMax]   = useState("100");
  const [newPromoExp,   setNewPromoExp]   = useState("31.12.2025");
  const [confirmClose,  setConfirmClose]  = useState(false);
  const [toast,         setToast]         = useState(null);
  const toastRef = useRef(null);

  // Accounts UI state
  const [accFilter,   setAccFilter]   = useState("all"); // all | courier | seller
  const [accReveal,   setAccReveal]   = useState({});    // {id: true} — показать пароль
  const [accEditId,   setAccEditId]   = useState(null);  // редактируемый аккаунт
  const [newAccModal, setNewAccModal] = useState(false);
  const [newAcc, setNewAcc] = useState({ role: "courier", name: "", phone: "", region: "Ташкент", login: "", password: "" });
  const [resetConfirm, setResetConfirm] = useState(null); // id аккаунта для подтверждения сброса

  function showToast(text, type = "ok") {
    setToast({ text, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2200);
  }

  // ── Orders ───────────────────────────────────────────────────
  function moveOrderStatus(id, toStatus) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status: toStatus } : o));
    showToast(`Заказ #${id} → «${ADMIN_SC[toStatus]?.label}»`);
  }
  function cancelOrder(id) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    showToast(`Заказ #${id} отменён`, "bad");
  }
  function updateOrderNote(id, note) {
    setOrders(os => os.map(o => o.id === id ? { ...o, note } : o));
  }
  function assignCourier(id, courier) {
    setOrders(os => os.map(o => o.id === id ? { ...o, courier } : o));
  }

  const filteredOrders = orders.filter(o => orderFilter === "all" || o.status === orderFilter);

  // ── Products ─────────────────────────────────────────────────
  function toggleProduct(id) {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const p = products.find(x => x.id === id);
    showToast(`«${p?.name}» ${p?.active ? "скрыт" : "активирован"}`);
  }
  function updateProduct(id, field, val) {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: val } : p));
  }
  function deleteProduct(id) {
    const p = products.find(x => x.id === id);
    setProducts(ps => ps.filter(x => x.id !== id));
    setEditProduct(null);
    showToast(`«${p?.name}» удалён`, "bad");
  }
  function saveProduct() {
    showToast("Изменения сохранены ✅");
    setEditProduct(null);
  }

  const filteredProducts = products.filter(p =>
    productFilter === "all" || p.cat === productFilter ||
    (productFilter === "low" && p.stock <= 3) ||
    (productFilter === "hidden" && !p.active)
  );

  // ── Couriers ─────────────────────────────────────────────────
  function toggleCourierOnline(id) {
    setCouriers(cs => cs.map(c => c.id === id ? { ...c, online: !c.online } : c));
  }
  function toggleCourierBlock(id) {
    setCouriers(cs => cs.map(c => c.id === id ? { ...c, blocked: !c.blocked, online: false } : c));
    const c = couriers.find(x => x.id === id);
    showToast(`${c?.name} ${c?.blocked ? "разблокирован" : "заблокирован"}`, c?.blocked ? "ok" : "bad");
  }
  function updateCourierRate(id, rate) {
    setCouriers(cs => cs.map(c => c.id === id ? { ...c, rate: Number(rate) || c.rate } : c));
  }

  // ── Promos ───────────────────────────────────────────────────
  function togglePromo(code) {
    setPromos(ps => ps.map(p => p.code === code ? { ...p, active: !p.active } : p));
  }
  function deletePromo(code) {
    setPromos(ps => ps.filter(p => p.code !== code));
    showToast(`Промокод ${code} удалён`, "bad");
  }
  function addPromo() {
    if (!newPromoCode.trim()) return;
    setPromos(ps => [...ps, { code: newPromoCode.toUpperCase(), discount: Number(newPromoDisc) || 10, uses: 0, maxUses: Number(newPromoMax) || 100, active: true, expires: newPromoExp }]);
    setNewPromoModal(false);
    setNewPromoCode(""); setNewPromoDisc("10"); setNewPromoMax("100"); setNewPromoExp("31.12.2025");
    showToast(`Промокод ${newPromoCode.toUpperCase()} создан ✅`);
  }

  // ── Accounts ─────────────────────────────────────────────────
  function resetPassword(id) {
    const tmp = genTempPass();
    setAccounts(as => as.map(a => a.id === id ? { ...a, tempPass: tmp } : a));
    setResetConfirm(null);
    const a = accounts.find(x => x.id === id);
    showToast(`Пароль сброшен → ${tmp}`);
    return tmp;
  }
  function toggleAccount(id) {
    setAccounts(as => as.map(a => a.id === id ? { ...a, active: !a.active } : a));
    const a = accounts.find(x => x.id === id);
    showToast(`${a?.name} ${a?.active ? "заблокирован" : "активирован"}`, a?.active ? "bad" : "ok");
  }
  function updateAccount(id, field, val) {
    setAccounts(as => as.map(a => a.id === id ? { ...a, [field]: val } : a));
  }
  function deleteAccount(id) {
    const a = accounts.find(x => x.id === id);
    setAccounts(as => as.filter(x => x.id !== id));
    setAccEditId(null);
    showToast(`Аккаунт ${a?.name} удалён`, "bad");
  }
  function addAccount() {
    if (!newAcc.name || !newAcc.login || !newAcc.password) return;
    const id = `${newAcc.role[0]}_${Date.now()}`;
    setAccounts(as => [...as, { ...newAcc, id, active: true, lastLogin: "—", tempPass: null }]);
    setNewAccModal(false);
    setNewAcc({ role: "courier", name: "", phone: "", region: "Ташкент", login: "", password: "" });
    showToast(`Аккаунт «${newAcc.name}» создан ✅`);
  }
  function revealPass(id) {
    setAccReveal(r => ({ ...r, [id]: !r[id] }));
  }

  // ── Settings ─────────────────────────────────────────────────
  function setSetting(key, val) {
    setSettings(s => ({ ...s, [key]: val }));
  }

  // ── Metrics ──────────────────────────────────────────────────
  const todayOrders   = orders.filter(o => o.date === "28.06");
  const todayRevenue  = todayOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const activeProducts = products.filter(p => p.active).length;
  const lowStockCount  = products.filter(p => p.stock <= 3 && p.active).length;
  const onlineCouriers = couriers.filter(c => c.online && !c.blocked).length;
  const pendingOrders  = orders.filter(o => o.status === "accepted" || o.status === "packed").length;

  const TABS = [
    { id: "dashboard", label: "📊 Обзор" },
    { id: "orders",    label: "📦 Заказы", badge: pendingOrders },
    { id: "products",  label: "🐠 Товары", badge: lowStockCount },
    { id: "couriers",  label: "🏍️ Курьеры" },
    { id: "accounts",  label: "🔐 Аккаунты" },
    { id: "promos",    label: "🎁 Промокоды" },
    { id: "settings",  label: "⚙️ Настройки" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: A.bg, color: A.text, paddingBottom: 50, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Шапка ───────────────────────────────────────────── */}
      <div style={{ background: A.card, borderBottom: `1px solid ${A.border}`, padding: "14px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", color: A.soft, fontSize: 12, cursor: "pointer", padding: 0, marginBottom: 4, display: "block" }}>← Профиль</button>
            <div style={{ fontSize: 9, color: A.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>AquaUZ</div>
            <div style={{ fontSize: 19, fontWeight: 900 }}>🔧 Admin-панель</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: A.muted }}>28 июня 2025</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: settings.storeOpen ? A.teal : A.red, marginTop: 2 }}>
              {settings.storeOpen ? "● Магазин открыт" : "○ Магазин закрыт"}
            </div>
          </div>
        </div>

        {/* Табы */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 0, marginBottom: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              whiteSpace: "nowrap", position: "relative",
              background: tab === t.id ? A.teal : "transparent",
              color: tab === t.id ? "#08131F" : A.soft,
              border: "none",
              borderBottom: tab === t.id ? `2px solid ${A.teal}` : "2px solid transparent",
              borderRadius: 0, padding: "8px 12px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              {t.label}
              {t.badge > 0 && (
                <span style={{ position: "absolute", top: 4, right: 2, background: A.red, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "0 4px", minWidth: 14, textAlign: "center" }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── DASHBOARD ───────────────────────────────────────── */}
      {tab === "dashboard" && (
        <div style={{ padding: 16 }}>

          {/* KPI карточки */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { icon: "🛒", label: "Заказов сегодня", value: todayOrders.length, color: A.teal },
              { icon: "💰", label: "Выручка сегодня", value: (todayRevenue / 1000).toFixed(0) + "K", color: A.amber },
              { icon: "🐠", label: "Активных товаров", value: activeProducts, color: A.teal },
              { icon: "⚠️", label: "Мало на складе", value: lowStockCount, color: lowStockCount > 0 ? A.red : A.green },
              { icon: "🏍️", label: "Курьеров онлайн", value: onlineCouriers, color: A.teal },
              { icon: "📋", label: "Ожидают обработки", value: pendingOrders, color: pendingOrders > 0 ? A.amber : A.green },
            ].map((s, i) => (
              <div key={i} style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px 12px" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: A.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Мини-воронка статусов */}
          <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📊 Статусы заказов</div>
            {Object.entries(ADMIN_SC).map(([key, s]) => {
              const cnt = orders.filter(o => o.status === key).length;
              const pct = orders.length ? Math.round(cnt / orders.length * 100) : 0;
              return (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.label}</span>
                    <span style={{ color: A.muted }}>{cnt} шт ({pct}%)</span>
                  </div>
                  <div style={{ height: 5, background: "#102433", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: pct + "%", height: "100%", background: s.color, borderRadius: 3, transition: "width 0.4s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ТОП товаров */}
          <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🏆 Топ товаров по продажам</div>
            {[...products].sort((a, b) => b.orders - a.orders).slice(0, 5).map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: [A.amber, A.soft, A.muted, A.muted, A.muted][i], width: 16 }}>{i + 1}</span>
                <span style={{ fontSize: 18 }}>{p.emoji}</span>
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: A.amber, fontWeight: 700 }}>{p.orders} шт</span>
              </div>
            ))}
          </div>

          {/* Кнопки быстрого доступа */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "📦 Новые заказы", action: () => { setTab("orders"); setOrderFilter("accepted"); } },
              { label: "⚠️ Мало товаров", action: () => { setTab("products"); setProductFilter("low"); } },
              { label: "🎁 Промокоды",    action: () => setTab("promos") },
              { label: "⚙️ Настройки",   action: () => setTab("settings") },
            ].map(b => (
              <button key={b.label} onClick={b.action} style={{ background: "#102433", border: `1px solid ${A.border}`, borderRadius: 12, padding: "12px", fontSize: 13, color: A.soft, cursor: "pointer", fontWeight: 600, textAlign: "center" }}>{b.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── ЗАКАЗЫ ──────────────────────────────────────────── */}
      {tab === "orders" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Заказы ({filteredOrders.length})</div>

          {/* Фильтр */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
            {[["all", "Все"], ...Object.entries(ADMIN_SC).map(([k, s]) => [k, s.label])].map(([k, l]) => (
              <button key={k} onClick={() => setOrderFilter(k)} style={{
                whiteSpace: "nowrap",
                background: orderFilter === k ? A.teal : "#102433",
                color: orderFilter === k ? "#08131F" : A.soft,
                border: `1px solid ${orderFilter === k ? A.teal : A.border}`,
                borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div style={{ textAlign: "center", color: A.muted, fontSize: 13, marginTop: 30 }}>Нет заказов в этой категории</div>
          )}

          {filteredOrders.map(o => {
            const isOpen = openOrderId === o.id;
            const next = NEXT_STATUS[o.status];
            return (
              <div key={o.id} style={{ background: A.card, border: `1px solid ${o.status === "accepted" ? A.amber + "77" : o.status === "cancelled" ? A.red + "44" : A.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
                {/* Шапка карточки */}
                <div onClick={() => setOpenOrderId(isOpen ? null : o.id)} style={{ padding: "12px 14px", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 800 }}>#{o.id}</span>
                      <span style={{ fontSize: 12, color: A.muted, marginLeft: 8 }}>{o.time} · {o.date}</span>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{o.buyer} · 📍 {o.region}</div>
                  <div style={{ fontSize: 11, color: A.muted, marginTop: 2 }}>{o.items.map(i => i.name).join(", ")}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: A.muted }}>{o.courier ? `🏍️ ${o.courier}` : "Курьер не назначен"}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: A.amber }}>{o.total.toLocaleString("ru-RU")} сум</span>
                  </div>
                </div>

                {/* Раскрытая детальная карточка */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${A.border}`, padding: "12px 14px", background: "#0A1822" }}>

                    {/* Состав заказа */}
                    <div style={{ fontSize: 12, fontWeight: 700, color: A.soft, marginBottom: 6 }}>Состав:</div>
                    {o.items.map((it, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: A.muted, marginBottom: 3 }}>
                        <span>{it.name}</span><span style={{ color: A.amber }}>{it.price.toLocaleString("ru-RU")} сум</span>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px solid ${A.border}`, marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 }}>
                      <span>Итого</span><span style={{ color: A.amber }}>{o.total.toLocaleString("ru-RU")} сум</span>
                    </div>

                    {/* Адрес и телефон */}
                    <div style={{ marginTop: 10, fontSize: 12, color: A.muted }}>
                      <div>📱 {o.phone}</div>
                      <div style={{ marginTop: 3 }}>📍 {o.address}</div>
                    </div>

                    {/* Заметка */}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Заметка:</div>
                      <textarea value={o.note} onChange={e => updateOrderNote(o.id, e.target.value)} placeholder="Добавить заметку..."
                        style={{ width: "100%", background: "#102433", border: `1px solid ${A.border}`, borderRadius: 8, padding: "7px 10px", color: A.text, fontSize: 12, outline: "none", resize: "none", boxSizing: "border-box", minHeight: 50 }} />
                    </div>

                    {/* Назначить курьера */}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Курьер:</div>
                      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                        {couriers.filter(c => c.online && !c.blocked && c.region === o.region).concat(couriers.filter(c => c.online && !c.blocked && c.region !== o.region)).slice(0, 5).map(c => (
                          <button key={c.id} onClick={() => assignCourier(o.id, c.name)} style={{
                            whiteSpace: "nowrap", background: o.courier === c.name ? A.teal + "33" : "#102433",
                            border: `1px solid ${o.courier === c.name ? A.teal : A.border}`,
                            borderRadius: 8, padding: "5px 10px", fontSize: 11, color: o.courier === c.name ? A.teal : A.soft, cursor: "pointer",
                          }}>{c.region === o.region ? "📍 " : ""}{c.name}</button>
                        ))}
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      {next && (
                        <button onClick={() => moveOrderStatus(o.id, next)} style={{ flex: 2, background: A.teal, color: "#08131F", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                          → {ADMIN_SC[next]?.label}
                        </button>
                      )}
                      {o.status !== "cancelled" && o.status !== "delivered" && (
                        <button onClick={() => cancelOrder(o.id)} style={{ flex: 1, background: "none", border: `1px solid ${A.red}`, color: A.red, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                          Отменить
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── ТОВАРЫ ──────────────────────────────────────────── */}
      {tab === "products" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Товары ({filteredProducts.length})</div>
          </div>

          {/* Фильтр по категории */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
            {[["all","Все"],["fish","🐠 Рыбы"],["food","🍽️ Корм"],["equipment","⚙️ Оборудование"],["plant","🌿 Растения"],["low","⚠️ Мало"],["hidden","🚫 Скрытые"]].map(([k, l]) => (
              <button key={k} onClick={() => setProductFilter(k)} style={{
                whiteSpace: "nowrap",
                background: productFilter === k ? A.teal : "#102433",
                color: productFilter === k ? "#08131F" : A.soft,
                border: `1px solid ${productFilter === k ? A.teal : A.border}`,
                borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>

          {filteredProducts.map(p => {
            const isEdit = editProduct === p.id;
            const lowStock = p.stock <= 3;
            return (
              <div key={p.id} style={{ background: A.card, border: `1px solid ${lowStock && p.active ? A.red + "44" : A.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{p.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: A.amber }}>{p.price.toLocaleString("ru-RU")} сум</span>
                        <span style={{ fontSize: 11, color: lowStock ? A.red : A.teal }}>📦 {p.stock} шт{lowStock ? " ⚠️" : ""}</span>
                        <span style={{ fontSize: 11, color: A.muted }}>🛒 {p.orders} продано</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                      <AdminToggle value={p.active} onChange={() => toggleProduct(p.id)} />
                      <button onClick={() => setEditProduct(isEdit ? null : p.id)} style={{ background: "none", border: `1px solid ${A.border}`, borderRadius: 7, padding: "3px 9px", fontSize: 11, color: A.soft, cursor: "pointer" }}>
                        {isEdit ? "▲ Свернуть" : "✏️ Ред."}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Редактирование */}
                {isEdit && (
                  <div style={{ borderTop: `1px solid ${A.border}`, padding: "12px 14px", background: "#0A1822" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Цена (сум)</div>
                        <AInp type="number" value={p.price} onChange={v => updateProduct(p.id, "price", Number(v))} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Остаток (шт)</div>
                        <AInp type="number" value={p.stock} onChange={v => updateProduct(p.id, "stock", Number(v))} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Мин. цена (сум)</div>
                        <AInp type="number" value={p.minPrice} onChange={v => updateProduct(p.id, "minPrice", Number(v))} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>👁 Просмотры</div>
                        <AInp type="number" value={p.views} onChange={v => updateProduct(p.id, "views", Number(v))} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={saveProduct} style={{ flex: 2, background: A.teal, color: "#08131F", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ Сохранить</button>
                      <button onClick={() => deleteProduct(p.id)} style={{ flex: 1, background: "none", border: `1px solid ${A.red}`, color: A.red, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🗑 Удалить</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── КУРЬЕРЫ ─────────────────────────────────────────── */}
      {tab === "couriers" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Курьеры — всего {couriers.length}</div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: A.muted, marginBottom: 14 }}>
            <span style={{ color: A.teal }}>● Онлайн: {couriers.filter(c => c.online && !c.blocked).length}</span>
            <span style={{ color: A.muted }}>○ Оффлайн: {couriers.filter(c => !c.online || c.blocked).length}</span>
            <span style={{ color: A.red }}>⛔ Блок: {couriers.filter(c => c.blocked).length}</span>
          </div>

          {couriers.map(c => (
            <div key={c.id} style={{ background: A.card, border: `1px solid ${c.blocked ? A.red + "44" : A.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#102433", border: `1px solid ${c.online && !c.blocked ? A.teal : A.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: A.teal, flexShrink: 0 }}>
                  {c.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: A.muted }}>📍 {c.region} · ⭐ {c.rating} · {c.trips} рейсов</div>
                  <div style={{ fontSize: 11, color: A.muted, marginTop: 1 }}>{c.phone}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: c.blocked ? A.red : c.online ? A.teal : A.muted }}>
                    {c.blocked ? "⛔ Блок" : c.online ? "● Онлайн" : "○ Офлайн"}
                  </div>
                  {!c.blocked && (
                    <AdminToggle value={c.online} onChange={() => toggleCourierOnline(c.id)} />
                  )}
                </div>
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: A.soft, marginBottom: 3 }}>Тариф доставки (сум)</div>
                  <AInp type="number" value={c.rate} onChange={v => updateCourierRate(c.id, v)} />
                </div>
                <button onClick={() => toggleCourierBlock(c.id)} style={{
                  marginTop: 18, background: c.blocked ? A.teal + "22" : "#2A1414",
                  border: `1px solid ${c.blocked ? A.teal : A.red}`,
                  color: c.blocked ? A.teal : A.red,
                  borderRadius: 10, padding: "9px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  {c.blocked ? "✅ Разблок." : "⛔ Заблок."}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── АККАУНТЫ ────────────────────────────────────────── */}
      {tab === "accounts" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              Аккаунты ({accounts.filter(a => accFilter === "all" || a.role === accFilter).length})
            </div>
            <button onClick={() => setNewAccModal(true)} style={{ background: A.teal, color: "#08131F", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Создать</button>
          </div>

          {/* Фильтр роли */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[["all","Все"],["courier","🏍️ Курьеры"],["seller","🏪 Продавцы"]].map(([k, l]) => (
              <button key={k} onClick={() => setAccFilter(k)} style={{
                background: accFilter === k ? A.teal : "#102433",
                color: accFilter === k ? "#08131F" : A.soft,
                border: `1px solid ${accFilter === k ? A.teal : A.border}`,
                borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>

          {accounts.filter(a => accFilter === "all" || a.role === accFilter).map(acc => {
            const isEdit = accEditId === acc.id;
            const showP  = accReveal[acc.id];
            const isReset = resetConfirm === acc.id;
            const dispPass = acc.tempPass ? `⏳ TEMP: ${acc.tempPass}` : (showP ? acc.password : "••••••");
            return (
              <div key={acc.id} style={{ background: A.card, border: `1px solid ${!acc.active ? A.red + "44" : acc.tempPass ? A.amber + "55" : A.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
                {/* Шапка карточки */}
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Аватар */}
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: acc.role === "courier" ? "#102433" : "#1A2210", border: `1px solid ${acc.active ? A.teal : A.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {acc.role === "courier" ? "🏍️" : "🏪"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{acc.name}</div>
                      <div style={{ fontSize: 11, color: A.muted }}>@{acc.login} · {acc.region}</div>
                      <div style={{ fontSize: 10.5, color: A.muted, marginTop: 1 }}>
                        {acc.phone} · Вход: {acc.lastLogin}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: acc.active ? A.teal : A.red }}>
                        {acc.active ? "● Активен" : "○ Блок"}
                      </span>
                      {acc.tempPass && <span style={{ fontSize: 9, color: A.amber, fontWeight: 700 }}>⏳ TEMP</span>}
                    </div>
                  </div>

                  {/* Пароль строка */}
                  <div style={{ marginTop: 10, background: "#0A1822", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: A.muted }}>🔑 Пароль:</span>
                    <span style={{ flex: 1, fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: acc.tempPass ? A.amber : A.teal, letterSpacing: 1 }}>
                      {dispPass}
                    </span>
                    <button onClick={() => revealPass(acc.id)} style={{ background: "none", border: `1px solid ${A.border}`, borderRadius: 7, padding: "3px 8px", fontSize: 11, color: A.soft, cursor: "pointer" }}>
                      {showP ? "🙈" : "👁"}
                    </button>
                  </div>

                  {/* Кнопки действий */}
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <button onClick={() => setAccEditId(isEdit ? null : acc.id)} style={{ flex: 1, background: isEdit ? "#1C3A4A" : "#102433", border: `1px solid ${A.border}`, borderRadius: 9, padding: "7px", fontSize: 12, color: A.soft, cursor: "pointer", fontWeight: 600 }}>
                      {isEdit ? "▲ Свернуть" : "✏️ Редакт."}
                    </button>
                    <button onClick={() => setResetConfirm(isReset ? null : acc.id)} style={{ flex: 1, background: isReset ? A.amber + "22" : "#102433", border: `1px solid ${isReset ? A.amber : A.border}`, borderRadius: 9, padding: "7px", fontSize: 12, color: A.amber, cursor: "pointer", fontWeight: 600 }}>
                      🔄 Сбросить пароль
                    </button>
                    <button onClick={() => toggleAccount(acc.id)} style={{ flex: 1, background: acc.active ? "#2A1414" : "#0F2A26", border: `1px solid ${acc.active ? A.red : A.teal}`, borderRadius: 9, padding: "7px", fontSize: 12, color: acc.active ? A.red : A.teal, cursor: "pointer", fontWeight: 600 }}>
                      {acc.active ? "⛔ Блок" : "✅ Активир."}
                    </button>
                  </div>
                </div>

                {/* Подтверждение сброса пароля */}
                {isReset && (
                  <div style={{ borderTop: `1px solid ${A.amber}44`, padding: "12px 14px", background: "#1A1400" }}>
                    <div style={{ fontSize: 12, color: A.amber, marginBottom: 10, fontWeight: 600 }}>
                      ⚠️ Сгенерировать временный пароль для {acc.name}?<br/>
                      <span style={{ fontSize: 11, color: A.muted, fontWeight: 400 }}>Пользователь войдёт с временным паролем и сразу создаст новый.</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setResetConfirm(null)} style={{ flex: 1, background: "#102433", color: A.soft, border: `1px solid ${A.border}`, borderRadius: 9, padding: "9px", fontSize: 13, cursor: "pointer" }}>Отмена</button>
                      <button onClick={() => resetPassword(acc.id)} style={{ flex: 2, background: A.amber, color: "#08131F", border: "none", borderRadius: 9, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🔄 Да, сбросить</button>
                    </div>
                  </div>
                )}

                {/* Редактирование аккаунта */}
                {isEdit && (
                  <div style={{ borderTop: `1px solid ${A.border}`, padding: "12px 14px", background: "#0A1822" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Имя / Магазин</div>
                        <AInp value={acc.name} onChange={v => updateAccount(acc.id, "name", v)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Телефон</div>
                        <AInp value={acc.phone} onChange={v => updateAccount(acc.id, "phone", v)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Логин</div>
                        <AInp value={acc.login} onChange={v => updateAccount(acc.id, "login", v.toLowerCase().replace(/\s/g, "_"))} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Пароль</div>
                        <AInp value={acc.password} onChange={v => updateAccount(acc.id, "password", v)} />
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Регион</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {["Ташкент","Самарканд","Андижан","Бухара","Наманган","Фергана"].map(r => (
                            <button key={r} onClick={() => updateAccount(acc.id, "region", r)} style={{ background: acc.region === r ? A.teal + "22" : "#102433", border: `1px solid ${acc.region === r ? A.teal : A.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: acc.region === r ? A.teal : A.soft, cursor: "pointer" }}>{r}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setAccEditId(null); showToast("Сохранено ✅"); }} style={{ flex: 2, background: A.teal, color: "#08131F", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ Сохранить</button>
                      <button onClick={() => deleteAccount(acc.id)} style={{ flex: 1, background: "none", border: `1px solid ${A.red}`, color: A.red, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🗑 Удалить</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Модалка создания нового аккаунта */}
          {newAccModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.85)", zIndex: 300, display: "flex", alignItems: "flex-end" }} onClick={() => setNewAccModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{ background: "#0B1B28", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", maxHeight: "90vh", overflowY: "auto" }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>🔐 Новый аккаунт</div>

                {/* Роль */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {[["courier","🏍️ Курьер"],["seller","🏪 Продавец"]].map(([k, l]) => (
                    <button key={k} onClick={() => setNewAcc(a => ({ ...a, role: k }))} style={{ flex: 1, background: newAcc.role === k ? A.teal + "22" : "#102433", border: `1px solid ${newAcc.role === k ? A.teal : A.border}`, borderRadius: 12, padding: "10px", fontSize: 13, color: newAcc.role === k ? A.teal : A.soft, fontWeight: 700, cursor: "pointer" }}>{l}</button>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {[
                    ["name",     newAcc.role === "courier" ? "Имя курьера" : "Название магазина", "Азиз Р."],
                    ["phone",    "Телефон",  "+998 90 ..."],
                    ["login",    "Логин",    "aziz_tashkent"],
                    ["password", "Пароль",   "AZ1234"],
                  ].map(([field, label, ph]) => (
                    <div key={field}>
                      <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>{label}</div>
                      <AInp value={newAcc[field]} onChange={v => setNewAcc(a => ({ ...a, [field]: field === "login" ? v.toLowerCase().replace(/\s/g, "_") : v }))} placeholder={ph} />
                    </div>
                  ))}
                </div>

                {/* Регион */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: A.soft, marginBottom: 6 }}>Регион</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Ташкент","Самарканд","Андижан","Бухара","Наманган","Фергана"].map(r => (
                      <button key={r} onClick={() => setNewAcc(a => ({ ...a, region: r }))} style={{ background: newAcc.region === r ? A.teal + "22" : "#102433", border: `1px solid ${newAcc.region === r ? A.teal : A.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: newAcc.region === r ? A.teal : A.soft, cursor: "pointer" }}>{r}</button>
                    ))}
                  </div>
                </div>

                {/* Превью */}
                {newAcc.login && newAcc.password && (
                  <div style={{ background: "#0A2520", border: `1px solid ${A.teal}44`, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: A.teal, fontWeight: 700, marginBottom: 4 }}>✅ Данные для входа:</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: A.text }}>Логин: <b>{newAcc.login}</b></div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: A.text }}>Пароль: <b>{newAcc.password}</b></div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNewAccModal(false)} style={{ flex: 1, background: "#102433", color: A.soft, border: `1px solid ${A.border}`, borderRadius: 12, padding: "12px", fontSize: 14, cursor: "pointer" }}>Отмена</button>
                  <button onClick={addAccount} disabled={!newAcc.name || !newAcc.login || !newAcc.password}
                    style={{ flex: 2, background: newAcc.name && newAcc.login && newAcc.password ? A.teal : "#1C3A4A", color: newAcc.name && newAcc.login && newAcc.password ? "#08131F" : A.muted, border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                    ✅ Создать аккаунт
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ПРОМОКОДЫ ───────────────────────────────────────── */}
      {tab === "promos" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Промокоды ({promos.length})</div>
            <button onClick={() => setNewPromoModal(true)} style={{ background: A.teal, color: "#08131F", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Создать</button>
          </div>

          {promos.map(p => {
            const usePct = p.maxUses > 0 ? Math.min(100, Math.round(p.uses / p.maxUses * 100)) : 0;
            const nearly = usePct >= 80;
            return (
              <div key={p.code} style={{ background: A.card, border: `1px solid ${p.active ? A.border : "#0D1E2C"}`, borderRadius: 14, padding: "14px", marginBottom: 10, opacity: p.active ? 1 : 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: 1, color: A.amber }}>{p.code}</div>
                    <div style={{ fontSize: 12, color: A.teal, fontWeight: 700, marginTop: 2 }}>−{p.discount}% скидка</div>
                  </div>
                  <AdminToggle value={p.active} onChange={() => togglePromo(p.code)} />
                </div>
                <div style={{ fontSize: 11, color: A.muted, marginBottom: 6 }}>
                  Использований: {p.uses} / {p.maxUses} · До: {p.expires}
                </div>
                <div style={{ height: 5, background: "#102433", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ width: usePct + "%", height: "100%", background: nearly ? A.red : A.teal, borderRadius: 3 }} />
                </div>
                {nearly && <div style={{ fontSize: 11, color: A.red, marginBottom: 8 }}>⚠️ Почти исчерпан — {p.maxUses - p.uses} ост.</div>}
                <button onClick={() => deletePromo(p.code)} style={{ background: "none", border: `1px solid ${A.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, color: A.red, cursor: "pointer", fontWeight: 600 }}>🗑 Удалить</button>
              </div>
            );
          })}

          {/* Модалка создания промокода */}
          {newPromoModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.8)", zIndex: 300, display: "flex", alignItems: "flex-end" }} onClick={() => setNewPromoModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{ background: "#0B1B28", width: "100%", borderRadius: "20px 20px 0 0", padding: "20px 20px 36px" }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>🎁 Новый промокод</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Код</div>
                    <AInp value={newPromoCode} onChange={setNewPromoCode} placeholder="SUMMER25" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Скидка %</div>
                    <AInp type="number" value={newPromoDisc} onChange={setNewPromoDisc} placeholder="10" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Макс. использ.</div>
                    <AInp type="number" value={newPromoMax} onChange={setNewPromoMax} placeholder="100" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Истекает</div>
                    <AInp value={newPromoExp} onChange={setNewPromoExp} placeholder="31.12.2025" />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNewPromoModal(false)} style={{ flex: 1, background: "#102433", color: A.soft, border: `1px solid ${A.border}`, borderRadius: 12, padding: "12px", fontSize: 14, cursor: "pointer" }}>Отмена</button>
                  <button onClick={addPromo} disabled={!newPromoCode.trim()} style={{ flex: 2, background: newPromoCode.trim() ? A.teal : "#1C3A4A", color: newPromoCode.trim() ? "#08131F" : A.muted, border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 700, cursor: newPromoCode.trim() ? "pointer" : "default" }}>✅ Создать</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── НАСТРОЙКИ ───────────────────────────────────────── */}
      {tab === "settings" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Настройки системы</div>

          {/* Переключатели */}
          {[
            { key: "storeOpen",          label: "Магазин открыт",          sub: "Принимаем заказы от клиентов",      icon: "🏪" },
            { key: "smsNotify",          label: "SMS-уведомления",          sub: "Клиентам при смене статуса заказа", icon: "📱" },
            { key: "aiDoctor",           label: "AI-доктор рыб",            sub: "Доступен клиентам в приложении",   icon: "🩺" },
            { key: "courierSignup",      label: "Приём курьеров",           sub: "Регистрация новых курьеров",        icon: "🏍️" },
            { key: "autoAssignCourier",  label: "Авто-назначение курьера",  sub: "По ближайшему региону к заказу",   icon: "🤖" },
            { key: "cashPayment",        label: "Оплата наличными",         sub: "Наличными курьеру при получении",  icon: "💵" },
            { key: "clickPayment",       label: "Оплата Click",             sub: "QR-код при оформлении заказа",     icon: "🟦" },
            { key: "paymePayment",       label: "Оплата Payme",             sub: "Карты Uzcard и Humo",              icon: "🟢" },
          ].map(s => (
            <div key={s.key} style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: A.muted, marginTop: 2 }}>{s.sub}</div>
              </div>
              <AdminToggle value={settings[s.key]} onChange={v => setSetting(s.key, v)} />
            </div>
          ))}

          {/* Числовые настройки */}
          <div style={{ fontSize: 13, fontWeight: 700, margin: "18px 0 10px" }}>Параметры</div>
          <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: A.soft, marginBottom: 4 }}>Гарантия здоровья рыб (часов)</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="range" min={12} max={96} step={12} value={settings.guaranteeHours} onChange={e => setSetting("guaranteeHours", Number(e.target.value))}
                style={{ flex: 1, accentColor: A.teal }} />
              <span style={{ fontSize: 16, fontWeight: 800, color: A.teal, minWidth: 40, textAlign: "right" }}>{settings.guaranteeHours} ч</span>
            </div>
          </div>

          <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: A.soft, marginBottom: 6 }}>Телефон поддержки</div>
            <AInp value={settings.supportPhone} onChange={v => setSetting("supportPhone", v)} />
          </div>

          <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: A.soft, marginBottom: 6 }}>Время работы</div>
            <AInp value={settings.supportHours} onChange={v => setSetting("supportHours", v)} />
          </div>

          <button onClick={() => { showToast("Настройки сохранены ✅"); }} style={{ width: "100%", background: A.teal, color: "#08131F", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
            💾 Сохранить настройки
          </button>

          {/* Опасная зона */}
          <div style={{ background: "#1A0808", border: `1px solid ${A.red}33`, borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: A.red, marginBottom: 6 }}>🔴 Опасная зона</div>
            <div style={{ fontSize: 12, color: A.muted, marginBottom: 12 }}>Закрыть магазин — клиенты не смогут оформлять заказы</div>
            {!confirmClose ? (
              <button onClick={() => setConfirmClose(true)} style={{ background: "none", border: `1px solid ${A.red}`, color: A.red, borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {settings.storeOpen ? "Закрыть магазин" : "Открыть магазин"}
              </button>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: A.red, marginBottom: 8 }}>Вы уверены?</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConfirmClose(false)} style={{ flex: 1, background: "#102433", color: A.soft, border: `1px solid ${A.border}`, borderRadius: 10, padding: "9px", fontSize: 13, cursor: "pointer" }}>Отмена</button>
                  <button onClick={() => { setSetting("storeOpen", !settings.storeOpen); setConfirmClose(false); showToast(settings.storeOpen ? "Магазин закрыт" : "Магазин открыт", settings.storeOpen ? "bad" : "ok"); }} style={{ flex: 2, background: A.red, color: "#fff", border: "none", borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Подтвердить</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: toast.type === "bad" ? "#2A1414" : "#0F2A26", border: `1px solid ${toast.type === "bad" ? A.red : A.teal}`, color: A.text, padding: "10px 18px", borderRadius: 12, fontSize: 13, zIndex: 500, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          {toast.text}
        </div>
      )}
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | city | catalog | seller | profile | delivery | courier | doctor | diary | admin
  const [region, setRegion] = useState(null);
  const [cart, setCart] = useState([]);

  // Telegram Mini App — инициализация
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();           // сообщаем Telegram что приложение готово
      tg.expand();          // разворачиваем на весь экран
      tg.disableVerticalSwipes?.(); // отключаем закрытие свайпом вниз
    }
  }, []);

  // Auth state
  const [accounts, setAccounts] = useState(INIT_ACCOUNTS);
  const [loggedInAcc, setLoggedInAcc] = useState(null);  // текущий аккаунт курьера/продавца
  const [needChangePwd, setNeedChangePwd] = useState(false); // требуется смена пароля
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [userTanks, setUserTanks] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [quizFilter, setQuizFilter] = useState(null); // фильтр из квиза

  if (screen === "landing") return <Landing onEnter={() => setScreen("quiz")} />;

  if (screen === "quiz")
    return (
      <OnboardingQuiz
        onDone={({ cartItems, quizFilter: qf }) => {
          if (cartItems && cartItems.length > 0) setCart(cartItems);
          setQuizFilter(qf || null);
          setScreen("city");
        }}
      />
    );
  if (screen === "city" || !region)
    return (
      <CityPicker
        onSelect={(r) => {
          setRegion(r);
          setScreen("catalog");
        }}
      />
    );
  if (screen === "doctor") return <FishDoctorScreen onBack={() => setScreen("catalog")} />;
  if (screen === "diary")  return <DiaryScreen onBack={() => setScreen("catalog")} />;
  if (screen === "club")   return <ClubScreen onBack={() => setScreen("catalog")} />;
  if (screen === "seller") {
    if (!loggedInAcc || loggedInAcc.role !== "seller") {
      return (
        <LoginScreen
          role="seller"
          accounts={accounts}
          onBack={() => setScreen("catalog")}
          onLogin={(acc, needChange) => {
            setLoggedInAcc(acc);
            if (needChange) { setNeedChangePwd(true); } else { setNeedChangePwd(false); }
          }}
        />
      );
    }
    if (needChangePwd) {
      return (
        <ChangePasswordScreen
          account={loggedInAcc}
          onDone={newPwd => {
            setAccounts(as => as.map(a => a.id === loggedInAcc.id ? { ...a, password: newPwd, tempPass: null } : a));
            setNeedChangePwd(false);
          }}
        />
      );
    }
    return <SellerCabinet onBack={() => { setLoggedInAcc(null); setScreen("catalog"); }} />;
  }

  if (screen === "courier") {
    if (!loggedInAcc || loggedInAcc.role !== "courier") {
      return (
        <LoginScreen
          role="courier"
          accounts={accounts}
          onBack={() => setScreen("catalog")}
          onLogin={(acc, needChange) => {
            setLoggedInAcc(acc);
            if (needChange) { setNeedChangePwd(true); } else { setNeedChangePwd(false); }
          }}
        />
      );
    }
    if (needChangePwd) {
      return (
        <ChangePasswordScreen
          account={loggedInAcc}
          onDone={newPwd => {
            setAccounts(as => as.map(a => a.id === loggedInAcc.id ? { ...a, password: newPwd, tempPass: null } : a));
            setNeedChangePwd(false);
          }}
        />
      );
    }
    return <CourierView onBack={() => { setLoggedInAcc(null); setScreen("catalog"); }} />;
  }
  if (screen === "admin")  return <AdminPanel onBack={() => setScreen("profile")} />;
  if (screen === "delivery" && trackingOrder)
    return (
      <DeliveryTracker
        order={trackingOrder}
        onBack={() => setScreen("profile")}
        onSimulate={(status) => {
          const updated = { ...trackingOrder, status };
          setTrackingOrder(updated);
          setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
        }}
      />
    );
  if (screen === "profile")
    return (
      <Profile
        onBack={() => setScreen("catalog")}
        onOpenCatalog={() => setScreen("catalog")}
        orders={orders}
        userTanks={userTanks}
        setUserTanks={setUserTanks}
        onTrackOrder={(order) => {
          setTrackingOrder(order);
          setScreen("delivery");
        }}
        onOpenDoctor={() => setScreen("doctor")}
        onOpenDiary={() => setScreen("diary")}
        onOpenSeller={() => setScreen("seller")}
        onOpenCourier={() => setScreen("courier")}
        onOpenClub={() => setScreen("club")}
        onOpenAdmin={() => setScreen("admin")}
      />
    );

  // Главная страница: лендинг-шапка + каталог
  return (
    <>
      {/* Компактный лендинг-хедер */}
      <HomeHero
        region={region}
        onChangeRegion={() => setScreen("city")}
        onOpenProfile={() => setScreen("profile")}
        onOpenDoctor={() => setScreen("doctor")}
        onOpenDiary={() => setScreen("diary")}
        onOpenSeller={() => setScreen("seller")}
        onOpenCourier={() => setScreen("courier")}
        onOpenClub={() => setScreen("club")}
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Каталог — без своего хедера, встроен под лендинг */}
      <Catalog
        region={region}
        cart={cart}
        setCart={setCart}
        onChangeRegion={() => setScreen("city")}
        onOpenConfigurator={() => setConfiguratorOpen(true)}
        onOpenProfile={() => setScreen("profile")}
        onOpenDoctor={() => setScreen("doctor")}
        onOrderPlaced={(order) => setOrders((o) => [...o, order])}
        externalCartOpen={cartOpen}
        onExternalCartClose={() => setCartOpen(false)}
        hideHeader
        quizFilter={quizFilter}
        onClearQuizFilter={() => setQuizFilter(null)}
      />

      {configuratorOpen && (
        <AiConfigurator
          onClose={() => setConfiguratorOpen(false)}
          onApply={(fishList) => {
            const expanded = fishList.flatMap((f) =>
              Array.from({ length: f.qty || 1 }, () => f)
            );
            setCart((c) => [...c, ...expanded]);
            setConfiguratorOpen(false);
          }}
        />
      )}
    </>
  );
}
