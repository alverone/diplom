const { db } = require('@vercel/postgres');

async function createCategoriesTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      description TEXT
    );`;

    console.log(`Created "categories" table`);
  } catch (error) {
    console.error('Error creating categories:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await createCategoriesTable(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
