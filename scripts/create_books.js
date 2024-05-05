const { db } = require('@vercel/postgres');

async function createBooksTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS books (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      category UUID NOT NULL,
      description TEXT NOT NULL,
      price FLOAT(53) NOT NULL,
      author UUID NOT NULL,
      publisher UUID NOT NULL,
      publish_date DATE NOT NULL,
      page_length INT NOT NULL,
      type VARCHAR(100) NOT NULL,
      imageUrl TEXT
    );`;

    console.log(`Created "books" table`);
  } catch (error) {
    console.error('Error when creating books: ', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await createBooksTable(client);

  await client.end();
}

main().catch((err) => {
  console.error(err);
});
