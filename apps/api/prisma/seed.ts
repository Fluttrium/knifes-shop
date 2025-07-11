import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==================== CATEGORIES ====================
  console.log('📂 Creating categories...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Кухонные ножи',
        slug: 'kitchen-knives',
        description: 'Профессиональные кухонные ножи для дома и ресторанов',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Охотничьи ножи',
        slug: 'hunting-knives',
        description: 'Надежные ножи для охоты и рыбалки',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Складные ножи',
        slug: 'folding-knives',
        description: 'Компактные складные ножи для повседневного использования',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Точилки',
        slug: 'sharpeners',
        description: 'Профессиональные точилки для ножей',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Аксессуары',
        slug: 'accessories',
        description: 'Чехлы, подставки и другие аксессуары для ножей',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
        sortOrder: 5,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ==================== PRODUCTS ====================
  console.log('🔪 Creating products...');

  const products = await Promise.all([
    // Кухонные ножи
    prisma.product.create({
      data: {
        name: 'Шеф-нож Santoku 18см',
        slug: 'chef-knife-santoku-18cm',
        description: 'Профессиональный шеф-нож Santoku с лезвием 18см. Идеально подходит для нарезки овощей, мяса и рыбы.',
        shortDescription: 'Профессиональный шеф-нож для кухни',
        sku: 'KNIFE-001',
        price: 4500.00,
        comparePrice: 5500.00,
        costPrice: 3000.00,
        weight: 250.0,
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
        description: 'Специализированный нож для хлеба с зубчатым лезвием. Легко режет свежий и черствый хлеб.',
        shortDescription: 'Нож для хлеба с зубчатым лезвием',
        sku: 'KNIFE-002',
        price: 3200.00,
        comparePrice: 3800.00,
        costPrice: 2200.00,
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
    // Охотничьи ножи
    prisma.product.create({
      data: {
        name: 'Охотничий нож Bowie',
        slug: 'hunting-knife-bowie',
        description: 'Классический охотничий нож Bowie с прочным лезвием. Идеален для охоты и кемпинга.',
        shortDescription: 'Классический охотничий нож',
        sku: 'KNIFE-003',
        price: 8500.00,
        comparePrice: 9500.00,
        costPrice: 6000.00,
        weight: 350.0,
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
    // Складные ножи
    prisma.product.create({
      data: {
        name: 'Складной нож EDC',
        slug: 'folding-knife-edc',
        description: 'Компактный складной нож для повседневного ношения. Надежный механизм блокировки.',
        shortDescription: 'Компактный складной нож',
        sku: 'KNIFE-004',
        price: 2800.00,
        comparePrice: 3200.00,
        costPrice: 1900.00,
        weight: 120.0,
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
    // Точилки
    prisma.product.create({
      data: {
        name: 'Точилка для ножей 3-ступенчатая',
        slug: 'knife-sharpener-3-stage',
        description: 'Профессиональная точилка с тремя абразивными поверхностями для идеальной заточки.',
        shortDescription: '3-ступенчатая точилка для ножей',
        sku: 'SHARP-001',
        price: 1500.00,
        comparePrice: 1800.00,
        costPrice: 1000.00,
        weight: 500.0,
        dimensions: '25x8x3',
        stockQuantity: 20,
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
    // Аксессуары
    prisma.product.create({
      data: {
        name: 'Кожаный чехол для ножа',
        slug: 'leather-knife-sheath',
        description: 'Качественный кожаный чехол для безопасного хранения и переноски ножей.',
        shortDescription: 'Кожаный чехол для ножа',
        sku: 'ACC-001',
        price: 800.00,
        comparePrice: 950.00,
        costPrice: 500.00,
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

  console.log(`✅ Created ${products.length} products`);

  // ==================== SHIPPING METHODS ====================
  console.log('🚚 Creating shipping methods...');

  const shippingMethods = await Promise.all([
    prisma.shippingMethod.create({
      data: {
        name: 'Стандартная доставка',
        description: 'Доставка курьером 2-3 дня',
        price: 300.00,
        estimatedDays: '2-3 дня',
        sortOrder: 1,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Экспресс доставка',
        description: 'Доставка курьером в течение дня',
        price: 800.00,
        estimatedDays: '1 день',
        sortOrder: 2,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Бесплатная доставка',
        description: 'При заказе от 5000₽',
        price: 0.00,
        freeShippingThreshold: 5000.00,
        estimatedDays: '3-5 дней',
        sortOrder: 3,
      },
    }),
  ]);

  console.log(`✅ Created ${shippingMethods.length} shipping methods`);

  // ==================== TAX RATES ====================
  console.log('💰 Creating tax rates...');

  const taxRates = await Promise.all([
    prisma.taxRate.create({
      data: {
        name: 'НДС 20%',
        rate: 0.20,
        country: 'RU',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${taxRates.length} tax rates`);

  // ==================== COUPONS ====================
  console.log('🎫 Creating coupons...');

  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        name: 'Приветственная скидка',
        description: 'Скидка 10% на первый заказ',
        discountType: 'percentage',
        discountValue: 10.00,
        minimumAmount: 1000.00,
        usageLimit: 100,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'SHARP50',
        name: 'Скидка на точилки',
        description: 'Скидка 50₽ на все точилки',
        discountType: 'fixed_amount',
        discountValue: 50.00,
        minimumAmount: 500.00,
        usageLimit: 50,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 дней
      },
    }),
  ]);

  console.log(`✅ Created ${coupons.length} coupons`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 