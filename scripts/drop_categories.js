const { db } = require('@vercel/postgres');

async function dropCategoriesTable(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS categories;`;

    console.log(`dropped "categories" table`);
  } catch (error) {
    console.error('Failed to drop "categories":', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /* await dropCategoriesTable(client); */

  await client.end();
}

main().catch((err) => {
  console.error(err);
});
