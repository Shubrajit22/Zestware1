import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if the "Uniform" category already exists
  let uniformCategory = await prisma.productCategory.findFirst({
    where: { name: 'UNIFORM' },
  });

  // Create category if not exists
  if (!uniformCategory) {
    uniformCategory = await prisma.productCategory.create({
      data: {
        name: 'UNIFORM',
        imageUrl: '/images/uniform.jpeg',
        description: 'Uniforms for various institutions in Assam',
      },
    });
  }

  // Insert products
  await prisma.product.createMany({
    data: [
      {
        name: 'Guwahati School Uniform - Shirt',
        description: 'Comfortable school shirt for Guwahati institutions',
        price: 499,
        mrpPrice: 599,
        discount: 15,
        imageUrl: '/uniform/gs/full.png',
        categoryId: uniformCategory.id,
        type: 'UNIFORM',
        state: 'Assam',
        district: 'Guwahati',
        institution: 'School A Guwahati',
        color: 'Blue',
        texture: 'Cotton',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Guwahati School Uniform - Pants',
        description: 'School pants for Guwahati institutions',
        price: 799,
        mrpPrice: 899,
        discount: 10,
        imageUrl: '/uniform/gs/pant.png',
        categoryId: uniformCategory.id,
        type: 'UNIFORM',
        state: 'Assam',
        district: 'Guwahati',
        institution: 'School B Guwahati',
        color: 'Black',
        texture: 'Polyester',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dibrugarh School Uniform - T-Shirt',
        description: 'Comfortable school T-shirt for Dibrugarh institutions',
        price: 499,
        mrpPrice: 599,
        discount: 15,
        imageUrl: '/uniform/dps/dps-full.png',
        categoryId: uniformCategory.id,
        type: 'UNIFORM',
        state: 'Assam',
        district: 'Dibrugarh',
        institution: 'School A Dibrugarh',
        color: 'Green',
        texture: 'Cotton',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dibrugarh School Uniform - Pants',
        description: 'School pants for Dibrugarh institutions',
        price: 799,
        mrpPrice: 899,
        discount: 10,
        imageUrl: '/uniform/dps/dps-pant.png',
        categoryId: uniformCategory.id,
        type: 'UNIFORM',
        state: 'Assam',
        district: 'Dibrugarh',
        institution: 'School B Dibrugarh',
        color: 'Black',
        texture: 'Polyester',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  // Fetch the newly created products
  const products = await prisma.product.findMany({
    where: {
      name: {
        in: [
          'Guwahati School Uniform - Shirt',
          'Guwahati School Uniform - Pants',
          'Dibrugarh School Uniform - T-Shirt',
          'Dibrugarh School Uniform - Pants',
        ],
      },
    },
  });

  // Add stock images
  await prisma.stockImage.createMany({
    data: [
      {
        imageUrl: '/uniform/gs/full.png',
        productId: products[0].id,
      },
      {
        imageUrl: '/uniform/gs/pant.png',
        productId: products[1].id,
      },
      {
        imageUrl: '/uniform/dps/dps-full.png',
        productId: products[2].id,
      },
      {
        imageUrl: '/uniform/dps/dps-pant.png',
        productId: products[3].id,
      },
    ],
  });

  // Add size options (S, M, L, XL) for each product
  for (const product of products) {
    await prisma.sizeOption.createMany({
      data: [
        {
          size: 'S',
          price: product.price - 30,
          productId: product.id,
        },
        {
          size: 'M',
          price: product.price,
          productId: product.id,
        },
        {
          size: 'L',
          price: product.price + 30,
          productId: product.id,
        },
        {
          size: 'XL',
          price: product.price + 60,
          productId: product.id,
        },
      ],
    });
  }

  console.log('✅ Uniform products and size options seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
