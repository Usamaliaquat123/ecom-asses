import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    },
  });

  // Create manager user
  const managerPassword = await bcrypt.hash('password123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      passwordHash: managerPassword,
      role: 'MANAGER',
      profile: {
        create: {
          firstName: 'Manager',
          lastName: 'User',
        },
      },
    },
  });

  // Create sample sales metrics
  const salesMetrics = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    salesMetrics.push({
      date,
      revenue: Math.random() * 10000 + 5000,
      orders: Math.floor(Math.random() * 100) + 50,
      customers: Math.floor(Math.random() * 80) + 40,
      channel: ['online', 'mobile', 'retail'][Math.floor(Math.random() * 3)],
    });
  }

  await prisma.salesMetric.createMany({
    data: salesMetrics,
  });

  // Create sample customer metrics
  const customerMetrics = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    customerMetrics.push({
      date,
      totalCustomers: 1000 + i * 10,
      newCustomers: Math.floor(Math.random() * 50) + 10,
      returningCustomers: Math.floor(Math.random() * 200) + 100,
      averageOrderValue: Math.random() * 100 + 150,
    });
  }

  await prisma.customerMetric.createMany({
    data: customerMetrics,
  });

  // Create sample inventory items
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  const inventoryItems = [];
  
  for (let i = 1; i <= 50; i++) {
    inventoryItems.push({
      sku: `SKU-${i.toString().padStart(3, '0')}`,
      name: `Product ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      stock: Math.floor(Math.random() * 100) + 10,
      reserved: Math.floor(Math.random() * 10),
      price: Math.random() * 500 + 50,
      cost: Math.random() * 250 + 25,
      supplier: `Supplier ${Math.floor(Math.random() * 5) + 1}`,
    });
  }

  await prisma.inventoryItem.createMany({
    data: inventoryItems,
  });

  // Create sample reports
  await prisma.report.createMany({
    data: [
      {
        title: 'Monthly Sales Report',
        generatedBy: admin.id,
        status: 'COMPLETED',
        filePath: '/reports/monthly-sales-2024-01.pdf',
      },
      {
        title: 'Inventory Analysis',
        generatedBy: manager.id,
        status: 'COMPLETED',
        filePath: '/reports/inventory-analysis-2024-01.pdf',
      },
      {
        title: 'Customer Insights',
        generatedBy: admin.id,
        status: 'PROCESSING',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@example.com / password123');
  console.log('👤 Manager user: manager@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

