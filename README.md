# 🛡️ Resilient Payment Tracker

**Offline-First | Sync-Capable | AI-Light Warnings**

MVP разработан для хакатона. Решение проблемы потери данных о платежах в условиях нестабильного интернета.

## 🚀 Основные возможности

-   **Offline-First:** Добавляйте платежи в горах, в дороге или при сбое сети. Данные сохраняются в браузере (IndexedDB).
-   **Auto-Sync:** Как только интернет восстановится, приложение автоматически отправит данные в облако (Supabase).
-   **AI Warning Banner:** Система анализирует статус сети и "предсказывает" риски сбоев, рекомендуя перейти на наличные или подождать.
-   **Premium UI:** Современный темный интерфейс с эффектом Glassmorphism и плавными анимациями.
-   **Analytics:** Наглядные графики ваших расходов за последнюю неделю.

## 🛠 Технологический стек

-   **Frontend:** Next.js 14, Tailwind CSS, Framer Motion, Chart.js
-   **Database (Offline):** Dexie.js (IndexedDB)
-   **Backend/Auth:** Supabase
-   **Icons:** Lucide-React

## 📦 Быстрый старт

1.  **Клонируйте проект**
2.  **Установите зависимости:**
    ```bash
    npm install
    ```
3.  **Настройте Supabase:**
    Создайте таблицу `payments` в Supabase SQL Editor:
    ```sql
    create table payments (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id),
      amount numeric not null,
      description text,
      status text,
      createdAt timestamp with time zone default timezone('utc'::text, now()),
      synced integer default 1
    );
    ```
4.  **Настройте .env:**
    Создайте `.env.local` и добавьте:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```
5.  **Запустите:**
    ```bash
    npm run dev
    ```

## 🎯 Питч (2 минуты)

**Проблема:** В регионах с нестабильным интернетом пользователи часто не могут провести платеж или забывают записать расходы, когда сеть "лежит". Это ведет к хаосу в личных финансах и бизнесе.

**Решение:** Resilient Payment Tracker — это страховка для ваших данных. Мы используем Local-first подход: приложение всегда доступно. Даже если сервер упадет, ваши данные в безопасности на вашем устройстве.

**Ценность:** 
1. **Надежность:** 100% аптайм для записи данных.
2. **Прозрачность:** Аналитика даже в оффлайне.
3. **Безопасность:** Прозрачная синхронизация с облаком.

---
*Developed with ❤️ for the Hackathon.*
