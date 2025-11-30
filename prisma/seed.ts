import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_jqtVQP2GRln6@ep-proud-wind-ahp7vsl8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter: adapter as any } as any);

async function main() {
  console.log("Starting seed...");

  const products = [
    {
      name: "Areca Palm",
      price: 49.0,
      description: "Feathery indoor palm plant perfect for bright spaces. Known for its air-purifying qualities and elegant appearance.",
      imageUrl: "https://unsplash.com/photos/a-couple-of-palm-trees-sitting-next-to-each-other-sXygOVnMEf4",
      category: "Indoor Plants",
    },
    {
      name: "Snake Plant",
      price: 35.0,
      description: "Hardy low-maintenance indoor plant. Thrives in low light and requires minimal watering. Perfect for beginners.",
      imageUrl: "https://unsplash.com/photos/a-potted-plant-on-a-wooden-table--Lh6tVzDdMg",
      category: "Indoor Plants",
    },
    {
      name: "Monstera Deliciosa",
      price: 65.0,
      description: "Popular tropical plant with distinctive split leaves. Adds a modern touch to any room.",
      imageUrl: "https://unsplash.com/photos/a-close-up-of-a-plant-with-green-leaves-LPCGXZNA5js",
      category: "Indoor Plants",
    },
    {
      name: "Peace Lily",
      price: 42.0,
      description: "Elegant white blooms and glossy leaves. Excellent air purifier that thrives in indirect light.",
      imageUrl: "https://images.unsplash.com/photo-1687858001773-d58b6cec5bdf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UGVhY2UlMjBMaWx5fGVufDB8fDB8fHww",
      category: "Indoor Plants",
    },
    {
      name: "Pothos Golden",
      price: 28.0,
      description: "Trailing vine plant with heart-shaped leaves. Very easy to care for and great for hanging baskets.",
      imageUrl: "https://unsplash.com/photos/a-potted-plant-flourishes-in-sunlight-yjvW-sC3kTY",
      category: "Indoor Plants",
    },
    {
      name: "Fiddle Leaf Fig",
      price: 89.0,
      description: "Statement plant with large, violin-shaped leaves. Requires bright indirect light and consistent care.",
      imageUrl: "https://images.unsplash.com/photo-1643819131797-46919f3009f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RmlkZGxlJTIwTGVhZiUyMEZpZ3xlbnwwfHwwfHx8MA%3D%3D",
      category: "Indoor Plants",
    },
    {
      name: "Rubber Plant",
      price: 55.0,
      description: "Glossy dark green leaves with burgundy undersides. Excellent air purifier and very resilient.",
      imageUrl: "https://unsplash.com/photos/a-plant-in-a-pot-GNdLc38zNjU",
      category: "Indoor Plants",
    },
    {
      name: "ZZ Plant",
      price: 38.0,
      description: "Nearly indestructible plant with glossy, dark green leaves. Perfect for low-light conditions.",
      imageUrl: "https://plus.unsplash.com/premium_photo-1675864662842-6efc0ef31f67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8WlolMjBQbGFudHxlbnwwfHwwfHx8MA%3D%3D",
      category: "Indoor Plants",
    },
    {
      name: "Boston Fern",
      price: 45.0,
      description: "Feathery fronds create a lush, tropical look. Prefers humid environments and indirect light.",
      imageUrl: "https://unsplash.com/photos/green-fern-plant-in-close-up-photography-Rnrgib7lsjg",
      category: "Indoor Plants",
    },
    {
      name: "Lavender",
      price: 24.0,
      description: "Fragrant purple flowers perfect for outdoor gardens. Attracts pollinators and adds beautiful color.",
      imageUrl: "https://unsplash.com/photos/a-field-of-lavender-flowers-with-a-bee-on-it-TXQ0O-v1Qp4",
      category: "Outdoor Plants",
    },
    {
      name: "Rosemary",
      price: 18.0,
      description: "Aromatic herb perfect for cooking and garden borders. Drought-tolerant and easy to grow.",
      imageUrl: "https://unsplash.com/photos/green-plant-in-close-up-photography-e9T7LqnNPnA",
      category: "Outdoor Plants",
    },
    {
      name: "Hydrangea",
      price: 35.0,
      description: "Beautiful flowering shrub with large, colorful blooms. Prefers partial shade and moist soil.",
      imageUrl: "https://unsplash.com/photos/green-leafed-plant-with-purple-flowers-_SAVhxRL2U8",
      category: "Outdoor Plants",
    },
    {
      name: "Boxwood",
      price: 42.0,
      description: "Evergreen shrub perfect for hedges and topiaries. Dense foliage and easy to shape.",
      imageUrl: "https://unsplash.com/photos/green-plant-near-brown-building-during-daytime-lEikWeCu5xk",
      category: "Outdoor Plants",
    },
    {
      name: "Japanese Maple",
      price: 85.0,
      description: "Stunning ornamental tree with delicate, lacy leaves. Beautiful fall color and graceful form.",
      imageUrl: "https://unsplash.com/photos/a-tree-with-red-leaves-and-a-building-in-the-background-sx_PY26ol50",
      category: "Outdoor Plants",
    },
    {
      name: "Succulent Collection",
      price: 32.0,
      description: "Set of 3 colorful succulents. Low maintenance and perfect for sunny windowsills.",
      imageUrl: "https://unsplash.com/photos/a-succulent-plant-in-a-terracotta-pot-nVlZjfgiMYw",
      category: "Succulents",
    },
    {
      name: "Aloe Vera",
      price: 22.0,
      description: "Medicinal plant with soothing gel. Easy to care for and great for beginners.",
      imageUrl: "https://unsplash.com/photos/a-green-plant-with-drops-of-water-on-it-iRcFP75uef8",
      category: "Succulents",
    },
  ];

  // Check existing products count
  const existingCount = await prisma.product.count();
  console.log(`Existing products in database: ${existingCount}`);

  // Get existing product names to avoid duplicates
  const existingProducts = await prisma.product.findMany({
    select: { name: true },
  });
  const existingNames = new Set(existingProducts.map((p: { name: string }) => p.name));

  // Filter out products that already exist
  const newProducts = products.filter((product) => !existingNames.has(product.name));

  if (newProducts.length === 0) {
    console.log("All products already exist in database. No new products to create.");
  } else {
    // Create only new products
    const result = await prisma.product.createMany({
      data: newProducts,
    });

    console.log(`Created ${result.count} new products`);
  }

  const finalCount = await prisma.product.count();
  console.log(`Total products in database: ${finalCount}`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });