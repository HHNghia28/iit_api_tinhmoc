import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const userData = [
    {
      email: 'admin@gmail.com',
      password: '$2b$10$uP4jmm5.hkLMdMb59gCvVevRrse/Tk34YJntSFkuU2fFZJur.PGeq',
    },
  ];
  const users = [];
  for (const usr of userData) {
    const newUser = await prisma.user.create({ data: usr });
    users.push(newUser);
  }

  // Seed Category
  const categoriesData = [
    {
      name: 'Cửa',
      createId: users[0].id,
      updateId: users[0].id,
    },
    {
      name: 'Bàn ghế',
      createId: users[0].id,
      updateId: users[0].id,
    },
    {
      name: 'Kệ',
      createId: users[0].id,
      updateId: users[0].id,
    },
  ];
  const categories = [];
  for (const cat of categoriesData) {
    const newCat = await prisma.category.create({ data: cat });
    categories.push(newCat);
  }

  // Seed sub category
  const subCategoriesData = [
    {
      name: 'Bàn',
      createId: users[0].id,
      updateId: users[0].id,
      parentId: categories[1].id,
    },
    {
      name: 'Ghế',
      createId: users[0].id,
      updateId: users[0].id,
      parentId: categories[1].id,
    },
    {
      name: 'Cửa cái',
      createId: users[0].id,
      updateId: users[0].id,
      parentId: categories[0].id,
    },
    {
      name: 'Cửa sổ',
      createId: users[0].id,
      updateId: users[0].id,
      parentId: categories[0].id,
    },
    {
      name: 'Kệ lớn',
      createId: users[0].id,
      updateId: users[0].id,
      parentId: categories[2].id,
    },
    {
      name: 'Kệ nhỏ',
      createId: users[0].id,
      updateId: users[0].id,
      parentId: categories[2].id,
    },
  ];
  const subCategories = [];
  for (const cat of subCategoriesData) {
    const newSubCat = await prisma.category.create({ data: cat });
    subCategories.push(newSubCat);
  }

  // Seed Product
  const productsData = [
    {
      slug: 'IIT-001',
      title: 'Cửa cái',
      normalizeTitle: 'cua cai',
      content: 'Của cái',
      thumbnail:
        'http://192.168.1.18:3000/uploads/products/file-1722227013968-42799818.png',
      price: '150000',
      salePercent: 5,
      categoryId: subCategories[2].id,
      createId: users[0].id,
      updateId: users[0].id,
    },
    {
      slug: 'IIT-002',
      title: 'Cửa sổ',
      normalizeTitle: 'cua so',
      content: 'Của sổ',
      thumbnail:
        'http://192.168.1.18:3000/uploads/products/file-1722227013968-42799818.png',
      price: '150000',
      salePercent: 0,
      categoryId: subCategories[3].id,
      createId: users[0].id,
      updateId: users[0].id,
    },
    {
      slug: 'IIT-003',
      title: 'Bàn 01',
      normalizeTitle: 'ban 01',
      content: 'Bàn 01',
      thumbnail:
        'http://192.168.1.18:3000/uploads/products/file-1722227013968-42799818.png',
      price: '150000',
      salePercent: 0,
      categoryId: subCategories[0].id,
      createId: users[0].id,
      updateId: users[0].id,
    },
    {
      slug: 'IIT-004',
      title: 'Kệ 01',
      normalizeTitle: 'ke 01',
      content: 'Kệ 01',
      thumbnail:
        'http://192.168.1.18:3000/uploads/products/file-1722227013968-42799818.png',
      price: '150000',
      salePercent: 0,
      categoryId: subCategories[4].id,
      createId: users[0].id,
      updateId: users[0].id,
    },
  ];
  const products = [];
  for (const pro of productsData) {
    const newPro = await prisma.product.create({ data: pro });
    products.push(newPro);
  }

  // Seed Images Product
  const productImagesData = [
    {
      productId: products[0].id,
      url: 'http://localhost:3000/uploads/products/1.png',
    },
    {
      productId: products[0].id,
      url: 'http://localhost:3000/uploads/products/2.png',
    },
    {
      productId: products[1].id,
      url: 'http://localhost:3000/uploads/products/3.png',
    },
    {
      productId: products[1].id,
      url: 'http://localhost:3000/uploads/products/4.png',
    },
    {
      productId: products[2].id,
      url: 'http://localhost:3000/uploads/products/5.png',
    },
    {
      productId: products[2].id,
      url: 'http://localhost:3000/uploads/products/6.png',
    },
    {
      productId: products[3].id,
      url: 'http://localhost:3000/uploads/products/7.png',
    },
    {
      productId: products[3].id,
      url: 'http://localhost:3000/uploads/products/8.png',
    },
  ];
  await prisma.productImages.createMany({ data: productImagesData });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
