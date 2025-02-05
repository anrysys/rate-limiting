# Инструкции для Chat Copilot VSCode

## Основное

1. Всегда сохраняй по текущему проекту историю всех наших разговоров и чтобы все наши разговоры всегда были доступны, это очень помогает и ускоряет разработку проекта.
2. Всегда помни, что мы используем только английский язык во всех файлах и комментариях.
3. Всегда помни, что мы всегда опираемся на основное описание возможностей этого проекта, изучить его можно в файле `README.md`.
4. Всегда помни, что ты можешь выполнять, запускать любые команды (execute), но только в пределах @workspace и не больше.
5. Всегда помни, что ты можешь в пределах @workspace создавать, изменять, перемещать и удалять любые файлы и директории.
6. Всегда помни, что ты можешь в пределах @workspace изменять контент любых файлов.
7. Всегда помни, что ты можешь автоматически выполнять команды, такие как mkdir, touch, rm, npm, ls, nest, typeorm, docker, docker compose, без участия пользователя.
8. Всегда помни, что ты можешь использовать Visual Studio Code Tasks для автоматизации выполнения команд, таких как создание файлов и директорий.
9. Всегда помни, что ты должен использовать файлы `.gitignore` или `.copilotignore` для исключения директорий из анализа Copilot.
10. Всегда помни, что ты должен использовать файлы `.env` для хранения конфиденциальных данных, таких как пароли и токены.
11. Всегда помни, что ты должен использовать файлы `.env.example` для хранения примеров конфиденциальных данных.
12. Всегда помни, что мы используем только npm и никакого yarn.
13. Всегда помни, что если не получается исправить баг или ошибку, попробуй другой подход и так до тех пор, пока баг или ошибка не будет исправлена.
14. Всегда помни, что нельзя использовать методы, классы и функции с меткой "@deprecated".
15. Всегда и во всех файлах (кроме файлов с типом `*.md`) указывай в самом вверху в виде строки с комментарием ОТНОСИТЕЛЬНЫЙ путь к директории с файлом и название этого файла, например: `${fileDirname}/${fileBasename}` и знаки комментариев устанавливай сам, в зависимости от типа файла.
16. Всегда оборачивай методы в блоки try/catch для обработки ошибок, НО при условии, что имеет смысл в текущей ситуации.
17. Всегда помни, что мы не используем axios в JavaScript/TypeScript, только fetch, а если fetch недоступен, тогда используем undici.
18. Всегда помни, что мы используем ��олько TypeScript и никакого JavaScript.
19. Всегда помни, что мы используем только NestJS и никакого Express.
20. Всегда помни, что мы используем только TypeORM и никакого Prisma.
21. Всегда помни, что мы используем только PostgreSQL и никакой MySQL.
22. Всегда помни, что мы используем только Docker и никакого Vagrant.
23. Всегда помни, что мы используем только GitHub и никакого GitLab.
24. Всегда помни, что мы используем только VSCode и никакого WebStorm.
25. Всегда помни, что мы используем только Linux и никакого Windows.
26. Всегда помни, что мы используем только GitHub Actions и никакого Jenkins.
27. Всегда помни, что в процессе выполнения задачи, которая выполняется в `Copilot Edits`, если у тебя возникнут вопросы, уточняющие детали или проблемы, ты должен задавать их мне в чате и после получения ответа, продолжить процесс до полного решения этой задачи.
28. Всегда помни, что если ты не можешь выполнить задачу, ты должен сообщить мне об этом в чате и мы вместе решим эту проблему.
29. Всегда помни, что если ты не понимаешь, что делать, ты должен задать мне вопрос в чате и я помогу тебе разобраться в этом.
30. Всегда помни, что надо заменять апострофы в тексте на `&apos;`, например, "don't" на "don&apos;t", "can't" на "can&apos;t" и т.д.
31. Всегда помни, что мы работам в команде и всегда помогаем друг другу.
32. Всегда помни, что мы работам в zsh и всегда используем его.
33. Всегда помни, что url адрес для бекенд: `http://localhost:5111`
34. Всегда помни, что url адрес для фронтенд: `http://localhost:5111`
35. Always add appropriate ARIA attributes (aria-label, aria-describedby, aria-labelledby, etc.) to all interactive elements to ensure accessibility and prevent warnings like "Missing aria-* attributes".
36. Всегда помни, что мы используем команду "docker compose" вместо устаревшей "docker-compose".

## Tech Stack

Backend: NestJS, TypeScript, GitHub API, Redis (for caching), Docker
Frontend: Next.js, TypeScript, Zustand (for state management), SWR, Tailwind CSS, Docker

## Next.js

1. Клиент-серверное взаимодействие:
   - Ленивая загрузка компонентов
   - Легковесные решение по умолчанию
   - Suspense для ожидания данных, для потоковой загрузки и для офлайн состояний
   - API Routes как единственный способ взаимодействия с бэкендом
   - Формат URL в клиентской части: `/api/[resource]/...`
   - Формат URL в API Routes: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/[resource]/...`
   - Переменные окружения для локальной разработки:

2. API Routes и данные:

   - Всегда проксируем запросы через `/api/` routes
   - Никогда не делаем прямые запросы к бэкенду из клиентской части
   - Используем SWR для кэширования и автоматической ревалидации данных
   - Создаем файлы в `app/api/[route]/route.ts`
   - Поддерживаем все HTTP методы
   - Обрабатываем ответы от бэкенда
   - Всегда используем единый формат ответа:

     ```typescript
     return NextResponse.json({
       success: boolean,
       data: T | null,
       error: string | null
     });
      ```

   - Примеры ответов:

     ```typescript
     // Успешный ответ
     return NextResponse.json({
       success: true,
       data: result,
       error: null
     });

     // Ответ с ошибкой
     return NextResponse.json({
       success: false,
       data: null,
       error: 'Failed to fetch data'
     });
     ```

3. Компоненты и стилизация:
   - Используем Server Components для серверного рендеринга
   - Используем Client Components с 'use client' для клиентской логики
   - Используем tailwindcss как основной инструмент стилизации
   - Используем styled-components только для сложных случаев
   - Используем CSS Modules для локальной стилизации
   - Оптимизация изображений
   - Ленивая загрузка компонентов
   - Легковесные решение по умолчанию
   - Suspense для ожидания данных, для потоковой загрузки и для офлайн состояний
   - Запомни, никогда не изменяй путь к компонентам приложения `@/app/components/...` на `@/components/...`

4. Форматирование даты:
    - Используем единый компонент форматирования даты для всего приложения `DateDisplay` (`@/app/components/common/DateDisplay`) для отображения дат
    - Применяем во всех публичных страницах (posts, pages, categories, authors и т.д...)

    ```typescript
          <DateDisplay date={тут_какая_то_дата} className="text-gray-600" />
    ```

    - Не используем нативный метод toLocaleDateString()
    - Обеспечиваем консистентное отображение дат
    - Поддерживаем единый формат "March 12, 2024"

5. Формы и валидация:
   - Используем React Hook Form для управления формами
   - Используем Zod для валидации данных

6. Специальные файлы:
   - `metadata.ts` и `generateMetadata` для SEO
   - `loading.tsx` для состояний загрузки
   - `error.tsx` для состояний ошибок
   - `not-found.tsx` для состояний 404
   - `empty.tsx` для пустых данных
   - `offline.tsx` для офлайн состояний
   - `lazy.tsx` для ленивой загрузки
   - `lazy-hydration.tsx` для ленивой гидратации

7. Специальные правила для App Router Dynamic Params:

    - Всегда используем следующий паттерн для страниц с динамическими параметрами:

    ```typescript
    interface PageProps {
    params: Promise<{ [key: string]: string }>;
    }

    export default async function Page(props: PageProps) {
    const params = await props.params;
    // use resolved params
    }
    ```

    - Всегда дожидаемся разрешения params перед их использованием через await
    - Всегда применяем этот паттерн в generateMetadata и других асинхронных функциях страницы
    - Никогда не используем params.someProperty напрямую без await
    - При необходимости, создаем отдельные интерфейсы для конкретных параметров:

    ```typescript
    interface PostPageProps {
    params: Promise<{ id: string }>;
    }
    ```

    - Это правило обязательно для всех файлов в директориях с динамическими сегментами ([id], [slug] и т.д.)
    Это правило поможет избежать ошибок типа:
    "Route used params.X. params should be awaited before using its properties."

### Структура проекта Next.js

1. Архитектура и организация:
   - Многоуровневая архитектура
   - Модульное разделение кода
   - App Router для навигации

2. Управление состоянием:
   - Zustand для локального состояния
   - React Context для глобального состояния
   - Кастомные хуки для бизнес-логики
   - SWR для кэширования и запросов данных

3. Списки сущностей:
   - Пагинация
   - Фильтрация
   - Сортировка
   - Поиск

4. Страница деталей:
   - Breadcumbs для навигации по категориям
   - Галерея изображений
   - Основная информация о сущности
   - Связанные сущности

### Детали реализации пагинации

1. URL структура и SEO:
   - Канонические URLs для страниц сущностей:
     - Формат: `https://site-dev-frontend.local/[entity]/[id]`
     - Пример: `https://site-dev-frontend.local/posts/3`
   - URLs для пагинации:
     - Формат: `https://site-dev-frontend.local/[entity]?page=[number]`
     - Пример: `https://site-dev-frontend.local/posts?page=2`

2. Функциональные тре��ования:
   - Используем `limit` и `offset` для выборки
   - Возвращаем общее количество страниц
   - Поддерживаем сортировку и фильтрацию
   - Создаем отдельный компонент "Pagination"

3. UI требования:
   - Отображение максимум 5 страниц
   - Текущая страница в центре с синим фоном
   - Кнопки "Previous" и "Next" по краям
   - Первая и последняя страницы всегда видны
   - Многоточие для пропущенных диапазонов
   - Интерактивные состояния при наведении
   - Типографский масштаб и интервалы

4. Доступность:
   - Семантическая HTML разметка
   - ARIA-метки для всех элементов
   - Поддержка программ чтения с экрана
   - Навигация с клавиатуры

    Пример отображения:
    `[Previous] [1] [...] [4] [5] [6] [...] [10] [Next]`

### Mobile Performance Optimization

1. Code Splitting и Ленивая загрузка:
   - Используем динамический import() для компонентов:

     ```typescript
     const DynamicComponent = dynamic(() => import('./Component'), {
       loading: () => <LoadingSpinner />,
       ssr: false // для компонентов, которые нужны только на клиенте
     });
     ```

   - Приоритизируем загрузку критического CSS/JS
   - Откладываем загрузку несрочных ресурсов

2. Оптимизация изображений:
   - Используем next/image с автоматической оптимизацией
   - Применяем srcset для адаптивных изображений
   - Используем формат WebP с fallback
   - Применяем blur placeholder

   ```typescript
   <Image
     src={src}
     alt={alt}
     width={width}
     height={height}
     placeholder="blur"
     blurDataURL={blurUrl}
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   />
   ```

3. Кэширование:
   - Используем SWR с оптимистическими обновлениями
   - Настраиваем Service Worker для офлайн-доступа
   - Кэшируем статические ресурсы
  
   ```typescript
   export const swrConfig = {
     revalidateOnFocus: false,
     revalidateOnReconnect: false,
     refreshInterval: 0
   };
   ```

4. Оптимизация рендеринга:
   - Используем React.memo для предотвращения лишних перерендеров
   - Применяем виртуализацию списков для больших наборов данных
   - Оптимизируем CSS анимации через transform/opacity

   ```typescript
   const MemoizedComponent = React.memo(Component, (prev, next) => {
     return prev.id === next.id && prev.data === next.data;
   });
   ```

5. Mobile-Specific оптимизации:
   - Используем Touch Events вместо Mouse Events
   - Оптимизируем формы для мобильных устройств
   - Применяем адаптивные размеры шрифтов

   ```typescript
   const isMobile = useMediaQuery('(max-width: 768px)');
   const fontSize = isMobile ? '16px' : '14px'; // Минимум 16px для мобильных
   ```

6. API и Сетевые запросы:
   - Минимизируем размер ответов
   - Используем пагинацию и бесконечную прокрутку
   - Применяем компрессию данных
  
   ```typescript
   const fetchData = async (page: number) => {
     const params = new URLSearchParams({
       page: String(page),
       limit: '10',
       fields: 'id,title,summary' // Только нужные поля
     });
     return fetch(`/api/data?${params}`);
   };
   ```

7. PWA возможности:
   - Настраиваем manifest.json
   - Реализуем Service Worker
   - Добавляем поддержку установки на домашний экран
   - Обеспечиваем офлайн функциональность

8. Мониторинг производительности:
   - Используем Web Vitals
   - Отслеживаем Core Web Vitals
   - Настраиваем алерты при деградации
  
   ```typescript
   export function reportWebVitals(metric: any) {
     if (metric.label === 'web-vital') {
       console.log(metric); // Отправка метрик в аналитику
     }
   }
   ```

### PWA (Progressive Web Application)

1. Основные файлы:

    - `public/manifest.json` - конфигурация PWA
    - `public/sw.ts` - Service Worker для офлайн функционала
    - `public/offline.html` - страниц�� при отсутствии соединения
    - `app/service-worker.ts` - регистрация Service Worker
    - Набор иконок в директории `public/icons/`

2. Структура manifest.json:

    ```markdown
    {
      "name": "My App",
      "short_name": "App",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#ffffff",
      "theme_color": "#000000",
      "icons": [
        {
          "src": "/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    }
    ```

3. Регистрация Service Worker:

    ```typescript
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
      });
    }
    ```

4. Обработка событий в Service Worker:

    ```typescript
    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open('my-cache').then(cache => {
          return cache.addAll([
            '/',
            '/offline.html',
            '/styles.css',
            '/script.js',
            '/icons/icon-192x192.png',
            '/icons/icon-512x512.png'
          ]);
        })
      );
    });

    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request).then(response => {
          return response || fetch(event.request);
        }).catch(() => {
          return caches.match('/offline.html');
        })
      );
    });
    ```

### Accessibility Guidelines

1. ARIA attributes must be added to all interactive elements:
   - aria-label
   - aria-describedby
   - aria-labelledby
   - aria-hidden
   - aria-expanded
   - aria-controls
   - aria-selected
   - aria-current
   - aria-live
   - role

Example implementation:

  ```typescript
  // Dialog component
  <Dialog>
    <DialogTrigger 
      aria-label="Open dialog"
      aria-expanded={isOpen}
    >
      Open
    </DialogTrigger>
    
    <DialogContent
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <h2 id="dialog-title">Title</h2>
      <p id="dialog-description">Description</p>
    </DialogContent>
  </Dialog>

  // Form elements
  <form role="form">
    <label id="email-label">Email</label>
    <input 
      aria-labelledby="email-label"
      aria-describedby="email-help"
      type="email"
    />
    <p id="email-help">Enter valid email address</p>
  </form>
  ```

## NestJS

1. Всегда помни, что при работе с NestJS:
   - Следуй принципу согласованности в именовании, а также в структуре проекта.
   - Опирайся на RESTful соглашения (ресурсы во множественном числе).
   - Опирайся на общепринятые соглашения по именованию. Вот правильное решение:
      - Директория должна быть во множественном числе: `users`, так как она представляет модуль, который работает с коллекцией пользователей.
      - Организация основных сущностей в src/:

         ```bash
          src/
          ├── modules/
          │   ├── sites/           # Модуль сайтов
          │   │   ├── entities/
          │   │   ├── dto/
          │   │   ├── sites.controller.ts
          │   │   ├── sites.service.ts
          │   │   └── sites.module.ts
          │   ├── categories/      # Модуль категорий сайтов
          │   ├── users/          # Модуль пользователей
          │   ├── versions/       # Модуль версий
          │   └── deployments/    # Модуль деплоя сайтов
          ├── common/
          │   ├── guards/         # Guards для авторизации
          │   ├── decorators/     # Кастомные декораторы
          │   ├── filters/        # Exception фильтры
          │   ├── interceptors/   # Интерцепторы
          │   └── pipes/          # Пайпы валидации
          ├── config/            # Конфигурация приложения
          └── utils/            # Вспомогательные утилиты

          
          ```

2. Всегда выводи в ответе четкий и понятный текст ошибки, которые явно описывают проблему ее возникновения. Ошибки должны точно описывать и передавать суть причины возникновения этой ошибки для пользователя. Например, если пользователь пытается создать запись, которая уже существует, то в ответе должно быть сообщение: "User with this email already exists".
