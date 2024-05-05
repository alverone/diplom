const { db } = require('@vercel/postgres');

async function createAuthorsTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS authors (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT
    );`;

    console.log(`Created "authors" table`);
  } catch (error) {
    console.error('Error creating "authors":', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await createAuthorsTable(client);

  await client.end();
}

main().catch((err) => {
  console.error(err);
});
