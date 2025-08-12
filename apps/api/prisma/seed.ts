import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Очищаем данные в правильном порядке из-за внешних ключей
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.parcel.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.shippingMethod.deleteMany({});
  await prisma.taxRate.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared existing data');

  console.log('Creating admin user...');

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: '$2a$10$sRrJJzLfNqIelp.r9rrMn.Tjr/Db8VI5crBtw27nJWNoYSv8.2Dt2',
      role: 'admin',
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  console.log('Creating test users...');

  const testUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Иван Петров',
        email: 'ivan@example.com',
        password:
          '$2a$10$sRrJJzLfNqIelp.r9rrMn.Tjr/Db8VI5crBtw27nJWNoYSv8.2Dt2',
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Мария Сидорова',
        email: 'maria@example.com',
        password:
          '$2a$10$sRrJJzLfNqIelp.r9rrMn.Tjr/Db8VI5crBtw27nJWNoYSv8.2Dt2',
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Алексей Козлов',
        email: 'alex@example.com',
        password:
          '$2a$10$sRrJJzLfNqIelp.r9rrMn.Tjr/Db8VI5crBtw27nJWNoYSv8.2Dt2',
        role: 'user',
      },
    }),
  ]);

  console.log(`Created ${testUsers.length} test users`);

  console.log('Creating categories...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Кухонные ножи',
        slug: 'kitchen-knives',
        description: 'Профессиональные кухонные ножи для дома и ресторанов',
        image:
          'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Охотничьи ножи',
        slug: 'hunting-knives',
        description: 'Надежные ножи для охоты и рыбалки',
        image:
          'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Складные ножи',
        slug: 'folding-knives',
        description: 'Компактные складные ножи для повседневного использования',
        image:
          'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Точилки',
        slug: 'sharpeners',
        description: 'Профессиональные точилки для ножей',
        image:
          'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Аксессуары',
        slug: 'accessories',
        description: 'Чехлы, подставки и другие аксессуары для ножей',
        image:
          'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 5,
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  console.log('Creating products...');

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Шеф-нож Santoku 18см',
        slug: 'chef-knife-santoku-18cm',
        description:
          'Профессиональный шеф-нож Santoku с лезвием 18см. Идеально подходит для нарезки овощей, мяса и рыбы.',
        shortDescription: 'Профессиональный шеф-нож для кухни',
        sku: 'KNIFE-001',
        price: 4500.0,
        comparePrice: 5500.0,
        costPrice: 3000.0,
        weight: 250.0,
        brand: 'Zwilling',
        dimensions: '18x3x2',
        stockQuantity: 15,
        productType: 'knife',
        material: 'stainless_steel',
        handleType: 'fixed',
        bladeLength: 18.0,
        totalLength: 30.0,
        bladeHardness: 58,
        isFeatured: true,
        isNew: true,
        categoryId: categories[0].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600',
              alt: 'Шеф-нож Santoku',
              isPrimary: true,
              sortOrder: 1,
            },
            {
              url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600',
              alt: 'Шеф-нож Santoku - вид сбоку',
              isPrimary: false,
              sortOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Нож для хлеба 20см',
        slug: 'bread-knife-20cm',
        description:
          'Специализированный нож для хлеба с зубчатым лезвием. Легко режет свежий и черствый хлеб.',
        shortDescription: 'Нож для хлеба с зубчатым лезвием',
        sku: 'KNIFE-002',
        price: 3200.0,
        comparePrice: 3800.0,
        brand: 'Wüsthof',
        costPrice: 2200.0,
        weight: 180.0,
        dimensions: '20x2.5x1.5',
        stockQuantity: 12,
        productType: 'knife',
        material: 'stainless_steel',
        handleType: 'fixed',
        bladeLength: 20.0,
        totalLength: 32.0,
        bladeHardness: 56,
        categoryId: categories[0].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600',
              alt: 'Нож для хлеба',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Охотничий нож Bowie',
        slug: 'hunting-knife-bowie',
        description:
          'Классический охотничий нож Bowie с прочным лезвием. Идеален для охоты и кемпинга.',
        shortDescription: 'Классический охотничий нож',
        sku: 'KNIFE-003',
        price: 8500.0,
        comparePrice: 9500.0,
        costPrice: 6000.0,
        weight: 350.0,
        brand: 'Buck Knives',
        dimensions: '25x4x3',
        stockQuantity: 8,
        productType: 'knife',
        material: 'carbon_steel',
        handleType: 'fixed',
        bladeLength: 15.0,
        totalLength: 25.0,
        bladeHardness: 60,
        isFeatured: true,
        categoryId: categories[1].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600',
              alt: 'Охотничий нож Bowie',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Складной нож EDC',
        slug: 'folding-knife-edc',
        description:
          'Компактный складной нож для повседневного ношения. Надежный механизм блокировки.',
        shortDescription: 'Компактный складной нож',
        sku: 'KNIFE-004',
        price: 2800.0,
        comparePrice: 3200.0,
        costPrice: 1900.0,
        weight: 120.0,
        brand: 'Spyderco',
        dimensions: '8x2x1',
        stockQuantity: 25,
        productType: 'knife',
        material: 'stainless_steel',
        handleType: 'folding',
        bladeLength: 8.0,
        totalLength: 18.0,
        bladeHardness: 58,
        isNew: true,
        categoryId: categories[2].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600',
              alt: 'Складной нож EDC',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Точилка для ножей 3-ступенчатая',
        slug: 'knife-sharpener-3-stage',
        description:
          'Профессиональная точилка с тремя абразивными поверхностями для идеальной заточки.',
        shortDescription: '3-ступенчатая точилка для ножей',
        sku: 'SHARP-001',
        price: 1500.0,
        comparePrice: 1800.0,
        costPrice: 1000.0,
        weight: 500.0,
        dimensions: '25x8x3',
        stockQuantity: 20,
        brand: 'Condor Tool & Knife',
        productType: 'sharpener',
        categoryId: categories[3].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600',
              alt: 'Точилка для ножей',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Кожаный чехол для ножа',
        slug: 'leather-knife-sheath',
        description:
          'Качественный кожаный чехол для безопасного хранения и переноски ножей.',
        shortDescription: 'Кожаный чехол для ножа',
        sku: 'ACC-001',
        price: 800.0,
        comparePrice: 950.0,
        costPrice: 500.0,
        weight: 150.0,
        dimensions: '20x8x2',
        stockQuantity: 30,
        productType: 'sheath',
        material: 'leather',
        categoryId: categories[4].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600',
              alt: 'Кожаный чехол',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  console.log('Creating shipping methods...');

  const shippingMethods = await Promise.all([
    prisma.shippingMethod.create({
      data: {
        name: 'Стандартная доставка',
        description: 'Доставка курьером 2-3 дня',
        price: 300.0,
        estimatedDays: '2-3 дня',
        sortOrder: 1,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Экспресс доставка',
        description: 'Доставка курьером в течение дня',
        price: 800.0,
        estimatedDays: '1 день',
        sortOrder: 2,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Бесплатная доставка',
        description: 'При заказе от 5000₽',
        price: 0.0,
        freeShippingThreshold: 5000.0,
        estimatedDays: '3-5 дней',
        sortOrder: 3,
      },
    }),
  ]);

  console.log(`Created ${shippingMethods.length} shipping methods`);

  console.log('Creating tax rates...');

  const taxRates = await Promise.all([
    prisma.taxRate.create({
      data: {
        name: 'НДС 20%',
        rate: 0.2,
        country: 'RU',
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${taxRates.length} tax rates`);

  console.log('Creating coupons...');

  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        name: 'Приветственная скидка',
        description: 'Скидка 10% на первый заказ',
        discountType: 'percentage',
        discountValue: 10.0,
        minimumAmount: 1000.0,
        usageLimit: 100,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'SHARP50',
        name: 'Скидка на точилки',
        description: 'Скидка 50₽ на все точилки',
        discountType: 'fixed_amount',
        discountValue: 50.0,
        minimumAmount: 500.0,
        usageLimit: 50,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`Created ${coupons.length} coupons`);

  console.log('Creating addresses...');

  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: testUsers[0].id,
        firstName: 'Иван',
        lastName: 'Петров',
        address1: 'ул. Ленина, д. 10, кв. 5',
        city: 'Москва',
        state: 'Москва',
        postalCode: '123456',
        country: 'Россия',
        phone: '+7 (999) 123-45-67',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: testUsers[1].id,
        firstName: 'Мария',
        lastName: 'Сидорова',
        address1: 'пр. Мира, д. 25, кв. 12',
        city: 'Санкт-Петербург',
        state: 'Санкт-Петербург',
        postalCode: '654321',
        country: 'Россия',
        phone: '+7 (999) 987-65-43',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: testUsers[2].id,
        firstName: 'Алексей',
        lastName: 'Козлов',
        address1: 'ул. Гагарина, д. 15, кв. 8',
        city: 'Екатеринбург',
        state: 'Свердловская область',
        postalCode: '620000',
        country: 'Россия',
        phone: '+7 (999) 555-44-33',
        isDefault: true,
      },
    }),
  ]);

  console.log(`Created ${addresses.length} addresses`);

  console.log('Creating orders...');

  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: testUsers[0].id,
        orderNumber: 'ORD-001',
        status: 'confirmed',
        subtotal: 2500.0,
        taxAmount: 500.0,
        shippingAmount: 300.0,
        discountAmount: 0.0,
        totalAmount: 3300.0,
        currency: 'RUB',
        shippingAddressId: addresses[0].id,
        paymentMethod: 'card',
        notes: 'Доставить до 18:00',
      },
    }),
    prisma.order.create({
      data: {
        userId: testUsers[1].id,
        orderNumber: 'ORD-002',
        status: 'shipped',
        subtotal: 1800.0,
        taxAmount: 360.0,
        shippingAmount: 0.0,
        discountAmount: 100.0,
        totalAmount: 2060.0,
        currency: 'RUB',
        shippingAddressId: addresses[1].id,
        paymentMethod: 'card',
        notes: 'Хрупкий товар',
      },
    }),
    prisma.order.create({
      data: {
        userId: testUsers[2].id,
        orderNumber: 'ORD-003',
        status: 'delivered',
        subtotal: 3200.0,
        taxAmount: 640.0,
        shippingAmount: 300.0,
        discountAmount: 0.0,
        totalAmount: 4140.0,
        currency: 'RUB',
        shippingAddressId: addresses[2].id,
        paymentMethod: 'card',
        notes: 'Подарочная упаковка',
      },
    }),
  ]);

  console.log(`Created ${orders.length} orders`);

  console.log('Creating parcels...');

  const parcels = await Promise.all([
    prisma.parcel.create({
      data: {
        orderId: orders[0].id,
        status: 'ready',
        trackingNumber: 'RU123456789CN',
        carrier: 'СДЭК',
        comment: 'Готов к отправке',
      },
    }),
    prisma.parcel.create({
      data: {
        orderId: orders[1].id,
        status: 'shipped',
        trackingNumber: 'RU987654321CN',
        carrier: 'Почта России',
        shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        comment: 'Отправлено через Почту России',
      },
    }),
    prisma.parcel.create({
      data: {
        orderId: orders[2].id,
        status: 'delivered',
        trackingNumber: 'RU555444333CN',
        carrier: 'СДЭК',
        shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        comment: 'Доставлено успешно',
      },
    }),
  ]);

  console.log(`Created ${parcels.length} parcels`);

  console.log('Creating payments...');

  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        orderId: orders[0].id,
        userId: testUsers[0].id,
        status: 'paid',
        method: 'card',
        amount: 3300.0,
        currency: 'RUB',
        externalId: 'PAY-001',
        comment: 'Оплачено картой',
      },
    }),
    prisma.payment.create({
      data: {
        orderId: orders[1].id,
        userId: testUsers[1].id,
        status: 'paid',
        method: 'card',
        amount: 2060.0,
        currency: 'RUB',
        externalId: 'PAY-002',
        comment: 'Оплачено картой',
      },
    }),
    prisma.payment.create({
      data: {
        orderId: orders[2].id,
        userId: testUsers[2].id,
        status: 'paid',
        method: 'card',
        amount: 4140.0,
        currency: 'RUB',
        externalId: 'PAY-003',
        comment: 'Оплачено картой',
      },
    }),
  ]);

  console.log(`Created ${payments.length} payments`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
