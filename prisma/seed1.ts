import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seeding Product Categories
  await prisma.productCategory.createMany({
    data: [
      {
        name: 'BRAHMAND',
        imageUrl: '/images/brahmand.jpeg', // Replace with actual image URLs
        description: 'A special category for Brahmand products like T-shirts and Hoodies.',
      },
      {
        name: 'NIRBHAY',
        imageUrl: '/images/nirbhay.jpeg', // Replace with actual image URLs
        description: 'A special category for Nirbhay-themed products.',
      },
      {
        name: 'JERSEY',
        imageUrl: '/images/tshirt.jpg', // Replace with actual image URLs
        description: 'Category for various sports jerseys.',
      },
      {
        name: 'CUSTOMISE',
        imageUrl: '/images/hoodie.jpeg', // Replace with actual image URLs
        description: 'Customizable products to fit your design.',
      },
      {
        name: 'UNIFORM',
        imageUrl: '/images/uniform.jpeg', // Replace with actual image URLs
        description: 'Uniforms for various institutions and organizations.',
      },
      {
        name: 'SHOES',
        imageUrl: '/images/shoes.jpeg', // Replace with actual image URLs
        description: 'Category for shoes, ranging from casual to formal.',
      },
    ],
  })

  console.log('Product categories have been seeded.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
