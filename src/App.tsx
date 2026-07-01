import React, { useState, useMemo, useRef, useEffect } from "react";

/* ============================================================
   🍏 Icon — набор иконок в стиле iOS / SF Symbols (line-style,
   скруглённые концы линий, единая толщина обводки). Используется
   вместо эмодзи в нижней навигации и меню профиля, чтобы интерфейс
   выглядел как нативный Apple-стиль.
   ============================================================ */
function Icon({ name, size = 20, color = "currentColor", strokeWidth = 1.8 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const paths = {
    home: (
      <svg {...common}>
        <path d="M3.5 11.5 12 4l8.5 7.5" />
        <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3.5a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
    fish: (
      <svg {...common}>
        <path d="M3 12c3-4.5 8-6.5 13-5 2 .6 4 2 5 5-1 3-3 4.4-5 5-5 1.5-10-.5-13-5Z" />
        <circle cx="16" cy="10.6" r="0.9" fill={color} stroke="none" />
        <path d="M18.5 8.5c1.5-1.8 2.8-2.2 2.5-.3M18.5 15.5c1.5 1.8 2.8 2.2 2.5.3" />
      </svg>
    ),
    cart: (
      <svg {...common}>
        <path d="M4 5h2l1.6 10.2a1.8 1.8 0 0 0 1.8 1.5h7.4a1.8 1.8 0 0 0 1.8-1.5L20 8H7" />
        <circle cx="10" cy="20" r="1.15" fill={color} stroke="none" />
        <circle cx="17" cy="20" r="1.15" fill={color} stroke="none" />
      </svg>
    ),
    doctor: (
      <svg {...common}>
        <path d="M12 21c-4.5-2.7-8-6-8-9.8C4 8.1 6.1 6 8.7 6c1.5 0 2.7.7 3.3 1.8C12.6 6.7 13.8 6 15.3 6 17.9 6 20 8.1 20 11.2c0 3.8-3.5 7.1-8 9.8Z" />
        <path d="M9.5 12h1.4l.7-1.6.9 3.2.7-1.6h1.3" />
      </svg>
    ),
    ai: (
      <svg {...common}>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
    person: (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20c1-3.8 4-5.8 7-5.8s6 2 7 5.8" />
      </svg>
    ),
    aquarium: (
      <svg {...common}>
        <rect x="3.5" y="6" width="17" height="12" rx="1.6" />
        <path d="M3.5 10.5c1.8 1 3.4-1 5.2 0s3.4 1 5.2 0 3.4-1 5.9 0" />
        <path d="M8 6V4M16 6V4" />
      </svg>
    ),
    box: (
      <svg {...common}>
        <path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
        <path d="M3.5 8v8.2c0 .4.2.7.6.9L12 20l7.9-2.9c.4-.2.6-.5.6-.9V8" />
        <path d="M12 12v8" />
      </svg>
    ),
    heart: (
      <svg {...common}>
        <path d="M12 20.5C6 16.8 3 13.4 3 9.8 3 7.2 5 5 7.6 5c1.7 0 3.2.9 4.4 2.6C13.2 5.9 14.7 5 16.4 5 19 5 21 7.2 21 9.8c0 3.6-3 7-9 10.7Z" />
      </svg>
    ),
    repeat: (
      <svg {...common}>
        <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
        <path d="M20 4v4h-4" />
        <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
        <path d="M4 20v-4h4" />
      </svg>
    ),
    gift: (
      <svg {...common}>
        <rect x="3.5" y="9.5" width="17" height="10" rx="1.2" />
        <path d="M3.5 9.5h17M12 9.5V20" />
        <path d="M12 9.5c-2-3.2-6-3.2-6-.8 0 1 1 .8 2.5.8H12ZM12 9.5c2-3.2 6-3.2 6-.8 0 1-1 .8-2.5.8H12Z" />
      </svg>
    ),
    chevron: (
      <svg {...common}>
        <path d="M9 5.5 15.5 12 9 18.5" />
      </svg>
    ),
    back: (
      <svg {...common}>
        <path d="M15 5.5 8.5 12 15 18.5" />
      </svg>
    ),
  };
  return paths[name] || null;
}

/* ============================================================
   🧯 ErrorBoundary — страховка от белого экрана
   Ловит любую непойманную ошибку рендера (например, из-за
   неожиданной формы данных, восстановленных из localStorage
   после обновления приложения) и показывает аккуратный экран
   вместо падения всего Mini App.
   ============================================================ */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Единая точка логирования непойманных ошибок рендера — сюда же в будущем
    // подключить Sentry/аналитику вместо простого console.error.
    console.error("AquaMarjon: unhandled render error", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    // Чистим только собственные ключи приложения (префикс aqua_), а не весь
    // localStorage целиком — Telegram WebView или соседний виджет могут
    // хранить там что-то своё, что лучше не трогать.
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("aqua_"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse at top, #0E2235 0%, #08131F 70%)",
          color: "#E8F4F8",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "32px 20px", textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🐠💥</div>
          <h1 style={{ fontSize: 19, fontWeight: 900, margin: "0 0 8px", fontFamily: "Georgia, serif" }}>
            Что-то пошло не так
          </h1>
          <p style={{ fontSize: 13, color: "#9FC4CC", lineHeight: 1.6, maxWidth: 320, margin: "0 0 24px" }}>
            Приложение столкнулось с неожиданной ошибкой. Ваши заказы и данные не пропали —
            попробуйте обновить страницу.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280, marginBottom: 20 }}>
            <button
              onClick={this.handleReload}
              style={{
                background: "linear-gradient(135deg, #00C9B1, #00A896)", color: "#08131F",
                border: "none", borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 800,
                cursor: "pointer", boxShadow: "0 6px 24px #00C9B144",
              }}
            >
              Обновить страницу
            </button>
            <button
              onClick={this.handleResetAndReload}
              style={{
                background: "#102433", color: "#9FC4CC",
                border: "1px solid #1C3A4A", borderRadius: 14, padding: "13px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              Сбросить локальные данные и обновить
            </button>
          </div>

          {/* Технические детали — свёрнуты по умолчанию, пригодятся при обращении
              в поддержку (можно сделать скриншот) или для отладки в devtools. */}
          <details style={{ fontSize: 11, color: "#6C8E96", maxWidth: 320, textAlign: "left" }}>
            <summary style={{ cursor: "pointer", marginBottom: 6 }}>Технические детали</summary>
            <div style={{
              background: "#0B1B28", border: "1px solid #1C3A4A", borderRadius: 10,
              padding: "10px 12px", fontFamily: "monospace", whiteSpace: "pre-wrap",
              wordBreak: "break-word", maxHeight: 160, overflowY: "auto",
            }}>
              {this.state.error?.message || String(this.state.error)}
              {this.state.errorInfo?.componentStack ? `\n${this.state.errorInfo.componentStack}` : ""}
            </div>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ============================================================
   AquaMarjon — бэкенд интеграция
   ============================================================ */
// API URL берётся из переменной окружения, если она задана сборщиком, иначе —
// дефолт (текущий прод-бэкенд), чтобы ничего не сломалось, если .env не настроен.
// Работает «из коробки» с CRA/Next.js (REACT_APP_API_URL / NEXT_PUBLIC_API_URL).
// ⚠️ Если сборщик — Vite: process.env там по умолчанию не определён, замените
// строку ниже на:
//   const API = import.meta.env.VITE_API_URL || "https://aqua-uz-backend.up.railway.app/api";
// и добавьте VITE_API_URL=... в .env (переменные Vite обязаны начинаться с VITE_).
function readEnvApiUrl(): string | undefined {
  try {
    // typeof-проверка обязательна: в браузерном бандле без полифилла `process`
    // просто не существует, и обращение к process.env упадёт в ReferenceError.
    if (typeof process !== "undefined" && process.env) {
      return process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
    }
  } catch {
    // process не определён в этом окружении — используем дефолт ниже
  }
  return undefined;
}
const API = readEnvApiUrl() || "https://aqua-uz-backend.up.railway.app/api";

// ⚠️ ПЕРЕД ПРОДАКШЕНОМ: offline-фолбэк логина сверяет пароли из INIT_ACCOUNTS
// (см. ниже) прямо в клиентском бандле — они видны любому, кто откроет devtools.
// Это нужно только для офлайн-демо без бэкенда. Перед реальным релизом либо
// поставьте ALLOW_OFFLINE_AUTH_FALLBACK = false (тогда при недоступном API
// логин просто покажет ошибку, как и должно быть), либо уберите password/
// tempPass из INIT_ACCOUNTS и переведите её на безопасные мок-данные без секретов.
const ALLOW_OFFLINE_AUTH_FALLBACK = true;
const tg = (window as any).Telegram?.WebApp;
const tgInitData: string = tg?.initData || "";
const tgUser = tg?.initDataUnsafe?.user as { id?: number; first_name?: string; username?: string } | undefined;

// Единый тип роли аккаунта продавца/курьера/админа — раньше "seller"/"courier"/
// "admin" были рассыпаны по файлу как строковые литералы без единого источника
// правды. Теперь опечатку в роли ловит компилятор, а не рантайм.
type Role = "seller" | "courier" | "admin";

// Единая цветовая палитра (тёмная тема seller/courier-кабинетов). Раньше этот
// объект был скопирован дословно в 4 местах (ContactSupportScreen, LoginScreen,
// ChangePasswordScreen, AdminPanel) — при смене бренд-цвета пришлось бы искать
// каждую копию руками. Теперь один источник правды; локальные алиасы `C`/`A`
// в компонентах ниже сохранены, чтобы не переименовывать все обращения к ним.
const THEME = {
  bg: "#08131F", card: "#0E2030", border: "#1C3A4A", teal: "#00C9B1",
  amber: "#F0A93C", text: "#E8F4F8", muted: "#6C8E96", soft: "#9FC4CC",
  red: "#FF6B6B", green: "#51CF66",
} as const;

// ------------------------------------------------------------
// JWT токен — хранится ТОЛЬКО в памяти (модульная переменная), не в
// localStorage. Раньше токен клался в localStorage, но: (1) loggedInAcc
// и так не восстанавливается из токена при перезагрузке страницы (см.
// `useState(null)` для loggedInAcc в App) — то есть персистентность в
// localStorage не давала реального UX-бенефита (пользователь всё равно
// логинится заново после reload), (2) любой XSS/инжект в WebView мог бы
// прочитать токен из localStorage синхронно и унести его. Хранение в
// памяти даёт то же поведение для пользователя, но токен не переживает
// обновление страницы и не виден через localStorage в devtools.
// Если понадобится «не разлогинивать при обновлении» — правильный путь:
// на бэкенде выдавать короткоживущий токен и на старте приложения
// молча переавторизовываться через tgInitData (Telegram сам подтверждает
// личность пользователя), а не персистить сам токен на клиенте.
let inMemoryToken: string = "";
function getToken(): string { return inMemoryToken; }
function setToken(t: string) { inMemoryToken = t; }
function clearToken() { inMemoryToken = ""; }

// Базовые заголовки для авторизованных запросов
function authHeaders(): Record<string, string> {
  return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
}

/* ------------------------------------------------------------
   🪵 Логирование клиентских ошибок
   Единая точка вместо разрозненных `catch {}` по всему файлу —
   пишет в console.error со структурным контекстом (что упало,
   с какими параметрами), чтобы это было видно в devtools или
   логах Telegram WebView. Когда подключим Sentry/аналитику —
   правим только эту функцию, вызовы по всему коду трогать не надо.
   ------------------------------------------------------------ */
function logClientError(context: string, error: unknown, extra?: Record<string, any>) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[AquaMarjon] ${context}:`, message, extra || "");
  // Заглушка под будущую аналитику:
  // (window as any).Sentry?.captureException(error, { tags: { context }, extra });
}

/* ------------------------------------------------------------
   Push-уведомления через Telegram Bot API
   Реальная отправка сообщения происходит на бэкенде (через
   bot.sendMessage по telegram_id) — фронтенд лишь сообщает
   бэкенду «отправь это событие» и хранит/синхронизирует
   пользовательские настройки уведомлений.
   ------------------------------------------------------------ */
type NotifType = "water_reminder" | "order_status" | "new_arrival" | "subscription_due" | "badge_progress" | "inactivity_reminder";

async function notifyTelegram(type: NotifType, payload: Record<string, any> = {}) {
  if (!tgUser?.id) return false; // вне Telegram WebApp пушить некому
  try {
    const res = await fetch(`${API}/notifications/notify`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ telegram_id: tgUser.id, type, payload }),
    });
    if (!res.ok) {
      // Бэкенд ответил, но с ошибкой (напр. неверный telegram_id, бот
      // заблокирован пользователем, 5xx) — это не «нет сети», а реальный
      // повод для расследования, поэтому логируем отдельно от catch ниже.
      logClientError("notifyTelegram: non-OK response", new Error(`HTTP ${res.status}`), { type, telegram_id: tgUser.id });
      return false;
    }
    return true;
  } catch (err) {
    // Сюда попадают офлайн/недоступный бэкенд — UI это не блокирует,
    // но факт всё равно логируем, чтобы отличать «никто не пушится» от
    // «пушится, но с ошибками», глядя на логи, а не гадая.
    logClientError("notifyTelegram: request failed", err, { type, telegram_id: tgUser.id, online: typeof navigator !== "undefined" ? navigator.onLine : undefined });
    return false;
  }
}

type NotifPrefs = { water: boolean; delivery: boolean; arrivals: boolean };
const DEFAULT_NOTIF_PREFS: NotifPrefs = { water: true, delivery: true, arrivals: true };

async function syncNotifPrefs(prefs: NotifPrefs) {
  if (!tgUser?.id) return;
  try {
    const res = await fetch(`${API}/notifications/preferences`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ telegram_id: tgUser.id, prefs }),
    });
    if (!res.ok) {
      logClientError("syncNotifPrefs: non-OK response", new Error(`HTTP ${res.status}`), { telegram_id: tgUser.id, prefs });
    }
  } catch (err) {
    logClientError("syncNotifPrefs: request failed", err, { telegram_id: tgUser.id, prefs, online: typeof navigator !== "undefined" ? navigator.onLine : undefined });
  }
}

/* ============================================================
   🏷️ Промокоды — бэкенд-валидация
   ============================================================ */
type PromoType = "percent" | "fixed" | "free_delivery";

interface PromoResult {
  code: string;
  type: PromoType;
  value: number;
  label: string;
}

function calcPromoSavings(
  result: PromoResult | null,
  subtotal: number,
  baseDelivery: number,
): { discount: number; delivery: number } {
  if (!result) return { discount: 0, delivery: baseDelivery };
  switch (result.type) {
    case "percent":
      return { discount: Math.round(subtotal * result.value / 100), delivery: baseDelivery };
    case "fixed":
      return { discount: Math.min(result.value, subtotal), delivery: baseDelivery };
    case "free_delivery":
      return { discount: 0, delivery: 0 };
    default:
      return { discount: 0, delivery: baseDelivery };
  }
}

function promoErrorMessage(serverError: string): string {
  switch (serverError) {
    case "PROMO_NOT_FOUND":      return "Промокод не найден";
    case "PROMO_EXPIRED":        return "Срок действия промокода истёк";
    case "PROMO_USED":           return "Промокод уже использован";
    case "PROMO_LIMIT_REACHED":  return "Промокод больше не действует (лимит исчерпан)";
    case "PROMO_MIN_ORDER":      return "Сумма заказа слишком мала для этого промокода";
    case "PROMO_WRONG_SEGMENT":  return "Этот промокод недоступен для вашего аккаунта";
    default:                     return "Не удалось применить промокод — попробуйте позже";
  }
}

// Старые локальные промокоды (AQUA10 / FISH20 / NEWFISH, см. CHECKOUT_PROMOS ниже
// по файлу) — используются только как офлайн-фолбэк, если бэкенд недоступен
// (упала сеть/таймаут/5xx). Когда бэкенд гарантированно жив — этот блок можно убрать.
function legacyPromoFallback(key: string, subtotal: number): { result?: PromoResult; error?: string } {
  const percent = (CHECKOUT_PROMOS as Record<string, number>)[key];
  if (percent == null) return { error: "Промокод не найден" };
  return {
    result: {
      code: key,
      type: "percent",
      value: percent,
      label: `−${percent}% (офлайн-режим)`,
    },
  };
}

/* ------------------------------------------------------------
   🎁 Промокоды-награды за достижения дневника
   Реальная мотивация: разблокированный бейдж дневника даёт
   рабочий промокод в магазине (а не просто виртуальную плашку).
   Храним их локально — это персональные награды пользователя,
   а не серверные акции, поэтому проверяем их ДО похода в бэкенд.
   ------------------------------------------------------------ */
/* ------------------------------------------------------------
   🤝 Реферальная программа — «Пригласи друга, оба получите промокод».
   Переиспользует тот же движок наград, что и бейджи дневника
   (unlockAchievementPromo/getRewardPromos), просто под виртуальным
   «бейджем» referral — единая система хранения, единая проверка
   usedAt/minOrderSum при оплате.
   ------------------------------------------------------------ */
const REFERRAL_BADGE = { id: "referral", title: "Приведи друга", icon: "🤝" };
const MY_REFERRAL_CODE_KEY = "aqua_my_referral_code";
const REDEEMED_REFERRALS_KEY = "aqua_redeemed_referral_codes";

function getMyReferralCode(): string {
  let code = readLocal(MY_REFERRAL_CODE_KEY, null);
  if (!code) {
    code = "FRIEND-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    writeLocal(MY_REFERRAL_CODE_KEY, code);
  }
  return code;
}

// Активирует чужой реферальный код: текущий пользователь получает промокод-награду.
// В реальном бэкенде это также начислило бы промокод владельцу кода — здесь,
// в локальном прототипе без серверных аккаунтов, мы честно показываем это
// в тексте подсказки, а не делаем вид, что наградили и друга тоже.
function redeemReferralCode(code: string): { ok: boolean; error?: string; reward?: any } {
  const key = code.trim().toUpperCase();
  if (!key) return { ok: false, error: "Введите код друга" };
  if (key === getMyReferralCode()) return { ok: false, error: "Это ваш собственный код" };
  const redeemed = readLocal(REDEEMED_REFERRALS_KEY, []);
  if (redeemed.includes(key)) return { ok: false, error: "Вы уже активировали реферальный код" };
  writeLocal(REDEEMED_REFERRALS_KEY, [...redeemed, key]);
  const reward = unlockAchievementPromo(REFERRAL_BADGE, 1); // тир «серебро» — 10%, от 150 000 сум
  return { ok: true, reward };
}

const ACHIEVEMENT_PROMO_KEY = "aqua_diary_reward_promos";
const ACHIEVEMENT_PROMO_PERCENTS = [5, 10, 15]; // по тиру: бронза/серебро/золото
// Минимальная сумма заказа для применения награды — растёт вместе с тиром,
// иначе −15% можно слить на самый дешёвый товар в корзине и уйти в минус по марже.
const ACHIEVEMENT_PROMO_MIN_ORDER = [50000, 150000, 300000]; // сум, по тиру: бронза/серебро/золото

function diaryAchievementPromoCode(badgeId: string, tierIndex: number): string {
  const tierLetter = ["B", "S", "G"][tierIndex] || "B";
  return `AQUA-${badgeId.toUpperCase().slice(0, 8)}-${tierLetter}`;
}

function getRewardPromos(): Record<string, { percent: number; label: string; badgeId: string; tierIndex: number; usedAt: string | null; minOrderSum: number }> {
  return readLocal(ACHIEVEMENT_PROMO_KEY, {});
}

// Сохраняет новый промокод-награду за бейдж (если такого ещё нет) и возвращает его
function unlockAchievementPromo(badge: { id: string; title: string; icon: string }, tierIndex: number) {
  const code = diaryAchievementPromoCode(badge.id, tierIndex);
  const promos = getRewardPromos();
  if (!promos[code]) {
    const percent = ACHIEVEMENT_PROMO_PERCENTS[tierIndex] ?? 5;
    const minOrderSum = ACHIEVEMENT_PROMO_MIN_ORDER[tierIndex] ?? 50000;
    promos[code] = {
      percent,
      label: `${badge.icon} Награда за «${badge.title}» (${TIER_NAMES[tierIndex]})`,
      badgeId: badge.id,
      tierIndex,
      usedAt: null,
      minOrderSum,
    };
    writeLocal(ACHIEVEMENT_PROMO_KEY, promos);
  }
  return { code, ...promos[code] };
}

// Отмечает промокод-награду как использованный — вызывается при успешном
// оформлении заказа, чтобы код нельзя было применить повторно (одноразовость).
function markRewardPromoUsed(code: string) {
  const key = code.trim().toUpperCase();
  const promos = getRewardPromos();
  if (promos[key] && !promos[key].usedAt) {
    promos[key] = { ...promos[key], usedAt: new Date().toISOString() };
    writeLocal(ACHIEVEMENT_PROMO_KEY, promos);
  }
}

async function applyPromoImpl(
  code: string,
  subtotal: number,
  userId: number | undefined,
  signal: AbortSignal,
): Promise<{ result?: PromoResult; error?: string }> {
  const key = code.trim().toUpperCase();
  if (!key) return { error: "Введите промокод" };

  // Сначала проверяем личные промокоды-награды за достижения дневника —
  // они не существуют на бэкенде, поэтому их нужно ловить раньше сетевого запроса.
  const rewardPromos = getRewardPromos();
  if (rewardPromos[key]) {
    const r = rewardPromos[key];
    if (r.usedAt) {
      return { error: promoErrorMessage("PROMO_USED") };
    }
    if (r.minOrderSum && subtotal < r.minOrderSum) {
      return { error: `Минимальная сумма заказа для этого промокода — ${r.minOrderSum.toLocaleString("ru-RU")} сум` };
    }
    return {
      result: {
        code: key,
        type: "percent",
        value: r.percent,
        label: `−${r.percent}% · награда за достижение 🏅`,
      },
    };
  }

  let res: Response;
  try {
    res = await fetch(`${API}/promos/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: key, cart_total: subtotal, user_id: userId }),
      signal,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") throw e;
    // Сеть недоступна — пробуем старый локальный список промокодов,
    // чтобы не ломать чекаут.
    return legacyPromoFallback(key, subtotal);
  }

  if (!res.ok) {
    // Бэкенд ответил, но с ошибкой 5xx (а не «промокод неверный») — тоже
    // пробуем офлайн-фолбэк перед тем как сдаться.
    if (res.status >= 500) return legacyPromoFallback(key, subtotal);
    const data = await res.json().catch(() => ({}));
    return { error: promoErrorMessage(data.error || "") };
  }

  const data = await res.json();
  const type: PromoType = data.type;
  const value: number = data.value ?? 0;
  let label: string;
  switch (type) {
    case "percent":        label = `−${value}%`; break;
    case "fixed":          label = `−${value.toLocaleString("ru-RU")} сум`; break;
    case "free_delivery":  label = "Доставка бесплатно 🚚"; break;
    default:                label = "Скидка применена";
  }
  return { result: { code: key, type, value, label } };
}

function PromoSpinner() {
  return (
    <>
      <style>{`@keyframes aquaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <span style={{
        display: "inline-block", width: 14, height: 14,
        border: "2px solid #1C3A4A", borderTopColor: "#00C9B1",
        borderRadius: "50%", animation: "aquaSpin 0.65s linear infinite",
      }} />
      <span>Проверяем…</span>
    </>
  );
}

function PromoField({ subtotal, userId, promoResult, onApply }: {
  subtotal: number; userId?: number;
  promoResult: PromoResult | null;
  onApply: (r: PromoResult | null) => void;
}) {
  const [input, setInput] = useState(promoResult?.code ?? "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const applied = promoResult !== null;

  async function handleApply() {
    if (loading) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setErr("");
    try {
      const { result, error } = await applyPromoImpl(input, subtotal, userId, ctrl.signal);
      if (error) {
        setErr(error);
        onApply(null);
      } else if (result) {
        onApply(result);
        setErr("");
      }
    } catch (e: any) {
      if (e.name === "AbortError") return;
      setErr("Нет соединения. Проверьте интернет и попробуйте снова.");
      onApply(null);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setInput("");
    setErr("");
    onApply(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleApply();
  }

  const borderColor = err ? "#FF6B6B" : applied ? "#4ADE80" : "#1C3A4A";

  return (
    <CkField label="Промокод">
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setErr("");
            if (applied) onApply(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Напр.: AQUA10"
          style={{
            flex: 1, background: "#102433", border: `1px solid ${borderColor}`,
            borderRadius: 12, padding: "11px 14px", color: "#E8F4F8", fontSize: 14,
            outline: "none", textTransform: "uppercase", opacity: loading ? 0.6 : 1,
            transition: "border-color 0.15s, opacity 0.15s",
          }}
        />
        {applied ? (
          <button onClick={handleReset} style={{
            flexShrink: 0, background: "#1C1414", border: "1px solid #FF6B6B",
            borderRadius: 12, padding: "11px 14px", color: "#FF6B6B",
            fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          }}>✕ Убрать</button>
        ) : (
          <button onClick={handleApply} disabled={loading || !input.trim()} style={{
            flexShrink: 0, background: loading || !input.trim() ? "#0B1B28" : "#0F2A26",
            border: `1px solid ${loading || !input.trim() ? "#1C3A4A" : "#00C9B1"}`,
            borderRadius: 12, padding: "11px 16px", color: loading || !input.trim() ? "#6C8E96" : "#00C9B1",
            fontSize: 13, fontWeight: 700, cursor: loading || !input.trim() ? "default" : "pointer",
            minWidth: 96, transition: "all 0.15s", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 6,
          }}>
            {loading ? <PromoSpinner /> : "Применить"}
          </button>
        )}
      </div>
      {err && (
        <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> {err}
        </div>
      )}
      {!applied && !err && (() => {
        const rewardCodes = Object.keys(getRewardPromos());
        if (rewardCodes.length === 0) return null;
        return (
          <div style={{ fontSize: 11, color: Dp.muted, marginTop: 6 }}>
            🎁 У вас есть {rewardCodes.length} промокод{rewardCodes.length === 1 ? "" : "а"} за достижения в 📔 Дневнике — введите его выше
          </div>
        );
      })()}
      {applied && promoResult && (
        <div style={{
          marginTop: 8, background: "#071C14", border: "1px solid #00C9B133",
          borderRadius: 10, padding: "10px 12px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 12, color: "#4ADE80", fontWeight: 700 }}>✓ Промокод применён</div>
            <div style={{ fontSize: 13, color: "#E8F4F8", marginTop: 2 }}>{promoResult.label}</div>
          </div>
          <span style={{
            fontSize: 11, background: "#0F2A26", border: "1px solid #00C9B133",
            borderRadius: 8, padding: "3px 8px", color: "#00C9B1", fontFamily: "monospace",
          }}>{promoResult.code}</span>
        </div>
      )}
      {!applied && !err && (
        <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 6 }}>
          Код выдаётся при первом заказе, через Telegram или реферальную программу
        </div>
      )}
    </CkField>
  );
}

/* ============================================================
   AquaMarjon — прототип
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
  {
    id: "swordtail_red",
    type: "fish",
    name: "Меченосец «Красный»",
    latin: "Xiphophorus hellerii",
    price: 18000,
    rating: 4.8,
    reviews: 64,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: ["betta"],
    img: "🗡️",
    color: "#E14B4B",
    badges: ["🌱 Легко", "🏠 Местная"],
    about: "Узнаваема по «мечу» — вытянутому нижнему лучу хвостового плавника у самцов. Размер до 8 см, живёт 3–5 лет. Активна и неприхотлива.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Уже привыкла к местной воде — легко приживётся в вашем аквариуме.",
    pro: "pH 7.0–8.2 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 60 л",
    minVolume: 60,
    goal: ["beauty", "pets", "breeding"],
    difficulty: "easy",
  },
  {
    id: "swordtail_black",
    type: "fish",
    name: "Меченосец «Чёрный бархат»",
    latin: "Xiphophorus hellerii var.",
    price: 22000,
    rating: 4.7,
    reviews: 39,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: ["betta"],
    img: "🗡️",
    color: "#2B2B2B",
    badges: ["🌱 Легко", "🏠 Местная"],
    about: "Бархатно-чёрный окрас по всему телу, контрастный «меч» на хвосте. Размер до 8 см, живёт 3–5 лет. Мирная, хорошо смотрится стайкой.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Уже привыкла к местной воде — легко приживётся в вашем аквариуме.",
    pro: "pH 7.0–8.2 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 60 л",
    minVolume: 60,
    goal: ["beauty", "pets"],
    difficulty: "easy",
  },
  {
    id: "swordtail_indo_green",
    type: "fish",
    name: "Меченосец «Индонезийский зелёный»",
    latin: "Xiphophorus hellerii var.",
    price: 35000,
    rating: 4.9,
    reviews: 21,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "import",
    avoid: ["betta"],
    img: "🗡️",
    color: "#3CA96A",
    badges: ["✈️ Привозная", "🔴 Редкая"],
    about: "Редкая привозная форма с зеленовато-оливковым отливом и длинным «мечом». Размер до 9 см, живёт 3–5 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла карантин 14 дней — здоровая и готова к новому дому.",
    pro: "pH 7.0–8.2 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 80 л",
    minVolume: 80,
    goal: ["beauty"],
    difficulty: "medium",
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

// Подсвечивает первое вхождение query в text полужирным акцентным span'ом.
// Используется в автокомплите поиска, чтобы было видно, за что зацепился результат.
function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "#00C9B1", fontWeight: 800 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

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

// Расширяем "new_arrival" с общих новинок на конкретные позиции из вишлиста:
// сравниваем цену/наличие на момент добавления в избранное с актуальными
// данными FISH_DB и шлём точечный пуш «эта рыба подешевела / снова в наличии»,
// а не только общую рассылку о новых поступлениях.
const WISHLIST_NOTIFIED_KEY = "aqua_wishlist_notified_changes";

function getWishlistAlerts(wishlist) {
  const alerts = [];
  for (const item of wishlist || []) {
    const live = FISH_DB.find((f) => f.id === item.id);
    if (!live) continue;
    if (live.price < item.price) {
      alerts.push({ item, live, type: "price_drop", pct: Math.round((1 - live.price / item.price) * 100) });
    }
    const wasOut = item.stock === 0 || item.outOfStock === true;
    const nowIn = getStock(live) > 0;
    if (wasOut && nowIn) {
      alerts.push({ item, live, type: "restock" });
    }
  }
  return alerts;
}

async function notifyWishlistAlerts(wishlist) {
  const alerts = getWishlistAlerts(wishlist);
  if (alerts.length === 0) return;
  const notified = readLocal(WISHLIST_NOTIFIED_KEY, {});
  for (const a of alerts) {
    const dedupeKey = `${a.item.id}:${a.type}:${a.type === "price_drop" ? a.live.price : "in"}`;
    if (notified[dedupeKey]) continue;
    const ok = await notifyTelegram("new_arrival", a.type === "price_drop"
      ? { name: a.live.name, price: a.live.price, oldPrice: a.item.price, emoji: a.live.img, reason: "price_drop" }
      : { name: a.live.name, price: a.live.price, emoji: a.live.img, reason: "restock" });
    if (ok) notified[dedupeKey] = true;
  }
  writeLocal(WISHLIST_NOTIFIED_KEY, notified);
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
  (f) => `Уже вторая покупка в AquaMarjon. Качество стабильное, рыбы крепкие, без признаков болезней.`,
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
/* ------------------------------------------------------------
   Skeleton — единый плейсхолдер загрузки для карточек/сеток.
   variant: "card" (квадратная карточка товара), "line" (текстовая строка),
   "circle" (аватар/иконка). Используется вместо точечных спиннеров там,
   где заранее известна форма контента (сетки фото, карточки товаров и т.п.).
   ------------------------------------------------------------ */
function Skeleton({ variant = "line", width, height, style: extraStyle = {} }) {
  const base = {
    background: "linear-gradient(90deg, #102433 25%, #17303F 37%, #102433 63%)",
    backgroundSize: "400% 100%",
    animation: "skeletonShimmer 1.4s ease infinite",
    borderRadius: variant === "circle" ? "50%" : 8,
  };
  const dims =
    variant === "card" ? { width: width ?? "100%", aspectRatio: "1/1" } :
    variant === "circle" ? { width: width ?? 40, height: height ?? 40 } :
    { width: width ?? "100%", height: height ?? 12 };
  return (
    <>
      <style>{`@keyframes skeletonShimmer { 0%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
      <div style={{ ...base, ...dims, ...extraStyle }} />
    </>
  );
}

function SkeletonGrid({ count = 3, columns = 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderRadius: 12, overflow: "hidden" }}>
          <Skeleton variant="card" />
          <Skeleton height={10} style={{ marginTop: 6 }} />
        </div>
      ))}
    </div>
  );
}

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
   🏠 ЛЕНДИНГ — главная страница AquaMarjon
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
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: "#00C9B1" }}>AquaMarjon</span>
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
        <div style={{ fontSize: 16, fontWeight: 900, color: "#00C9B1", marginBottom: 6 }}>🐠 AquaMarjon</div>
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
        AquaMarjon
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
function CompareModal({ fishes, onClose, onRemove }) {
  const list = (fishes || []).filter(Boolean);
  if (list.length < 2) return null;
  const sizeLabel = (f) => f.size === "small" ? "Мелкая" : f.size === "medium" ? "Средняя" : "Крупная";
  const temperLabel = (f) => f.temper === "peaceful" ? "Мирная" : f.temper === "aggressive" ? "Хищная" : "Полумирная";
  const diffLabel = (f) => f.difficulty === "easy" ? "🌱 Легко" : f.difficulty === "medium" ? "🟡 Средне" : "🔴 Сложно";
  const originLabel = (f) => f.origin === "local" ? "🏠 Местная" : "✈️ Привозная";
  const rows = [
    { label: "Цена", get: (f) => formatSum(f.price) },
    { label: "Рейтинг", get: (f) => `⭐ ${f.rating}` },
    { label: "Размер", get: sizeLabel },
    { label: "Темперамент", get: temperLabel },
    { label: "Температура", get: (f) => `${f.temp[0]}–${f.temp[1]}°C` },
    { label: "Мин. объём", get: (f) => `${f.minVolume} л` },
    { label: "Сложность", get: diffLabel },
    { label: "Происхождение", get: originLabel },
  ];
  // Совместимость каждой пары
  const pairWarnings = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const c = checkCompatibility(list[i], [list[j]]);
      if (c.level !== "ok") pairWarnings.push({ a: list[i], b: list[j], c });
    }
  }
  const gridCols = `90px repeat(${list.length}, 1fr)`;
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
          <div style={{ fontSize: 15, fontWeight: 800 }}>⚖️ Сравнение рыб ({list.length})</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6C8E96", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {/* Fish heads */}
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 0, padding: "14px 18px 0", overflowX: "auto" }}>
          <div />
          {list.map(fish => (
            <div key={fish.id} style={{ textAlign: "center", padding: "0 4px", position: "relative" }}>
              {onRemove && list.length > 2 && (
                <button onClick={() => onRemove(fish.id)} style={{ position: "absolute", top: -6, right: 2, background: "#1C3A4A", border: "none", borderRadius: "50%", width: 16, height: 16, color: "#9FC4CC", fontSize: 10, cursor: "pointer", lineHeight: "16px", padding: 0 }}>✕</button>
              )}
              <div style={{ fontSize: 32 }}>{fish.img}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.3, marginTop: 4, color: "#E8F4F8" }}>{fish.name}</div>
            </div>
          ))}
        </div>
        {/* Compat banner(s) */}
        <div style={{ margin: "12px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
          {pairWarnings.length === 0 ? (
            <div style={{ background: "#071C14", border: "1px solid #00C9B1", borderRadius: 10, padding: "8px 12px", fontSize: 12, textAlign: "center", color: "#00C9B1", fontWeight: 600 }}>
              ✅ Все выбранные рыбы отлично уживутся вместе
            </div>
          ) : pairWarnings.map((w, i) => (
            <div key={i} style={{
              background: w.c.level === "bad" ? "#2A1414" : "#1E1800",
              border: `1px solid ${w.c.level === "bad" ? "#FF6B6B" : "#F0A93C"}`,
              borderRadius: 10, padding: "8px 12px", fontSize: 11.5, textAlign: "center",
              color: w.c.level === "bad" ? "#FF6B6B" : "#F0A93C", fontWeight: 600,
            }}>
              {w.c.level === "bad" ? "⚠️" : "🟡"} {w.a.name.split(" ")[0]} + {w.b.name.split(" ")[0]}: {w.c.reason}
            </div>
          ))}
        </div>
        {/* Table */}
        <div style={{ padding: "0 18px 32px", overflowX: "auto" }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: gridCols,
              gap: 0, borderBottom: "1px solid #1C3A4A",
              padding: "10px 0", minWidth: 90 + list.length * 80,
            }}>
              <div style={{ fontSize: 11, color: "#6C8E96", width: 90, paddingRight: 8 }}>{r.label}</div>
              {list.map(f => (
                <div key={f.id} style={{ fontSize: 12, fontWeight: 600, textAlign: "center", color: "#C9DEE2" }}>{r.get(f)}</div>
              ))}
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
function FishCard({ fish, compat, inCart, onOpen, onAdd, onCompare, inCompare, isFav, onToggleFav }) {
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
        {onToggleFav && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFav(fish); }}
            title={isFav ? "Убрать из избранного" : "В избранное"}
            aria-label={isFav ? `Убрать «${fish.name}» из избранного` : `Добавить «${fish.name}» в избранное`}
            aria-pressed={isFav}
            style={{
              position: "absolute", bottom: 8, right: 8,
              background: "rgba(8,19,31,0.7)", border: "none",
              borderRadius: "50%", width: 28, height: 28,
              fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >{isFav ? "❤️" : "🤍"}</button>
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
          {fish.type === "food" && (
            <span
              style={{
                fontSize: 10, fontWeight: 700,
                background: "#0F2A26", color: "#00C9B1",
                border: "1px solid #00C9B144",
                borderRadius: 6,
                padding: "2px 6px",
              }}
            >
              🔁 Подписка −10%
            </span>
          )}
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
                  background: inCompare ? "#F0A93C" : "#102433", color: inCompare ? "#08131F" : "#9FC4CC",
                  border: `1px solid ${inCompare ? "#F0A93C" : "#1C3A4A"}`, borderRadius: 10,
                  padding: "6px 8px", fontSize: 12, cursor: "pointer", fontWeight: inCompare ? 800 : 400,
                }}
                title="Сравнить"
                aria-label={inCompare ? `Убрать «${fish.name}» из сравнения` : `Добавить «${fish.name}» к сравнению`}
                aria-pressed={inCompare}
              >⚖️</button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(fish);
              }}
              aria-label={`Добавить «${fish.name}» в корзину`}
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
function FishDetail({ fish, compat, onClose, onAdd, onCompare, inCompare, isFav, onToggleFav, onSubscribe, activeSubscription }) {
  const [tab, setTab] = useState("about");
  const [arOpen, setArOpen] = useState(false);
  const [subInterval, setSubInterval] = useState((activeSubscription && activeSubscription.intervalWeeks) || 4);
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
          {onToggleFav && (
            <button
              onClick={() => onToggleFav(fish)}
              style={{
                position: "absolute",
                top: 12,
                right: 56,
                background: "rgba(0,0,0,0.4)",
                border: "none",
                color: "#E8F4F8",
                borderRadius: 999,
                width: 32,
                height: 32,
                fontSize: 16,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          )}
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
                    background: inCompare ? "#F0A93C" : "#102433", color: inCompare ? "#08131F" : "#9FC4CC",
                    border: `1px solid ${inCompare ? "#F0A93C" : "#1C3A4A"}`, borderRadius: 12,
                    padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >⚖️ {inCompare ? "В сравнении" : "Сравнить"}</button>
              )}
            </div>
          )}
          {fish.type === "food" && onSubscribe && (
            <div
              style={{
                background: "#0F2A26",
                border: "1px solid #00C9B1",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#00C9B1" }}>
                  🔁 Подписка на корм
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#08131F",
                  background: "#F0A93C", borderRadius: 6, padding: "2px 7px",
                }}>
                  −10%
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "#9FC4CC", marginBottom: 10, lineHeight: 1.5 }}>
                Автоматическая доставка без напоминаний — отменить можно в любой момент в профиле.
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: activeSubscription ? 10 : 0 }}>
                {SUBSCRIPTION_INTERVALS.map((opt) => (
                  <button
                    key={opt.weeks}
                    onClick={() => setSubInterval(opt.weeks)}
                    style={{
                      flex: 1,
                      background: subInterval === opt.weeks ? "#00C9B1" : "#102433",
                      color: subInterval === opt.weeks ? "#08131F" : "#9FC4CC",
                      border: `1px solid ${subInterval === opt.weeks ? "#00C9B1" : "#1C3A4A"}`,
                      borderRadius: 9,
                      padding: "8px 4px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {activeSubscription && (
                <div style={{ fontSize: 11.5, color: "#6C8E96", marginBottom: 10 }}>
                  Следующая доставка: {fmtDate(activeSubscription.nextDate)}
                </div>
              )}
              <button
                onClick={() => onSubscribe(fish, subInterval)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "1px solid #00C9B1",
                  borderRadius: 10,
                  padding: "9px",
                  color: "#00C9B1",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {activeSubscription ? "Обновить подписку" : `Оформить за ${formatSum(Math.round(fish.price * (1 - SUBSCRIPTION_DISCOUNT)))}`}
              </button>
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
function PostOrderScreen({ cart, onClose, onCreateDiary }) {
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

        {onCreateDiary && fishItems.length > 0 && (
          <button
            onClick={() => onCreateDiary(fishItems)}
            style={{
              width: "100%", marginTop: 16,
              background: "linear-gradient(135deg, #00C9B1, #00A693)", color: "#08131F",
              border: "none", borderRadius: 14, padding: "14px",
              fontSize: 14.5, fontWeight: 800, cursor: "pointer",
            }}
          >📔 Создать дневник для этого аквариума</button>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%", marginTop: 10,
            background: "#102433", color: "#9FC4CC",
            border: "1px solid #1C3A4A", borderRadius: 14, padding: "14px",
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
function AIChatWidget({ cart, open: openProp, onOpenChange, autoEscalate }) {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = (v) => { onOpenChange ? onOpenChange(v) : setOpenState(v); };
  const [messages, setMessages] = useState([
    { role: "bot", text: "Привет! 🐠 Я Marjon, как могу помочь? Спрашивайте про рыб, уход, совместимость или доставку." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [humanMode, setHumanMode] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const bottomRef = useRef(null);
  const escalated = useRef(false);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (autoEscalate && open && !escalated.current) {
      escalated.current = true;
      escalateToHuman();
    }
  }, [autoEscalate, open]);

  function escalateToHuman() {
    if (humanMode || connecting) return;
    setConnecting(true);
    setMessages(m => [...m, { role: "system", text: "Запрос передан живому специалисту…" }]);
    setTimeout(() => {
      setConnecting(false);
      setHumanMode(true);
      setMessages(m => [...m, { role: "human", text: "Привет! Это Анна, специалист AquaMarjon 👋 Я на связи и помогу разобраться. Опишите ситуацию подробнее." }]);
    }, 1400);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    const cartSummary = cart.filter(f => f.type === "fish").map(f => f.name).join(", ") || "пока пусто";
    const humanSystem = `Ты — Анна, живой специалист интернет-магазина аквариумных рыб AquaMarjon (Узбекистан), который только что подключился к чату с клиентом вместо AI-бота. Отвечай как человек: тепло, конкретно, можешь задавать уточняющие вопросы, иногда используй разговорные обороты на русском. Не упоминай, что ты AI. В корзине покупателя: ${cartSummary}.`;
    const botSystem = `Ты — Marjon, помощник интернет-магазина аквариумных рыб AquaMarjon (Узбекистан). Не упоминай, что ты AI или бот, представляйся просто как Marjon. Отвечай коротко, дружелюбно, на русском языке. Используй эмодзи умеренно. В корзине покупателя сейчас: ${cartSummary}. Помогай с выбором рыб, уходом, совместимостью, вопросами о доставке. Если вопрос сложный (болезнь рыбы, спорный заказ, жалоба) — предложи позвать живого консультанта.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: humanMode ? humanSystem : botSystem,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Упс, что-то пошло не так. Попробуйте ещё раз.";
      setMessages(m => [...m, { role: humanMode ? "human" : "bot", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: humanMode ? "human" : "bot", text: "Нет соединения. Попробуйте позже." }]);
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
              background: humanMode ? "#F0A93C22" : "#00C9B122", border: `1px solid ${humanMode ? "#F0A93C44" : "#00C9B144"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>{humanMode ? "👩" : "🐠"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{humanMode ? "Анна · специалист AquaMarjon" : "Marjon · помощник AquaMarjon"}</div>
              <div style={{ fontSize: 11, color: connecting ? "#F0A93C" : "#00C9B1" }}>
                {connecting ? "● Подключаем специалиста…" : "● Онлайн"}
              </div>
            </div>
            {!humanMode && (
              <button
                onClick={escalateToHuman}
                disabled={connecting}
                title="Позвать живого консультанта"
                style={{ background: "none", border: "1px solid #1C3A4A", borderRadius: 8, padding: "5px 9px", color: "#9FC4CC", fontSize: 11, cursor: connecting ? "default" : "pointer", whiteSpace: "nowrap" }}
              >👤 Консультант</button>
            )}
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
            {messages.map((m, i) => {
              if (m.role === "system") {
                return (
                  <div key={i} style={{ textAlign: "center", fontSize: 11, color: "#6C8E96", padding: "2px 0" }}>
                    {m.text}
                  </div>
                );
              }
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "80%",
                    background: m.role === "user" ? "#00C9B1" : m.role === "human" ? "#2A1F0A" : "#102433",
                    color: m.role === "user" ? "#08131F" : "#E8F4F8",
                    border: m.role === "human" ? "1px solid #F0A93C44" : "none",
                    borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    padding: "9px 12px",
                    fontSize: 13, lineHeight: 1.55,
                  }}>{m.text}</div>
                </div>
              );
            })}
            {connecting && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ fontSize: 11, color: "#F0A93C" }}>🔄 Ищем свободного специалиста…</div>
              </div>
            )}
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
function Catalog({ region, cart, setCart, onChangeRegion, onOpenConfigurator, onOpenProfile, onOpenDoctor, onOpenHome, onOrderPlaced, hideHeader, hideBottomNav, externalCartOpen, onExternalCartClose, quizFilter, onClearQuizFilter, wishlist, onToggleWishlist, subscriptions, onSubscribe, initialSearch, onClearInitialSearch, initialCategory, onClearInitialCategory, filterSeed, onOpenDiary, initialToast, onClearInitialToast }) {
  const [search, setSearch] = useState(initialSearch || "");
  // Инпут обновляется мгновенно (search), а фильтрация каталога — по debounced-значению,
  // чтобы не пересчитывать сетку на каждый keystroke на большом каталоге.
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || "");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      setDebouncedSearch(initialSearch);
      onClearInitialSearch && onClearInitialSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [productType, setProductType] = useState("fish");
  const [cat, setCat] = useState("all");
  useEffect(() => {
    if (initialCategory) {
      setCat(initialCategory);
      onClearInitialCategory && onClearInitialCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory]);
  // Сид фильтра для встроенного каталога на главной — пересчитывается на каждый клик
  // по категории (даже повторный), поэтому передаём готовый объект с токеном.
  useEffect(() => {
    if (filterSeed) {
      setSearch(filterSeed.search || "");
      setCat(filterSeed.cat || "all");
      setProductType("fish");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSeed]);
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
  const [compareList, setCompareList] = useState([]); // до 4 рыб для сравнения
  const [compareOpen, setCompareOpen] = useState(false);
  const toastTimer = useRef(null);
  // Разовая подсказка про кнопку «⚖️ Сравнить» на карточке — показываем один раз,
  // пока пользователь ни разу не пробовал сравнение, и прячем после первого клика или закрытия.
  const [showCompareHint, setShowCompareHint] = useState(() => !readLocal("aqua_seen_compare_hint", false));
  function dismissCompareHint() {
    setShowCompareHint(false);
    writeLocal("aqua_seen_compare_hint", true);
  }

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
      if (debouncedSearch && !f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
          !(f.latin && f.latin.toLowerCase().includes(debouncedSearch.toLowerCase()))) return false;
      if (productType !== "fish") return true;
      if (quizFilter && !debouncedSearch && cat === "all") {
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
  }, [debouncedSearch, cat, productType, quizFilter, sort, tankVolume, priceMax]);

  // Категории, где есть результаты по текущему поиску (без учёта cat/объёма/цены) —
  // используется для подсказки «попробуйте» в пустом состоянии каталога.
  const categoriesWithResults = useMemo(() => {
    if (productType !== "fish") return [];
    return CATEGORIES.filter((c) => {
      if (c.id === "all" || c.id === cat) return false;
      return ALL_PRODUCTS.some((f) => {
        if (f.type !== "fish") return false;
        if (debouncedSearch && !f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
            !(f.latin && f.latin.toLowerCase().includes(debouncedSearch.toLowerCase()))) return false;
        if (c.id === "peaceful") return f.temper === "peaceful";
        if (c.id === "aggressive") return f.temper === "aggressive";
        if (c.id === "kids") return f.goal && f.goal.includes("kids");
        if (c.id === "local") return f.origin === "local";
        if (c.id === "import") return f.origin === "import";
        return false;
      });
    }).slice(0, 3);
  }, [debouncedSearch, cat, productType]);

  function showToast(text, type = "ok") {
    setToast({ text, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  // Тост, переданный извне (например, после «Повторить заказ» из профиля) —
  // показываем один раз при монтировании и сразу сообщаем родителю, что забрали.
  useEffect(() => {
    if (initialToast) {
      showToast(initialToast.text, initialToast.type || "ok");
      onClearInitialToast && onClearInitialToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToast]);

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

  function toggleCompare(fish) {
    if (showCompareHint) dismissCompareHint();
    setCompareList((list) => {
      if (list.some((f) => f.id === fish.id)) return list.filter((f) => f.id !== fish.id);
      if (list.length >= 4) { showToast("⚖️ Можно сравнить максимум 4 рыбы", "bad"); return list; }
      return [...list, fish];
    });
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
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{highlightMatch(s.name, search)}</div>
                    {s.latin && <div style={{ fontSize: 11, color: "#6C8E96", fontStyle: "italic" }}>{highlightMatch(s.latin, search)}</div>}
                  </div>
                  <span style={{ fontSize: 12, color: "#F0A93C", fontWeight: 700 }}>{formatSum(s.price)}</span>
                </div>
              ))}
            </div>
          )}
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
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
            aria-label={showFilters ? "Скрыть фильтры" : "Показать фильтры"}
            aria-expanded={showFilters}
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
      {quizFilter && productType === "fish" && !debouncedSearch && cat === "all" && (
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

      {/* Трей режима сравнения */}
      {compareList.length > 0 && (
        <div style={{
          margin: "0 16px 4px",
          background: "linear-gradient(90deg, #1A0E28, #102433)",
          border: "1px solid #F0A93C55",
          borderRadius: 14, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ display: "flex", gap: -4 }}>
            {compareList.map((f) => (
              <span key={f.id} style={{ fontSize: 18, marginRight: -4 }}>{f.img}</span>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0A93C" }}>⚖️ Сравнение ({compareList.length}/4)</div>
            <div style={{ fontSize: 11, color: "#9FC4CC", marginTop: 1 }}>
              {compareList.length < 2 ? "Выберите ещё одну рыбу" : "Готово к сравнению"}
            </div>
          </div>
          {compareList.length >= 2 && (
            <button onClick={() => setCompareOpen(true)} style={{ background: "#F0A93C", border: "none", borderRadius: 8, padding: "6px 12px", color: "#08131F", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Сравнить</button>
          )}
          <button onClick={() => setCompareList([])} style={{ background: "none", border: "1px solid #1C3A4A", borderRadius: 8, padding: "4px 10px", color: "#6C8E96", fontSize: 11, cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Разовая подсказка про сравнение рыб — только пока пользователь ей не пользовался */}
      {productType === "fish" && showCompareHint && compareList.length === 0 && filtered.length > 0 && (
        <div style={{
          margin: "0 16px 4px",
          background: "#0D2030", border: "1px solid #1C3A4A",
          borderRadius: 14, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>⚖️</span>
          <div style={{ flex: 1, fontSize: 11.5, color: "#9FC4CC" }}>
            Нажмите на значок «⚖️» на карточке, чтобы сравнить до 4 рыб между собой
          </div>
          <button
            onClick={dismissCompareHint}
            aria-label="Скрыть подсказку"
            style={{ background: "none", border: "1px solid #1C3A4A", borderRadius: 8, padding: "4px 8px", color: "#6C8E96", fontSize: 11, cursor: "pointer" }}
          >Понятно</button>
        </div>
      )}

      {/* Чипсы активных фильтров — видно, что применено, без открытия панели заново */}
      {(debouncedSearch || cat !== "all" || tankVolume > 0 || priceMax > 0) && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 16px 4px" }}>
          {debouncedSearch && (
            <button
              onClick={() => setSearch("")}
              aria-label="Убрать поисковый запрос"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#102433", border: "1px solid #1C3A4A", borderRadius: 999,
                padding: "4px 10px", color: "#9FC4CC", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >🔍 «{debouncedSearch}» <span style={{ color: "#6C8E96" }}>✕</span></button>
          )}
          {cat !== "all" && (
            <button
              onClick={() => setCat("all")}
              aria-label="Сбросить категорию"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#102433", border: "1px solid #1C3A4A", borderRadius: 999,
                padding: "4px 10px", color: "#9FC4CC", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >{CATEGORIES.find(c => c.id === cat)?.label || cat} <span style={{ color: "#6C8E96" }}>✕</span></button>
          )}
          {tankVolume > 0 && (
            <button
              onClick={() => setTankVolume(0)}
              aria-label="Сбросить фильтр по объёму"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#102433", border: "1px solid #1C3A4A", borderRadius: 999,
                padding: "4px 10px", color: "#9FC4CC", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >🪣 до {tankVolume} л <span style={{ color: "#6C8E96" }}>✕</span></button>
          )}
          {priceMax > 0 && (
            <button
              onClick={() => setPriceMax(0)}
              aria-label="Сбросить фильтр по цене"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#102433", border: "1px solid #1C3A4A", borderRadius: 999,
                padding: "4px 10px", color: "#9FC4CC", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >💰 до {formatSum(priceMax)} <span style={{ color: "#6C8E96" }}>✕</span></button>
          )}
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
            onOpen={(fish) => setOpenFish(fish)}
            onAdd={addToCart}
            onCompare={toggleCompare}
            inCompare={compareList.some((c) => c.id === f.id)}
            isFav={wishlist ? wishlist.some((w) => w.id === f.id) : false}
            onToggleFav={onToggleWishlist}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", marginTop: 30, padding: "0 12px" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <p style={{ color: "#9FC4CC", fontSize: 13.5, marginBottom: 14 }}>
              Ничего не найдено — попробуйте другой запрос или сбросьте фильтры
            </p>
            {(debouncedSearch || cat !== "all" || tankVolume > 0 || priceMax > 0) && (
              <button
                onClick={() => { setSearch(""); setCat("all"); setTankVolume(0); setPriceMax(0); }}
                style={{
                  background: "#00C9B1", border: "none", borderRadius: 10,
                  padding: "8px 18px", color: "#08131F", fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}
              >Сбросить всё</button>
            )}
            {categoriesWithResults.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11.5, color: "#6C8E96", marginBottom: 8 }}>Может быть, вас заинтересует:</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                  {categoriesWithResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCat(c.id)}
                      style={{
                        background: "#102433", border: "1px solid #1C3A4A", borderRadius: 999,
                        padding: "6px 14px", color: "#9FC4CC", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}
                    >{c.label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* bottom nav */}
      {!hideBottomNav && (
      <div
        style={{
          position: "fixed",
          bottom: 14,
          left: 12,
          right: 12,
          background: "rgba(16, 28, 40, 0.55)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 26,
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 6px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          zIndex: 90,
        }}
      >
        {[
          ["home", "Главная", onOpenHome],
          ["fish", "Каталог", null],
          ["cart", "Корзина", () => setCartOpen(true)],
          ["doctor", "Доктор", onOpenDoctor],
          ["ai", "AI Подбор", onOpenConfigurator],
        ].map(([icon, label, action], i) => (
          <button
            key={label}
            onClick={action || undefined}
            aria-label={label === "Корзина" && cart.length > 0 ? `Открыть корзину, товаров: ${cart.length}` : undefined}
            style={{
              position: "relative",
              textAlign: "center",
              color: i === 1 ? "#00C9B1" : "#6C8E96",
              fontSize: 10.5,
              fontWeight: i === 1 ? 700 : 500,
              background: i === 1 ? "rgba(255,255,255,0.06)" : "none",
              border: "none",
              borderRadius: 14,
              padding: "6px 10px",
              cursor: action ? "pointer" : "default",
              transition: "background 0.2s",
            }}
          >
            <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 3 }}>
              <Icon name={icon} size={20} />
              {label === "Корзина" && cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -8,
                    background: "#00C9B1",
                    color: "#08131F",
                    fontSize: 9,
                    fontWeight: 800,
                    borderRadius: 999,
                    padding: "1px 5px",
                  }}
                >
                  {cart.length}
                </span>
              )}
            </div>
            {label}
          </button>
        ))}
      </div>
      )}

      <FishDetail
        fish={openFish}
        compat={openFish ? checkCompatibility(openFish, cart) : { level: "ok" }}
        onClose={() => setOpenFish(null)}
        onAdd={(f) => {
          addToCart(f);
          setOpenFish(null);
        }}
        onCompare={toggleCompare}
        inCompare={openFish ? compareList.some((c) => c.id === openFish.id) : false}
        isFav={openFish && wishlist ? wishlist.some((w) => w.id === openFish.id) : false}
        onToggleFav={onToggleWishlist}
        onSubscribe={onSubscribe ? (f, weeks) => {
          onSubscribe(f, weeks);
          showToast(`🔁 Подписка на «${f.name.split(" ")[0]}» оформлена`, "ok");
        } : undefined}
        activeSubscription={openFish && subscriptions ? subscriptions.find((s) => s.productId === openFish.id) : null}
      />
      {compareOpen && (
        <CompareModal
          fishes={compareList}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompareList((l) => l.filter((f) => f.id !== id))}
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
          onCreateDiary={onOpenDiary ? (fishItems) => {
            // Передаём дневнику черновик аквариума с автозаполнением рыб из
            // корзины через localStorage — DiaryScreen подхватит его при монтировании.
            writeLocal(PENDING_DIARY_TANK_KEY, buildTankDraftFromCart(fishItems));
            setPostOrderCart(null);
            onOpenDiary();
          } : undefined}
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
// ⚠️ Используется как офлайн-фолбэк в legacyPromoFallback() (см. начало файла),
// если бэкенд /api/promos/validate недоступен. НЕ мёртвый код — не удалять
// без необходимости. Удалить можно после того как бэкенд гарантированно стабилен.
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
function CheckoutSteps({ current, onStepClick }) {
  const labels = ["Адрес", "Оплата", "Готово"];
  const pct = current === 1 ? 18 : current === 2 ? 55 : 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {labels.map((l, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < current;
          const isCurrent = stepNum === current;
          const clickable = isDone && !!onStepClick;
          return (
            <span
              key={l}
              onClick={clickable ? () => onStepClick(stepNum) : undefined}
              style={{ fontSize: 11, fontWeight: isCurrent ? 700 : 400,
                color: isDone ? "#00C9B1" : isCurrent ? "#E8F4F8" : "#6C8E96",
                cursor: clickable ? "pointer" : "default",
                textDecoration: clickable ? "underline" : "none",
                textUnderlineOffset: 3 }}
            >
              {isDone ? "✓ " : ""}{l}
            </span>
          );
        })}
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
          <div style={{ fontSize: 10, color: "#6C8E96", marginTop: 6 }}>
            После нажатия «Подтвердить» ниже мы покажем статус ожидания оплаты
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
          Покупаете с защитой AquaMarjon
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
function CheckoutLoadingScreen({ onDone, pay, onPaymentIssue }) {
  const [dot, setDot] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const isDigital = pay === "click" || pay === "payme";
  const msgs = isDigital
    ? ["Ожидаем подтверждение оплаты…", "Проверяем платёж…", "Почти готово…"]
    : ["Отправляем заказ…", "Назначаем курьера…", "Подтверждаем…"];
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 3), 900);
    const done = setTimeout(onDone, 2400);
    // Если бы это была реальная оплата и подтверждение задержалось — через 6с
    // показываем подсказку «платёж завис». В моке не наступает, но UI на это готов.
    const help = setTimeout(() => setShowHelp(true), 6000);
    return () => { clearInterval(t); clearTimeout(done); clearTimeout(help); };
  }, []);
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 20, animation: "ckSpin 2s linear infinite" }}>🐠</div>
      <style>{`@keyframes ckSpin{ 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
      <div style={{ fontSize: 16, color: "#E8F4F8", fontWeight: 700, marginBottom: 8 }}>
        {msgs[dot]}
      </div>
      {isDigital && (
        <div style={{ fontSize: 12, color: "#6C8E96", marginBottom: 4 }}>
          Не закрывайте окно, пока платёж не подтвердится
        </div>
      )}
      <div style={{ width: 180, height: 4, background: "#1C3A4A", borderRadius: 2,
        margin: "16px auto 0", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#00C9B1", borderRadius: 2,
          animation: "ckFill 2.4s linear forwards" }} />
        <style>{`@keyframes ckFill{ from{width:0%} to{width:100%} }`}</style>
      </div>
      {showHelp && isDigital && (
        <div style={{ marginTop: 20, fontSize: 12, color: "#9FC4CC" }}>
          Платёж долго не подтверждается?{" "}
          <button
            onClick={onPaymentIssue}
            style={{ background: "none", border: "none", color: "#00C9B1", fontWeight: 700, fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >Попробовать другой способ</button>
        </div>
      )}
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
function StepPayment({ pay, setPay, promo, setPromo, promoResult, setPromoResult,
  groupedCart, onAddUpsell, onBack, onNext, subtotal, discount, delivery, total, deliveryInfo, region, userId }) {

  return (
    <div>
      <UpsellBlock groupedCart={groupedCart} onAddUpsell={onAddUpsell} />

      {/* Промокод */}
      <PromoField
        subtotal={subtotal}
        userId={userId}
        promoResult={promoResult}
        onApply={(r) => {
          setPromoResult(r);
          setPromo(r?.code ?? "");
        }}
      />

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
            <span>Скидка ({promoResult?.label})</span><span>−{formatSum(discount)}</span>
          </div>
        )}
        {promoResult?.type === "free_delivery" && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4ADE80", marginBottom: 6 }}>
            <span>🚚 Бесплатная доставка</span><span>−{formatSum(deliveryInfo.price)}</span>
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

/* ── Разовое предупреждение при попытке оплаты офлайн ────── */
function OfflinePayWarning({ pay, onConfirm, onCancel }) {
  const isDigital = pay === "click" || pay === "payme";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.75)", zIndex: 220,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0E2030", border: "1px solid #F0A93C55", borderRadius: 18,
        padding: "22px 20px", maxWidth: 340, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 34, marginBottom: 12 }}>📡</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#F0A93C", marginBottom: 8 }}>
          Нет соединения с интернетом
        </div>
        <p style={{ fontSize: 13, color: "#9FC4CC", lineHeight: 1.5, margin: "0 0 18px" }}>
          {isDigital
            ? "Онлайн-оплата сейчас недоступна — для Click/Payme нужен интернет. Проверьте связь и попробуйте снова."
            : "Заказ будет принят локально и уйдёт на сервер, как только связь восстановится. Если это срочно — проверьте интернет и попробуйте снова."}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, background: "#102433", color: "#9FC4CC",
            border: "1px solid #1C3A4A", borderRadius: 12, padding: "12px", fontSize: 13,
            fontWeight: 700, cursor: "pointer" }}>
            Отмена
          </button>
          {!isDigital && (
            <button onClick={onConfirm} style={{ flex: 1, background: "#F0A93C", color: "#08131F",
              border: "none", borderRadius: 12, padding: "12px", fontSize: 13,
              fontWeight: 800, cursor: "pointer" }}>
              Всё равно продолжить
            </button>
          )}
        </div>
      </div>
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
  const [promo, setPromo] = useState("");                              // код для отправки в /orders
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);

  // Разовое предупреждение об офлайне при попытке оплаты: показываем один раз
  // за сессию оформления заказа (не при каждом клике), пока связь не появится
  // и не пропадёт снова — тогда предупредим ещё раз.
  const { online } = useOnlineStatus();
  const [showOfflinePayWarning, setShowOfflinePayWarning] = useState(false);
  const [offlineAcknowledged, setOfflineAcknowledged] = useState(false);
  useEffect(() => { if (online) setOfflineAcknowledged(false); }, [online]);

  const orderId = useMemo(() => Math.floor(1000 + Math.random() * 9000), []);
  const deliveryInfo = DELIVERY_RATES[region] || { price: 35000, time: "сегодня", courier: "Курьер", phone: "", rating: 4.8, trips: 0 };

  const groupedCart = useMemo(() => groupCart(cart), [cart]);
  const subtotal = cart.reduce((s, f) => s + f.price, 0);
  const baseDelivery = cart.length === 0 ? 0 : deliveryInfo.price;
  const { discount, delivery } = calcPromoSavings(promoResult, subtotal, baseDelivery);
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
    // Оплата картой/Click/Payme объективно требует сеть; наличные при курьере
    // мы готовы принять офлайн, но всё равно предупреждаем один раз, чтобы
    // человек не удивился потом, почему заказ долго не подтверждался.
    if (!online && !offlineAcknowledged) {
      setShowOfflinePayWarning(true);
      return;
    }
    setLoading(true);
  }
  async function handleDone() {
    // Если применённый промокод — личная награда за бейдж дневника, гасим его
    // здесь же, при подтверждённом оформлении заказа: это единственная точка,
    // где мы точно знаем, что заказ состоялся, поэтому одноразовость надёжна
    // и для офлайн-фолбэка (когда бэкенд недоступен), и для онлайн-пути.
    if (promoResult && promoResult.label.includes("награда за достижение")) {
      markRewardPromoUsed(promoResult.code);
    }
    try {
      const items = groupedCart.map(([item, qty]: [any, number]) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        qty,
      }));
      const slotObj = TIME_SLOTS.find((s: any) => s.id === slot);
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          region,
          address,
          comment,
          delivery_slot: slotObj ? `${slotObj.label} · ${slotObj.sub}` : slot,
          pay_method: pay,
          promo_code: promo || undefined,
          promo_type: promoResult?.type || undefined,
          items,
          buyer_name: tgUser?.first_name,
          telegram_user: tgUser,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сервера");

      const order = {
        id: data.order_id || orderId,
        date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
        items: cart,
        total,
        address,
        slot: slotObj ? `${slotObj.label} · ${slotObj.sub}` : slot,
        pay,
        region,
        deliveryInfo,
        status: "accepted",
      };
      onDone(order);
    } catch (err: any) {
      // Если бэкенд недоступен — всё равно показываем подтверждение
      const slotObj = TIME_SLOTS.find((s: any) => s.id === slot);
      const order = {
        id: orderId,
        date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
        items: cart,
        total,
        address,
        slot: slotObj ? `${slotObj.label} · ${slotObj.sub}` : slot,
        pay,
        region,
        deliveryInfo,
        status: "accepted",
      };
      onDone(order);
      console.warn("Backend unavailable, order shown locally:", err.message);
    }
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
            <div style={{ fontSize: 16, fontWeight: 800, color: "#E8F4F8" }}>🐠 AquaMarjon · Оформление</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 999,
            background: "#00C9B122", color: "#00C9B1", border: "1px solid #00C9B144" }}>#{orderId}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 18, cursor: "pointer", padding: 0 }}>✕</button>
        </div>

        {/* Тело */}
        <div style={{ padding: "24px 18px 36px" }}>
          {step < 3 && !loading && <CheckoutSteps current={step} onStepClick={(n) => setStep(n)} />}

          {step < 3 && !loading && (
            <CheckoutCartSummary
              groupedCart={groupedCart} onQtyChange={handleQtyChange} onRemove={handleRemove}
              subtotal={subtotal} discount={discount}
              delivery={delivery} total={total}
              deliveryInfo={deliveryInfo} collapsed={step === 2} />
          )}

          {loading && (
            <CheckoutLoadingScreen
              pay={pay}
              onDone={() => { setLoading(false); setStep(3); }}
              onPaymentIssue={() => { setLoading(false); setStep(2); }}
            />
          )}

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
              promoResult={promoResult} setPromoResult={setPromoResult}
              groupedCart={groupedCart} onAddUpsell={handleAddUpsell}
              onBack={() => setStep(1)} onNext={goToConfirm}
              subtotal={subtotal} discount={discount}
              delivery={delivery} total={total}
              deliveryInfo={deliveryInfo} region={region}
              userId={tgUser?.id} />
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

      {showOfflinePayWarning && (
        <OfflinePayWarning
          pay={pay}
          onCancel={() => setShowOfflinePayWarning(false)}
          onConfirm={() => {
            setOfflineAcknowledged(true);
            setShowOfflinePayWarning(false);
            setLoading(true);
          }}
        />
      )}
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
  const [calcMode, setCalcMode] = useState(false); // переключатель: ползунок vs калькулятор по размерам
  const [dimL, setDimL] = useState(60);
  const [dimW, setDimW] = useState(30);
  const [dimH, setDimH] = useState(35);
  const calcVolume = Math.round((dimL * dimW * dimH) / 1000); // см³ → литры

  function applyCalcVolume() {
    const v = Math.max(20, Math.min(350, calcVolume || 20));
    setVolume(v);
    setCalcMode(false);
  }

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
            <p style={{ fontSize: 13, color: "#6C8E96", marginBottom: 16 }}>
              Или сколько литров планируете — точность не важна
            </p>

            <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "#102433", border: "1px solid #1C3A4A", borderRadius: 12, padding: 4 }}>
              <button
                onClick={() => setCalcMode(false)}
                style={{ flex: 1, background: !calcMode ? "#00C9B1" : "transparent", color: !calcMode ? "#08131F" : "#9FC4CC", border: "none", borderRadius: 9, padding: "8px 6px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >🎚 Знаю литраж</button>
              <button
                onClick={() => setCalcMode(true)}
                style={{ flex: 1, background: calcMode ? "#00C9B1" : "transparent", color: calcMode ? "#08131F" : "#9FC4CC", border: "none", borderRadius: 9, padding: "8px 6px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >📐 Посчитать по размерам</button>
            </div>

            {!calcMode && (
              <>
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
              </>
            )}

            {calcMode && (
              <>
                <p style={{ fontSize: 12, color: "#6C8E96", marginBottom: 14 }}>
                  Измерьте аквариум изнутри (или возьмите размеры с коробки) — посчитаем литраж автоматически.
                </p>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {[
                    { label: "Длина, см", val: dimL, set: setDimL },
                    { label: "Ширина, см", val: dimW, set: setDimW },
                    { label: "Высота, см", val: dimH, set: setDimH },
                  ].map((d) => (
                    <div key={d.label} style={{ flex: 1 }}>
                      <label style={{ fontSize: 10.5, color: "#6C8E96", display: "block", marginBottom: 4 }}>{d.label}</label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={d.val}
                        onChange={(e) => d.set(Math.max(0, Number(e.target.value)))}
                        style={{ width: "100%", background: "#102433", border: "1px solid #1C3A4A", borderRadius: 10, padding: "9px 8px", color: "#E8F4F8", fontSize: 14, fontWeight: 700, textAlign: "center", outline: "none" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", background: "#0F2A26", border: "1px solid #00C9B144", borderRadius: 12, padding: "12px", marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: "#6C8E96", marginBottom: 2 }}>Объём по формуле Д×Ш×В</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#00C9B1" }}>≈ {calcVolume} л</div>
                  <div style={{ fontSize: 10.5, color: "#6C8E96", marginTop: 2 }}>фактический объём воды обычно на 10–15% меньше (грунт, декор, уровень воды)</div>
                </div>
                <button onClick={applyCalcVolume} style={{ ...primaryBtn, marginBottom: 30, background: "#0F2A26", color: "#00C9B1", border: "1px solid #00C9B1" }}>
                  Использовать {Math.max(20, Math.min(350, calcVolume || 20))} л
                </button>
              </>
            )}

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

function WaterReminder({ days, tankName, notifEnabled = true }) {
  const urgent = days >= 7;
  const [sent, setSent] = useState(false);
  async function handleRemind() {
    if (!notifEnabled) return;
    const ok = await notifyTelegram("water_reminder", { tankName, daysAgo: days });
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }
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
        <span
          onClick={handleRemind}
          style={{ color: sent ? "#00C9B1" : "#FF6B6B", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8, cursor: "pointer" }}
        >
          {sent ? "✓ Отправлено в Telegram" : "Напомнить"}
        </span>
      )}
    </div>
  );
}

function Profile({ onBack, onOpenCatalog, orders = [], userTanks = [], setUserTanks, onTrackOrder, onRepeatOrder, onCreateTankFromOrder, onOpenDoctor, onOpenDiary, onOpenSeller, onOpenCourier, onOpenClub, onOpenAdmin, wishlist = [], onToggleWishlist, onAddToCart, subscriptions = [], onCancelSubscription, onTogglePauseSubscription, notifPrefs, onUpdateNotifPref, initialTab }) {
  const [tab, setTab] = useState(initialTab || "tanks"); // tanks | orders | favorites
  const [newTankModal, setNewTankModal] = useState(false);
  const [tankName, setTankName] = useState("");
  const [tankVolume, setTankVolume] = useState(100);
  const wishlistAlerts = useMemo(() => getWishlistAlerts(wishlist), [wishlist]);
  useEffect(() => { notifyWishlistAlerts(wishlist); }, [wishlist]);

  // Локальный тост профиля — для действий, у которых нет своего экрана-подтверждения
  // (повтор заказа, создание дневника из заказа, новый аквариум и т.п.)
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  function showToast(text, type = "ok") {
    setToast({ text, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

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
    showToast(`✅ Аквариум «${newTank.name}» создан`, "ok");
  }

  const PROFILE_MENU = [
    { id: "tanks", icon: "aquarium", text: "Мои аквариумы", grad: "linear-gradient(135deg, #2E86FF, #1D5FCC)" },
    { id: "orders", icon: "box", text: "Заказы", grad: "linear-gradient(135deg, #F0A93C, #C97F1F)" },
    { id: "favorites", icon: "heart", text: "Избранное", grad: "linear-gradient(135deg, #FF5C7A, #E23F5D)" },
    { id: "subscriptions", icon: "repeat", text: "Подписки", grad: "linear-gradient(135deg, #8B5CF6, #6D28D9)" },
    { id: "rewards", icon: "gift", text: "Награды", grad: "linear-gradient(135deg, #00C9B1, #00A896)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", paddingBottom: 30 }}>
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button
            onClick={onBack}
            aria-label="На главную"
            style={{ background: "none", border: "none", color: "#9FC4CC", cursor: "pointer", padding: 4, lineHeight: 1, display: "flex" }}
          >
            <Icon name="back" size={20} />
          </button>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Профиль</div>
          <div style={{ width: 28 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 22 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00C9B1, #00A896)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: "#08131F",
              marginBottom: 12,
              boxShadow: "0 8px 28px #00C9B144",
            }}
          >
            А
          </div>
          <div style={{ fontSize: 19, fontWeight: 800, textAlign: "center" }}>Алишер К.</div>
          <div style={{ fontSize: 12, color: "#6C8E96", marginTop: 2 }}>📍 Ташкент · с нами 3 месяца</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#121F2C",
            border: "1px solid #1C3A4A",
            borderRadius: 18,
            padding: "12px 14px",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #FF5C7A, #E23F5D)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#fff",
              }}
            >
              <Icon name="person" size={18} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Мой профиль</span>
          </div>
          <span style={{ color: "#4C6A73", display: "flex" }}><Icon name="chevron" size={16} /></span>
        </div>

        <div
          style={{
            background: "#121F2C",
            border: "1px solid #1C3A4A",
            borderRadius: 18,
            marginBottom: 18,
            overflow: "hidden",
          }}
        >
          {PROFILE_MENU.map(({ id, icon, text, grad }, i) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: tab === id ? "#17293A" : "transparent",
                border: "none",
                borderBottom: i < PROFILE_MENU.length - 1 ? "1px solid #1C3A4A" : "none",
                padding: "13px 14px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: grad,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#fff",
                  }}
                >
                  <Icon name={icon} size={18} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: tab === id ? "#00C9B1" : "#E8F4F8" }}>{text}</span>
              </div>
              <span style={{ color: "#4C6A73", display: "flex" }}><Icon name="chevron" size={16} /></span>
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
                <WaterReminder days={t.lastWaterChange} tankName={t.name} notifEnabled={notifPrefs ? notifPrefs.water : true} />
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
              const items = Array.isArray(o.items) ? o.items : [];
              const fishItems = items.filter((it) => it.type === "fish");
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
                    {items.map((it, idx) => (
                      <span key={(it.id || it.name) + idx} style={{ fontSize: 22 }} title={it.name}>{it.img}</span>
                    ))}
                    <span style={{ fontSize: 12, color: "#9FC4CC", alignSelf: "center" }}>
                      {items.length} {items.length === 1 ? "товар" : "товара"}
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
                    {onRepeatOrder && (
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
                    )}
                    {fishItems.length > 0 && onCreateTankFromOrder && (
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
          wishlist.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6C8E96", fontSize: 13, marginTop: 40 }}>
              ❤️ Пока нет избранного — отмечайте товары сердечком в каталоге
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {wishlist.map((f) => {
                const alert = wishlistAlerts.find((a) => a.item.id === f.id && a.type === "price_drop");
                return (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#0E2030", border: `1px solid ${alert ? "#51CF6666" : "#1C3A4A"}`, borderRadius: 14, padding: "10px 12px" }}>
                  <span style={{ fontSize: 28, width: 46, height: 46, borderRadius: 12, background: "#102433", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.img}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    {alert ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 12.5, color: "#51CF66", fontWeight: 800 }}>{formatSum(alert.live.price)}</span>
                        <span style={{ fontSize: 11, color: "#6C8E96", textDecoration: "line-through" }}>{formatSum(f.price)}</span>
                        <span style={{ fontSize: 10, background: "#0F2A26", color: "#51CF66", border: "1px solid #51CF6666", borderRadius: 999, padding: "1px 6px", fontWeight: 800 }}>−{alert.pct}%</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12.5, color: "#F0A93C", fontWeight: 700, marginTop: 2 }}>{formatSum(f.price)}</div>
                    )}
                  </div>
                  {onAddToCart && (
                    <button onClick={() => onAddToCart(f)} style={{ background: "#00C9B1", border: "none", borderRadius: 10, padding: "7px 10px", color: "#08131F", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>+ 🛒</button>
                  )}
                  {onToggleWishlist && (
                    <button onClick={() => onToggleWishlist(f)} style={{ background: "none", border: "none", color: "#FF6B6B", fontSize: 16, cursor: "pointer", padding: "4px 2px" }}>🗑️</button>
                  )}
                </div>
              );})}
            </div>
          )
        )}

        {tab === "subscriptions" && (
          subscriptions.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6C8E96", fontSize: 13, marginTop: 40 }}>
              🔁 Нет активных подписок — оформите подписку на корм в карточке товара и получайте скидку 10% на каждую доставку
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {subscriptions.map((s) => {
                const intervalLabel = (SUBSCRIPTION_INTERVALS.find((o) => o.weeks === s.intervalWeeks) || {}).label || `Каждые ${s.intervalWeeks} нед.`;
                const discountedPrice = Math.round(s.product.price * (1 - SUBSCRIPTION_DISCOUNT));
                return (
                  <div key={s.id} style={{ background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 14, padding: "12px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28, width: 46, height: 46, borderRadius: 12, background: "#102433", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.product.img}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.product.name}</div>
                        <div style={{ fontSize: 12, color: "#6C8E96", marginTop: 2 }}>{intervalLabel}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12.5, color: "#F0A93C", fontWeight: 700 }}>{formatSum(discountedPrice)}</div>
                        <div style={{ fontSize: 10.5, color: "#6C8E96", textDecoration: "line-through" }}>{formatSum(s.product.price)}</div>
                      </div>
                    </div>
                    <div style={{
                      marginTop: 10, fontSize: 12, color: s.paused ? "#F0A93C" : "#00C9B1",
                      background: s.paused ? "#2A2210" : "#0F2A26",
                      border: `1px solid ${s.paused ? "#F0A93C44" : "#00C9B144"}`,
                      borderRadius: 9, padding: "7px 10px",
                    }}>
                      {s.paused ? "⏸ Подписка на паузе" : `📅 Следующая доставка: ${fmtDate(s.nextDate)}`}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {onTogglePauseSubscription && (
                        <button
                          onClick={() => onTogglePauseSubscription(s.id)}
                          style={{ flex: 1, background: "#102433", border: "1px solid #1C3A4A", borderRadius: 9, padding: "8px", color: "#9FC4CC", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          {s.paused ? "▶️ Возобновить" : "⏸ Поставить на паузу"}
                        </button>
                      )}
                      {onCancelSubscription && (
                        <button
                          onClick={() => onCancelSubscription(s.id)}
                          style={{ background: "none", border: "1px solid #FF6B6B44", borderRadius: 9, padding: "8px 12px", color: "#FF6B6B", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          Отменить
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {tab === "rewards" && (() => {
          const rewardPromos = getRewardPromos();
          const entries = Object.entries(rewardPromos).sort((a, b) => (b[1].usedAt ? 0 : 1) - (a[1].usedAt ? 0 : 1));
          if (entries.length === 0) {
            return (
              <div style={{ textAlign: "center", color: "#6C8E96", fontSize: 13, marginTop: 40 }}>
                🎁 Пока нет наград — открывайте бейджи в дневнике аквариума, и сюда будут падать рабочие промокоды на скидку
              </div>
            );
          }
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {entries.map(([code, r]) => {
                const used = !!r.usedAt;
                return (
                  <div key={code} style={{
                    background: "#0E2030", border: `1px solid ${used ? "#1C3A4A" : "#F0A93C44"}`,
                    borderRadius: 14, padding: "12px 14px", opacity: used ? 0.55 : 1,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap",
                        background: used ? "#1C3A4A" : "#F0A93C22", color: used ? "#6C8E96" : "#F0A93C",
                      }}>
                        {used ? "Использован" : "Доступен"}
                      </span>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#00C9B1", letterSpacing: 0.5, marginTop: 6 }}>{code}</div>
                    <div style={{ fontSize: 11.5, color: "#6C8E96", marginTop: 4 }}>
                      −{r.percent}% · от {formatSum(r.minOrderSum || 0)}
                      {used && r.usedAt ? ` · применён ${fmtDate(r.usedAt)}` : ""}
                    </div>
                    {!used && (
                      <button
                        onClick={() => navigator.clipboard?.writeText(code)}
                        style={{ marginTop: 8, width: "100%", background: "#102433", border: "1px solid #1C3A4A", borderRadius: 9, padding: "7px", color: "#9FC4CC", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        📋 Скопировать код
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ---- Уведомления (Telegram push) ---- */}
        <div style={{ marginTop: 28, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#6C8E96", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
            🔔 Уведомления в Telegram
          </div>
          {!tgUser?.id && (
            <div style={{
              background: "#2A2210", border: "1px solid #F0A93C44", borderRadius: 12,
              padding: "10px 12px", fontSize: 12, color: "#F0A93C", marginBottom: 10, lineHeight: 1.5,
            }}>
              ⚠️ Откройте AquaMarjon через Telegram-бота, чтобы получать пуши — сейчас приложение открыто в браузере.
            </div>
          )}
          <div style={{ background: "#0E2030", border: "1px solid #1C3A4A", borderRadius: 14, overflow: "hidden" }}>
            {[
              { key: "water", icon: "💧", label: "Напоминания о смене воды", sub: "Когда пора менять воду в аквариуме" },
              { key: "delivery", icon: "🚚", label: "Статус доставки", sub: "Принят · Собран · В пути · Доставлен" },
              { key: "arrivals", icon: "🐠", label: "Новые поступления рыб", sub: "Когда привозят редкие или популярные виды" },
            ].map((row, i) => (
              <div
                key={row.key}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderTop: i === 0 ? "none" : "1px solid #1C3A4A",
                }}
              >
                <span style={{ fontSize: 20 }}>{row.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: "#6C8E96", marginTop: 2 }}>{row.sub}</div>
                </div>
                <button
                  onClick={() => onUpdateNotifPref && onUpdateNotifPref(row.key, !(notifPrefs && notifPrefs[row.key]))}
                  style={{
                    width: 40, height: 24, borderRadius: 12, border: "none", cursor: "pointer", flexShrink: 0,
                    background: notifPrefs && notifPrefs[row.key] ? "#00C9B1" : "#1C3A4A",
                    position: "relative", transition: "background 0.15s",
                  }}
                >
                  <span style={{
                    position: "absolute", top: 3, left: notifPrefs && notifPrefs[row.key] ? 19 : 3,
                    width: 18, height: 18, borderRadius: "50%", background: "#08131F",
                    transition: "left 0.15s",
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

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
      <Toast toast={toast} />
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
          messages: [{ role: "user", content: `Напиши краткое продающее описание товара для зоомагазина AquaMarjon (Узбекистан). Товар: "${name}". Категория: ${category}. 2-3 предложения на русском языке. Только текст описания, без заголовков и markdown.` }],
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

          {loading && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12.5, color: S.muted, marginBottom: 10 }}>🤖 Ищу в базе…</div>
              <SkeletonGrid count={3} columns={3} />
            </div>
          )}

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
            <div style={{ fontSize: 11, color: S.amber, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 2 }}>AquaMarjon</div>
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
            // Сообщаем бэкенду о новом поступлении — рассылка подписчикам
            // (telegram_id всех, у кого включены уведомления "arrivals")
            // выполняется на сервере; здесь только триггер события.
            if (newProduct.active && newProduct.category === "fish") {
              notifyTelegram("new_arrival", { name: newProduct.name, price: newProduct.price, emoji: newProduct.emoji });
            }
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

function DocStepDiagnosis({ fishName, data, onBack, onReset, cart, setCart, onOpenChat }) {
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const ran=useRef(false);

  const symptomLabels=data.symptoms.map(id=>SYMPTOMS_DOCTOR.find(s=>s.id===id)?.label).filter(Boolean);

  async function diagnose(){
    setLoading(true);setError(null);
    const systemPrompt=`Ты — опытный ветеринар по аквариумным рыбам для магазина AquaMarjon (Узбекистан).
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
            const inCart=(cart||[]).some(c=>c.id===med.id);
            return(
              <div key={med.id} style={{background:Pd.card,border:`1px solid ${inCart?Pd.teal+"66":Pd.border}`,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,transition:"border-color 0.2s"}}>
                <span style={{fontSize:24,width:44,height:44,borderRadius:12,background:"#102433",border:`1px solid ${Pd.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{med.img}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13.5,fontWeight:700}}>{med.name}</div>
                  <div style={{fontSize:13,color:Pd.amber,fontWeight:700}}>{med.price.toLocaleString("ru-RU")} сум</div>
                </div>
                <button onClick={()=>{
                  if(!setCart) return;
                  if(inCart){ setCart(c=>{const idx=c.findIndex(x=>x.id===med.id); if(idx===-1) return c; const copy=[...c]; copy.splice(idx,1); return copy;}); }
                  else { setCart(c=>[...c, {id:med.id, type:"medicine", name:med.name, price:med.price, img:med.img, color:"#00C9B1", rating:4.9}]); }
                }} style={{background:inCart?Pd.teal:"transparent",border:`1px solid ${inCart?Pd.teal:Pd.border}`,borderRadius:10,padding:"7px 12px",color:inCart?"#08131F":Pd.soft,fontSize:12.5,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                  {inCart?"✓ В корзине":"+ В корзину"}
                </button>
              </div>
            );
          })}
          {(cart||[]).some(c=>recommendedMeds.some(m=>m.id===c.id))&&(
            <div style={{background:Pd.successBg,border:`1px solid ${Pd.teal}44`,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,color:Pd.teal,textAlign:"center"}}>
              ✅ Лекарства добавлены в корзину — оформите заказ в каталоге
            </div>
          )}
        </>
      )}
      <div style={{background:Pd.successBg,border:`1px solid ${Pd.teal}22`,borderRadius:12,padding:"12px 14px",marginBottom:20,fontSize:13,color:Pd.soft,lineHeight:1.5}}>
        🛡 <strong style={{color:Pd.teal}}>Профилактика:</strong> {result.prevention}
      </div>
      {result.confidence<65&&(
        <div style={{background:Pd.dangerBg,border:`1px solid ${Pd.danger}44`,borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:12.5,color:"#FF8F8F",lineHeight:1.5}}>
          <div style={{marginBottom:10}}>⚠️ Уверенность AI ниже 65% — рекомендуем проконсультироваться с нашим специалистом.</div>
          {onOpenChat && (
            <button onClick={onOpenChat} style={{width:"100%",background:Pd.danger,border:"none",borderRadius:10,padding:"10px",color:"#08131F",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              💬 Написать живому консультанту
            </button>
          )}
        </div>
      )}
      <DBtn variant="ghost" onClick={onReset}>🔄 Новая диагностика</DBtn>
    </div>
  );
}

function FishDoctorScreen({ onBack, cart, setCart }) {
  const [step,setStep]=useState(1);
  const [fishName,setFishName]=useState("");
  const [diagData,setDiagData]=useState(null);
  const [chatOpen,setChatOpen]=useState(false);
  const [autoEscalate,setAutoEscalate]=useState(false);
  const stepLabels=["Рыба","Симптомы","Диагноз"];
  function reset(){setStep(1);setFishName("");setDiagData(null);}
  function openLiveChat(){ setAutoEscalate(true); setChatOpen(true); }
  return(
    <div style={{minHeight:"100vh",background:Pd.bg,color:Pd.text,paddingBottom:40}}>
      <div style={{background:Pd.card,borderBottom:`1px solid ${Pd.border}`,padding:"16px 16px 14px",position:"relative",overflow:"hidden"}}>
        <BubblesDoc/>
        <div style={{position:"relative",zIndex:1}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:Pd.soft,fontSize:13,cursor:"pointer",marginBottom:8,padding:0}}>← Назад в каталог</button>
          <div style={{fontSize:11,color:Pd.teal,fontWeight:700,letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>AquaMarjon</div>
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
        {step===3&&diagData&&<DocStepDiagnosis fishName={fishName} data={diagData} onBack={()=>setStep(2)} onReset={reset} cart={cart} setCart={setCart} onOpenChat={openLiveChat}/>}
      </div>
      <div style={{padding:"20px 16px 0",fontSize:11.5,color:Pd.muted,textAlign:"center",lineHeight:1.6}}>
        AI-диагностика не заменяет специалиста. При тяжёлых симптомах — <span onClick={openLiveChat} style={{color:Pd.teal,cursor:"pointer",textDecoration:"underline"}}>напишите нам в чат</span>.
      </div>
      <AIChatWidget cart={cart||[]} open={chatOpen} onOpenChange={(v)=>{setChatOpen(v); if(!v) setAutoEscalate(false);}} autoEscalate={autoEscalate} />
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

// Удержание/онбординг: сразу после первого заказа с рыбами предлагаем создать
// дневник аквариума с автозаполнением рыб из корзины — именно вовлечение в
// дневник в первую неделю определяет, вернётся ли человек.
const PENDING_DIARY_TANK_KEY = "aqua_pending_diary_tank";

function buildTankDraftFromCart(fishItems) {
  return {
    id: "tank_" + Date.now(),
    name: "Новый аквариум",
    volume: 100,
    emoji: "🌿",
    fish: fishItems.map((f, i) => ({ id: "tf_" + Date.now() + "_" + i, name: f.name, img: f.img, qty: 1, status: "ok" })),
    logs: [],
    waterChangeEvery: 7, lastWaterChange: 0,
    filterCleanEvery: 30, lastFilterClean: 0,
    feedingSchedule: "2 раза в день", notes: "", temperature: 25, ph: 7.0,
  };
}

const DIARY_SEED_TANKS = [
  {
    id: "dt1", name: "Гостиная", volume: 120, emoji: "🌿",
    careSinceISO: "2026-03-15", // с какой даты ведётся учёт «без потерь»
    lastLossISO: null,          // дата последней гибели рыбы (null = ни одной потери)
    fish: [
      { id: "guppy", name: "Гуппи «Огненный хвост»", qty: 5, img: "🐠", temp: [22,28], lifespan: "3–5 лет", addedDate: "15 мая", status: "alive" },
      { id: "neon",  name: "Неон «Голубая искра»",   qty: 12, img: "🐟", temp: [20,26], lifespan: "4–6 лет", addedDate: "15 мая", status: "alive" },
      { id: "ancistrus", name: "Анциструс «Чистильщик»", qty: 2, img: "🐡", temp: [22,27], lifespan: "8–10 лет", addedDate: "20 мая", status: "alive" },
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
    careSinceISO: "2026-02-01",
    lastLossISO: null,
    fish: [
      { id: "betta", name: "Петушок «Королевский бархат»", qty: 1, img: "👑", temp: [24,29], lifespan: "2–4 года", addedDate: "1 июня", status: "alive" },
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

/* ============================================================
   🏅 ГЕЙМИФИКАЦИЯ ДНЕВНИКА — стрики, уровни с названиями, тиры бейджей
   ============================================================ */
const RU_MONTHS_GEN = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
function formatDiaryDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso; // на случай старого формата строки
  return `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}`;
}
function diaryTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Считает текущую и лучшую серию дней подряд, в которые была хотя бы одна запись
function computeDiaryStreaks(allDates) {
  const dates = Array.from(allDates).sort();
  if (dates.length === 0) return { current: 0, best: 0 };
  let best = 1, run = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00");
    const next = new Date(dates[i] + "T00:00:00");
    const diffDays = Math.round((next.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) run++;
    else if (diffDays > 1) run = 1;
    best = Math.max(best, run);
  }
  return { current: run, best }; // current = серия, заканчивающаяся последней записью
}

const TIER_NAMES = ["Бронза", "Серебро", "Золото"];
const TIER_COLORS = ["#CD7F32", "#C0C8D2", "#FFD24A"];

// Каждый бейдж имеет 3 порога (бронза/серебро/золото)
const DIARY_BADGES = [
  { id: "streak",      icon: "🔥", title: "Серия ухода",          desc: "Дней подряд с записью в дневнике",   metric: (s) => s.bestStreak,     tiers: [3, 7, 30] },
  { id: "punctual",    icon: "⏱️", title: "Пунктуальность",       desc: "Уход выполнен вовремя (до просрочки)", metric: (s) => s.onTimeCare,   tiers: [5, 15, 40] },
  { id: "water_master",icon: "💧", title: "Мастер воды",          desc: "Смен воды",                          metric: (s) => s.water,          tiers: [10, 30, 100] },
  { id: "clean_freak", icon: "🧹", title: "Чистюля",              desc: "Чисток стёкол и фильтра",            metric: (s) => s.clean,          tiers: [5, 15, 50] },
  { id: "feeder",      icon: "🍽️", title: "Кормилец",             desc: "Записей о кормлении",                metric: (s) => s.feed,           tiers: [5, 20, 60] },
  { id: "vet",         icon: "🩺", title: "Аквариумный врач",     desc: "Записей о здоровье рыб",             metric: (s) => s.health,         tiers: [3, 10, 25] },
  { id: "marathoner",  icon: "📔", title: "Марафонец дневника",   desc: "Записей всего",                      metric: (s) => s.totalLogs,      tiers: [20, 75, 200] },
  { id: "collector",   icon: "🐠", title: "Коллекционер",         desc: "Рыб в коллекции",                    metric: (s) => s.totalFish,      tiers: [15, 40, 100] },
  { id: "keeper",      icon: "🏠", title: "Хранитель аквариумов", desc: "Аквариумов в дневнике",              metric: (s) => s.tankCount,      tiers: [2, 4, 7] },
  { id: "big_house",   icon: "🪸", title: "Большой дом",          desc: "Объём крупнейшего аквариума (л)",    metric: (s) => s.maxVolume,      tiers: [100, 150, 250] },
  { id: "versatile",   icon: "🌈", title: "Разносторонний уход",  desc: "Типов записей использовано",         metric: (s) => s.typesUsedCount, tiers: [3, 4, 5] },
  { id: "guardian",    icon: "🛡️", title: "Хранитель жизни",      desc: "Месяцев подряд без потери ни одной рыбы", metric: (s) => s.monthsNoLoss, tiers: [1, 3, 6] },
];

// Считает, сколько месяцев подряд во всех аквариумах не погибало ни одной рыбы.
// «Слабым звеном» считается аквариум с самой недавней потерей (или началом учёта).
function diaryMonthsNoLoss(tanks) {
  if (!tanks || tanks.length === 0) return 0;
  let minMonths = Infinity;
  tanks.forEach(t => {
    const ref = t.lastLossISO || t.careSinceISO;
    if (!ref) return; // нет данных по этому аквариуму — не учитываем в расчёте
    const days = diaryDaysSince(ref);
    minMonths = Math.min(minMonths, Math.floor(days / 30));
  });
  return Number.isFinite(minMonths) ? Math.max(0, minMonths) : 0;
}

function computeDiaryStats(tanks) {
  let totalLogs = 0, water = 0, clean = 0, feed = 0, health = 0, note = 0;
  let totalFish = 0, maxVolume = 0, onTimeCare = 0;
  const typesUsed = new Set();
  const allDates = new Set();
  tanks.forEach(t => {
    totalFish += t.fish.reduce((s, f) => s + (f.status === "lost" ? 0 : f.qty), 0);
    maxVolume = Math.max(maxVolume, t.volume);
    t.logs.forEach(l => {
      totalLogs++;
      typesUsed.add(l.type);
      if (l.date) allDates.add(l.date);
      if (l.type === "water") water++;
      else if (l.type === "clean") clean++;
      else if (l.type === "feed") feed++;
      else if (l.type === "health") health++;
      else if (l.type === "note") note++;
      if (l.onTime && (l.type === "water" || l.type === "clean")) onTimeCare++;
    });
  });
  const streaks = computeDiaryStreaks(allDates);
  const monthsNoLoss = diaryMonthsNoLoss(tanks);
  return {
    totalLogs, water, clean, feed, health, note, onTimeCare,
    tankCount: tanks.length, totalFish, maxVolume, typesUsedCount: typesUsed.size,
    currentStreak: streaks.current, bestStreak: streaks.best, monthsNoLoss,
  };
}

// Возвращает индекс достигнутого тира (-1 если ни одного), прогресс к следующему
function getBadgeTier(badge, stats) {
  const val = badge.metric(stats);
  let tierIndex = -1;
  for (let i = 0; i < badge.tiers.length; i++) {
    if (val >= badge.tiers[i]) tierIndex = i;
  }
  const maxed = tierIndex === badge.tiers.length - 1;
  const nextTarget = maxed ? badge.tiers[tierIndex] : badge.tiers[tierIndex + 1];
  const prevTarget = tierIndex >= 0 ? badge.tiers[tierIndex] : 0;
  const span = nextTarget - prevTarget || 1;
  const pctToNext = maxed ? 1 : Math.min(Math.max((val - prevTarget) / span, 0), 1);
  return { tierIndex, val, maxed, nextTarget, pctToNext, earned: tierIndex >= 0 };
}

function diaryEarnedBadgeKeys(stats) {
  // Ключ вида "id:tierIndex" — нужен чтобы ловить именно повышение тира, а не только первое получение
  return DIARY_BADGES.map(b => {
    const { tierIndex } = getBadgeTier(b, stats);
    return tierIndex >= 0 ? `${b.id}:${tierIndex}` : null;
  }).filter(Boolean);
}

// Находит ближайший недостигнутый тир бейджа (минимальное число действий до получения)
function diaryNearestNextBadge(stats) {
  let best = null;
  DIARY_BADGES.forEach(b => {
    const t = getBadgeTier(b, stats);
    if (t.maxed) return;
    const remaining = Math.max(0, Math.ceil(t.nextTarget - t.val));
    if (remaining <= 0) return;
    if (!best || remaining < best.remaining) {
      best = { badge: b, remaining, ...t };
    }
  });
  return best;
}

function diaryPluralRu(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

const DIARY_LEVEL_NAMES = [
  { min: 1,  name: "Новичок" },
  { min: 3,  name: "Любитель" },
  { min: 6,  name: "Опытный аквариумист" },
  { min: 10, name: "Мастер" },
  { min: 15, name: "Гуру" },
];
function diaryLevelName(level) {
  let name = DIARY_LEVEL_NAMES[0].name;
  for (const l of DIARY_LEVEL_NAMES) if (level >= l.min) name = l.name;
  return name;
}
function diaryComputeXP(stats) {
  return stats.totalLogs * 10 + stats.water * 5 + stats.clean * 5 + stats.tankCount * 15
    + stats.totalFish * 2 + stats.bestStreak * 8
    + stats.onTimeCare * 8      // бонус за уход ДО просрочки — поощряем своевременность, а не просто клики
    + stats.monthsNoLoss * 20;  // бонус за здоровье коллекции — ни одной потери
}

function DiaryGamificationBar({ stats, onOpenBadges }) {
  const xp = diaryComputeXP(stats);
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const levelName = diaryLevelName(level);
  const earnedCount = DIARY_BADGES.filter(b => getBadgeTier(b, stats).earned).length;
  return (
    <div onClick={onOpenBadges} style={{ background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 16, padding: 14, marginBottom: 12, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: "linear-gradient(135deg,#00C9B1,#F0A93C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#08131F", flexShrink: 0 }}>
            {level}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>{levelName} <span style={{ color: Dp.muted, fontWeight: 600 }}>· уровень {level}</span></div>
            <div style={{ fontSize: 11, color: Dp.muted }}>
              🏅 {earnedCount} из {DIARY_BADGES.length} бейджей
              {stats.currentStreak > 1 && <span style={{ color: Dp.amber }}> · 🔥 серия {stats.currentStreak} дн.</span>}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11, color: Dp.teal, fontWeight: 700, whiteSpace: "nowrap" }}>Все бейджи →</span>
      </div>
      <div style={{ height: 6, background: Dp.border, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${xpInLevel}%`, background: "linear-gradient(90deg,#00C9B1,#F0A93C)", borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>
      <div style={{ fontSize: 10, color: Dp.muted, marginTop: 4 }}>{xpInLevel}/100 XP до уровня {level + 1} ({diaryLevelName(level + 1)})</div>
    </div>
  );
}

function DiaryBadgeStrip({ stats, onOpenBadges }) {
  return (
    <div onClick={onOpenBadges} style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16, cursor: "pointer" }}>
      {DIARY_BADGES.map(b => {
        const { earned, tierIndex } = getBadgeTier(b, stats);
        const tierColor = earned ? TIER_COLORS[tierIndex] : Dp.border;
        return (
          <div key={b.id} title={b.title} style={{ position: "relative", flex: "0 0 auto", width: 50, height: 50, borderRadius: 14, background: earned ? "#0F2A26" : "#102433", border: `1px solid ${tierColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, opacity: earned ? 1 : 0.35, filter: earned ? "none" : "grayscale(1)" }}>
            {b.icon}
            {earned && (
              <span style={{ position: "absolute", bottom: -4, right: -4, width: 14, height: 14, borderRadius: 999, background: tierColor, border: `1px solid ${Dp.bg}` }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---- Карточка «ближайшая цель» — всегда видна на главном экране дневника ---- */
function DiaryNextBadgeCard({ stats, onOpenBadges }) {
  const nb = diaryNearestNextBadge(stats);

  // Все бейджи уже на максимальном тире — поздравляем вместо прогресса
  if (!nb) {
    return (
      <div onClick={onOpenBadges} style={{ background: "linear-gradient(135deg,#0F2A26,#1A2F1A)", border: `1px solid ${TIER_COLORS[2]}66`, borderRadius: 16, padding: "14px 16px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 26 }}>🏆</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: TIER_COLORS[2] }}>Все бейджи получены на золото!</div>
          <div style={{ fontSize: 11, color: Dp.muted }}>Вы — легенда AquaMarjon 🌟</div>
        </div>
      </div>
    );
  }

  const { badge, tierIndex, pctToNext, remaining } = nb;
  const nextTierIndex = tierIndex + 1;
  const nextTierColor = TIER_COLORS[nextTierIndex];
  const word = diaryPluralRu(remaining, "записи", "записей", "записей");
  const isAlmostThere = remaining <= 1;

  return (
    <div
      onClick={onOpenBadges}
      style={{
        background: isAlmostThere ? `linear-gradient(135deg, ${nextTierColor}18, ${Dp.card})` : Dp.card,
        border: `1px solid ${nextTierColor}${isAlmostThere ? "" : "66"}`, borderRadius: 16,
        padding: "14px 16px", marginBottom: 16, cursor: "pointer", position: "relative", overflow: "hidden",
        animation: isAlmostThere ? "nextBadgePulse 1.8s ease-in-out infinite" : "none",
      }}
    >
      {isAlmostThere && (
        <style>{`@keyframes nextBadgePulse { 0%,100%{box-shadow:0 0 0 0 ${nextTierColor}55} 50%{box-shadow:0 0 0 6px ${nextTierColor}00} }`}</style>
      )}
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: 999, background: `${nextTierColor}14`, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "#102433", border: `1px solid ${nextTierColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {badge.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: nextTierColor, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 1 }}>
            {isAlmostThere ? "🔥 Совсем чуть-чуть!" : "🎯 Ближайшая цель"}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: Dp.text, marginBottom: 2 }}>
            {badge.title} · {TIER_NAMES[nextTierIndex]}
          </div>
          <div style={{ fontSize: 11.5, color: Dp.soft }}>
            {isAlmostThere
              ? <>Ещё <strong style={{ color: nextTierColor }}>{remaining}</strong> {word} — и бейдж ваш!</>
              : <>Ещё <strong style={{ color: nextTierColor }}>{remaining}</strong> {word} до бейджа</>}
          </div>
        </div>
      </div>
      <div style={{ height: 6, background: Dp.border, borderRadius: 999, overflow: "hidden", marginTop: 10 }}>
        <div style={{ height: "100%", width: `${pctToNext * 100}%`, background: nextTierColor, borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

/* ---- Конфетти при разблокировке бейджа ---- */
function Confetti({ active, colors }) {
  const pieces = useMemo(() => {
    if (!active) return [];
    const palette = colors && colors.length ? colors : ["#00C9B1", "#F0A93C", "#FFD24A", "#51CF66", "#FF6B6B", "#9FC4CC"];
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 0.25,
      duration: 1.1 + Math.random() * 0.7,
      size: 6 + Math.random() * 6,
      color: palette[i % palette.length],
      rotate: Math.round(Math.random() * 360),
      drift: Math.round((Math.random() - 0.5) * 120),
      round: Math.random() > 0.5,
    }));
  }, [active, colors]);

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes aquaConfettiFall {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translate(var(--drift), 160px) rotate(420deg); opacity: 0; }
        }
      `}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 650, pointerEvents: "none", overflow: "hidden" }}>
        {pieces.map(p => (
          <span
            key={p.id}
            style={{
              position: "absolute", top: "18%", left: `${p.left}%`,
              width: p.size, height: p.size * (p.round ? 1 : 1.6),
              background: p.color, borderRadius: p.round ? "50%" : 2,
              ["--drift" as any]: `${p.drift}px`,
              animation: `aquaConfettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
}

function DiaryAchievementsModal({ stats, onClose, onShare, onShareImage }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.85)", zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0B1B28", borderRadius: "20px 20px 0 0", padding: "22px 18px 32px", width: "100%", maxWidth: 460, maxHeight: "85vh", overflowY: "auto", color: Dp.text, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 900 }}>🏅 Достижения</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: Dp.muted, fontSize: 20, cursor: "pointer", padding: 0 }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {DIARY_BADGES.map(b => {
            const { earned, tierIndex, maxed, val, nextTarget, pctToNext } = getBadgeTier(b, stats);
            const tierColor = earned ? TIER_COLORS[tierIndex] : Dp.border;
            return (
              <div key={b.id} style={{ background: Dp.card, border: `1px solid ${tierColor}`, borderRadius: 14, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontSize: 24, filter: earned ? "none" : "grayscale(0.6)" }}>{b.icon}</div>
                  {earned && (
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: tierColor, border: `1px solid ${tierColor}66`, borderRadius: 999, padding: "1px 7px" }}>
                      {TIER_NAMES[tierIndex]}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 3 }}>{b.title}</div>
                <div style={{ fontSize: 10.5, color: Dp.muted, marginBottom: 8, lineHeight: 1.4 }}>{b.desc}</div>
                <div style={{ height: 5, background: Dp.border, borderRadius: 999, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${pctToNext * 100}%`, background: earned ? "#51CF66" : Dp.amber, borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 10, color: earned ? "#51CF66" : Dp.muted, fontWeight: earned ? 700 : 400 }}>
                  {maxed ? `✅ Золото (${val})` : `${val}/${nextTarget} до ${TIER_NAMES[tierIndex + 1]}`}
                </div>
                {earned && !maxed && (
                  <div style={{ display: "flex", gap: 3, marginTop: 6, marginBottom: earned ? 8 : 0 }}>
                    {TIER_NAMES.map((tn, i) => (
                      <span key={tn} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= tierIndex ? TIER_COLORS[i] : Dp.border }} />
                    ))}
                  </div>
                )}
                {earned && (() => {
                  const code = diaryAchievementPromoCode(b.id, tierIndex);
                  const percent = ACHIEVEMENT_PROMO_PERCENTS[tierIndex] ?? 5;
                  return (
                    <div
                      onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(code); }}
                      title="Скопировать промокод"
                      style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, background: "#08131F", border: `1px dashed ${tierColor}88`, borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}
                    >
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: Dp.amber, letterSpacing: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎁 {code}</span>
                      <span style={{ fontSize: 9.5, color: Dp.muted, whiteSpace: "nowrap" }}>−{percent}%</span>
                    </div>
                  );
                })()}
                {earned && onShare && (
                  <button
                    onClick={() => onShare(b, tierIndex)}
                    style={{ width: "100%", marginTop: 8, background: "#102433", border: `1px solid ${tierColor}66`, color: tierColor, borderRadius: 8, padding: "6px 0", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    📤 Поделиться в Клубе
                  </button>
                )}
                {earned && onShareImage && (
                  <button
                    onClick={() => onShareImage(b, tierIndex)}
                    style={{ width: "100%", marginTop: 6, background: "none", border: `1px dashed ${tierColor}44`, color: Dp.soft, borderRadius: 8, padding: "6px 0", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                  >
                    🖼️ Скачать картинку
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Рендерит карточку бейджа в PNG через canvas и делится ей через Web Share API
// (файлом — если поддерживается, например в Telegram на мобильных) либо
// скачивает файл как фолбэк. В отличие от поста в Клубе (виден только внутри
// приложения), эта картинка — самостоятельный файл, который можно отправить
// в любой внешний чат.
async function shareBadgeImage(badge, tierIndex) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    const color = TIER_COLORS[tierIndex] || "#00C9B1";

    const grad = ctx.createLinearGradient(0, 0, 800, 800);
    grad.addColorStop(0, "#0B1B28");
    grad.addColorStop(1, "#08131F");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);

    ctx.beginPath();
    ctx.arc(650, 130, 230, 0, Math.PI * 2);
    ctx.fillStyle = color + "22";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.font = "220px sans-serif";
    ctx.fillText(badge.icon, 400, 380);

    ctx.font = "bold 34px sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(TIER_NAMES[tierIndex].toUpperCase(), 400, 460);

    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = "#E8F4F8";
    ctx.fillText(badge.title, 400, 528);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#9FC4CC";
    wrapCanvasText(ctx, badge.desc || "", 400, 575, 640, 32);

    ctx.font = "28px sans-serif";
    ctx.fillStyle = "#6C8E96";
    ctx.fillText("🐠 AquaMarjon · Дневник ухода", 400, 730);

    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return false;
    const file = new File([blob], `aquamarjon-${badge.id}-${tierIndex}.png`, { type: "image/png" });

    const nav = navigator as any;
    if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
      await nav.share({ files: [file], title: badge.title, text: diaryBadgeShareText(badge, tierIndex).text });
      return true;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch {
    return false; // пользователь отменил share-диалог или canvas недоступен — не блокируем UI
  }
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = w + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
}

// Генерирует контент поста для шаринга бейджа в Клуб
function diaryBadgeShareText(badge, tierIndex) {
  return {
    title: `Получил бейдж «${badge.title}» — ${TIER_NAMES[tierIndex]}! 🏅`,
    text: `${badge.icon} ${badge.desc}. Веду дневник ухода в AquaMarjon — присоединяйтесь!`,
    tag: { label: "Достижение", color: TIER_COLORS[tierIndex] },
    photo: { emoji: badge.icon, color: TIER_COLORS[tierIndex] },
  };
}

// Генерирует контент поста для шаринга «выживания» конкретной рыбы
function diaryFishShareText(fish, tankName, days, tierIndex) {
  return {
    title: `${fish.img} ${fish.name} живёт у меня уже ${days} дней!`,
    text: `Аквариум «${tankName}» · статус «${TIER_NAMES[tierIndex]}» в дневнике ухода AquaMarjon 🐠`,
    tag: { label: "Питомец", color: TIER_COLORS[tierIndex] },
    photo: { emoji: fish.img, color: TIER_COLORS[tierIndex] },
  };
}

const FISH_SURVIVAL_TIERS = [30, 100, 365];
function diaryDaysSince(iso) {
  if (!iso) return 0;
  const d = new Date(iso + "T00:00:00");
  const today = new Date(diaryTodayISO() + "T00:00:00");
  return Math.max(0, Math.round((today.getTime() - d.getTime()) / 86400000));
}
function getFishSurvivalTier(days) {
  let idx = -1;
  FISH_SURVIVAL_TIERS.forEach((t, i) => { if (days >= t) idx = i; });
  return idx;
}

// Рейтинг сообщества — фиктивные пользователи + текущий пользователь (по реальному XP)
const DIARY_LEADERBOARD_USERS = [
  { id: "u1", name: "Aziz_Breeder",           avatar: "🧑‍🦱", city: "Ташкент",    xp: 940 },
  { id: "u2", name: "Malika_T",               avatar: "👩",   city: "Самарканд",  xp: 780 },
  { id: "u3", name: "PlantLover_Samarkand",   avatar: "🌿",   city: "Самарканд",  xp: 615 },
  { id: "u4", name: "Rustam_Nukus",           avatar: "🐠",   city: "Нукус",      xp: 540 },
  { id: "u5", name: "Тимур",                  avatar: "📍",   city: "Ташкент",    xp: 410 },
  { id: "u6", name: "Dilnoza_Aqua",           avatar: "👩‍🦰", city: "Фергана",    xp: 295 },
  { id: "u7", name: "Jasur_K",                avatar: "🧔",   city: "Андижан",    xp: 150 },
];
function diaryBuildLeaderboard(diaryStats) {
  const myXp = diaryStats ? diaryComputeXP(diaryStats) : 0;
  const myLevel = Math.floor(myXp / 100) + 1;
  const rows = [
    ...DIARY_LEADERBOARD_USERS.map(u => ({ ...u, level: Math.floor(u.xp / 100) + 1, isMe: false })),
    { id: "me", name: "Вы", avatar: "🧑‍🚀", city: "—", xp: myXp, level: myLevel, isMe: true },
  ];
  rows.sort((a, b) => b.xp - a.xp);
  return rows;
}

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
function DiaryParamsGrid({ tank, onOpenCatalog }) {
  const params = [
    { label: "pH", value: tank.ph, color: Dp.teal },
    { label: "Темп.", value: `${tank.temperature}°C`, color: Dp.amber },
    { label: "NO₃", value: tank.no3 ?? "—", color: tank.no3 > 40 ? Dp.danger : Dp.soft },
    { label: "NH₄", value: (tank.nh4 ?? 0).toFixed(1), color: (tank.nh4 ?? 0) > 0 ? Dp.danger : "#51CF66" },
  ];
  // Замыкаем цикл «дневник → магазин»: если показатели вышли за норму, сразу
  // предлагаем конкретный товар, а не только в AI Докторе.
  const no3High = tank.no3 != null && tank.no3 > 40;
  const nh4High = (tank.nh4 ?? 0) > 0;
  let alert = null;
  if (nh4High) {
    alert = { text: "Обнаружен аммиак (NH₄) — это опасно для рыб. Подмените 20–30% воды и используйте кондиционер для нейтрализации.", query: "кондиционер для воды антиаммиак" };
  } else if (no3High) {
    alert = { text: "NO₃ выше нормы (>40 мг/л) — пора подменить воду и проверить параметры тест-набором.", query: "тест набор для воды NO3" };
  }
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {params.map((p, i) => (
          <div key={i} style={{ flex: 1, background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 12, padding: "9px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: p.color }}>{p.value}</div>
            <div style={{ fontSize: 10, color: Dp.muted, marginTop: 1 }}>{p.label}</div>
          </div>
        ))}
      </div>
      {alert && (
        <div style={{ marginTop: 8, background: "#2A1414", border: `1px solid ${Dp.danger}66`, borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ fontSize: 12, color: "#FF8A8A", lineHeight: 1.4, marginBottom: 8 }}>⚠️ {alert.text}</div>
          {onOpenCatalog && (
            <button
              onClick={() => onOpenCatalog(alert.query)}
              style={{ width: "100%", background: Dp.danger, border: "none", color: "#fff", borderRadius: 9, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              🛒 Подобрать товар в каталоге
            </button>
          )}
        </div>
      )}
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
          <div style={{ fontSize: 12, color: Dp.muted }}>{tank.volume} л · {tank.fish.filter(f=>f.status!=="lost").length} вида · {tank.fish.reduce((s,f)=>s+(f.status==="lost"?0:f.qty),0)} рыб</div>
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

function DiaryTankDetail({ tank, onBack, onUpdate, onShareFish, onOpenCatalog }) {
  const [tab, setTab] = useState("diary");
  const [addingLog, setAddingLog] = useState(false);
  const [logType, setLogType] = useState("water");
  const [logNote, setLogNote] = useState("");
  const [logTemp, setLogTemp] = useState(tank.temperature);
  const [confirmLossId, setConfirmLossId] = useState(null);
  const [addFishModal, setAddFishModal] = useState(false);

  function addFishToTank(fish) {
    onUpdate({
      ...tank,
      fish: [...tank.fish, {
        id: fish.id + "_" + Date.now(), name: fish.name, qty: 1, img: fish.img,
        temp: fish.temp, lifespan: fish.lifespan || "—",
        addedDate: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
        addedDateISO: diaryTodayISO(), status: "alive",
      }],
    });
    setAddFishModal(false);
  }

  function markFishLost(fishId) {
    const today = diaryTodayISO();
    onUpdate({
      ...tank,
      fish: tank.fish.map(f => f.id === fishId ? { ...f, status: "lost", lostDateISO: today } : f),
      lastLossISO: today, // сбрасывает отсчёт «месяцев без потерь» для бейджа 🛡️
    });
    setConfirmLossId(null);
  }

  function addLog() {
    if (!logNote.trim()) return;
    // Своевременность: задача выполнена ДО того, как стала просроченной (daysAgo < интервал)
    const onTime =
      logType === "water" ? tank.lastWaterChange < tank.waterChangeEvery :
      logType === "clean" ? tank.lastFilterClean < tank.filterCleanEvery :
      undefined;
    const newLog = { id: "l" + Date.now(), date: diaryTodayISO(), type: logType, note: logNote, temp: logTemp, onTime };
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
            <div style={{ fontSize: 12, color: Dp.muted }}>{tank.volume} л · {tank.fish.reduce((s,f)=>s+(f.status==="lost"?0:f.qty),0)} рыб · 🌡 {tank.temperature}°C</div>
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
            <DiaryParamsGrid tank={tank} onOpenCatalog={onOpenCatalog} />
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
                {(logType === "water" || logType === "clean") && (
                  (() => {
                    const onTimeNow = logType === "water" ? tank.lastWaterChange < tank.waterChangeEvery : tank.lastFilterClean < tank.filterCleanEvery;
                    return (
                      <div style={{ fontSize: 11, marginBottom: 10, color: onTimeNow ? "#51CF66" : Dp.amber, display: "flex", alignItems: "center", gap: 5 }}>
                        {onTimeNow ? "✅ Вовремя — будет бонус +8 XP" : "⚠️ Уже просрочено — бонус за своевременность не начислится"}
                      </div>
                    );
                  })()
                )}
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
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, background: lt.color + "22", color: lt.color, border: `1px solid ${lt.color}44`, borderRadius: 999, padding: "2px 8px", fontWeight: 600 }}>{lt.icon} {lt.label}</span>
                      {log.onTime === true && (
                        <span title="Сделано до просрочки — бонус XP" style={{ fontSize: 10.5, background: "#0F2A26", color: "#51CF66", border: "1px solid #51CF6666", borderRadius: 999, padding: "2px 7px", fontWeight: 700 }}>
                          ✅ Вовремя +8 XP
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: 11.5, color: Dp.muted }}>{formatDiaryDate(log.date)} · {log.temp}°C</span>
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
            {tank.fish.map(f => {
              const isLost = f.status === "lost";
              const days = f.addedDateISO ? diaryDaysSince(f.addedDateISO) : null;
              const tierIndex = days != null ? getFishSurvivalTier(days) : -1;
              const earned = tierIndex >= 0;
              const nextTarget = tierIndex < FISH_SURVIVAL_TIERS.length - 1 ? FISH_SURVIVAL_TIERS[tierIndex + 1] : FISH_SURVIVAL_TIERS[FISH_SURVIVAL_TIERS.length - 1];
              const prevTarget = tierIndex >= 0 ? FISH_SURVIVAL_TIERS[tierIndex] : 0;
              const pct = tierIndex === FISH_SURVIVAL_TIERS.length - 1 ? 1 : Math.min(Math.max((days - prevTarget) / ((nextTarget - prevTarget) || 1), 0), 1);
              return (
                <div key={f.id} style={{ background: Dp.card, border: `1px solid ${isLost ? Dp.border : earned ? TIER_COLORS[tierIndex] : Dp.border}`, borderRadius: 14, padding: "14px", marginBottom: 10, opacity: isLost ? 0.6 : 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 28, filter: isLost ? "grayscale(1)" : "none" }}>{f.img}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, textDecoration: isLost ? "line-through" : "none" }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: Dp.muted }}>
                        {isLost ? `🕊️ В памяти · с ${f.addedDate}${f.lostDateISO ? ` по ${formatDiaryDate(f.lostDateISO)}` : ""}` : `${f.qty} шт · добавлены ${f.addedDate}`}
                      </div>
                    </div>
                    {!isLost && earned && (
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: TIER_COLORS[tierIndex], border: `1px solid ${TIER_COLORS[tierIndex]}66`, borderRadius: 999, padding: "1px 7px", whiteSpace: "nowrap" }}>
                        {TIER_NAMES[tierIndex]}
                      </span>
                    )}
                  </div>
                  {!isLost && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12, color: Dp.soft, marginBottom: f.addedDateISO ? 10 : 0 }}>
                      <span>🌡 {f.temp[0]}–{f.temp[1]}°C</span>
                      <span>⏳ Живёт {f.lifespan}</span>
                    </div>
                  )}
                  {!isLost && f.addedDateISO && (
                    <>
                      <div style={{ fontSize: 11, color: Dp.muted, marginBottom: 4 }}>
                        📅 {days} дн. у вас {tierIndex === FISH_SURVIVAL_TIERS.length - 1 ? "— максимум!" : `· до «${TIER_NAMES[tierIndex + 1]}» осталось ${nextTarget - days} дн.`}
                      </div>
                      <div style={{ height: 5, background: Dp.border, borderRadius: 999, overflow: "hidden", marginBottom: earned ? 8 : 0 }}>
                        <div style={{ height: "100%", width: `${pct * 100}%`, background: earned ? TIER_COLORS[tierIndex] : Dp.amber, borderRadius: 999 }} />
                      </div>
                      {earned && onShareFish && (
                        <button
                          onClick={() => onShareFish(f, tank.name, days, tierIndex)}
                          style={{ width: "100%", background: "#102433", border: `1px solid ${TIER_COLORS[tierIndex]}66`, color: TIER_COLORS[tierIndex], borderRadius: 8, padding: "6px 0", fontSize: 11, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}
                        >
                          📤 Поделиться в Клубе
                        </button>
                      )}
                    </>
                  )}
                  {!isLost && (
                    confirmLossId === f.id ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#2A1414", border: "1px solid #FF6B6B66", borderRadius: 8, padding: "8px 10px" }}>
                        <span style={{ fontSize: 11, color: "#FF8A8A", flex: 1 }}>Отметить рыбу как потерянную? Это сбросит счётчик «без потерь» 🛡️</span>
                        <button onClick={() => setConfirmLossId(null)} style={{ background: "none", border: `1px solid ${Dp.border}`, color: Dp.muted, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>Отмена</button>
                        <button onClick={() => markFishLost(f.id)} style={{ background: "#FF6B6B", border: "none", color: "#1A0808", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Да</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmLossId(f.id)} style={{ width: "100%", background: "none", border: `1px dashed ${Dp.border}`, color: Dp.muted, borderRadius: 8, padding: "5px 0", fontSize: 10.5, cursor: "pointer" }}>
                        💔 Отметить как потерянную
                      </button>
                    )
                  )}
                </div>
              );
            })}
            {tank.fish.length === 0 && (
              <div style={{ textAlign: "center", color: Dp.muted, fontSize: 13, marginTop: 30, marginBottom: 14 }}>
                Рыб ещё нет — добавьте рыб в аквариум
              </div>
            )}
            <button
              onClick={() => setAddFishModal(true)}
              style={{ width: "100%", background: "#102433", border: `1px dashed ${Dp.border}`, color: Dp.soft, borderRadius: 12, padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              🐠 + Добавить рыбу в этот аквариум
            </button>
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
      {addFishModal && (
        <DiaryAddFishModal tank={tank} onClose={() => setAddFishModal(false)} onAdd={addFishToTank} />
      )}
    </div>
  );
}

// Живая проверка совместимости при добавлении рыбы в УЖЕ существующий
// аквариум дневника — переиспользует ту же checkCompatibility, что и корзина,
// просто собирает «виртуальную корзину» из текущих обитателей по FISH_DB.
function DiaryAddFishModal({ tank, onClose, onAdd }) {
  const [q, setQ] = useState("");
  const tankAsCart = tank.fish
    .filter(f => f.status !== "lost")
    .map(f => FISH_DB.find(d => f.id.startsWith(d.id)))
    .filter(Boolean);
  const results = FISH_DB.filter(f => f.type === "fish" && (!q || f.name.toLowerCase().includes(q.toLowerCase()))).slice(0, 30);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.75)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0B1B28", borderRadius: "20px 20px 0 0", padding: "20px 16px 28px", width: "100%", maxWidth: 420, maxHeight: "78vh", display: "flex", flexDirection: "column", color: Dp.text }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Добавить рыбу в «{tank.name}»</div>
        <input
          autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск рыбы..."
          style={{ width: "100%", background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 10, padding: "10px 12px", color: Dp.text, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
        />
        <div style={{ overflowY: "auto", flex: 1 }}>
          {results.map(f => {
            const compat = checkCompatibility(f, tankAsCart);
            const color = compat.level === "bad" ? Dp.danger : compat.level === "warn" ? Dp.amber : "#51CF66";
            return (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, background: Dp.card, border: `1px solid ${Dp.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
                <span style={{ fontSize: 24, width: 40, height: 40, borderRadius: 10, background: "#102433", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.img}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  {compat.reason ? (
                    <div style={{ fontSize: 11, color, marginTop: 2 }}>{compat.level === "bad" ? "⛔ " : "⚠️ "}{compat.reason}</div>
                  ) : (
                    <div style={{ fontSize: 11, color: "#51CF66", marginTop: 2 }}>✅ Совместима с обитателями</div>
                  )}
                </div>
                <button
                  onClick={() => onAdd(f)}
                  style={{ background: compat.level === "bad" ? "transparent" : Dp.teal, border: `1px solid ${compat.level === "bad" ? Dp.danger : Dp.teal}`, color: compat.level === "bad" ? Dp.danger : "#08131F", borderRadius: 9, padding: "7px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {compat.level === "bad" ? "Всё равно" : "+ Добавить"}
                </button>
              </div>
            );
          })}
          {results.length === 0 && (
            <div style={{ textAlign: "center", color: Dp.muted, fontSize: 13, marginTop: 20 }}>Ничего не найдено</div>
          )}
        </div>
        <button onClick={onClose} style={{ marginTop: 12, width: "100%", background: "#102433", border: `1px solid ${Dp.border}`, color: Dp.soft, borderRadius: 12, padding: 12, fontSize: 14, cursor: "pointer" }}>Отмена</button>
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

const DIARY_TANKS_STORAGE_KEY = "aqua_diary_tanks";
const DIARY_LAST_OPEN_KEY = "aqua_diary_last_open";
const DIARY_LAST_INACTIVITY_PUSH_KEY = "aqua_diary_last_inactivity_push";

function daysSinceISO(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

// Удержание: если пользователь давно не открывал дневник, а у какого-то
// аквариума просрочена смена воды/чистка фильтра — шлём пуш не чаще раза в
// день (троттлим через локальную метку времени последней отправки).
async function maybeSendInactivityReminder(tanks: any[]) {
  const daysSinceOpen = daysSinceISO(readLocal(DIARY_LAST_OPEN_KEY, null));
  if (daysSinceOpen == null || daysSinceOpen < 5) return; // порог — 5 дней без захода
  const lastPush = readLocal(DIARY_LAST_INACTIVITY_PUSH_KEY, null);
  if (lastPush && daysSinceISO(lastPush)! < 1) return; // не чаще раза в день

  const overdueTank = (tanks || []).find(
    (t) => t.lastWaterChange >= t.waterChangeEvery || t.lastFilterClean >= t.filterCleanEvery
  );
  if (!overdueTank) return;

  const reason = overdueTank.lastWaterChange >= overdueTank.waterChangeEvery ? "смена воды" : "чистка фильтра";
  const ok = await notifyTelegram("inactivity_reminder", {
    text: `Вы не заходили ${daysSinceOpen} дн. — у «${overdueTank.name}» просрочена ${reason}`,
    tankName: overdueTank.name, daysAgo: daysSinceOpen, reason,
  });
  if (ok) writeLocal(DIARY_LAST_INACTIVITY_PUSH_KEY, new Date().toISOString());
}

function DiaryScreen({ onBack, onAddClubPost, onStatsUpdate, onOpenCatalog }) {
  const [tanks, setTanks] = useState(() => {
    const pending = readLocal(PENDING_DIARY_TANK_KEY, null);
    const saved = readLocal(DIARY_TANKS_STORAGE_KEY, null);
    const base = saved || DIARY_SEED_TANKS;
    return pending ? [pending, ...base] : base;
  });
  useEffect(() => { writeLocal(DIARY_TANKS_STORAGE_KEY, tanks); }, [tanks]);
  // До открытия дневника шлём ретеншн-пуш по состоянию НА МОМЕНТ предыдущего
  // визита, и только потом обновляем метку «открыл сейчас».
  useEffect(() => {
    maybeSendInactivityReminder(readLocal(DIARY_TANKS_STORAGE_KEY, DIARY_SEED_TANKS));
    writeLocal(DIARY_LAST_OPEN_KEY, new Date().toISOString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [selectedTank, setSelectedTank] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [badgeToast, setBadgeToast] = useState(null);
  const [shareToast, setShareToast] = useState(false);
  const prevEarnedRef = useRef(null);
  const notifiedNearRef = useRef(new Set()); // чтобы не слать пуш повторно за один и тот же прогресс

  // Если только что подхватили черновик из заказа — открываем его сразу и
  // чистим за собой, чтобы он не подмешивался при следующем визите.
  const [pendingTankToast, setPendingTankToast] = useState(null);
  useEffect(() => {
    const pending = readLocal(PENDING_DIARY_TANK_KEY, null);
    if (pending) {
      setSelectedTank(pending);
      writeLocal(PENDING_DIARY_TANK_KEY, null);
      setPendingTankToast({ text: `✅ Аквариум «${pending.name}» создан из заказа`, type: "ok" });
      setTimeout(() => setPendingTankToast(null), 2200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => computeDiaryStats(tanks), [tanks]);

  // Поднимаем актуальную статистику наверх — нужна для рейтинга в Клубе
  useEffect(() => { onStatsUpdate?.(stats); }, [stats]);

  // Отслеживаем разблокировку новых бейджей/тиров и показываем тост
  useEffect(() => {
    const earnedKeys = diaryEarnedBadgeKeys(stats);
    if (prevEarnedRef.current === null) {
      // Первый расчёт при заходе в дневник: бейджи, уже полученные раньше,
      // должны иметь рабочий промокод без показа тоста.
      earnedKeys.forEach(k => {
        const [badgeId, tierIndexStr] = k.split(":");
        const badge = DIARY_BADGES.find(b => b.id === badgeId);
        if (badge) unlockAchievementPromo(badge, Number(tierIndexStr));
      });
    } else {
      const newOnes = earnedKeys.filter(k => !prevEarnedRef.current.includes(k));
      if (newOnes.length > 0) {
        const [badgeId, tierIndexStr] = newOnes[0].split(":");
        const badge = DIARY_BADGES.find(b => b.id === badgeId);
        if (badge) {
          const tierIndex = Number(tierIndexStr);
          const reward = unlockAchievementPromo(badge, tierIndex); // реальный промокод в магазин
          setBadgeToast({ ...badge, tierIndex, rewardCode: reward.code, rewardPercent: reward.percent });
          setTimeout(() => setBadgeToast(null), 5500);
        }
      }
    }
    prevEarnedRef.current = earnedKeys;
  }, [stats]);

  // Пуш в Telegram, когда пользователь близко к новому бейджу (актуально вне приложения)
  useEffect(() => {
    const nb = diaryNearestNextBadge(stats);
    if (!nb || nb.remaining > 2) return;
    const key = `${nb.badge.id}:${nb.tierIndex + 1}:${nb.remaining}`;
    if (notifiedNearRef.current.has(key)) return;
    notifiedNearRef.current.add(key);
    const word = diaryPluralRu(nb.remaining, "записи", "записей", "записей");
    notifyTelegram("badge_progress", {
      title: `Ты на ${nb.remaining} ${word} от нового бейджа! 🎯`,
      text: `${nb.badge.icon} «${nb.badge.title}» · ${TIER_NAMES[nb.tierIndex + 1]} уже близко — заполни дневник AquaMarjon`,
      badgeId: nb.badge.id, tierIndex: nb.tierIndex + 1, remaining: nb.remaining,
    });
  }, [stats]);

  function shareBadge(badge, tierIndex) {
    if (!onAddClubPost) return;
    onAddClubPost(diaryBadgeShareText(badge, tierIndex));
    setBadgeToast(null);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  }

  function shareFish(fish, tankName, days, tierIndex) {
    if (!onAddClubPost) return;
    onAddClubPost(diaryFishShareText(fish, tankName, days, tierIndex));
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  }

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
    return (
      <>
        <DiaryTankDetail tank={selectedTank} onBack={() => setSelectedTank(null)} onUpdate={updateTank} onShareFish={shareFish} onOpenCatalog={onOpenCatalog} />
        <Toast toast={pendingTankToast} />
      </>
    );
  }

  const totalLogs = stats.totalLogs;
  const totalFish = stats.totalFish;
  const waterChanges = stats.water;

  return (
    <>
      <div style={{ minHeight: "100vh", background: Dp.bg, color: Dp.text, paddingBottom: 30 }}>
        <div style={{ background: Dp.card, borderBottom: `1px solid ${Dp.border}`, padding: "16px 16px 14px", position: "relative", overflow: "hidden" }}>
          <Bubbles count={10} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", color: Dp.soft, fontSize: 13, cursor: "pointer", marginBottom: 8, padding: 0 }}>← Назад в каталог</button>
            <div style={{ fontSize: 11, color: Dp.teal, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>AquaMarjon</div>
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

          {/* Геймификация: уровень, XP, бейджи */}
          <DiaryGamificationBar stats={stats} onOpenBadges={() => setShowBadges(true)} />
          <DiaryNextBadgeCard stats={stats} onOpenBadges={() => setShowBadges(true)} />
          <DiaryBadgeStrip stats={stats} onOpenBadges={() => setShowBadges(true)} />

          {tanks.map(tank => (
            <DiaryTankCard key={tank.id} tank={tank} onClick={() => setSelectedTank(tank)} />
          ))}

          <button onClick={() => setAddModal(true)} style={{ width: "100%", border: `1px dashed ${Dp.border}`, background: "none", color: Dp.muted, borderRadius: 16, padding: 18, fontSize: 14, cursor: "pointer" }}>
            + Добавить аквариум
          </button>
        </div>
      </div>
      {addModal && <DiaryAddTankModal onClose={() => setAddModal(false)} onAdd={addTank} />}
      {showBadges && <DiaryAchievementsModal stats={stats} onClose={() => setShowBadges(false)} onShare={shareBadge} onShareImage={shareBadgeImage} />}
      <Confetti active={!!badgeToast} colors={badgeToast ? [TIER_COLORS[badgeToast.tierIndex] || Dp.teal, "#FFD24A", "#51CF66"] : undefined} />
      {badgeToast && (
        <>
          <style>{`
            @keyframes aquaBadgePulse {
              0%   { transform: scale(1); }
              30%  { transform: scale(1.28); }
              55%  { transform: scale(0.95); }
              75%  { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            @keyframes aquaToastDrop {
              0%   { transform: translate(-50%, -16px); opacity: 0; }
              100% { transform: translate(-50%, 0); opacity: 1; }
            }
          `}</style>
          <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 380, background: "#0F2A26", border: `1px solid ${TIER_COLORS[badgeToast.tierIndex] || Dp.teal}`, borderRadius: 14, padding: "12px 16px", zIndex: 660, boxShadow: `0 8px 28px rgba(0,0,0,0.55), 0 0 0 3px ${TIER_COLORS[badgeToast.tierIndex] || Dp.teal}33`, animation: "aquaToastDrop 0.35s cubic-bezier(0.34,1.56,0.64,1)", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26, display: "inline-block", animation: "aquaBadgePulse 0.9s ease-in-out 0.1s" }}>{badgeToast.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: TIER_COLORS[badgeToast.tierIndex] || Dp.teal, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {TIER_NAMES[badgeToast.tierIndex]} · новый бейдж!
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{badgeToast.title}</div>
              </div>
              {onAddClubPost && (
                <button onClick={() => shareBadge(badgeToast, badgeToast.tierIndex)} style={{ background: TIER_COLORS[badgeToast.tierIndex] || Dp.teal, border: "none", color: "#08131F", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
                  📤
                </button>
              )}
            </div>
            {badgeToast.rewardCode && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, background: "#08131F", border: `1px dashed ${Dp.amber}88`, borderRadius: 10, padding: "8px 10px" }}>
                <span style={{ fontSize: 16 }}>🎁</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, color: Dp.muted }}>Промокод на скидку −{badgeToast.rewardPercent}% в магазине</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: Dp.amber, letterSpacing: 0.5 }}>{badgeToast.rewardCode}</div>
                </div>
                <button
                  onClick={() => { navigator.clipboard?.writeText(badgeToast.rewardCode); }}
                  style={{ background: "#102433", border: `1px solid ${Dp.amber}66`, color: Dp.amber, borderRadius: 7, padding: "5px 9px", fontSize: 10.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Копировать
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {shareToast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#0F2A26", border: `1px solid ${Dp.teal}`, color: Dp.text, padding: "10px 18px", borderRadius: 12, fontSize: 13, zIndex: 600, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          ✅ Опубликовано в Клубе
        </div>
      )}
      <Toast toast={pendingTankToast} />
    </>
  );
}

/* ============================================================
   👥 КЛУБ — сообщество AquaMarjon (форум, обмен, конкурсы, города)
   ============================================================ */
const CLUB_TABS = [
  { id: "forum",   label: "Форум",   icon: "💬" },
  { id: "exchange", label: "Обмен",  icon: "🔄" },
  { id: "contest", label: "Конкурс", icon: "🏆" },
  { id: "rating",  label: "Рейтинг", icon: "📈" },
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
    id: "p2", tab: "contest", author: "AquaMarjon Official", time: "вчера", avatar: "👑",
    tag: { label: "Конкурс", color: "#F0A93C" },
    title: "🏆 Конкурс «Лучший аквариум июня» — 500 000 UZS призовой фонд!",
    text: "Публикуйте фото своего аквариума с хэштегом #AquaMarjon_June. Голосование до 30 июня. Победитель получает сертификат на оборудование…",
    likes: 89, comments: 43, views: null, cta: "Участвовать",
    photo: { emoji: "🪸", color: "#F0A93C" },
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
    photo: { emoji: "🐠", color: "#51CF66" },
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
      <div style={{ fontSize: 13, color: Dp.soft, lineHeight: 1.55, marginBottom: post.photo ? 10 : 12 }}>{post.text}</div>
      {post.photo && (
        <div style={{
          width: "100%", aspectRatio: "16/9", borderRadius: 12, marginBottom: 12,
          background: `linear-gradient(135deg, ${post.photo.color}33, #08131F)`,
          border: `1px solid ${post.photo.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52,
        }}>
          {post.photo.emoji}
        </div>
      )}
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

function DiaryLeaderboard({ diaryStats }) {
  const rows = diaryBuildLeaderboard(diaryStats);
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div style={{ padding: "2px 0" }}>
      {!diaryStats && (
        <div style={{ fontSize: 12, color: Dp.muted, marginBottom: 12, textAlign: "center" }}>
          Откройте 📔 Дневник и ведите записи — ваш результат появится здесь
        </div>
      )}
      {rows.map((u, i) => (
        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, background: u.isMe ? "#0F2A26" : Dp.card, border: `1px solid ${u.isMe ? Dp.teal : Dp.border}`, borderRadius: 14, padding: "10px 12px", marginBottom: 8 }}>
          <div style={{ width: 26, textAlign: "center", fontSize: i < 3 ? 18 : 13, fontWeight: 800, color: i < 3 ? undefined : Dp.muted }}>
            {i < 3 ? medals[i] : `#${i + 1}`}
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: "#102433", border: `1px solid ${Dp.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
            {u.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {u.name}{u.isMe && <span style={{ color: Dp.teal }}> (вы)</span>}
            </div>
            <div style={{ fontSize: 11, color: Dp.muted }}>{diaryLevelName(u.level)} · уровень {u.level}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: Dp.amber, whiteSpace: "nowrap" }}>{u.xp} XP</div>
        </div>
      ))}
    </div>
  );
}

function ReferralCard() {
  const [code] = useState(() => getMyReferralCode());
  const [friendCode, setFriendCode] = useState("");
  const [msg, setMsg] = useState(null);
  const shareText = `Заказываю рыб и оборудование в AquaMarjon — подключайся по моему коду ${code} и получи промокод на первый заказ! 🐠`;

  function redeem() {
    const res = redeemReferralCode(friendCode);
    if (!res.ok) { setMsg({ ok: false, text: res.error }); return; }
    setMsg({ ok: true, text: `Промокод −${res.reward.percent}% активирован: ${res.reward.code}` });
    setFriendCode("");
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #0F2A26, #0E2030)", border: `1px solid ${Dp.teal}44`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>🤝 Пригласи друга — оба получите промокод</div>
      <div style={{ fontSize: 12, color: Dp.soft, lineHeight: 1.5, marginBottom: 10 }}>
        Поделитесь своим кодом. Когда друг активирует его — вы оба получаете скидку 10% на заказ от 150 000 сум.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 14, fontWeight: 800, color: Dp.teal, letterSpacing: 0.5 }}>{code}</div>
        <button
          onClick={() => {
            if (navigator.share) navigator.share({ text: shareText }).catch(() => {});
            else navigator.clipboard?.writeText(shareText);
          }}
          style={{ background: Dp.teal, border: "none", color: "#08131F", borderRadius: 10, padding: "0 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
        >
          Поделиться
        </button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={friendCode} onChange={e => setFriendCode(e.target.value)} placeholder="Код друга (FRIEND-XXXXX)"
          style={{ flex: 1, background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 10, padding: "9px 12px", color: Dp.text, fontSize: 13, outline: "none" }}
        />
        <button onClick={redeem} style={{ background: "#102433", border: `1px solid ${Dp.border}`, color: Dp.soft, borderRadius: 10, padding: "0 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
          Активировать
        </button>
      </div>
      {msg && (
        <div style={{ marginTop: 8, fontSize: 12, color: msg.ok ? "#51CF66" : Dp.danger }}>{msg.ok ? "✅ " : "⚠️ "}{msg.text}</div>
      )}
    </div>
  );
}

const POST_PHOTO_EMOJIS = ["🐠", "🐡", "🦈", "🪸", "🌿", "🏔️", "🌊", "👑"];

function ClubComposeModal({ tab, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photoEmoji, setPhotoEmoji] = useState(null);
  const tagInfo = (CLUB_TABS.find(t => t.id === tab) || {});

  function submit() {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      text: text.trim(),
      tag: { label: tagInfo.label || "Пост", color: Dp.teal },
      tab,
      photo: photoEmoji ? { emoji: photoEmoji, color: Dp.teal } : undefined,
    });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,16,0.75)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0B1B28", borderRadius: "20px 20px 0 0", padding: "20px 16px 28px", width: "100%", maxWidth: 420, color: Dp.text }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Новый пост · {tagInfo.label}</div>
        <input
          autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок"
          style={{ width: "100%", background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 10, padding: "11px 12px", color: Dp.text, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }}
        />
        <textarea
          value={text} onChange={e => setText(e.target.value)} placeholder="Расскажите подробнее..." rows={3}
          style={{ width: "100%", background: "#102433", border: `1px solid ${Dp.border}`, borderRadius: 10, padding: "11px 12px", color: Dp.text, fontSize: 13.5, outline: "none", boxSizing: "border-box", marginBottom: 12, resize: "none", fontFamily: "inherit" }}
        />
        <div style={{ fontSize: 12, color: Dp.soft, marginBottom: 8 }}>📷 Фото аквариума/рыбы (визуал — важно!)</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {POST_PHOTO_EMOJIS.map(e => (
            <button key={e} onClick={() => setPhotoEmoji(photoEmoji === e ? null : e)} style={{ width: 40, height: 40, borderRadius: 10, background: photoEmoji === e ? Dp.teal + "33" : "#102433", border: `1px solid ${photoEmoji === e ? Dp.teal : Dp.border}`, fontSize: 18, cursor: "pointer" }}>{e}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#102433", border: `1px solid ${Dp.border}`, color: Dp.soft, borderRadius: 12, padding: 12, fontSize: 14, cursor: "pointer" }}>Отмена</button>
          <button onClick={submit} disabled={!title.trim()} style={{ flex: 2, background: title.trim() ? Dp.teal : Dp.border, border: "none", color: title.trim() ? "#08131F" : Dp.muted, borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700, cursor: title.trim() ? "pointer" : "default" }}>Опубликовать</button>
        </div>
      </div>
    </div>
  );
}

function ClubScreen({ onBack, posts, diaryStats, onAddPost }) {
  const [tab, setTab] = useState("forum");
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);

  const allPosts = posts || CLUB_POSTS;
  const filtered = allPosts.filter(p => {
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
          <div style={{ fontSize: 11, color: Dp.teal, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>AquaMarjon</div>
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
        {tab === "forum" && <ReferralCard />}
        {tab === "rating" ? (
          <DiaryLeaderboard diaryStats={diaryStats} />
        ) : filtered.length > 0 ? (
          filtered.map(post => <ClubPostCard key={post.id} post={post} />)
        ) : (
          <div style={{ textAlign: "center", color: Dp.muted, fontSize: 13, marginTop: 30 }}>
            Пока нет постов в этой категории — будьте первым!
          </div>
        )}
        {tab !== "rating" && (
          <button onClick={() => setComposeOpen(true)} style={{ width: "100%", border: `1px dashed ${Dp.border}`, background: "none", color: Dp.muted, borderRadius: 16, padding: 16, fontSize: 14, cursor: "pointer", marginBottom: 10 }}>
            + Создать пост
          </button>
        )}
      </div>
      {composeOpen && (
        <ClubComposeModal
          tab={tab}
          onClose={() => setComposeOpen(false)}
          onSubmit={(payload) => { onAddPost && onAddPost(payload); setComposeOpen(false); }}
        />
      )}
    </div>
  );
}

/* ---- Компактная лендинг-шапка для главной страницы ---- */
/* ============================================================
   🏠 ГЛАВНАЯ СТРАНИЦА — поиск + избранное, баннеры, важные категории,
   нижняя навигация: Главная · Каталог · Корзина · Профиль
   ============================================================ */

const HOME_BANNERS = [
  {
    title: "Скидка 15% на первый заказ",
    sub: "Промокод действует на любых рыб и оборудование",
    emoji: "🎉",
    bg: "linear-gradient(135deg, #00C9B1, #00897B)",
  },
  {
    title: "Привозные рыбы недели",
    sub: "Редкие виды — ограниченная партия",
    emoji: "✈️",
    bg: "linear-gradient(135deg, #F0A93C, #C97A1A)",
  },
  {
    title: "Бесплатная доставка от 200 000 сум",
    sub: "Сегодня же, с гарантией 48 часов",
    emoji: "🚚",
    bg: "linear-gradient(135deg, #4D7CFE, #2F4FCB)",
  },
];

const HOME_CATEGORIES = [
  { icon: "🐠", label: "Гуппи", search: "Гуппи" },
  { icon: "🗡️", label: "Меченосцы", search: "Меченосц" },
  { icon: "👑", label: "Петушки", search: "Петушок" },
  { icon: "💎", label: "Дискусы", search: "Дискус" },
  { icon: "⛵", label: "Скалярии", search: "Скаляр" },
  { icon: "✈️", label: "Привозные", cat: "import" },
  { icon: "🧒", label: "Для детей", cat: "kids" },
  { icon: "🦈", label: "Хищники", cat: "aggressive" },
];

function HomeScreen({
  region, cart, setCart, wishlist, onToggleWishlist, subscriptions, onSubscribe,
  onOpenCatalog, onOpenCart, onOpenProfile, onOpenFavorites, onOpenDoctor, onOpenConfigurator,
  onOrderPlaced, quizFilter, onClearQuizFilter, onOpenDiary,
}) {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [filterSeed, setFilterSeed] = useState(null);

  function handleCategorySelect(c) {
    setFilterSeed({ token: Date.now(), search: c.search || "", cat: c.cat || "all" });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#08131F", color: "#E8F4F8", fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: 90 }}>
      {/* Шапка */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🐠</span>
            <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.03em", color: "#00C9B1" }}>AquaMarjon</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {region && (
              <span style={{ fontSize: 12, color: "#6C8E96" }}>📍 {region}</span>
            )}
            <button
              onClick={onOpenProfile}
              style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: "#102433", border: "1px solid #1C3A4A",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "#E8F4F8", cursor: "pointer",
              }}
            >
              👤
            </button>
          </div>
        </div>

        {/* Поиск + избранное */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onOpenCatalog}
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              background: "#102433", border: "1px solid #1C3A4A", borderRadius: 14,
              padding: "12px 14px", cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 16, color: "#6C8E96" }}>🔍</span>
            <span style={{ fontSize: 14, color: "#6C8E96" }}>Поиск рыб и товаров</span>
          </button>
          <button
            onClick={onOpenFavorites}
            style={{
              position: "relative", flexShrink: 0,
              width: 44, height: 44, borderRadius: 14,
              background: "#102433", border: "1px solid #1C3A4A",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, cursor: "pointer", color: "#E8F4F8",
            }}
          >
            ❤️
            {wishlist && wishlist.length > 0 && (
              <span style={{ position: "absolute", top: -5, right: -5, background: "#00C9B1", color: "#08131F", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "1px 5px", minWidth: 14, textAlign: "center" }}>
                {wishlist.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Баннеры — горизонтальная карусель */}
      <div
        style={{ display: "flex", gap: 12, overflowX: "auto", padding: "16px 16px", scrollSnapType: "x mandatory" }}
        onScroll={(e) => {
          const w = e.currentTarget.clientWidth;
          const idx = Math.round(e.currentTarget.scrollLeft / (w * 0.86 + 12));
          if (idx !== bannerIdx) setBannerIdx(idx);
        }}
      >
        {HOME_BANNERS.map((b, i) => (
          <button
            key={i}
            onClick={onOpenCatalog}
            style={{
              flex: "0 0 86%", scrollSnapAlign: "start",
              background: b.bg, border: "none", borderRadius: 18,
              padding: "20px 18px", textAlign: "left", cursor: "pointer",
              minHeight: 110, display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <span style={{ fontSize: 28 }}>{b.emoji}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#08131F", marginBottom: 2, lineHeight: 1.25 }}>{b.title}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#08131F", opacity: 0.8 }}>{b.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Индикаторы баннеров */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 22 }}>
        {HOME_BANNERS.map((_, i) => (
          <span key={i} style={{ width: i === bannerIdx ? 16 : 6, height: 6, borderRadius: 999, background: i === bannerIdx ? "#00C9B1" : "#1C3A4A", transition: "all 0.2s" }} />
        ))}
      </div>

      {/* Важные категории */}
      <div style={{ padding: "0 16px" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.01em" }}>Популярные категории</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {HOME_CATEGORIES.map((c) => {
            const isActive = filterSeed && (
              (c.search && filterSeed.search === c.search) ||
              (c.cat && !c.search && filterSeed.cat === c.cat)
            );
            return (
              <button
                key={c.label}
                onClick={() => handleCategorySelect(c)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  background: isActive ? "#0F2A26" : "#102433",
                  border: `1px solid ${isActive ? "#00C9B1" : "#1C3A4A"}`,
                  borderRadius: 14,
                  padding: "14px 6px", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? "#00C9B1" : "#E8F4F8", textAlign: "center", lineHeight: 1.2 }}>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Каталог рыб — встроен прямо на главной, под категориями.
          Выбор категории выше фильтрует список ниже на месте, без перехода на отдельный экран. */}
      <div style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 4px", padding: "0 16px", letterSpacing: "-0.01em" }}>Каталог рыб</h2>
        <Catalog
          region={region}
          cart={cart}
          setCart={setCart}
          onOpenConfigurator={onOpenConfigurator}
          onOpenProfile={onOpenProfile}
          onOpenDoctor={onOpenDoctor}
          onOrderPlaced={onOrderPlaced}
          hideHeader
          hideBottomNav
          quizFilter={quizFilter}
          onClearQuizFilter={onClearQuizFilter}
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          subscriptions={subscriptions}
          onSubscribe={onSubscribe}
          filterSeed={filterSeed}
          onOpenDiary={onOpenDiary}
        />
      </div>

      {/* Нижняя навигация: Главная · Каталог · Доктор · AI Подбор · Я — как в каталоге, чтобы не «прыгала» */}
      <div
        style={{
          position: "fixed", bottom: 14, left: 12, right: 12,
          background: "rgba(16, 28, 40, 0.55)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 26,
          display: "flex", justifyContent: "space-around",
          padding: "10px 6px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          zIndex: 90,
        }}
      >
        {[
          ["home", "Главная", null, true],
          ["fish", "Каталог", onOpenCatalog, false],
          ["cart", "Корзина", onOpenCart, false],
          ["doctor", "Доктор", onOpenDoctor, false],
          ["ai", "AI Подбор", onOpenConfigurator, false],
        ].map(([icon, label, action, active]) => (
          <button
            key={label}
            onClick={action || undefined}
            aria-label={label === "Корзина" && cart && cart.length > 0 ? `Открыть корзину, товаров: ${cart.length}` : undefined}
            style={{
              position: "relative", textAlign: "center",
              color: active ? "#00C9B1" : "#6C8E96",
              fontSize: 10.5, fontWeight: active ? 700 : 500,
              background: active ? "rgba(255,255,255,0.06)" : "none",
              border: "none", borderRadius: 14, padding: "6px 10px",
              cursor: action ? "pointer" : "default",
              transition: "background 0.2s",
            }}
          >
            <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 3 }}>
              <Icon name={icon} size={20} />
              {label === "Корзина" && cart && cart.length > 0 && (
                <span style={{ position: "absolute", top: -4, right: -6, background: "#00C9B1", color: "#08131F", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "1px 5px" }}>
                  {cart.length}
                </span>
              )}
            </div>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HomeHero({ region, onChangeRegion, onOpenProfile, onOpenDoctor, onOpenDiary, onOpenSeller, onOpenCourier, onOpenClub, cart, onOpenCart }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse 100% 80% at 50% 0%, #0E2A36 0%, #08131F 80%)", paddingBottom: 0 }}>
      <Bubbles count={12} />

      {/* Топ-бар */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐠</span>
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.03em", color: "#00C9B1" }}>AquaMarjon</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onOpenProfile} style={{ background: "none", border: "none", color: "#9FC4CC", fontSize: 20, cursor: "pointer", padding: 0 }}>👤</button>
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
function QuizResult({ answers, onAddToCart, onGoToCatalog, onOpenConfigurator, onOpenDoctor }) {
  const recs = getQuizRecommendations(answers);
  const volLabel = QUIZ_VOLUME_OPTIONS.find(v => v.id === answers.volume)?.label || "";
  const expLabel = QUIZ_EXPERIENCE_OPTIONS.find(e => e.id === answers.experience)?.label || "";
  const goalLabel = QUIZ_GOAL_OPTIONS.find(g => g.id === answers.goal)?.label || "";

  // "Первый раз" / "Немного есть" — предлагаем не разбираться самим,
  // а доверить сборку AI-конфигуратору. "Опытный" / "Профи" — у них,
  // скорее всего, аквариум уже есть, поэтому уместнее предложить
  // AI-доктора на случай проблем с текущими рыбками.
  const isNewbie = answers.experience === "zero" || answers.experience === "some";
  const hasTankAlready = answers.experience === "medium" || answers.experience === "expert";

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

      {/* Персональный переход к AI-инструментам — показываем только тот,
          что реально подходит под ответ про опыт (не обе карточки сразу,
          чтобы не перегружать экран результата). */}
      {isNewbie && onOpenConfigurator && (
        <button
          onClick={onOpenConfigurator}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            textAlign: "left", background: "#0F2A26",
            border: "1px solid #00C9B144", borderRadius: 16,
            padding: "14px 16px", cursor: "pointer", marginBottom: 12,
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: "#00C9B122", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22,
          }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#00C9B1", marginBottom: 2 }}>
              Не хотите выбирать сами?
            </div>
            <div style={{ fontSize: 12, color: "#9FC4CC", lineHeight: 1.4 }}>
              AI-конфигуратор соберёт весь аквариум под ключ за 30 секунд
            </div>
          </div>
          <span style={{ color: "#00C9B1", fontSize: 18, flexShrink: 0 }}>→</span>
        </button>
      )}

      {hasTankAlready && onOpenDoctor && (
        <button
          onClick={onOpenDoctor}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            textAlign: "left", background: "#0E2030",
            border: "1px solid #1C3A4A", borderRadius: 16,
            padding: "14px 16px", cursor: "pointer", marginBottom: 12,
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: "#F0A93C22", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22,
          }}>🩺</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#F0A93C", marginBottom: 2 }}>
              Аквариум уже есть?
            </div>
            <div style={{ fontSize: 12, color: "#9FC4CC", lineHeight: 1.4 }}>
              Если с рыбками что-то не так — спросите AI-доктора
            </div>
          </div>
          <span style={{ color: "#F0A93C", fontSize: 18, flexShrink: 0 }}>→</span>
        </button>
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
function OnboardingQuiz({ onDone, onOpenConfigurator, onOpenDoctor }) {
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
          <span style={{ fontSize: 16, fontWeight: 900, color: "#00C9B1", letterSpacing: "-0.03em" }}>AquaMarjon</span>
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
          <>
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
            {/* Быстрый выход для новичков прямо на шаге «Опыт»:
                если человек никогда не держал рыб, не заставляем его
                идти через весь квиз — сразу предлагаем AI-конфигуратор. */}
            {currentStep.key === "experience" && currentAnswer === "zero" && onOpenConfigurator && (
              <button
                onClick={onOpenConfigurator}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  textAlign: "left", background: "#0F2A26",
                  border: "1px dashed #00C9B166", borderRadius: 16,
                  padding: "13px 16px", cursor: "pointer", marginTop: 14,
                  animation: "qFadeIn 0.3s ease-out",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
                <span style={{ flex: 1, fontSize: 12.5, color: "#9FC4CC", lineHeight: 1.4 }}>
                  <b style={{ color: "#00C9B1" }}>Первый аквариум?</b> Можем собрать всё
                  за вас — не нужно отвечать на остальные вопросы
                </span>
                <span style={{ color: "#00C9B1", fontSize: 16, flexShrink: 0 }}>→</span>
              </button>
            )}
          </>
        ) : (
          <QuizResult
            answers={answers}
            onAddToCart={(fish) => setPendingCart(prev => [...prev, fish])}
            onGoToCatalog={handleGoToCatalog}
            onOpenConfigurator={onOpenConfigurator}
            onOpenDoctor={onOpenDoctor}
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
type Account = {
  id: string; role: "seller" | "courier"; name: string; phone: string; region: string;
  login: string; password: string; active: boolean; lastLogin: string; tempPass: string | null;
};
const INIT_ACCOUNTS: Account[] = [
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

// ── Экран «Свяжитесь с нами» для новых курьеров/продавцов ────
function ContactSupportScreen({ role, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const C = THEME;
  const roleLabel = role === "courier" ? "курьера" : "продавца";
  const roleIcon  = role === "courier" ? "🏍️" : "🏪";
  const TG_SUPPORT = "https://t.me/aquauz_support";
  const ADMIN_TG_ID = "5300621854"; // замените на ваш Telegram ID

  async function handleCallRequest() {
    setSubmitting(true);
    try {
      const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const name = tgUser ? `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() : "Неизвестный";
      const username = tgUser?.username ? `@${tgUser.username}` : "(без username)";
      const userId = tgUser?.id || "—";
      const msg = `📋 *Заявка на доступ — ${role === "courier" ? "Курьер" : "Продавец"}*\n\n👤 Имя: ${name}\n🔗 TG: ${username}\n🆔 ID: ${userId}\n⏰ Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })}`;
      await fetch(`https://api.telegram.org/bot7543461671:AAGcb1e0CJqf8L9bIHevtOYwKexT5MnD3tI/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ADMIN_TG_ID, text: msg, parse_mode: "Markdown" }),
      });
    } catch { /* silent */ }
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Заявка принята!</div>
        <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, maxWidth: 320 }}>
          Ваша заявка будет рассмотрена в течение <span style={{ color: C.teal, fontWeight: 700 }}>24 часов</span>.<br /><br />
          Мы свяжемся с вами и выдадим логин и пароль.
        </div>
        <button onClick={onBack} style={{ marginTop: 36, background: C.card, border: `1px solid ${C.border}`, color: C.soft, borderRadius: 14, padding: "13px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          ← Вернуться
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Шапка */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.soft, fontSize: 13, cursor: "pointer", padding: 0 }}>← Назад</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{roleIcon}</div>
          <div style={{ fontSize: 9, color: C.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>AquaMarjon</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Нет доступа?</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 8, lineHeight: 1.6, maxWidth: 300, margin: "8px auto 0" }}>
            Чтобы стать {roleLabel} AquaMarjon, свяжитесь с нами — мы выдадим вам логин и пароль.
          </div>
        </div>

        <div style={{ maxWidth: 360, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Написать в Telegram */}
          <a
            href={TG_SUPPORT}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "linear-gradient(135deg, #229ED9, #1A7BBD)",
              borderRadius: 16, padding: "16px 20px", textDecoration: "none",
              boxShadow: "0 6px 24px #229ED944",
            }}
          >
            <span style={{ fontSize: 28 }}>✈️</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Написать в Telegram</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Поддержка @aquauz_support</div>
            </div>
          </a>

          {/* Заявка на звонок */}
          <button
            onClick={handleCallRequest}
            disabled={submitting}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: `linear-gradient(135deg, ${C.teal}, #00A896)`,
              border: "none", borderRadius: 16, padding: "16px 20px",
              cursor: "pointer", boxShadow: `0 6px 24px ${C.teal}44`,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <span style={{ fontSize: 28 }}>📞</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#08131F" }}>{submitting ? "Отправляем..." : "Заявка на звонок"}</div>
              <div style={{ fontSize: 12, color: "#08131F", opacity: 0.7, marginTop: 2 }}>Мы перезвоним вам в течение 24 часов</div>
            </div>
          </button>

          <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 8 }}>
            Логин и пароль выдаёт только администратор AquaMarjon
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Экран входа для курьера/продавца ─────────────────────────
function LoginScreen({ role, onBack, onLogin, accounts, onNoAccess }) {
  const [login,    setLogin]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const roleLabel = role === "courier" ? "Курьер" : "Продавец";
  const roleIcon  = role === "courier" ? "🏍️" : "🏪";
  const C = THEME;

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim().toLowerCase(), password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Неверный логин или пароль");
        setLoading(false);
        return;
      }
      setToken(data.token);
      onLogin(data.user, data.needPasswordChange);
    } catch {
      if (!ALLOW_OFFLINE_AUTH_FALLBACK) {
        setError("Сервер недоступен. Попробуйте позже.");
        setLoading(false);
        return;
      }
      // Fallback к локальной проверке при недоступном бэкенде (только для демо —
      // см. предупреждение у ALLOW_OFFLINE_AUTH_FALLBACK выше)
      const acc = (accounts as any[]).find((a: any) =>
        a.role === role &&
        a.login === login.trim().toLowerCase() &&
        (a.password === password || (a.tempPass && a.tempPass === password))
      );
      if (!acc) { setError("Неверный логин или пароль"); setLoading(false); return; }
      if (!acc.active) { setError("Аккаунт заблокирован."); setLoading(false); return; }
      onLogin(acc, !!(acc.tempPass && acc.tempPass === password));
    } finally {
      setLoading(false);
    }
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
          <div style={{ fontSize: 9, color: C.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>AquaMarjon</div>
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
            Забыли пароль? Обратитесь к администратору — он сбросит пароль.
          </div>

          {/* Кнопка входа */}
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

          {/* Разделитель */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 4px" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>Нет доступа?</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Кнопка «Свяжитесь с нами» */}
          <button
            onClick={onNoAccess}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.soft,
              borderRadius: 14, padding: "13px",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              marginTop: 10,
            }}
          >
            📩 Связаться с нами
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
  const C = THEME;

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
   🔧 ADMIN PANEL — полноценная панель управления AquaMarjon
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
const A = THEME;

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
    if (!window.confirm(`Удалить «${p?.name}»? Это действие нельзя отменить.`)) return;
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
    const c = couriers.find(x => x.id === id);
    if (!c?.blocked && !window.confirm(`Заблокировать курьера «${c?.name}»? Он потеряет доступ к заказам.`)) return;
    setCouriers(cs => cs.map(x => x.id === id ? { ...x, blocked: !x.blocked, online: false } : x));
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
    if (!window.confirm(`Удалить промокод ${code}? Он перестанет работать у всех, кто его ещё не использовал.`)) return;
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
    const a = accounts.find(x => x.id === id);
    if (a?.active && !window.confirm(`Заблокировать аккаунт «${a?.name}»? Он потеряет доступ к кабинету.`)) return;
    setAccounts(as => as.map(x => x.id === id ? { ...x, active: !x.active } : x));
    showToast(`${a?.name} ${a?.active ? "заблокирован" : "активирован"}`, a?.active ? "bad" : "ok");
  }
  function updateAccount(id, field, val) {
    setAccounts(as => as.map(a => a.id === id ? { ...a, [field]: val } : a));
  }
  function deleteAccount(id) {
    const a = accounts.find(x => x.id === id);
    if (!window.confirm(`Удалить аккаунт «${a?.name}»? Это действие нельзя отменить.`)) return;
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
            <div style={{ fontSize: 9, color: A.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>AquaMarjon</div>
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

// Безопасное чтение/запись localStorage — приложение продолжает работать офлайн,
// так как весь каталог статичен и не требует сети для просмотра
function readLocal(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Подписка на корм — скидка и расчёт следующей даты доставки
const SUBSCRIPTION_DISCOUNT = 0.1; // 10%
const SUBSCRIPTION_INTERVALS = [
  { weeks: 2, label: "Каждые 2 недели" },
  { weeks: 4, label: "Каждый месяц" },
  { weeks: 6, label: "Раз в 6 недель" },
];
function nextDeliveryDate(intervalWeeks) {
  return Date.now() + intervalWeeks * 7 * 24 * 60 * 60 * 1000;
}
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

// Единая точка определения «онлайн ли клиент» — используется и баннером наверху
// экрана, и разовым предупреждением на шаге оплаты в Checkout, чтобы не дублировать
// подписку на window online/offline в двух местах и не разъезжаться в логике.
function useOnlineStatus() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  // Показываем короткое подтверждение восстановления связи, а не просто
  // молча прячем баннер — иначе непонятно, синхронизировалось ли что-то.
  const [justReconnected, setJustReconnected] = useState(false);
  const wasOffline = useRef(false);
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      if (wasOffline.current) {
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 2000);
      }
      wasOffline.current = false;
    };
    const goOffline = () => { setOnline(false); wasOffline.current = true; };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);
  return { online, justReconnected };
}

function OfflineBanner() {
  const { online, justReconnected } = useOnlineStatus();
  if (!online) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: "#F0A93C", color: "#08131F", textAlign: "center",
        fontSize: 12, fontWeight: 700, padding: "6px 10px",
      }}>
        📡 Нет соединения — каталог, корзина и избранное доступны офлайн. Оформление заказа и AI-функции требуют интернет.
      </div>
    );
  }
  if (justReconnected) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: "#00C9B1", color: "#08131F", textAlign: "center",
        fontSize: 12, fontWeight: 700, padding: "6px 10px",
      }}>
        ✅ Снова онлайн — синхронизируем данные
      </div>
    );
  }
  return null;
}

function App() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | city | catalog | seller | profile | delivery | courier | doctor | diary | admin
  const [region, setRegion] = useState(null);
  const [cart, setCart] = useState(() => readLocal("aqua_cart", []));

  // Избранное — отдельно от корзины, переживает перезагрузку и работает офлайн
  const [wishlist, setWishlist] = useState(() => readLocal("aqua_wishlist", []));
  useEffect(() => { writeLocal("aqua_wishlist", wishlist); }, [wishlist]);
  useEffect(() => { writeLocal("aqua_cart", cart); }, [cart]);
  function toggleWishlist(fish) {
    setWishlist((w) => (w.some((x) => x.id === fish.id) ? w.filter((x) => x.id !== fish.id) : [...w, fish]));
  }

  // Подписка на корм/расходники — повторяющиеся заказы со скидкой
  const [subscriptions, setSubscriptions] = useState(() => readLocal("aqua_subscriptions", []));
  useEffect(() => { writeLocal("aqua_subscriptions", subscriptions); }, [subscriptions]);

  function subscribeToProduct(product, intervalWeeks) {
    setSubscriptions((subs) => {
      const exists = subs.find((s) => s.productId === product.id);
      const next = nextDeliveryDate(intervalWeeks);
      if (exists) {
        return subs.map((s) => s.productId === product.id
          ? { ...s, intervalWeeks, nextDate: next, paused: false }
          : s);
      }
      return [...subs, {
        id: "sub_" + Date.now(),
        productId: product.id,
        product,
        intervalWeeks,
        nextDate: next,
        createdAt: Date.now(),
        paused: false,
      }];
    });
  }
  function cancelSubscription(subId) {
    setSubscriptions((subs) => subs.filter((s) => s.id !== subId));
  }
  function toggleSubscriptionPause(subId) {
    setSubscriptions((subs) => subs.map((s) => s.id === subId ? { ...s, paused: !s.paused } : s));
  }

  // Настройки push-уведомлений (Telegram Bot API)
  const [notifPrefs, setNotifPrefs] = useState(() => readLocal("aqua_notif_prefs", DEFAULT_NOTIF_PREFS));
  useEffect(() => { writeLocal("aqua_notif_prefs", notifPrefs); }, [notifPrefs]);
  function updateNotifPref(key, value) {
    setNotifPrefs((p) => {
      const next = { ...p, [key]: value };
      syncNotifPrefs(next);
      return next;
    });
  }

  // Telegram Mini App — инициализация
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();           // сообщаем Telegram что приложение готово
      tg.expand();          // разворачиваем на весь экран
      tg.disableVerticalSwipes?.(); // отключаем закрытие свайпом вниз
      // Приложение сверстано в единой тёмной палитре (нет отдельной светлой темы) —
      // явно фиксируем цвет шапки/фона Telegram под неё, чтобы в светлой теме
      // Telegram не было белых полос сверху/снизу вокруг тёмного контента.
      try {
        tg.setHeaderColor?.("#08131F");
        tg.setBackgroundColor?.("#08131F");
      } catch {}
    }
  }, []);

  // Auth state
  const [accounts, setAccounts] = useState(INIT_ACCOUNTS);
  const [loggedInAcc, setLoggedInAcc] = useState(null);  // текущий аккаунт курьера/продавца
  const [needChangePwd, setNeedChangePwd] = useState(false); // требуется смена пароля
  const [noAccessRole, setNoAccessRole] = useState<Role|null>(null); // экран «нет доступа»
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  // Заказы пользователя и их статусы — храним в localStorage, иначе
  // «Повторить заказ»/трекинг статуса доставки слетают при перезагрузке
  // страницы (бэкенд для пользовательских заказов сейчас не опрашивается).
  const [orders, setOrders] = useState(() => readLocal("aqua_orders", []));
  useEffect(() => { writeLocal("aqua_orders", orders); }, [orders]);
  const [userTanks, setUserTanks] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [quizFilter, setQuizFilter] = useState(null); // фильтр из квиза
  const [clubPosts, setClubPosts] = useState(CLUB_POSTS); // лента Клуба (включая шаринг бейджей)
  const [diaryStats, setDiaryStats] = useState(null); // статистика дневника для рейтинга
  const [catalogSearchSeed, setCatalogSearchSeed] = useState(null); // поиск, переданный из дневника/доктора в каталог
  const [catalogCategorySeed, setCatalogCategorySeed] = useState(null); // категория, выбранная на главной
  const [profileInitialTab, setProfileInitialTab] = useState(null); // вкладка профиля при открытии (напр. избранное)
  const [flashToast, setFlashToast] = useState<{ text: string; type?: string } | null>(null); // одноразовый тост для каталога (напр. после «Повторить заказ»)
  // Экран, на который нужно попасть СРАЗУ после выбора города — используется,
  // когда пользователь уходит по короткому пути из квиза (напр. «к AI-доктору»)
  // ещё до того, как регион выбран, но CityPicker обязателен перед любым экраном.
  const [pendingScreenAfterCity, setPendingScreenAfterCity] = useState<string | null>(null);

  function addClubPost(payload) {
    setClubPosts(prev => [
      { id: "p_" + Date.now(), tab: "forum", author: "Вы", time: "только что", avatar: "🧑‍🚀", likes: 0, comments: 0, views: 0, ...payload },
      ...prev,
    ]);
  }

  // Повтор заказа из профиля: добавляем товары заказа в текущую корзину,
  // но прогоняем рыб через ту же проверку совместимости, что и обычное
  // добавление в каталоге — иначе можно молча получить несовместимых
  // соседей по аквариуму в один клик.
  function handleRepeatOrder(order) {
    const items = Array.isArray(order?.items) ? order.items : [];
    if (items.length === 0) return;

    const added: any[] = [];
    const skipped: any[] = [];
    setCart((c) => {
      const next = [...c];
      for (const raw of items) {
        const item = { ...raw };
        if (item.type === "fish") {
          const compat = checkCompatibility(item, next);
          if (compat.level === "bad") {
            skipped.push(item);
            continue;
          }
        }
        next.push(item);
        added.push(item);
      }
      return next;
    });

    setScreen("catalog");
    setCartOpen(true);

    if (skipped.length > 0) {
      const names = skipped.map((f) => f.name.split(" ")[0]).join(", ");
      setFlashToast({
        text: added.length > 0
          ? `⚠️ Добавлено ${added.length} из ${items.length}. Пропущено: ${names} — несовместимы`
          : `⚠️ Ничего не добавлено — ${names} несовместимы с корзиной`,
        type: "bad",
      });
    } else {
      setFlashToast({ text: `✅ Заказ добавлен в корзину (${added.length})`, type: "ok" });
    }
  }

  // «Завести аквариум» из заказа: берём рыб из состава заказа и передаём
  // черновик в дневник через тот же механизм PENDING_DIARY_TANK_KEY, что
  // используется при создании дневника сразу после оформления заказа.
  function handleCreateTankFromOrder(order) {
    const fishItems = (Array.isArray(order?.items) ? order.items : []).filter((it) => it.type === "fish");
    if (fishItems.length === 0) return;
    writeLocal(PENDING_DIARY_TANK_KEY, buildTankDraftFromCart(fishItems));
    setScreen("diary");
  }

  if (screen === "landing") return <Landing onEnter={() => setScreen("quiz")} />;

  if (screen === "quiz")
    return (
      <>
      <OnboardingQuiz
        onDone={({ cartItems, quizFilter: qf }) => {
          if (cartItems && cartItems.length > 0) setCart(cartItems);
          setQuizFilter(qf || null);
          setScreen("city");
        }}
        onOpenConfigurator={() => setConfiguratorOpen(true)}
        onOpenDoctor={() => {
          // Экран доктора требует выбранный регион (иначе общий гард ниже
          // всё равно покажет CityPicker) — запоминаем цель и уходим её выбирать.
          setPendingScreenAfterCity("doctor");
          setScreen("city");
        }}
      />
      {configuratorOpen && (
        <AiConfigurator
          onClose={() => setConfiguratorOpen(false)}
          onApply={(fishList) => {
            const expanded = fishList.flatMap((f) =>
              Array.from({ length: f.qty || 1 }, () => f)
            );
            // Конфигуратор уже собрал аквариум под ключ — дальше отвечать
            // на вопросы квиза незачем, сразу отправляем выбирать город.
            setCart((c) => [...c, ...expanded]);
            setConfiguratorOpen(false);
            setScreen("city");
          }}
        />
      )}
      </>
    );
  if (screen === "city" || !region)
    return (
      <CityPicker
        onSelect={(r) => {
          setRegion(r);
          setScreen(pendingScreenAfterCity || "home");
          setPendingScreenAfterCity(null);
        }}
      />
    );

  if (screen === "home")
    return (
      <>
      <HomeScreen
        region={region}
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        subscriptions={subscriptions}
        onSubscribe={subscribeToProduct}
        onOpenCatalog={() => setScreen("catalog")}
        onOpenCart={() => { setScreen("catalog"); setCartOpen(true); }}
        onOpenProfile={() => { setProfileInitialTab(null); setScreen("profile"); }}
        onOpenFavorites={() => { setProfileInitialTab("favorites"); setScreen("profile"); }}
        onOpenDoctor={() => setScreen("doctor")}
        onOpenConfigurator={() => setConfiguratorOpen(true)}
        onOrderPlaced={(order) => setOrders((o) => [...o, order])}
        quizFilter={quizFilter}
        onClearQuizFilter={() => setQuizFilter(null)}
        onOpenDiary={() => setScreen("diary")}
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

  if (screen === "doctor") return <FishDoctorScreen onBack={() => setScreen("catalog")} cart={cart} setCart={setCart} />;
  if (screen === "diary")  return <DiaryScreen onBack={() => setScreen("catalog")} onAddClubPost={addClubPost} onStatsUpdate={setDiaryStats} onOpenCatalog={(query) => { setCatalogSearchSeed(query); setScreen("catalog"); }} />;
  if (screen === "club")   return <ClubScreen onBack={() => setScreen("catalog")} posts={clubPosts} diaryStats={diaryStats} onAddPost={addClubPost} />;
  if (screen === "seller") {
    if (noAccessRole === "seller") {
      return <ContactSupportScreen role="seller" onBack={() => setNoAccessRole(null)} />;
    }
    if (!loggedInAcc || loggedInAcc.role !== "seller") {
      return (
        <LoginScreen
          role="seller"
          accounts={accounts}
          onBack={() => setScreen("catalog")}
          onNoAccess={() => setNoAccessRole("seller")}
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
    return <SellerCabinet onBack={() => { clearToken(); setLoggedInAcc(null); setScreen("catalog"); }} />;
  }

  if (screen === "courier") {
    if (noAccessRole === "courier") {
      return <ContactSupportScreen role="courier" onBack={() => setNoAccessRole(null)} />;
    }
    if (!loggedInAcc || loggedInAcc.role !== "courier") {
      return (
        <LoginScreen
          role="courier"
          accounts={accounts}
          onBack={() => setScreen("catalog")}
          onNoAccess={() => setNoAccessRole("courier")}
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
    return <CourierView onBack={() => { clearToken(); setLoggedInAcc(null); setScreen("catalog"); }} />;
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
          if (notifPrefs.delivery) {
            const info = ORDER_STATUSES.find((s) => s.key === status);
            notifyTelegram("order_status", { orderId: updated.id, status, label: info?.label, desc: info?.desc });
          }
        }}
      />
    );
  if (screen === "profile")
    return (
      <Profile
        onBack={() => setScreen("home")}
        onOpenCatalog={() => setScreen("catalog")}
        initialTab={profileInitialTab}
        orders={orders}
        userTanks={userTanks}
        setUserTanks={setUserTanks}
        onTrackOrder={(order) => {
          setTrackingOrder(order);
          setScreen("delivery");
        }}
        onRepeatOrder={handleRepeatOrder}
        onCreateTankFromOrder={handleCreateTankFromOrder}
        onOpenDoctor={() => setScreen("doctor")}
        onOpenDiary={() => setScreen("diary")}
        onOpenSeller={() => setScreen("seller")}
        onOpenCourier={() => setScreen("courier")}
        onOpenClub={() => setScreen("club")}
        onOpenAdmin={() => setScreen("admin")}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={(f) => setCart((c) => [...c, f])}
        subscriptions={subscriptions}
        onCancelSubscription={cancelSubscription}
        onTogglePauseSubscription={toggleSubscriptionPause}
        notifPrefs={notifPrefs}
        onUpdateNotifPref={updateNotifPref}
      />
    );

  // Главная страница: лендинг-шапка + каталог
  return (
    <>
      <OfflineBanner />
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
        onOpenHome={() => setScreen("home")}
        onOrderPlaced={(order) => setOrders((o) => [...o, order])}
        externalCartOpen={cartOpen}
        onExternalCartClose={() => setCartOpen(false)}
        hideHeader
        quizFilter={quizFilter}
        onClearQuizFilter={() => setQuizFilter(null)}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        subscriptions={subscriptions}
        onSubscribe={subscribeToProduct}
        initialSearch={catalogSearchSeed}
        onClearInitialSearch={() => setCatalogSearchSeed(null)}
        initialCategory={catalogCategorySeed}
        onClearInitialCategory={() => setCatalogCategorySeed(null)}
        onOpenDiary={() => setScreen("diary")}
        initialToast={flashToast}
        onClearInitialToast={() => setFlashToast(null)}
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

/* Единая точка входа: любая необработанная ошибка рендера внутри App
   (в каком угодно из ~50 вложенных экранов/модалок) гасится здесь,
   а не роняет весь Mini App в белый экран. */
export default function AppRoot() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
