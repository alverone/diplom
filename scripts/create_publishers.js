const { db } = require('@vercel/postgres');

async function createPublishersTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS publishers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      description TEXT NOT NULL,
      name VARCHAR(255) NOT NULL UNIQUE
    );`;

    console.log(`Created "publishers" table`);
  } catch (error) {
    console.error('Error creating "publishers":', error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();

  await createPublishersTable(client);

  await client.end();
}

main().catch((err) => {
  console.error(err);
});
