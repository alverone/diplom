const { db } = require('@vercel/postgres');

async function createCategory(client, category, description) {
  try {
    await client.sql`
    INSERT INTO categories (title, description)
    VALUES (${category}, ${description ? description : null})
    ON CONFLICT (id) DO NOTHING;`;

    console.log(`Added category: ${category}`);
  } catch (error) {
    console.error(`Failed to create category: ${category}`, error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /*await createCategory(client, 'Category');*/

  await client.end();
}

main().catch((err) => console.error(err));
