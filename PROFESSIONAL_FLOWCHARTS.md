# 🎨 Профессиональные графические диаграммы

## 🏗️ Архитектура приложения

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Root Layout] --> B[AuthProvider]
        A --> C[Toaster]
        
        B --> D{Проверка авторизации}
        D -->|Авторизован| E[Main Layout]
        D -->|Не авторизован| F[Public Layout]
        
        E --> G[Header]
        E --> H[Main Content]
        E --> I[Footer]
        
        F --> J[Header]
        F --> K[Public Content]
        F --> L[Footer]
        
        G --> M[Logo]
        G --> N[Search Input]
        G --> O[Cart Button]
        G --> P[Profile Button]
        
        J --> Q[Logo]
        J --> R[Search Input]
        J --> S[Sign In Button]
        J --> T[Sign Up Button]
    end
    
    subgraph "Backend (NestJS)"
        U[API Gateway] --> V[Auth Module]
        U --> W[Product Module]
        U --> X[Cart Module]
        U --> Y[User Module]
        U --> Z[Order Module]
        
        V --> V1[JWT Strategy]
        V --> V2[Role Guard]
        V --> V3[Cookie Service]
        
        W --> W1[Product Controller]
        W --> W2[Admin Product Controller]
        
        X --> X1[Cart Controller]
        X --> X2[Cart Service]
        
        Y --> Y1[User Controller]
        Y --> Y2[User Service]
        
        Z --> Z1[Order Controller]
        Z --> Z2[Order Service]
    end
    
    subgraph "Database (PostgreSQL)"
        AA[Users Table]
        BB[Products Table]
        CC[Categories Table]
        DD[Cart Items Table]
        EE[Orders Table]
        FF[Order Items Table]
    end
    
    V --> AA
    W --> BB
    W --> CC
    X --> DD
    Z --> EE
    Z --> FF
    
    style A fill:#e1f5fe
    style U fill:#f3e5f5
    style AA fill:#e8f5e8
    style BB fill:#e8f5e8
    style CC fill:#e8f5e8
    style DD fill:#e8f5e8
    style EE fill:#e8f5e8
    style FF fill:#e8f5e8
```

## 🔐 Система авторизации и ролей

```mermaid
flowchart TD
    A[Пользователь заходит на сайт] --> B[AuthProvider инициализация]
    B --> C{Есть JWT токен?}
    
    C -->|Нет| D[Гость - Public State]
    C -->|Да| E[Проверка токена на сервере]
    
    E --> F{Токен валиден?}
    F -->|Нет| G{Есть Refresh токен?}
    F -->|Да| H[Получение данных пользователя]
    
    G -->|Нет| D
    G -->|Да| I[Обновление JWT токена]
    I --> J{Обновление успешно?}
    J -->|Нет| D
    J -->|Да| H
    
    H --> K{Роль пользователя?}
    K -->|user| L[Пользователь - User State]
    K -->|admin| M[Администратор - Admin State]
    
    D --> N[Доступные маршруты: /, /signin, /signup]
    L --> O[Доступные маршруты: /, /cart, /signin, /signup]
    M --> P[Доступные маршруты: Все + /dashboard/*]
    
    style D fill:#ffebee
    style L fill:#e8f5e8
    style M fill:#e3f2fd
    style N fill:#fff3e0
    style O fill:#f3e5f5
    style P fill:#e0f2f1
```

## 🛡️ Защита маршрутов - Детальный процесс

```mermaid
flowchart TD
    A[Попытка доступа к маршруту] --> B[Next.js Router]
    B --> C{Маршрут требует авторизации?}
    
    C -->|Нет| D[Доступ разрешен]
    C -->|Да| E[useAuth Hook]
    
    E --> F{isAuthenticated === true?}
    F -->|Нет| G[Редирект на /signin]
    F -->|Да| H{Маршрут требует роль admin?}
    
    H -->|Нет| I[Доступ разрешен]
    H -->|Да| J{isAdmin === true?}
    
    J -->|Нет| K[Редирект на /]
    J -->|Да| I
    
    G --> L[Страница входа]
    K --> M[Главная страница]
    I --> N[Защищенный контент]
    D --> O[Публичный контент]
    
    style G fill:#ffebee
    style K fill:#ffebee
    style I fill:#e8f5e8
    style D fill:#e8f5e8
    style N fill:#e8f5e8
    style O fill:#e8f5e8
```

## 🛒 Поток корзины - Полный цикл

```mermaid
flowchart TD
    A[Пользователь на главной странице] --> B{Авторизован?}
    
    B -->|Нет| C[Показать кнопку "Войти"]
    B -->|Да| D[Показать кнопку "Добавить в корзину"]
    
    D --> E[Клик "Добавить в корзину"]
    E --> F[AddToCartButton Component]
    F --> G[useCart Hook]
    G --> H[cartService.addToCart API]
    
    H --> I{API запрос успешен?}
    I -->|Нет| J[Показать ошибку toast]
    I -->|Да| K[Показать успех toast]
    
    K --> L[Обновить состояние корзины]
    L --> M[Обновить счетчик в CartButton]
    M --> N[Переход в корзину /cart]
    
    N --> O[CartPage Component]
    O --> P[useCart Hook - loadCart]
    P --> Q[cartService.getCart API]
    
    Q --> R{Корзина загружена?}
    R -->|Нет| S[Показать ошибку]
    R -->|Да| T[Отобразить товары в корзине]
    
    T --> U[Управление количеством]
    U --> V[updateCartItem API]
    V --> W[Обновить корзину]
    
    T --> X[Удаление товара]
    X --> Y[removeFromCart API]
    Y --> Z[Обновить корзину]
    
    T --> AA[Очистка корзины]
    AA --> BB[clearCart API]
    BB --> CC[Корзина пуста]
    
    T --> DD[Оформление заказа]
    DD --> EE[Переход к checkout]
    
    style C fill:#ffebee
    style J fill:#ffebee
    style S fill:#ffebee
    style K fill:#e8f5e8
    style T fill:#e8f5e8
    style W fill:#e8f5e8
    style Z fill:#e8f5e8
    style CC fill:#e8f5e8
    style EE fill:#e8f5e8
```

## 📱 Навигация и меню

```mermaid
graph TB
    subgraph "Header Navigation"
        A[Header Component] --> B{isAuthenticated?}
        
        B -->|Нет| C[Public Header]
        B -->|Да| D[Authenticated Header]
        
        C --> E[Logo]
        C --> F[Search Input]
        C --> G[Sign In Button]
        C --> H[Sign Up Button]
        
        D --> I[Logo]
        D --> J[Search Input]
        D --> K[Cart Button]
        D --> L[Profile Button]
        
        L --> M{isAdmin?}
        M -->|Нет| N[Профиль пользователя]
        M -->|Да| O[Админ панель]
        
        N --> P[/profile]
        O --> Q[/dashboard]
    end
    
    subgraph "Admin Sidebar"
        Q --> R[AppSidebar]
        R --> S[AdminNav]
        
        S --> T[Обзор /dashboard]
        S --> U[Пользователи /dashboard/users]
        S --> V[Товары /dashboard/products]
        S --> W[Заказы /dashboard/orders]
        S --> X[Доставки /dashboard/shipping]
        S --> Y[Платежи /dashboard/payments]
        S --> Z[Настройки /dashboard/settings]
    end
    
    subgraph "Mobile Menu"
        AA[Burger Menu] --> BB{isAuthenticated?}
        
        BB -->|Нет| CC[Public Mobile Menu]
        BB -->|Да| DD[Authenticated Mobile Menu]
        
        CC --> EE[Главная]
        CC --> FF[Войти]
        CC --> GG[Регистрация]
        
        DD --> HH[Главная]
        DD --> II[Корзина]
        DD --> JJ[Профиль]
        DD --> KK[Выйти]
        
        JJ --> LL{isAdmin?}
        LL -->|Да| MM[Админ панель]
    end
    
    style C fill:#ffebee
    style D fill:#e8f5e8
    style R fill:#e3f2fd
    style S fill:#e3f2fd
    style CC fill:#ffebee
    style DD fill:#e8f5e8
```

## 🔄 API взаимодействие

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as AuthService
    participant C as CartService
    participant P as ProductService
    participant B as Backend API
    participant DB as Database
    
    Note over U,DB: Инициализация приложения
    U->>F: Заходит на сайт
    F->>A: checkAuth()
    A->>B: GET /auth/me
    B->>DB: Проверка JWT токена
    DB-->>B: User data
    B-->>A: User info
    A-->>F: Auth state updated
    F-->>U: Отображает контент
    
    Note over U,DB: Добавление в корзину
    U->>F: Кликает "Добавить в корзину"
    F->>C: addToCart(productId, quantity)
    C->>B: POST /cart
    B->>DB: Создание записи в корзине
    DB-->>B: Cart item created
    B-->>C: Success response
    C-->>F: Cart updated
    F-->>U: Toast notification
    
    Note over U,DB: Загрузка корзины
    U->>F: Переходит в корзину
    F->>C: loadCart()
    C->>B: GET /cart
    B->>DB: Получение товаров корзины
    DB-->>B: Cart items
    B-->>C: Cart data
    C-->>F: Cart state updated
    F-->>U: Отображает корзину
    
    Note over U,DB: Обновление корзины
    U->>F: Изменяет количество
    F->>C: updateCartItem(itemId, quantity)
    C->>B: PUT /cart/:id
    B->>DB: Обновление количества
    DB-->>B: Updated cart item
    B-->>C: Success response
    C-->>F: Cart updated
    F-->>U: UI updated
```

## 🎯 Тестирование - Полный цикл

```mermaid
flowchart TD
    A[Начало тестирования] --> B[Подготовка тестовой среды]
    
    B --> C[Запуск серверов]
    C --> D[API: npm run start:dev]
    C --> E[Frontend: npm run dev]
    
    D --> F[Тест гостя]
    E --> F
    
    F --> G[Проверка публичных маршрутов]
    G --> H{Все маршруты доступны?}
    H -->|Нет| I[Исправить ошибки]
    H -->|Да| J[Проверка ограничений]
    
    J --> K{Корзина недоступна?}
    K -->|Нет| L[Исправить защиту]
    K -->|Да| M{Админка недоступна?}
    
    M -->|Нет| N[Исправить защиту]
    M -->|Да| O[Тест пользователя]
    
    O --> P[Регистрация нового пользователя]
    P --> Q{Регистрация успешна?}
    Q -->|Нет| R[Исправить регистрацию]
    Q -->|Да| S[Вход в систему]
    
    S --> T{Вход успешен?}
    T -->|Нет| U[Исправить авторизацию]
    T -->|Да| V[Тест функционала пользователя]
    
    V --> W[Добавление в корзину]
    W --> X{Корзина работает?}
    X -->|Нет| Y[Исправить корзину]
    X -->|Да| Z[Тест админа]
    
    Z --> AA[Изменение роли на admin]
    AA --> BB{Роль изменена?}
    BB -->|Нет| CC[Исправить роли]
    BB -->|Да| DD[Тест админ панели]
    
    DD --> EE[Доступ к /dashboard]
    EE --> FF{Админка доступна?}
    FF -->|Нет| GG[Исправить админку]
    FF -->|Да| HH[Тест админ функций]
    
    HH --> II[Управление товарами]
    HH --> JJ[Управление пользователями]
    HH --> KK[Управление заказами]
    
    II --> LL{Все функции работают?}
    JJ --> LL
    KK --> LL
    
    LL -->|Нет| MM[Исправить админ функции]
    LL -->|Да| NN[Тестирование завершено]
    
    style I fill:#ffebee
    style L fill:#ffebee
    style N fill:#ffebee
    style R fill:#ffebee
    style U fill:#ffebee
    style Y fill:#ffebee
    style CC fill:#ffebee
    style GG fill:#ffebee
    style MM fill:#ffebee
    style NN fill:#e8f5e8
```

## 🚀 Поток разработки и деплоя

```mermaid
flowchart TD
    A[Идея новой функции] --> B[Анализ требований]
    B --> C[Планирование архитектуры]
    
    C --> D[Backend разработка]
    C --> E[Frontend разработка]
    
    D --> F[Создание API endpoints]
    F --> G[Написание тестов]
    G --> H{Тесты проходят?}
    H -->|Нет| I[Исправить код]
    I --> G
    H -->|Да| J[Документация API]
    
    E --> K[Создание компонентов]
    K --> L[Интеграция с API]
    L --> M[Написание тестов]
    M --> N{Тесты проходят?}
    N -->|Нет| O[Исправить код]
    O --> M
    N -->|Да| P[Документация компонентов]
    
    J --> Q[Code Review]
    P --> Q
    Q --> R{Review пройден?}
    R -->|Нет| S[Исправить замечания]
    S --> Q
    R -->|Да| T[Merge в main]
    
    T --> U[Автоматические тесты]
    U --> V{Все тесты проходят?}
    V -->|Нет| W[Откат изменений]
    V -->|Да| X[Деплой на staging]
    
    X --> Y[Тестирование на staging]
    Y --> Z{Все работает?}
    Z -->|Нет| AA[Исправить баги]
    AA --> Y
    Z -->|Да| BB[Деплой на production]
    
    BB --> CC[Мониторинг]
    CC --> DD{Есть проблемы?}
    DD -->|Да| EE[Hotfix]
    DD -->|Нет| FF[Функция готова]
    
    style I fill:#ffebee
    style O fill:#ffebee
    style S fill:#ffebee
    style W fill:#ffebee
    style AA fill:#ffebee
    style EE fill:#ffebee
    style FF fill:#e8f5e8
```

## 📊 Мониторинг и аналитика

```mermaid
graph TB
    subgraph "Метрики производительности"
        A[Frontend Metrics] --> A1[Page Load Time]
        A --> A2[Time to Interactive]
        A --> A3[Bundle Size]
        A --> A4[Core Web Vitals]
        
        B[Backend Metrics] --> B1[Response Time]
        B --> B2[Throughput]
        B --> B3[Error Rate]
        B --> B4[Database Queries]
        
        C[Business Metrics] --> C1[User Registrations]
        C --> C2[Cart Conversions]
        C --> C3[Order Completions]
        C --> C4[Revenue]
    end
    
    subgraph "Система мониторинга"
        D[Application Monitoring] --> D1[Error Tracking]
        D --> D2[Performance Monitoring]
        D --> D3[User Behavior]
        D --> D4[Security Events]
        
        E[Infrastructure Monitoring] --> E1[Server Health]
        E --> E2[Database Performance]
        E --> E3[Network Latency]
        E --> E4[Resource Usage]
    end
    
    subgraph "Алерты и уведомления"
        F[Alert System] --> F1[High Error Rate]
        F --> F2[Slow Response Time]
        F --> F3[Security Breach]
        F --> F4[System Down]
        
        G[Notification Channels] --> G1[Email]
        G --> G2[Slack]
        G --> G3[SMS]
        G --> G4[Dashboard]
    end
    
    A --> H[Data Collection]
    B --> H
    C --> H
    D --> H
    E --> H
    
    H --> I[Analytics Dashboard]
    I --> J[Reports]
    I --> K[Insights]
    I --> L[Recommendations]
    
    F --> M[Automated Actions]
    G --> M
    
    style A1 fill:#e8f5e8
    style B1 fill:#e8f5e8
    style C1 fill:#e8f5e8
    style D1 fill:#e3f2fd
    style E1 fill:#e3f2fd
    style F1 fill:#fff3e0
    style G1 fill:#fff3e0
``` 