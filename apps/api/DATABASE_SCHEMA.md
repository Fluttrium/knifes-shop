# 🗄️ Схема базы данных - Интернет-магазин ножей

## 📋 Обзор

Схема базы данных разработана для полнофункционального интернет-магазина ножей с поддержкой всех необходимых функций e-commerce.

## 🏗️ Структура моделей

### 👤 Пользователи и аутентификация

#### `User`
- **Основная модель пользователя**
- Поля: id, name, email, password, role, phone, isActive
- Связи: addresses, orders, reviews, cartItems, wishlistItems

#### `Address`
- **Адреса доставки и выставления счетов**
- Поля: type (shipping/billing), firstName, lastName, address1, city, state, postalCode, country
- Связи: user, orders

### 🛍️ Каталог товаров

#### `Category`
- **Категории товаров с иерархией**
- Поля: name, slug, description, image, parentId, isActive, sortOrder
- Связи: parent, children, products

#### `Product`
- **Основная модель товара**
- Поля: name, slug, description, price, stockQuantity, productType, material, handleType
- Специфичные поля для ножей: bladeLength, totalLength, bladeHardness
- Связи: category, images, variants, orderItems, cartItems, wishlistItems, reviews

#### `ProductImage`
- **Изображения товаров**
- Поля: url, alt, isPrimary, sortOrder
- Связи: product

#### `ProductVariant`
- **Варианты товаров (цвет, размер и т.д.)**
- Поля: name, sku, price, stockQuantity
- Связи: product, orderItems, cartItems

### 🛒 Корзина и избранное

#### `CartItem`
- **Товары в корзине пользователя**
- Поля: userId, productId, variantId, quantity
- Связи: user, product, variant

#### `WishlistItem`
- **Избранные товары пользователя**
- Поля: userId, productId
- Связи: user, product

### 📦 Заказы

#### `Order`
- **Основная модель заказа**
- Поля: orderNumber, status, paymentStatus, subtotal, taxAmount, shippingAmount, totalAmount
- Связи: user, shippingAddress, items

#### `OrderItem`
- **Товары в заказе (снимок на момент заказа)**
- Поля: productName, productSku, quantity, unitPrice, totalPrice
- Связи: order, product, variant

### ⭐ Отзывы

#### `Review`
- **Отзывы пользователей о товарах**
- Поля: rating (1-5), title, comment, isVerified, isActive
- Связи: user, product

### 🎫 Скидки и купоны

#### `Coupon`
- **Купоны и промокоды**
- Поля: code, discountType, discountValue, minimumAmount, usageLimit, startsAt, expiresAt
- Типы скидок: percentage, fixed_amount

### 🚚 Доставка

#### `ShippingMethod`
- **Способы доставки**
- Поля: name, price, freeShippingThreshold, estimatedDays
- Связи: orders

### 💰 Налоги

#### `TaxRate`
- **Налоговые ставки**
- Поля: name, rate, country, state, postalCode
- Поддержка региональных налогов

## 🔄 Enums

### `OrderStatus`
- pending, confirmed, processing, shipped, delivered, cancelled, refunded

### `PaymentStatus`
- pending, paid, failed, refunded

### `PaymentMethod`
- card, cash, bank_transfer

### `ProductType`
- knife, sharpener, sheath, accessory, gift_set

### `Material`
- stainless_steel, carbon_steel, damascus_steel, ceramic, titanium, wood, plastic, leather, synthetic

### `HandleType`
- fixed, folding, multi_tool

## 🎯 Ключевые особенности

### ✅ Безопасность
- Хеширование паролей с bcrypt
- JWT токены для аутентификации
- Ролевая система (admin/user)

### ✅ Производительность
- Индексы на часто используемых полях
- Оптимизированные связи
- Правильные типы данных

### ✅ Масштабируемость
- Модульная структура
- Поддержка вариантов товаров
- Гибкая система категорий

### ✅ Функциональность
- Полный цикл покупки
- Система отзывов
- Купоны и скидки
- Множественные адреса
- Избранное и корзина

## 📊 Статистика схемы

- **Моделей**: 12 основных + 5 enum
- **Связей**: 25+ связей между моделями
- **Поля**: 150+ полей данных
- **Индексов**: Автоматические + уникальные ограничения

## 🚀 Готовые данные

После запуска seed создаются:
- 5 категорий товаров
- 6 товаров с изображениями
- 3 способа доставки
- 1 налоговая ставка
- 2 купона для тестирования

## 🔧 Использование

```bash
# Генерация Prisma Client
npx prisma generate

# Запуск миграций
npx prisma migrate dev

# Заполнение тестовыми данными
npm run seed

# Просмотр данных
npx prisma studio
``` 