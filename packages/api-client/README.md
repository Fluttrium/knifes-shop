# API Client

Клиентская библиотека для взаимодействия с API магазина ножей.

## Установка

```bash
npm install @repo/api-client
```

## Использование

### Импорт

```typescript
import { api } from '@repo/api-client';
// или
import { AuthService, ProductService } from '@repo/api-client';
```

### Основные сервисы

#### AuthService - Аутентификация

```typescript
// Вход в систему
const authResponse = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Регистрация
const authResponse = await api.auth.register({
  email: 'user@example.com',
  password: 'password',
  firstName: 'Иван',
  lastName: 'Иванов'
});

// Выход
await api.auth.logout();

// Получение текущего пользователя
const user = await api.auth.getCurrentUser();

// Проверка авторизации
const isAuth = await api.auth.isAuthenticated();

// Проверка роли админа
const isAdmin = await api.auth.isAdmin();
```

#### ProductService - Продукты

```typescript
// Получение списка продуктов
const products = await api.products.getProducts({
  page: 1,
  limit: 20,
  search: 'нож',
  categoryId: 'category-id',
  minPrice: 1000,
  maxPrice: 5000,
  sortBy: 'price',
  sortOrder: 'asc'
});

// Получение продукта по ID
const product = await api.products.getProductById('product-id');

// Получение продукта по slug
const product = await api.products.getProductBySlug('product-slug');

// Получение избранных продуктов
const featuredProducts = await api.products.getFeaturedProducts();

// Получение категорий
const categories = await api.products.getCategories();

// Админские методы
const newProduct = await api.products.createProduct({
  name: 'Нож охотничий',
  description: 'Описание ножа',
  categoryId: 'category-id',
  price: 5000,
  brand: 'Brand Name',
  steelType: 'Damascus',
  // ... другие поля
});
```

#### OrderService - Заказы

```typescript
// Создание заказа
const order = await api.orders.createOrder({
  items: [
    { productId: 'product-id', quantity: 2 }
  ],
  shippingAddressId: 'address-id',
  billingAddressId: 'address-id',
  paymentMethod: 'yookassa'
});

// Получение заказов пользователя
const orders = await api.orders.getOrders({
  page: 1,
  limit: 10,
  status: 'pending'
});

// Получение заказа по ID
const order = await api.orders.getOrderById('order-id');

// Отмена заказа
await api.orders.cancelOrder('order-id');

// Работа с адресами
const addresses = await api.orders.getAddresses();
const newAddress = await api.orders.createAddress({
  firstName: 'Иван',
  lastName: 'Иванов',
  addressLine1: 'ул. Примерная, 1',
  city: 'Москва',
  state: 'Московская область',
  postalCode: '123456',
  country: 'Россия',
  phone: '+7 999 123-45-67'
});
```

#### CartService - Корзина и избранное

```typescript
// Получение корзины
const cart = await api.cart.getCart();

// Добавление в корзину
const cartItem = await api.cart.addToCart({
  productId: 'product-id',
  quantity: 2
});

// Обновление количества
await api.cart.updateCartItem('item-id', { quantity: 3 });

// Удаление из корзины
await api.cart.removeFromCart('item-id');

// Очистка корзины
await api.cart.clearCart();

// Работа с избранным
const wishlist = await api.cart.getWishlist();
await api.cart.addToWishlist('product-id');
await api.cart.removeFromWishlist('item-id');
await api.cart.clearWishlist();

// Проверка наличия в избранном
const isInWishlist = await api.cart.isInWishlist('product-id');
```

#### PaymentService - Платежи

```typescript
// Создание платежа
const payment = await api.payments.createPayment({
  orderId: 'order-id',
  amount: 5000,
  currency: 'RUB',
  description: 'Оплата заказа #123',
  returnUrl: 'https://example.com/success'
});

// Получение статуса платежа
const status = await api.payments.getPaymentStatus('payment-id');

// Подтверждение платежа
await api.payments.capturePayment('payment-id');

// Отмена платежа
await api.payments.cancelPayment('payment-id');

// Возврат платежа
await api.payments.refundPayment('payment-id', 2500);

// Получение истории платежей
const history = await api.payments.getPaymentHistory('order-id');
```

#### UserService - Пользователи

```typescript
// Получение всех пользователей (админ)
const users = await api.users.getAllUsers();

// Получение пользователя по ID
const user = await api.users.getUserById('user-id');

// Получение пользователя по email
const user = await api.users.getUserByEmail('user@example.com');

// Обновление пользователя
const updatedUser = await api.users.updateUser('user-id', {
  firstName: 'Новое имя'
});

// Удаление пользователя
await api.users.deleteUser('user-id');
```

## Типы данных

Все типы экспортируются из пакета:

```typescript
import type {
  User,
  Product,
  Order,
  CartItem,
  Payment,
  // ... и другие типы
} from '@repo/api-client';
```

## Конфигурация

Библиотека автоматически использует базовый URL из переменных окружения или настройки проекта. Для изменения конфигурации можно модифицировать файл `config.ts`.

## Обработка ошибок

Все методы API возвращают Promise и могут выбросить исключения при ошибках сети или сервера. Рекомендуется использовать try-catch для обработки ошибок:

```typescript
try {
  const products = await api.products.getProducts();
} catch (error) {
  console.error('Ошибка при получении продуктов:', error);
}
```

## Авторизация

Библиотека автоматически отправляет куки с токенами авторизации. При успешном входе в систему токены сохраняются в куки и автоматически используются для последующих запросов.

## Поддержка

Для получения помощи или сообщения об ошибках, пожалуйста, создайте issue в репозитории проекта. 