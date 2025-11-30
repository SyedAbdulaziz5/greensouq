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
      imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Snake Plant",
      price: 35.0,
      description: "Hardy low-maintenance indoor plant. Thrives in low light and requires minimal watering. Perfect for beginners.",
      imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb4?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Monstera Deliciosa",
      price: 65.0,
      description: "Popular tropical plant with distinctive split leaves. Adds a modern touch to any room.",
      imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Peace Lily",
      price: 42.0,
      description: "Elegant white blooms and glossy leaves. Excellent air purifier that thrives in indirect light.",
      imageUrl: "https://images.unsplash.com/photo-1593691509545-3e465f91431e?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Pothos Golden",
      price: 28.0,
      description: "Trailing vine plant with heart-shaped leaves. Very easy to care for and great for hanging baskets.",
      imageUrl: "https://images.unsplash.com/photo-1586768852835-13c5a80c56a3?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Fiddle Leaf Fig",
      price: 89.0,
      description: "Statement plant with large, violin-shaped leaves. Requires bright indirect light and consistent care.",
      imageUrl: "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Rubber Plant",
      price: 55.0,
      description: "Glossy dark green leaves with burgundy undersides. Excellent air purifier and very resilient.",
      imageUrl: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "ZZ Plant",
      price: 38.0,
      description: "Nearly indestructible plant with glossy, dark green leaves. Perfect for low-light conditions.",
      imageUrl: "https://images.unsplash.com/photo-1632207691143-643e8a23d344?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Boston Fern",
      price: 45.0,
      description: "Feathery fronds create a lush, tropical look. Prefers humid environments and indirect light.",
      imageUrl: "https://images.unsplash.com/photo-1586093148909-4e1166c7b8c7?w=800&auto=format&fit=crop",
      category: "Indoor Plants",
    },
    {
      name: "Lavender",
      price: 24.0,
      description: "Fragrant purple flowers perfect for outdoor gardens. Attracts pollinators and adds beautiful color.",
      imageUrl: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&auto=format&fit=crop",
      category: "Outdoor Plants",
    },
    {
      name: "Rosemary",
      price: 18.0,
      description: "Aromatic herb perfect for cooking and garden borders. Drought-tolerant and easy to grow.",
      imageUrl: "https://images.unsplash.com/photo-1584868048564-e11c2c7e8d60?w=800&auto=format&fit=crop",
      category: "Outdoor Plants",
    },
    {
      name: "Hydrangea",
      price: 35.0,
      description: "Beautiful flowering shrub with large, colorful blooms. Prefers partial shade and moist soil.",
      imageUrl: "https://images.unsplash.com/photo-1595978966083-b4c5e5c6a0b2?w=800&auto=format&fit=crop",
      category: "Outdoor Plants",
    },
    {
      name: "Boxwood",
      price: 42.0,
      description: "Evergreen shrub perfect for hedges and topiaries. Dense foliage and easy to shape.",
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop",
      category: "Outdoor Plants",
    },
    {
      name: "Japanese Maple",
      price: 85.0,
      description: "Stunning ornamental tree with delicate, lacy leaves. Beautiful fall color and graceful form.",
      imageUrl: "https://images.unsplash.com/photo-1602524206684-043c4e8d68d3?w=800&auto=format&fit=crop",
      category: "Outdoor Plants",
    },
    {
      name: "Succulent Collection",
      price: 32.0,
      description: "Set of 3 colorful succulents. Low maintenance and perfect for sunny windowsills.",
      imageUrl: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&auto=format&fit=crop",
      category: "Succulents",
    },
    {
      name: "Aloe Vera",
      price: 22.0,
      description: "Medicinal plant with soothing gel. Easy to care for and great for beginners.",
      imageUrl: "https://images.unsplash.com/photo-1596547609652-e8f2c3c2e8d3?w=800&auto=format&fit=crop",
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