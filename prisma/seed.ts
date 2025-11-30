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
      description: "Feathery indoor palm plant perfect for bright spaces.",
      imageUrl: "https://images.unsplash.com/photo-1613742704300-19f6db62506c?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Snake Plant",
      price: 35.0,
      description: "Hardy low-maintenance indoor plant. Thrives in low light.",
      imageUrl: "https://images.unsplash.com/photo-1623245879821-7cfb8f7b8c9c?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Monstera Deliciosa",
      price: 65.0,
      description: "Popular tropical plant with distinctive split leaves.",
      imageUrl: "https://images.unsplash.com/photo-1611911811820-cd9d1d79c983?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Peace Lily",
      price: 42.0,
      description: "Elegant white blooms and glossy leaves. Excellent air purifier.",
      imageUrl: "https://images.unsplash.com/photo-1597651694976-cf6f57c1b6c4?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Pothos Golden",
      price: 28.0,
      description: "Trailing vine plant with heart-shaped leaves. Easy to care for.",
      imageUrl: "https://images.unsplash.com/photo-1623222501160-b94b19aebc49?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Fiddle Leaf Fig",
      price: 89.0,
      description: "Statement plant with large, violin-shaped leaves.",
      imageUrl: "https://images.unsplash.com/photo-1606379397471-df47c438c1ec?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Rubber Plant",
      price: 55.0,
      description: "Glossy dark green leaves with burgundy undersides. Very resilient.",
      imageUrl: "https://images.unsplash.com/photo-1617196030627-273a07b2b2bb?w=800",
      category: "Indoor Plants",
    },
    {
      name: "ZZ Plant",
      price: 38.0,
      description: "Nearly indestructible plant with glossy, dark green leaves.",
      imageUrl: "https://images.unsplash.com/photo-1618375569899-8c7e6b3a2a9c?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Boston Fern",
      price: 45.0,
      description: "Feathery fronds create a lush, tropical look.",
      imageUrl: "https://images.unsplash.com/photo-1605532430623-39f7b8c6f98c?w=800",
      category: "Indoor Plants",
    },
    {
      name: "Lavender",
      price: 24.0,
      description: "Fragrant purple flowers perfect for outdoor gardens.",
      imageUrl: "https://images.unsplash.com/photo-1516569422648-28bdb7d85f2e?w=800",
      category: "Outdoor Plants",
    },
    {
      name: "Rosemary",
      price: 18.0,
      description: "Aromatic herb perfect for cooking and garden borders.",
      imageUrl: "https://images.unsplash.com/photo-1582515073490-dc930c9ab6f3?w=800",
      category: "Outdoor Plants",
    },
    {
      name: "Hydrangea",
      price: 35.0,
      description: "Beautiful flowering shrub with large, colorful blooms.",
      imageUrl: "https://images.unsplash.com/photo-1602882507315-f427c4c6bdf4?w=800",
      category: "Outdoor Plants",
    },
    {
      name: "Succulent Collection",
      price: 32.0,
      description: "Set of 3 colorful succulents. Low maintenance and perfect for sunny windowsills.",
      imageUrl: "https://images.unsplash.com/photo-1623222501030-9b0d1f1a1b12?w=800",
      category: "Succulents",
    },
    {
      name: "Aloe Vera",
      price: 22.0,
      description: "Medicinal plant with soothing gel. Easy to care for and great for beginners.",
      imageUrl: "https://images.unsplash.com/photo-1618375569910-3f1d8a1f5b5c?w=800",
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

